/*
  # Add name field to user_profiles

  1. Changes
    - Add `name` column to user_profiles table
*/

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'name'
  ) THEN 
    ALTER TABLE user_profiles ADD COLUMN name text;
  END IF;
END $$;