# IT Support Hub — Security Summary

## Authentication

- **Password Hashing**: Admin passwords are hashed with bcrypt at cost factor 12 (industry standard)
- **Session Management**: Session tokens are stored in HTTP-only cookies with `SameSite=Strict`
- **Session Expiry**: Default 7 days; optional "Remember me" extends to 30 days
- **Rate Limiting**: Login attempts are limited to 5 failures per 15-minute window per email
- **User Enumeration Prevention**: Login returns generic "Invalid email or password" for both unknown email and wrong password
- **Initial Setup**: One-time setup page at `/setup` that disables after the first admin is created
- **Admin Creation**: Only authenticated admins can create new admin accounts from the dashboard
- **Account Deactivation**: Admins are deactivated (not deleted) to preserve audit trail

## Authorization

- **Route Protection**: Next.js middleware redirects unauthenticated users from `/admin/*` to `/login`
- **Edge Function Auth**: All admin edge functions verify the `X-Admin-Token` header
- **Token Format**: Session tokens contain the admin ID for server-side verification
- **Self-Protection**: Admins cannot delete their own account

## Database Security

- **Row Level Security (RLS)**: Enabled on all tables
- **Admin Tables**: No anon access — all admin table operations go through edge functions using the service role key
- **Ticket Tables**: Anon can INSERT (create tickets) and SELECT (track tickets); UPDATE is restricted to edge functions with service role
- **No SQL Injection**: All queries use Supabase client's parameterized queries

## HTTP Security Headers

Configured in `next.config.mjs`:
- `X-Frame-Options: DENY` — Prevents clickjacking
- `X-Content-Type-Options: nosniff` — Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` — Limits referrer exposure
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` — Disables unnecessary browser features
- `X-DNS-Prefetch-Control: on` — Enables DNS prefetching for performance

## CORS

- Edge functions allow all origins (`*`) for API compatibility
- Session cookies use `SameSite=Strict` to prevent CSRF
- All state-changing operations require the session token header

## Input Validation

- All form inputs are validated client-side before submission
- Edge functions validate all incoming JSON fields
- SQL constraints (CHECK constraints) enforce valid enum values at the database level
- Email addresses are normalized to lowercase

## Audit & Monitoring

- **Login History**: All login attempts (success + failure) are logged with IP, user agent, and timestamp
- **Security Events**: Security events (login, logout, password change, 2FA, suspicious activity) are tracked
- **Audit Logs**: All admin actions (ticket updates, admin creation/deletion) are logged with admin ID, action, and timestamp
- **IP Logging**: IP addresses are logged for security purposes, respecting privacy regulations

## Privacy

- IP addresses are stored for security auditing only
- No sensitive data is exposed in client-side JavaScript
- Service role key is never exposed to the frontend
- Environment variables are properly separated (public vs. server-only)

## Known Limitations

- 2FA (TOTP) UI is implemented but the backend verification is not yet wired to edge functions
- Email sending depends on a `send-notification` edge function (not yet deployed)
- Session tokens are stateless (encoded admin ID) — a sessions table would add revocation capability
- Recovery codes UI is present but generation/verification is not yet wired

## Recommendations for Production

1. Deploy the remaining edge functions (admin-create, admin-delete, admin-logout, admin-login-history, admin-security-events, admin-audit-logs, admin-update-ticket)
2. Set up the `send-notification` edge function with an email provider (Resend, SendGrid, etc.)
3. Add a `sessions` table for proper session revocation
4. Implement TOTP verification with a library like `otpauth`
5. Run `npm audit` and resolve any reported vulnerabilities before release
6. Configure a Content Security Policy (CSP) header in your hosting platform
7. Enable HTTPS (automatic on Vercel, Netlify, and most platforms)
