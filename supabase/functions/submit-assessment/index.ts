import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const MAX_SUBMISSIONS = 3;
const RATE_WINDOW_MINUTES = 60;

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // --- Extract client IP for rate limiting ---
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    // --- Rate limit: max N submissions per IP per window ---
    const since = new Date(
      Date.now() - RATE_WINDOW_MINUTES * 60 * 1000,
    ).toISOString();

    const { count, error: countError } = await supabase
      .from("rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", since);

    if (countError) {
      return json({ error: "Rate limit check failed" }, 500);
    }

    if ((count ?? 0) >= MAX_SUBMISSIONS) {
      return json(
        { error: "Too many submissions. Please try again later." },
        429,
      );
    }

    // --- Parse and validate body ---
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    const fullName = String(body.full_name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const organization = String(body.organization ?? "").trim();
    const service = String(body.service ?? "").trim();
    const message = String(body.message ?? "").trim();

    const errors: string[] = [];
    if (!fullName || fullName.length < 2) {
      errors.push("Full name is required (min 2 characters).");
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("A valid work email is required.");
    }
    if (!message || message.length < 10) {
      errors.push("Message is required (min 10 characters).");
    }
    if (fullName.length > 200) errors.push("Full name is too long.");
    if (email.length > 320) errors.push("Email is too long.");
    if (message.length > 5000) errors.push("Message is too long (max 5000).");

    if (errors.length > 0) {
      return json({ error: errors.join(" ") }, 400);
    }

    // --- Insert the assessment ---
    const { error: insertError } = await supabase
      .from("assessments")
      .insert({
        full_name: fullName,
        email,
        organization: organization || null,
        service: service || null,
        message,
      });

    if (insertError) {
      return json({ error: "Failed to save submission." }, 500);
    }

    // --- Record the rate-limit hit ---
    await supabase.from("rate_limits").insert({ ip });

    return json({ success: true, message: "Assessment request received." }, 200);
  } catch (err) {
    return json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      500,
    );
  }
});
