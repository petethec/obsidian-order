/*
  # Fix profile constraints and improve error handling

  1. Changes
    - Add NOT NULL constraint to created_at and updated_at
    - Add default values for timestamps
    - Add unique constraint on username
    - Add trigger to ensure updated_at is always set
*/

-- Ensure timestamps are not null and have defaults
ALTER TABLE profiles
ALTER COLUMN created_at SET NOT NULL,
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN updated_at SET NOT NULL,
ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

-- Add unique constraint to username if not exists
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_username_key'
  ) THEN
    ALTER TABLE profiles
    ADD CONSTRAINT profiles_username_key UNIQUE (username);
  END IF;
END $$;

-- Ensure trigger for updated_at exists
DROP TRIGGER IF EXISTS set_updated_at ON profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();