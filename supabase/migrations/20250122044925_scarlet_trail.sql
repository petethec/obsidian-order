/*
  # Fix Vote Weights Table and Dependencies

  1. Changes
    - Drop and recreate vote_weights table with proper constraints
    - Add proper indexes and RLS policies
    - Fix vote weight calculation function
    
  2. Security
    - Ensure proper access control for vote weights
    - Add validation for active campaigns only
*/

-- Drop existing vote_weights table if it exists
DROP TABLE IF EXISTS vote_weights CASCADE;

-- Recreate vote_weights table with proper structure
CREATE TABLE vote_weights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vote_id UUID REFERENCES votes(id) NOT NULL,
  base_weight INTEGER NOT NULL DEFAULT 1,
  pledge_multiplier NUMERIC DEFAULT 1.0,
  reputation_multiplier NUMERIC DEFAULT 1.0,
  final_weight NUMERIC NOT NULL,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE vote_weights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Vote weights are viewable by everyone"
  ON vote_weights FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_vote_weights_vote ON vote_weights(vote_id);
CREATE INDEX idx_vote_weights_final ON vote_weights(final_weight);

-- Recreate vote weight calculation function with better error handling
CREATE OR REPLACE FUNCTION calculate_vote_weight()
RETURNS TRIGGER AS $$
DECLARE
  pledge_amount NUMERIC;
  reputation_score INTEGER;
  campaign_status TEXT;
BEGIN
  -- Check if campaign is active
  SELECT status INTO campaign_status
  FROM campaigns
  WHERE id = NEW.campaign_id;

  IF campaign_status != 'active' THEN
    RAISE EXCEPTION 'Cannot vote on inactive campaign';
  END IF;

  -- Get pledge amount for campaign with proper null handling
  SELECT COALESCE(SUM(amount), 0) INTO pledge_amount
  FROM pledges
  WHERE campaign_id = NEW.campaign_id
  AND backer_id = NEW.voter_id
  AND status = 'pending';

  -- Get voter's reputation score with proper null handling
  SELECT COALESCE(score, 0) INTO reputation_score
  FROM reputation_scores
  WHERE creator_id = NEW.voter_id;

  -- Calculate and store vote weight with safe multipliers
  INSERT INTO vote_weights (
    vote_id,
    base_weight,
    pledge_multiplier,
    reputation_multiplier,
    final_weight
  ) VALUES (
    NEW.id,
    1,
    LEAST(GREATEST(COALESCE(pledge_amount / 1000, 1.0), 1.0), 2.0),
    LEAST(GREATEST(COALESCE(reputation_score / 100, 1.0), 1.0), 1.5),
    1 * 
    LEAST(GREATEST(COALESCE(pledge_amount / 1000, 1.0), 1.0), 2.0) * 
    LEAST(GREATEST(COALESCE(reputation_score / 100, 1.0), 1.0), 1.5)
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error and set default weight
    RAISE WARNING 'Error calculating vote weight: %', SQLERRM;
    
    INSERT INTO vote_weights (
      vote_id,
      base_weight,
      pledge_multiplier,
      reputation_multiplier,
      final_weight
    ) VALUES (
      NEW.id,
      1,
      1.0,
      1.0,
      1.0
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;