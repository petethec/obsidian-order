/*
  # Add Consequence-Based Features

  1. New Tables
    - `milestones`: Track campaign milestones and their completion status
    - `milestone_verifications`: Record milestone verification attempts
    - `votes`: Store backer votes for competitive innovation campaigns
    - `reputation_scores`: Track creator reputation and achievements
    - `achievements`: Define available achievements
    - `creator_achievements`: Link achievements to creators

  2. Changes
    - Add milestone tracking to campaigns table
    - Add voting support for competitive campaigns
    - Add reputation system

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for access control
*/

-- Create milestones table
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  completion_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create milestone verifications table
CREATE TABLE milestone_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID REFERENCES milestones(id) NOT NULL,
  verified_by UUID REFERENCES profiles(id) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) NOT NULL,
  voter_id UUID REFERENCES profiles(id) NOT NULL,
  vote_weight INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (campaign_id, voter_id)
);

-- Create achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  criteria JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create creator achievements table
CREATE TABLE creator_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) NOT NULL,
  achievement_id UUID REFERENCES achievements(id) NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (creator_id, achievement_id)
);

-- Create reputation scores table
CREATE TABLE reputation_scores (
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
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE reputation_scores ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Milestones policies
CREATE POLICY "Milestones are viewable by everyone"
  ON milestones FOR SELECT
  USING (true);

CREATE POLICY "Creators can manage their milestones"
  ON milestones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = milestones.campaign_id
      AND campaigns.creator_id = auth.uid()
    )
  );

-- Milestone verifications policies
CREATE POLICY "Verifications are viewable by everyone"
  ON milestone_verifications FOR SELECT
  USING (true);

CREATE POLICY "Authorized users can create verifications"
  ON milestone_verifications FOR INSERT
  WITH CHECK (auth.uid() = verified_by);

-- Votes policies
CREATE POLICY "Votes are viewable by everyone"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Backers can vote once per campaign"
  ON votes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pledges
      WHERE pledges.campaign_id = votes.campaign_id
      AND pledges.backer_id = auth.uid()
    )
  );

-- Achievements policies
CREATE POLICY "Achievements are viewable by everyone"
  ON achievements FOR SELECT
  USING (true);

-- Creator achievements policies
CREATE POLICY "Creator achievements are viewable by everyone"
  ON creator_achievements FOR SELECT
  USING (true);

-- Reputation scores policies
CREATE POLICY "Reputation scores are viewable by everyone"
  ON reputation_scores FOR SELECT
  USING (true);

-- Create functions for milestone management
CREATE OR REPLACE FUNCTION check_milestone_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Update milestone status based on verifications
  IF EXISTS (
    SELECT 1 FROM milestone_verifications
    WHERE milestone_id = NEW.id
    AND status = 'approved'
  ) THEN
    NEW.status = 'completed';
    NEW.completion_date = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update reputation score
CREATE OR REPLACE FUNCTION update_reputation_score()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO reputation_scores (creator_id, score, successful_campaigns, total_raised, total_backers)
  VALUES (
    NEW.creator_id,
    CASE 
      WHEN NEW.status = 'successful' THEN 100
      ELSE 0
    END,
    CASE 
      WHEN NEW.status = 'successful' THEN 1
      ELSE 0
    END,
    NEW.current_amount,
    (SELECT COUNT(*) FROM pledges WHERE campaign_id = NEW.id)
  )
  ON CONFLICT (creator_id) 
  DO UPDATE SET
    score = reputation_scores.score + 
      CASE 
        WHEN NEW.status = 'successful' THEN 100
        ELSE 0
      END,
    successful_campaigns = reputation_scores.successful_campaigns +
      CASE 
        WHEN NEW.status = 'successful' THEN 1
        ELSE 0
      END,
    total_raised = reputation_scores.total_raised + NEW.current_amount,
    total_backers = reputation_scores.total_backers + 
      (SELECT COUNT(*) FROM pledges WHERE campaign_id = NEW.id),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER check_milestone_completion_trigger
  AFTER INSERT OR UPDATE ON milestone_verifications
  FOR EACH ROW
  EXECUTE FUNCTION check_milestone_completion();

CREATE TRIGGER update_reputation_score_trigger
  AFTER UPDATE OF status ON campaigns
  FOR EACH ROW
  WHEN (NEW.status = 'successful')
  EXECUTE FUNCTION update_reputation_score();

-- Insert default achievements
INSERT INTO achievements (name, description, icon, criteria) VALUES
  ('First Success', 'Complete your first successful campaign', 'Trophy', '{"successful_campaigns": 1}'),
  ('Rising Star', 'Raise over $100,000 in total', 'Star', '{"total_raised": 100000}'),
  ('Community Builder', 'Get 1,000+ total backers', 'Users', '{"total_backers": 1000}'),
  ('Perfect Score', 'Achieve 100% milestone completion', 'CheckCircle', '{"milestone_completion": 100}');

-- Create indexes for performance
CREATE INDEX idx_milestones_campaign ON milestones(campaign_id);
CREATE INDEX idx_votes_campaign ON votes(campaign_id);
CREATE INDEX idx_reputation_score ON reputation_scores(score);
CREATE INDEX idx_achievements_name ON achievements(name);