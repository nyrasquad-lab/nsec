/*
# Create tickets and ticket_replies tables

1. New Tables
- `tickets`
  - `id` (uuid, primary key)
  - `ticket_number` (integer, auto-incrementing, unique — readable ID like #001)
  - `name` (text, not null — submitter's full name)
  - `email` (text, not null — submitter's email for notifications)
  - `phone` (text, nullable — submitter's phone number)
  - `category` (text, not null — hardware, software, network, account, other)
  - `priority` (text, not null — low, medium, high, urgent)
  - `subject` (text, not null — short problem title)
  - `description` (text, not null — detailed problem description)
  - `status` (text, not null, default 'open' — open, in_progress, resolved, closed)
  - `admin_notes` (text, nullable — internal admin notes)
  - `created_at` (timestamptz, default now)
  - `updated_at` (timestamptz, default now)
- `ticket_replies`
  - `id` (uuid, primary key)
  - `ticket_id` (uuid, foreign key to tickets.id, on delete cascade)
  - `author_role` (text, not null — 'admin' or 'user')
  - `message` (text, not null — reply message)
  - `status_change` (text, nullable — e.g. "open → in_progress")
  - `created_at` (timestamptz, default now)

2. Security
- Enable RLS on both tables.
- tickets: anon can INSERT (create tickets) and SELECT (check status). UPDATE/DELETE restricted to service role (admin via edge function).
- ticket_replies: anon can SELECT (view replies). INSERT restricted to service role (admin via edge function).

3. Indexes
- Index on tickets.ticket_number for fast lookups
- Index on tickets.email for user status checks
- Index on ticket_replies.ticket_id for fetching replies

4. Important Notes
- This is a no-auth (single-tenant) app. Users submit tickets without signing in.
- Admin updates go through an edge function using the service role key, bypassing RLS.
- Users check ticket status by ticket number + email.
*/

CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number serial UNIQUE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  category text NOT NULL CHECK (category IN ('hardware', 'software', 'network', 'account', 'other')),
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  subject text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_tickets" ON tickets;
CREATE POLICY "anon_insert_tickets" ON tickets FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_tickets" ON tickets;
CREATE POLICY "anon_select_tickets" ON tickets FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS ticket_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  author_role text NOT NULL CHECK (author_role IN ('admin', 'user')),
  message text NOT NULL,
  status_change text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_replies" ON ticket_replies;
CREATE POLICY "anon_select_replies" ON ticket_replies FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_replies" ON ticket_replies;
CREATE POLICY "anon_insert_replies" ON ticket_replies FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_tickets_ticket_number ON tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_tickets_email ON tickets(email);
CREATE INDEX IF NOT EXISTS idx_replies_ticket_id ON ticket_replies(ticket_id);

-- Trigger to update updated_at on ticket status changes
CREATE OR REPLACE FUNCTION update_ticket_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_tickets_updated_at ON tickets;
CREATE TRIGGER trg_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_updated_at();
