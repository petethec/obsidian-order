/*
  # Fix Achievement Data

  1. Changes
    - Fix SQL syntax for achievement names with apostrophes
    - Update achievement criteria format
    - Add missing achievement types
*/

-- Insert achievements with fixed syntax
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

-- Update achievement check function
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