/*
  # Fix profile creation trigger

  1. Changes
    - Update handle_new_user function to handle missing metadata
    - Add fallback for username generation
    - Add constraint to ensure username is not null
*/

-- Add NOT NULL constraint to username if not already present
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'username' 
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE profiles ALTER COLUMN username SET NOT NULL;
  END IF;
END $$;

-- Update the handle_new_user function with better fallbacks
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  username_val text;
BEGIN
  -- Generate a username if not provided
  username_val := COALESCE(
    new.raw_user_meta_data->>'username',
    SPLIT_PART(new.email, '@', 1),
    'user_' || SUBSTR(MD5(new.id::text), 1, 8)
  );

  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    avatar_url,
    created_at,
    updated_at
  ) VALUES (
    new.id,
    username_val,
    COALESCE(new.raw_user_meta_data->>'full_name', NULL),
    COALESCE(new.raw_user_meta_data->>'avatar_url', NULL),
    NOW(),
    NOW()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;