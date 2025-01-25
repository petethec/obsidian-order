/*
  # Fix Votes RLS Policy

  1. Changes
    - Drop and recreate the votes RLS policy to use proper syntax
    - Add additional validation for campaign status
    
  2. Security
    - Ensure proper access control for vote creation
    - Add validation for active campaigns only
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Authenticated users can vote once per campaign" ON votes;

-- Create new policy with proper syntax
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