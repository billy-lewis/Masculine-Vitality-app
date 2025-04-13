/*
  # Add Influencer Content Tables

  1. New Tables
    - `influencer_content`: Stores detailed information about influencers
    - `influencer_books`: Stores book recommendations from influencers
    - `influencer_quotes`: Stores notable quotes from influencers

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
*/

-- Create influencer_content table
CREATE TABLE IF NOT EXISTS influencer_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id text NOT NULL,
  bio text NOT NULL,
  expertise text[] NOT NULL,
  social_links jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create influencer_books table
CREATE TABLE IF NOT EXISTS influencer_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id text NOT NULL,
  title text NOT NULL,
  author text NOT NULL,
  description text,
  link text,
  created_at timestamptz DEFAULT now()
);

-- Create influencer_quotes table
CREATE TABLE IF NOT EXISTS influencer_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id text NOT NULL,
  quote text NOT NULL,
  context text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE influencer_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_quotes ENABLE ROW LEVEL SECURITY;

-- Create public read policies
CREATE POLICY "Allow public read access" ON influencer_content
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access" ON influencer_books
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access" ON influencer_quotes
  FOR SELECT TO public USING (true);

-- Insert sample data for Joe Rogan
INSERT INTO influencer_content (influencer_id, bio, expertise) VALUES
('joe-rogan', 
'Joe Rogan is a comedian, podcast host, and UFC commentator. He hosts The Joe Rogan Experience, one of the most popular podcasts globally, where he discusses various topics including comedy, martial arts, psychedelics, and philosophy.',
ARRAY['Comedy', 'Martial Arts', 'Podcasting', 'Health & Fitness']);

INSERT INTO influencer_books (influencer_id, title, author, description) VALUES
('joe-rogan', 
'The War of Art', 
'Steven Pressfield',
'A book about overcoming creative blocks and internal resistance'),
('joe-rogan',
'Born to Run',
'Christopher McDougall',
'Explores the running culture of the Tarahumara Indians and the science of running');

INSERT INTO influencer_quotes (influencer_id, quote, context) VALUES
('joe-rogan',
'Be the hero of your own movie if your life was a movie and you were the protagonist your behaviors would be different.',
'On personal development'),
('joe-rogan',
'The key to happiness doesn''t lay in numbers in a bank account but in the way we make others feel and the way they make us feel.',
'On success and fulfillment');