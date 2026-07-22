import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";
import bcrypt from "npm:bcryptjs@2.4.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Admin-Token",
};

// Simple rate limiting using database table
async function checkRateLimit(adminClient: any, email: string, ip: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const { data } = await adminClient
    .from("login_history")
    .select("id")
    .eq("email", email)
    .eq("success", false)
    .gte("created_at", windowStart);

  if (data && data.length >= 5) {
    return false; // Rate limited
  }
  return true;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { email, password, remember } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Check rate limit
    const allowed = await checkRateLimit(adminClient, email.toLowerCase(), ip);
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: "Too many failed login attempts. Please try again in 15 minutes." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Find admin
    const { data: admin, error: fetchError } = await adminClient
      .from("admins")
      .select("*")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (fetchError) throw fetchError;

    // Generic error to prevent user enumeration
    const invalidCredentials = "Invalid email or password";

    if (!admin) {
      // Log failed attempt
      await adminClient.from("login_history").insert({
        email: email.toLowerCase(), success: false,
        ip_address: ip, user_agent: userAgent,
        failure_reason: "user_not_found",
      });
      return new Response(
        JSON.stringify({ error: invalidCredentials }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!admin.is_active) {
      await adminClient.from("login_history").insert({
        admin_id: admin.id, email: email.toLowerCase(), success: false,
        ip_address: ip, user_agent: userAgent,
        failure_reason: "account_disabled",
      });
      return new Response(
        JSON.stringify({ error: "Account has been disabled. Contact your administrator." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Verify password
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      await adminClient.from("login_history").insert({
        admin_id: admin.id, email: email.toLowerCase(), success: false,
        ip_address: ip, user_agent: userAgent,
        failure_reason: "wrong_password",
      });
      await adminClient.from("security_events").insert({
        admin_id: admin.id, event_type: "login_failed",
        ip_address: ip, user_agent: userAgent,
        details: { reason: "wrong_password" },
      });
      return new Response(
        JSON.stringify({ error: invalidCredentials }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Generate session token: <admin_id>.<random_uuid>
    const token = `${admin.id}.${crypto.randomUUID()}`;

    // Update last login
    await adminClient.from("admins").update({
      last_login_at: new Date().toISOString(),
      last_login_ip: ip,
    }).eq("id", admin.id);

    // Log successful login
    await adminClient.from("login_history").insert({
      admin_id: admin.id, email: email.toLowerCase(), success: true,
      ip_address: ip, user_agent: userAgent,
    });

    await adminClient.from("security_events").insert({
      admin_id: admin.id, event_type: "login_success",
      ip_address: ip, user_agent: userAgent,
    });

    return new Response(
      JSON.stringify({
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
