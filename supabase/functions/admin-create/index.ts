import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";
import bcrypt from "npm:bcryptjs@2.4.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Admin-Token",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const token = req.headers.get("X-Admin-Token");
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const creatorId = token.split(".")[0];

    // Verify creator is an active admin
    const { data: creator } = await adminClient.from("admins").select("id, role").eq("id", creatorId).maybeSingle();
    if (!creator || !creator.is_active) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Name, email, and password are required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (password.length < 8) {
      return new Response(JSON.stringify({ error: "Password must be at least 8 characters" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Check if email already exists
    const { data: existing } = await adminClient.from("admins").select("id").eq("email", email.toLowerCase()).maybeSingle();
    if (existing) {
      return new Response(JSON.stringify({ error: "An admin with this email already exists" }), { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const { data: newAdmin, error: insertError } = await adminClient
      .from("admins")
      .insert({ name, email: email.toLowerCase(), password_hash: passwordHash, role: role || "admin", is_active: true })
      .select("id, email, name, role")
      .single();

    if (insertError) throw insertError;

    // Audit log
    await adminClient.from("audit_logs").insert({
      admin_id: creatorId, action: "admin_created", entity_type: "admin", entity_id: newAdmin.id,
      details: { email: newAdmin.email, role: newAdmin.role },
    });

    // Security event
    await adminClient.from("security_events").insert({
      admin_id: newAdmin.id, event_type: "admin_created",
      details: { created_by: creatorId, role: newAdmin.role },
    });

    return new Response(JSON.stringify({ success: true, admin: newAdmin }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
