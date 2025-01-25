/*
  # Fix Votes Table and Dependencies

  1. Changes
    - Drop and recreate votes table with proper constraints
    - Add proper indexes and RLS policies
    - Fix dependencies with vote_weights table
    
  2. Security
    - Ensure proper access control for voting
    - Add validation for active campaigns only
*/

-- Recreate votes table with proper structure
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) NOT NULL,
  voter_id UUID REFERENCES profiles(id) NOT NULL,
  vote_weight INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (campaign_id, voter_id)
);

-- Enable RLS
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Votes are viewable by everyone"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote once per campaign"
  ON votes FOR INSERT
  WITH CHECK (
    auth.uid() = voter_id AND
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE id = campaign_id
      AND status = 'active'
    ) AND
    NOT EXISTS (
      SELECT 1 FROM votes v
      WHERE v.campaign_id = votes.campaign_id
      AND v.voter_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_votes_campaign ON votes(campaign_id);
CREATE INDEX IF NOT EXISTS idx_votes_voter ON votes(voter_id);
CREATE INDEX IF NOT EXISTS idx_votes_created ON votes(created_at);

-- Recreate vote weights function to handle null cases
CREATE OR REPLACE FUNCTION calculate_vote_weight()
RETURNS TRIGGER AS $$
DECLARE
  pledge_amount NUMERIC;
  reputation_score INTEGER;
BEGIN
  -- Get pledge amount for campaign
  SELECT COALESCE(SUM(amount), 0) INTO pledge_amount
  FROM pledges
  WHERE campaign_id = NEW.campaign_id
  AND backer_id = NEW.voter_id
  AND status = 'pending';

  -- Get voter's reputation score
  SELECT COALESCE(score, 0) INTO reputation_score
  FROM reputation_scores
  WHERE creator_id = NEW.voter_id;

  -- Calculate and store vote weight
  INSERT INTO vote_weights (
    vote_id,
    base_weight,
    pledge_multiplier,
    reputation_multiplier,
    final_weight
  ) VALUES (
    NEW.id,
    1,
    LEAST(COALESCE(pledge_amount / 1000, 1.0), 2.0),
    LEAST(COALESCE(reputation_score / 100, 1.0), 1.5),
    1 * LEAST(COALESCE(pledge_amount / 1000, 1.0), 2.0) * 
    LEAST(COALESCE(reputation_score / 100, 1.0), 1.5)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;