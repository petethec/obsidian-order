/*
  # Create Reputation System

  1. New Tables
    - reputation_scores: Stores creator reputation metrics
    
  2. Changes
    - Add proper table structure with constraints
    - Add RLS policies
    - Add triggers for automatic updates
*/

-- Create reputation scores table
CREATE TABLE IF NOT EXISTS reputation_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  successful_campaigns INTEGER DEFAULT 0,
  total_raised NUMERIC DEFAULT 0,
  total_backers INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (creator_id)
);

-- Enable RLS
ALTER TABLE reputation_scores ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Reputation scores are viewable by everyone"
  ON reputation_scores FOR SELECT
  USING (true);

-- Create function to initialize reputation score
CREATE OR REPLACE FUNCTION initialize_reputation_score()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO reputation_scores (creator_id)
  VALUES (NEW.id)
  ON CONFLICT (creator_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to initialize reputation score for new profiles
CREATE TRIGGER initialize_reputation_score_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION initialize_reputation_score();

-- Create function to update reputation score
CREATE OR REPLACE FUNCTION update_reputation_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Update reputation score based on campaign success
  UPDATE reputation_scores
  SET 
    successful_campaigns = successful_campaigns + 1,
    total_raised = total_raised + NEW.current_amount,
    total_backers = (
      SELECT COUNT(DISTINCT backer_id)
      FROM pledges
      WHERE campaign_id = NEW.id
    ),
    score = score + 100,  -- Base score increase for successful campaign
    updated_at = NOW()
  WHERE creator_id = NEW.creator_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating reputation scores
CREATE TRIGGER update_reputation_score_trigger
  AFTER UPDATE OF status ON campaigns
  FOR EACH ROW
  WHEN (NEW.status = 'successful')
  EXECUTE FUNCTION update_reputation_score();

-- Create indexes for performance
CREATE INDEX idx_reputation_scores_creator ON reputation_scores(creator_id);
CREATE INDEX idx_reputation_scores_score ON reputation_scores(score);
CREATE INDEX idx_reputation_scores_updated ON reputation_scores(updated_at);