/*
  # Fix username constraint and indexes

  1. Changes
    - Fix username unique constraint without COLLATE clause
    - Ensure proper indexes exist
    - Clean up any duplicate triggers
*/

-- Drop existing constraint if it exists
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_username_key;

-- Add unique constraint without COLLATE clause
ALTER TABLE profiles
ADD CONSTRAINT profiles_username_key UNIQUE (username);

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles (username);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON profiles (created_at);

-- Clean up any duplicate triggers
DROP TRIGGER IF EXISTS set_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Ensure single trigger exists for updated_at
DROP TRIGGER IF EXISTS update_profiles_timestamp ON profiles;
CREATE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';