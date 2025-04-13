/*
  # Fix Schema and RLS Policies

  1. Schema Updates
    - Add missing columns to user_profiles table
    - Ensure messages table has correct structure
    - Make required fields non-nullable

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Update user_profiles table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS name text NOT NULL,
ADD COLUMN IF NOT EXISTS occupation text NOT NULL,
ALTER COLUMN interests SET NOT NULL,
ALTER COLUMN selected_influencers SET NOT NULL;

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own messages" ON messages;
DROP POLICY IF EXISTS "Users can read own messages" ON messages;

-- Create new policies for user_profiles
CREATE POLICY "Users can insert own profile"
ON user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own profile"
ON user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create new policies for messages
CREATE POLICY "Users can insert own messages"
ON messages
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_profile_id);

CREATE POLICY "Users can read own messages"
ON messages
FOR SELECT
TO authenticated
USING (auth.uid() = user_profile_id);