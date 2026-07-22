/*
# Update assessments RLS for admin access

1. Security Changes
   - Add UPDATE + DELETE policies for authenticated users (admin panel)
   - Keep existing anon INSERT + SELECT for public contact form
*/

DROP POLICY IF EXISTS "auth_update_assessments" ON assessments;
CREATE POLICY "auth_update_assessments" ON assessments FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_assessments" ON assessments;
CREATE POLICY "auth_delete_assessments" ON assessments FOR DELETE
TO authenticated USING (true);
