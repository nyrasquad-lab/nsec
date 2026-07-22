/*
# Tighten assessments RLS + add rate_limits table

## Purpose
Move assessment submissions behind a server-side Edge Function so the anon
client can no longer write directly to the assessments table. The Edge Function
validates input, enforces per-IP rate limiting using a new rate_limits table,
and inserts with the service role key (which bypasses RLS).

## 1. assessments table — RLS changes
- DROP all existing anon policies (select/insert/update/delete).
- Add a single SELECT policy scoped to authenticated only (future admin use).
  The anon key can no longer read or write assessments directly.
- Only the service role (used by the Edge Function) can insert, and it bypasses
  RLS entirely, so no insert policy is needed for the anon role.

## 2. New table: rate_limits
Stores timestamped rate-limit check records for the contact-form Edge Function.
One row per submission attempt, keyed by IP address. The Edge Function queries
this table to enforce a max of 3 submissions per IP per hour.
- id (uuid, primary key)
- ip (text, not null) — caller IP address
- created_at (timestamptz, default now())
- Index on (ip, created_at) for fast rate-limit lookups.
- RLS enabled with NO policies — only the service role (Edge Function) can
  access it. The anon client cannot read or write this table.

## 3. posts table — unchanged
The anon SELECT policy on posts remains so the public blog still loads.
*/
-- Drop all existing anon policies on assessments
DROP POLICY IF EXISTS "anon_select_assessments" ON assessments;
DROP POLICY IF EXISTS "anon_insert_assessments" ON assessments;
DROP POLICY IF EXISTS "anon_update_assessments" ON assessments;
DROP POLICY IF EXISTS "anon_delete_assessments" ON assessments;

-- Re-add a read-only policy for authenticated (future admin), no anon access
CREATE POLICY "auth_select_assessments" ON assessments FOR SELECT
  TO authenticated USING (true);

-- Rate limits table
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_rate_limits" ON rate_limits;
DROP POLICY IF EXISTS "anon_insert_rate_limits" ON rate_limits;
DROP POLICY IF EXISTS "anon_update_rate_limits" ON rate_limits;
DROP POLICY IF EXISTS "anon_delete_rate_limits" ON rate_limits;
-- No policies: only service role can access (bypasses RLS)

CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_created ON rate_limits (ip, created_at);
