/*
  # Fix profile table issues

  1. Changes
    - Ensure all required columns exist with proper types
    - Drop duplicate triggers
    - Add proper indexes for performance
    - Update RLS policies for better security
*/

-- Ensure all required columns exist with proper types
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_username_key;

ALTER TABLE profiles
ALTER COLUMN username SET NOT NULL,
ALTER COLUMN created_at SET NOT NULL,
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN updated_at SET NOT NULL,
ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

-- Recreate unique constraint with proper collation
ALTER TABLE profiles
ADD CONSTRAINT profiles_username_key UNIQUE (username COLLATE "C");

-- Drop duplicate triggers
DROP TRIGGER IF EXISTS set_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Create single trigger for updated_at
CREATE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles (username);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON profiles (created_at);

-- Update RLS policies for better security
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create comprehensive RLS policies
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';