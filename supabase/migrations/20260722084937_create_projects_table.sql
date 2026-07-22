/*
# Create projects table for admin panel

This table stores organizational project data: projects being worked on,
their completion status, hosting location, and other relevant metadata.
The admin panel uses this table to manage internal project tracking.

## 1. New Tables

### projects
Internal organizational projects with status tracking and hosting info.
- id (uuid, primary key)
- name (text, not null) - project name
- description (text) - optional project description
- status (text, not null, default 'planning') - one of: planning, in_progress, on_hold, completed, archived
- hosting_provider (text) - where the project is hosted (e.g. Vercel, AWS, GCP)
- hosting_url (text) - URL where the project is accessible
- repository_url (text) - link to the code repository
- tech_stack (text[]) - technologies used
- start_date (date) - when the project started
- due_date (date) - target completion date
- completed_at (timestamptz) - when the project was completed
- created_at (timestamptz)
- updated_at (timestamptz)

## 2. Security (RLS)
Single-tenant / no-auth: anon + authenticated CRUD (intentionally public/shared
organizational data managed through the admin panel).
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'on_hold', 'completed', 'archived')),
  hosting_provider text,
  hosting_url text,
  repository_url text,
  tech_stack text[] DEFAULT '{}',
  start_date date,
  due_date date,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
CREATE POLICY "anon_insert_projects" ON projects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_projects" ON projects;
CREATE POLICY "anon_update_projects" ON projects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
CREATE POLICY "anon_delete_projects" ON projects FOR DELETE
  TO anon, authenticated USING (true);
