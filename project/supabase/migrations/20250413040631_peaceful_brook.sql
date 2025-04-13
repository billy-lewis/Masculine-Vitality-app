/*
  # Initial Schema Setup

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `age` (integer)
      - `occupation` (text)
      - `interests` (text array)
      - `selected_influencers` (text array)
      - `created_at` (timestamp)
    
    - `messages`
      - `id` (uuid, primary key)
      - `content` (text)
      - `sender` (text)
      - `user_profile_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read/write their own data
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  age integer,
  occupation text,
  interests text[],
  selected_influencers text[],
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  sender text NOT NULL,
  user_profile_id uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (user_profile_id = auth.uid());

CREATE POLICY "Users can insert own messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (user_profile_id = auth.uid());