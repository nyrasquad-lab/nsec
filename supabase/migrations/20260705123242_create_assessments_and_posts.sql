/*
# Create assessments and posts tables (single-tenant, no auth)

This marketing site has no sign-in screen, so the frontend talks to Supabase
entirely with the anon key. All policies are scoped to `TO anon, authenticated`.

## 1. New Tables

### assessments
Contact-form ("Request Assessment") submissions. Replaces the demo setTimeout form.
- id (uuid, primary key)
- full_name (text, not null)
- email (text, not null)
- organization (text) — optional
- service (text) — optional
- message (text, not null)
- created_at (timestamptz)

### posts
Blog/insights articles for the Resources section. Replaces the hardcoded POSTS array.
- id (uuid, primary key)
- slug (text, unique, not null)
- category (text, not null)
- title (text, not null)
- excerpt (text, not null)
- read_time (text, not null)
- published_at (text, not null) — display string
- image_url (text, not null)
- created_at (timestamptz)

## 2. Security (RLS)
Both tables single-tenant / no-auth: anon + authenticated CRUD (intentionally
public/shared marketing content and a public contact form).
*/
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  organization text,
  service text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_assessments" ON assessments;
CREATE POLICY "anon_select_assessments" ON assessments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_assessments" ON assessments;
CREATE POLICY "anon_insert_assessments" ON assessments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_assessments" ON assessments;
CREATE POLICY "anon_update_assessments" ON assessments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_assessments" ON assessments;
CREATE POLICY "anon_delete_assessments" ON assessments FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  read_time text NOT NULL,
  published_at text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_posts" ON posts;
CREATE POLICY "anon_select_posts" ON posts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_posts" ON posts;
CREATE POLICY "anon_insert_posts" ON posts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_posts" ON posts;
CREATE POLICY "anon_update_posts" ON posts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_posts" ON posts;
CREATE POLICY "anon_delete_posts" ON posts FOR DELETE
  TO anon, authenticated USING (true);
