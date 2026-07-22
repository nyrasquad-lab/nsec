/*
# Create assessments table (single-tenant, no auth)

1. New Tables
   - `assessments`
     - `id` (uuid, primary key)
     - `full_name` (text, not null)
     - `email` (text, not null)
     - `organization` (text)
     - `service` (text)
     - `message` (text)
     - `created_at` (timestamp)
2. Security
   - Enable RLS on `assessments`.
   - Allow anon + authenticated INSERT (public contact form).
   - Allow anon + authenticated SELECT (no personal auth required).
*/

CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  organization text,
  service text,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_assessments" ON assessments;
CREATE POLICY "anon_insert_assessments" ON assessments FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_assessments" ON assessments;
CREATE POLICY "anon_select_assessments" ON assessments FOR SELECT
TO anon, authenticated USING (true);
