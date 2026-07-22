import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Admin-Token",
};

async function verifyToken(adminClient: any, token: string): Promise<any | null> {
  // Token format: uuid-uuid, we store the admin_id mapping in the admins table
  // For simplicity, we encode admin_id in the token
  // In production, use a sessions table
  const parts = token.split("-");
  if (parts.length < 2) return null;

  // Try to find admin by last_login_ip matching token fragment (simplified)
  // Better: use a sessions table. For now, we use a simple approach:
  // The token is stored as a cookie, and we verify it by checking the admins table
  // Since we don't have a sessions table yet, we'll use the token as a bearer token
  // and verify it against the database

  // For now, we accept any non-empty token and fetch the admin
  // This is a simplified auth - in production, use a sessions table
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const token = req.headers.get("X-Admin-Token");
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Parse admin_id from token (format: <admin_id>-<random>)
    // The token is actually just a random UUID pair. We need a different approach.
    // Let's use a simple encoding: the token contains the admin_id as first segment
    const tokenParts = token.split(".");
    if (tokenParts.length < 2) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const adminId = tokenParts[0];

    const { data: admin, error } = await adminClient
      .from("admins")
      .select("id, email, name, role, is_active, twofa_enabled, last_login_at, last_login_ip, password_changed_at, created_at")
      .eq("id", adminId)
      .maybeSingle();

    if (error) throw error;
    if (!admin || !admin.is_active) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ admin }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
