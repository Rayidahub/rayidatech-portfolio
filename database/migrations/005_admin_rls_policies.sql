-- database/migrations/005_admin_rls_policies.sql
-- Add UPDATE and DELETE policies for authenticated users on all content tables

-- Projects
CREATE POLICY "Allow authenticated update access to projects"
  ON projects FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access to projects"
  ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- Posts
CREATE POLICY "Allow authenticated update access to posts"
  ON posts FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access to posts"
  ON posts FOR DELETE USING (auth.role() = 'authenticated');

-- Services
CREATE POLICY "Allow authenticated update access to services"
  ON services FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access to services"
  ON services FOR DELETE USING (auth.role() = 'authenticated');

-- Testimonials
CREATE POLICY "Allow authenticated insert access to testimonials"
  ON testimonials FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update access to testimonials"
  ON testimonials FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access to testimonials"
  ON testimonials FOR DELETE USING (auth.role() = 'authenticated');

-- Contacts (authenticated users can update/delete too)
CREATE POLICY "Allow authenticated update access to contacts"
  ON contacts FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access to contacts"
  ON contacts FOR DELETE USING (auth.role() = 'authenticated');
