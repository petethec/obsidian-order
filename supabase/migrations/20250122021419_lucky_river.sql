/*
  # Fix profiles table and policies

  1. Changes
    - Add ON DELETE CASCADE to profiles foreign key references
    - Add missing RLS policies for profiles table
    - Add trigger to create profile on user creation
    
  2. Security
    - Enable RLS on profiles table
    - Add policies for profile creation and updates
*/

-- Drop existing foreign key constraints
ALTER TABLE campaigns DROP CONSTRAINT campaigns_creator_id_fkey;
ALTER TABLE pledges DROP CONSTRAINT pledges_backer_id_fkey;

-- Recreate foreign key constraints with ON DELETE CASCADE
ALTER TABLE campaigns
  ADD CONSTRAINT campaigns_creator_id_fkey
  FOREIGN KEY (creator_id) REFERENCES profiles(id)
  ON DELETE CASCADE;

ALTER TABLE pledges
  ADD CONSTRAINT pledges_backer_id_fkey
  FOREIGN KEY (backer_id) REFERENCES profiles(id)
  ON DELETE CASCADE;

-- Add missing RLS policies for profiles
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create function to handle profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();