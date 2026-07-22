/*
# Create admin authentication, security, and audit tables

1. New Tables
- `admins`: admin accounts with bcrypt-hashed passwords, roles, 2FA secrets
- `login_history`: tracks all login attempts (success + failure) with IP, user agent
- `security_events`: security incidents (suspicious activity, password changes, etc.)
- `audit_logs`: admin actions within the dashboard
- `admin_recovery_codes`: 2FA recovery codes

2. Modified Tables
- `tickets`: add `updated_by` column to track which admin last modified a ticket
- `ticket_replies`: add `admin_id` column to track which admin posted the reply

3. Security
- RLS enabled on all new tables
- admins: SELECT/INSERT via service role only (edge functions). No anon access.
- login_history: INSERT via service role (edge function logs after auth). SELECT via service role.
- security_events: INSERT/SELECT via service role only.
- audit_logs: INSERT/SELECT via service role only.
- admin_recovery_codes: SELECT/UPDATE/DELETE via service role only.
- tickets UPDATE policy changed: anon can no longer UPDATE (only via edge function with service role).
- ticket_replies INSERT: anon can still INSERT (users can add replies) but admin replies go through edge function.

4. Indexes
- Index on login_history.admin_id
- Index on security_events.admin_id
- Index on audit_logs.admin_id
- Index on admin_recovery_codes.admin_id

5. Important Notes
- Password hashing is done in edge functions using bcrypt (npm:bcryptjs).
- 2FA secrets are stored encrypted (base64) and verified via TOTP.
- Session management uses HTTP-only cookies set by edge functions.
- The first admin is created via a one-time setup endpoint that checks if any admins exist.
*/

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'viewer')),
  is_active boolean NOT NULL DEFAULT true,
  twofa_secret text,
  twofa_enabled boolean NOT NULL DEFAULT false,
  last_login_at timestamptz,
  last_login_ip text,
  password_changed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- No anon policies on admins — all access through edge functions with service role key
DROP POLICY IF EXISTS "no_anon_select_admins" ON admins;
CREATE POLICY "no_anon_select_admins" ON admins FOR SELECT
  TO authenticated USING (false);

-- Login history
CREATE TABLE IF NOT EXISTS login_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admins(id) ON DELETE CASCADE,
  email text NOT NULL,
  success boolean NOT NULL,
  ip_address text,
  user_agent text,
  failure_reason text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "no_anon_select_login_history" ON login_history;
CREATE POLICY "no_anon_select_login_history" ON login_history FOR SELECT
  TO authenticated USING (false);

-- Security events
CREATE TABLE IF NOT EXISTS security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admins(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN (
    'login_success', 'login_failed', 'logout', 'password_change',
    '2fa_enabled', '2fa_disabled', 'session_revoked', 'suspicious_activity',
    'admin_created', 'admin_deleted', 'role_changed', 'recovery_codes_generated'
  )),
  ip_address text,
  user_agent text,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "no_anon_select_security_events" ON security_events;
CREATE POLICY "no_anon_select_security_events" ON security_events FOR SELECT
  TO authenticated USING (false);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admins(id) ON DELETE CASCADE,
  action text NOT NULL,
  entity_type text,
  entity_id text,
  details jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "no_anon_select_audit_logs" ON audit_logs;
CREATE POLICY "no_anon_select_audit_logs" ON audit_logs FOR SELECT
  TO authenticated USING (false);

-- Recovery codes
CREATE TABLE IF NOT EXISTS admin_recovery_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admins(id) ON DELETE CASCADE,
  code_hash text NOT NULL,
  used boolean NOT NULL DEFAULT false,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_recovery_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "no_anon_select_recovery_codes" ON admin_recovery_codes;
CREATE POLICY "no_anon_select_recovery_codes" ON admin_recovery_codes FOR SELECT
  TO authenticated USING (false);

-- Add columns to existing tables
DO $$ BEGIN
  ALTER TABLE tickets ADD COLUMN IF NOT EXISTS updated_by uuid;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE ticket_replies ADD COLUMN IF NOT EXISTS admin_id uuid;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Remove anon UPDATE on tickets (only edge function with service role can update)
DROP POLICY IF EXISTS "anon_update_tickets" ON tickets;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_login_history_admin_id ON login_history(admin_id);
CREATE INDEX IF NOT EXISTS idx_login_history_created_at ON login_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_admin_id ON security_events(admin_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recovery_codes_admin_id ON admin_recovery_codes(admin_id);
