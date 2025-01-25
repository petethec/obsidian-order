/*
  # Add New Achievement Types

  1. New Achievements
    - Adds several new achievement types for campaign creators
    - Includes criteria and descriptions for each achievement
    - Supports different tiers for progressive achievements

  2. Changes
    - Adds new achievement records to the achievements table
    - Updates existing achievement criteria
*/

-- Insert new achievements
INSERT INTO achievements (name, description, icon, criteria) VALUES
  -- Campaign Success Achievements
  ('Campaign Master', 'Complete 5 successful campaigns', 'Trophy', '{"successful_campaigns": 5}'),
  ('Campaign Legend', 'Complete 10 successful campaigns', 'Trophy', '{"successful_campaigns": 10}'),
  
  -- Funding Achievements
  ('Six Figure Club', 'Raise over $100,000 in a single campaign', 'Star', '{"single_campaign_raised": 100000}'),
  ('Million Dollar Creator', 'Raise over $1,000,000 in total', 'Star', '{"total_raised": 1000000}'),
  
  -- Backer Achievements
  ('Viral Success', 'Get 5,000+ backers on a single campaign', 'Users', '{"single_campaign_backers": 5000}'),
  ('Community Leader', 'Reach 10,000+ total backers', 'Users', '{"total_backers": 10000}'),
  
  -- Milestone Achievements
  ('Milestone Master', 'Complete all milestones in 3 campaigns', 'CheckCircle', '{"perfect_milestone_campaigns": 3}'),
  ('Speed Runner', 'Complete all milestones ahead of schedule', 'Clock', '{"early_milestone_completion": true}'),
  
  -- Innovation Achievements
  ('Innovation Pioneer', 'Win 3 competitive innovation challenges', 'Lightbulb', '{"innovation_challenge_wins": 3}'),
  ('People\'s Choice', 'Get the most votes in a challenge', 'Award', '{"most_voted_challenge": true}'),
  
  -- Impact Achievements
  ('Change Maker', 'Successfully influence 3 corporate policies', 'Target', '{"corporate_policy_changes": 3}'),
  ('Policy Shifter', 'Achieve government action through campaign', 'Building', '{"government_action_achieved": true}'),
  
  -- Legacy Achievements
  ('Legacy Builder', 'Successfully transfer 3 campaigns', 'Briefcase', '{"successful_transfers": 3}'),
  ('Mentor', 'Maintain perfect advisor rating for 6 months', 'GraduationCap', '{"perfect_advisor_rating_months": 6}'),
  
  -- Special Achievements
  ('First Mover', 'Be among the first 100 creators', 'Rocket', '{"early_creator": true}'),
  ('Glass Ceiling', 'Maintain 95+ GlassScore for 3 months', 'Diamond', '{"high_glass_score_months": 3}');

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