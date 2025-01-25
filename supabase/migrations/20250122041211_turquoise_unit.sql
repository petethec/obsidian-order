/*
  # Create Achievement System

  1. New Tables
    - achievements: Stores achievement definitions
    - creator_achievements: Tracks unlocked achievements per creator
    
  2. Changes
    - Add proper table structure with constraints
    - Add RLS policies
    - Insert initial achievement data
*/

-- Create achievements table if it doesn't exist
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  criteria JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create creator achievements table if it doesn't exist
CREATE TABLE IF NOT EXISTS creator_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) NOT NULL,
  achievement_id UUID REFERENCES achievements(id) NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (creator_id, achievement_id)
);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Achievements are viewable by everyone"
  ON achievements FOR SELECT
  USING (true);

CREATE POLICY "Creator achievements are viewable by everyone"
  ON creator_achievements FOR SELECT
  USING (true);

-- Insert initial achievements
INSERT INTO achievements (name, description, icon, criteria) VALUES
  -- Campaign Success Achievements
  ('Campaign Master', 'Complete 5 successful campaigns', 'Trophy', '{"successful_campaigns": 5}'::jsonb),
  ('Campaign Legend', 'Complete 10 successful campaigns', 'Trophy', '{"successful_campaigns": 10}'::jsonb),
  
  -- Funding Achievements
  ('Six Figure Club', 'Raise over $100,000 in a single campaign', 'Star', '{"single_campaign_raised": 100000}'::jsonb),
  ('Million Dollar Creator', 'Raise over $1,000,000 in total', 'Star', '{"total_raised": 1000000}'::jsonb),
  
  -- Backer Achievements
  ('Viral Success', 'Get 5,000+ backers on a single campaign', 'Users', '{"single_campaign_backers": 5000}'::jsonb),
  ('Community Leader', 'Reach 10,000+ total backers', 'Users', '{"total_backers": 10000}'::jsonb),
  
  -- Milestone Achievements
  ('Milestone Master', 'Complete all milestones in 3 campaigns', 'CheckCircle', '{"perfect_milestone_campaigns": 3}'::jsonb),
  ('Speed Runner', 'Complete all milestones ahead of schedule', 'Clock', '{"early_milestone_completion": true}'::jsonb),
  
  -- Innovation Achievements
  ('Innovation Pioneer', 'Win 3 competitive innovation challenges', 'Lightbulb', '{"innovation_challenge_wins": 3}'::jsonb),
  ('Popular Choice', 'Get the most votes in a challenge', 'Award', '{"most_voted_challenge": true}'::jsonb),
  
  -- Impact Achievements
  ('Change Maker', 'Successfully influence 3 corporate policies', 'Target', '{"corporate_policy_changes": 3}'::jsonb),
  ('Policy Shifter', 'Achieve government action through campaign', 'Building', '{"government_action_achieved": true}'::jsonb),
  
  -- Legacy Achievements
  ('Legacy Builder', 'Successfully transfer 3 campaigns', 'Briefcase', '{"successful_transfers": 3}'::jsonb),
  ('Mentor', 'Maintain perfect advisor rating for 6 months', 'GraduationCap', '{"perfect_advisor_rating_months": 6}'::jsonb),
  
  -- Special Achievements
  ('First Mover', 'Be among the first 100 creators', 'Rocket', '{"early_creator": true}'::jsonb),
  ('Glass Ceiling', 'Maintain 95+ GlassScore for 3 months', 'Diamond', '{"high_glass_score_months": 3}'::jsonb);

-- Create function to check for new achievements
CREATE OR REPLACE FUNCTION check_achievements()
RETURNS TRIGGER AS $$
BEGIN
  -- Check campaign success achievements
  IF NEW.successful_campaigns >= 5 THEN
    INSERT INTO creator_achievements (creator_id, achievement_id)
    SELECT NEW.creator_id, id FROM achievements
    WHERE name = 'Campaign Master'
    ON CONFLICT DO NOTHING;
  END IF;

  IF NEW.successful_campaigns >= 10 THEN
    INSERT INTO creator_achievements (creator_id, achievement_id)
    SELECT NEW.creator_id, id FROM achievements
    WHERE name = 'Campaign Legend'
    ON CONFLICT DO NOTHING;
  END IF;

  -- Check funding achievements
  IF NEW.total_raised >= 1000000 THEN
    INSERT INTO creator_achievements (creator_id, achievement_id)
    SELECT NEW.creator_id, id FROM achievements
    WHERE name = 'Million Dollar Creator'
    ON CONFLICT DO NOTHING;
  END IF;

  -- Check backer achievements
  IF NEW.total_backers >= 10000 THEN
    INSERT INTO creator_achievements (creator_id, achievement_id)
    SELECT NEW.creator_id, id FROM achievements
    WHERE name = 'Community Leader'
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for achievement checks
CREATE TRIGGER check_achievements_trigger
  AFTER UPDATE ON reputation_scores
  FOR EACH ROW
  EXECUTE FUNCTION check_achievements();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_achievements_name ON achievements(name);
CREATE INDEX IF NOT EXISTS idx_creator_achievements_creator ON creator_achievements(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_achievements_achievement ON creator_achievements(achievement_id);