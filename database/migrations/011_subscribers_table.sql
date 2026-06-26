-- Migration 011: Create subscribers table for newsletter signups

CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow public insert access to subscribers"
  ON subscribers FOR INSERT WITH CHECK (true);
