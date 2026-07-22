import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

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
    const { ticket_id, status, message, status_changed } = await req.json();

    if (!ticket_id || !status) {
      return new Response(JSON.stringify({ error: "Missing ticket_id or status" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const validStatuses = ["open", "in_progress", "resolved", "closed"];
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ error: "Invalid status" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Extract admin ID from token if present
    const token = req.headers.get("X-Admin-Token");
    const adminId = token ? token.split(".")[0] : null;

    // Fetch the current ticket
    const { data: ticket, error: fetchError } = await adminClient
      .from("tickets").select("*").eq("id", ticket_id).maybeSingle();

    if (fetchError) throw fetchError;
    if (!ticket) {
      return new Response(JSON.stringify({ error: "Ticket not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const oldStatus = ticket.status;
    let replyAdded = false;

    // Update ticket status if changed
    if (status_changed && status !== oldStatus) {
      const { error: updateError } = await adminClient
        .from("tickets").update({ status, updated_by: adminId }).eq("id", ticket_id);
      if (updateError) throw updateError;
    }

    // Insert reply if message provided
    if (message && message.trim()) {
      const statusChangeStr = status_changed && status !== oldStatus ? `${oldStatus} → ${status}` : null;
      const { error: replyError } = await adminClient
        .from("ticket_replies").insert({
          ticket_id, admin_id: adminId, author_role: "admin",
          message: message.trim(), status_change: statusChangeStr,
        });
      if (replyError) throw replyError;
      replyAdded = true;
    }

    // Audit log
    if (adminId) {
      await adminClient.from("audit_logs").insert({
        admin_id: adminId, action: "ticket_updated",
        entity_type: "ticket", entity_id: ticket_id,
        details: { old_status: oldStatus, new_status: status, reply_added: replyAdded },
      });
    }

    // Send email notification (best-effort)
    const statusLabels: Record<string, string> = {
      open: "Open", in_progress: "In Progress", resolved: "Resolved", closed: "Closed",
    };
    const ticketNumberStr = `#${String(ticket.ticket_number).padStart(4, "0")}`;
    const emailSubject = `Update on your ticket ${ticketNumberStr} - ${statusLabels[status]}`;
    const emailHtml = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
        <div style="background: #2563eb; color: white; padding: 20px 24px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">IT Support Hub</h1>
        </div>
        <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
          <p style="margin: 0 0 16px; font-size: 15px;">Hi ${ticket.name},</p>
          <p style="margin: 0 0 16px; font-size: 15px;">Your support ticket <strong>${ticketNumberStr}</strong> has been updated.</p>
          <table style="width: 100%; margin-bottom: 16px; font-size: 14px;">
            <tr><td style="color: #64748b; padding: 4px 0;">Subject:</td><td style="font-weight: 600; padding: 4px 0;">${ticket.subject}</td></tr>
            <tr><td style="color: #64748b; padding: 4px 0;">Status:</td><td style="font-weight: 600; padding: 4px 0; color: ${status === "resolved" ? "#10b981" : "#2563eb"};">${statusLabels[status]}</td></tr>
          </table>
          ${message && message.trim() ? `
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <p style="margin: 0 0 8px; font-size: 13px; color: #64748b; font-weight: 600;">Message from Support Team:</p>
            <p style="margin: 0; font-size: 14px; line-height: 1.6;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>
          </div>` : ""}
          <p style="margin: 0; font-size: 13px; color: #64748b;">
            Ticket number: <strong>${String(ticket.ticket_number).padStart(4, "0")}</strong><br>Email: ${ticket.email}
          </p>
        </div>
      </div>`;

    try {
      await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: ticket.email, subject: emailSubject, html: emailHtml }),
      }).catch(() => {});
    } catch { /* best-effort */ }

    return new Response(JSON.stringify({
      success: true, ticket_id, old_status: oldStatus, new_status: status, reply_added: replyAdded,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
