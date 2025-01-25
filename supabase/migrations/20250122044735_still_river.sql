/*
  # Fix Votes Table Reference

  1. New Tables
    - `votes`: Store campaign votes with voter information
    
  2. Changes
    - Create votes table before vote weights
    - Add proper foreign key constraints
    
  3. Security
    - Enable RLS on votes table
    - Add policies for vote access control
*/

-- Create votes table first
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) NOT NULL,
  voter_id UUID REFERENCES profiles(id) NOT NULL,
  vote_weight INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (campaign_id, voter_id)
);

-- Enable RLS
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for votes
CREATE POLICY "Votes are viewable by everyone"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote once per campaign"
  ON votes FOR INSERT
  WITH CHECK (
    auth.uid() = voter_id AND
    NOT EXISTS (
      SELECT 1 FROM votes
      WHERE campaign_id = NEW.campaign_id
      AND voter_id = NEW.voter_id
    )
  );

-- Create indexes for performance
CREATE INDEX idx_votes_campaign ON votes(campaign_id);
CREATE INDEX idx_votes_voter ON votes(voter_id);
CREATE INDEX idx_votes_created ON votes(created_at);