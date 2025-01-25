/*
  # Initial Schema Setup for Consequence-Based Crowdfunding

  1. New Tables
    - `profiles`
      - Stores user profile information
      - Links to Supabase auth.users
      - Contains user preferences and settings
    
    - `campaigns`
      - Core campaign information
      - Funding goals and timeline
      - Success/failure consequence settings
      - Campaign status tracking
    
    - `pledges`
      - Records user contributions to campaigns
      - Tracks pledge amounts and status
      - Links pledges to campaigns and users

  2. Security
    - Enable RLS on all tables
    - Add policies for:
      - Public read access to active campaigns
      - Authenticated user access to own profiles
      - Creator access to own campaigns
      - Backer access to own pledges
*/

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('government', 'innovation')),
  funding_goal NUMERIC NOT NULL CHECK (funding_goal > 0),
  current_amount NUMERIC DEFAULT 0 CHECK (current_amount >= 0),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  target TEXT NOT NULL,
  success_type TEXT NOT NULL CHECK (success_type IN ('reward', 'stretch', 'community')),
  success_description TEXT NOT NULL,
  failure_type TEXT NOT NULL CHECK (failure_type IN ('refund', 'charity', 'challenge')),
  failure_description TEXT NOT NULL,
  charity_name TEXT,
  refund_percentage INTEGER CHECK (
    (failure_type != 'refund' OR (refund_percentage >= 0 AND refund_percentage <= 100))
  ),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'successful', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date > start_date),
  CONSTRAINT valid_charity CHECK (
    (failure_type != 'charity' OR charity_name IS NOT NULL)
  )
);

-- Create pledges table
CREATE TABLE pledges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) NOT NULL,
  backer_id UUID REFERENCES profiles(id) NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'refunded', 'redirected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE pledges ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Campaigns policies
CREATE POLICY "Campaigns are viewable by everyone"
  ON campaigns
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create campaigns"
  ON campaigns
  FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own campaigns"
  ON campaigns
  FOR UPDATE
  USING (auth.uid() = creator_id);

-- Pledges policies
CREATE POLICY "Users can view own pledges"
  ON pledges
  FOR SELECT
  USING (auth.uid() = backer_id);

CREATE POLICY "Users can create pledges"
  ON pledges
  FOR INSERT
  WITH CHECK (auth.uid() = backer_id);

-- Create functions for campaign management
CREATE OR REPLACE FUNCTION update_campaign_amount()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE campaigns
  SET current_amount = (
    SELECT COALESCE(SUM(amount), 0)
    FROM pledges
    WHERE campaign_id = NEW.campaign_id
    AND status = 'pending'
  )
  WHERE id = NEW.campaign_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update campaign amounts
CREATE TRIGGER update_campaign_amount_trigger
AFTER INSERT OR UPDATE ON pledges
FOR EACH ROW
EXECUTE FUNCTION update_campaign_amount();

-- Create function to check campaign status
CREATE OR REPLACE FUNCTION check_campaign_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update campaign status based on funding and end date
  IF NEW.current_amount >= NEW.funding_goal AND NEW.end_date <= NOW() THEN
    NEW.status = 'successful';
  ELSIF NEW.end_date <= NOW() AND NEW.current_amount < NEW.funding_goal THEN
    NEW.status = 'failed';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for campaign status
CREATE TRIGGER check_campaign_status_trigger
BEFORE UPDATE ON campaigns
FOR EACH ROW
EXECUTE FUNCTION check_campaign_status();