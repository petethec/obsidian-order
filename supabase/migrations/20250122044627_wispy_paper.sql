/*
  # Campaign History and Enhanced Tracking

  1. New Tables
    - `campaign_amount_history`: Track historical changes to campaign amounts
    - `vote_periods`: Track voting periods and rules for campaigns
    - `vote_weights`: Store vote weight calculations
    - `pledge_transactions`: Track payment processing status
    
  2. Changes
    - Add transaction tracking to pledges
    - Add vote verification and weighting
    
  3. Security
    - Enable RLS on all new tables
    - Add policies for appropriate access control
*/

-- Create campaign amount history table
CREATE TABLE campaign_amount_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) NOT NULL,
  previous_amount NUMERIC NOT NULL,
  new_amount NUMERIC NOT NULL,
  change_amount NUMERIC NOT NULL,
  change_type TEXT NOT NULL CHECK (change_type IN ('pledge', 'refund', 'adjustment')),
  reference_id UUID, -- Can reference pledge_id or refund_id
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vote periods table
CREATE TABLE vote_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  min_votes INTEGER NOT NULL DEFAULT 1,
  quorum_percentage INTEGER CHECK (quorum_percentage BETWEEN 0 AND 100),
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Create vote weights table
CREATE TABLE vote_weights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vote_id UUID REFERENCES votes(id) NOT NULL,
  base_weight INTEGER NOT NULL DEFAULT 1,
  pledge_multiplier NUMERIC DEFAULT 1.0,
  reputation_multiplier NUMERIC DEFAULT 1.0,
  final_weight NUMERIC NOT NULL,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pledge transactions table
CREATE TABLE pledge_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pledge_id UUID REFERENCES pledges(id) NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  payment_provider TEXT NOT NULL,
  provider_transaction_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE campaign_amount_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE pledge_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Campaign Amount History
CREATE POLICY "Campaign amount history viewable by everyone"
  ON campaign_amount_history FOR SELECT
  USING (true);

-- Vote Periods
CREATE POLICY "Vote periods are viewable by everyone"
  ON vote_periods FOR SELECT
  USING (true);

CREATE POLICY "Campaign creators can manage vote periods"
  ON vote_periods FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = vote_periods.campaign_id
      AND campaigns.creator_id = auth.uid()
    )
  );

-- Vote Weights
CREATE POLICY "Vote weights are viewable by everyone"
  ON vote_weights FOR SELECT
  USING (true);

-- Pledge Transactions
CREATE POLICY "Users can view their own pledge transactions"
  ON pledge_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pledges
      WHERE pledges.id = pledge_transactions.pledge_id
      AND pledges.backer_id = auth.uid()
    )
  );

-- Create function to track campaign amount changes
CREATE OR REPLACE FUNCTION track_campaign_amount_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.current_amount != OLD.current_amount THEN
    INSERT INTO campaign_amount_history (
      campaign_id,
      previous_amount,
      new_amount,
      change_amount,
      change_type,
      notes
    ) VALUES (
      NEW.id,
      OLD.current_amount,
      NEW.current_amount,
      NEW.current_amount - OLD.current_amount,
      CASE
        WHEN NEW.current_amount > OLD.current_amount THEN 'pledge'
        ELSE 'refund'
      END,
      'Automatic tracking'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate vote weight
CREATE OR REPLACE FUNCTION calculate_vote_weight()
RETURNS TRIGGER AS $$
DECLARE
  pledge_amount NUMERIC;
  reputation_score INTEGER;
BEGIN
  -- Get pledge amount for campaign
  SELECT COALESCE(SUM(amount), 0) INTO pledge_amount
  FROM pledges
  WHERE campaign_id = (
    SELECT campaign_id FROM votes WHERE id = NEW.id
  )
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
    LEAST(pledge_amount / 1000, 2.0),  -- Max 2x multiplier for pledges
    LEAST(reputation_score / 100, 1.5), -- Max 1.5x multiplier for reputation
    1 * LEAST(pledge_amount / 1000, 2.0) * LEAST(reputation_score / 100, 1.5)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER track_campaign_amount_changes
  AFTER UPDATE OF current_amount ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION track_campaign_amount_change();

CREATE TRIGGER calculate_vote_weight_trigger
  AFTER INSERT ON votes
  FOR EACH ROW
  EXECUTE FUNCTION calculate_vote_weight();

-- Create indexes for performance
CREATE INDEX idx_campaign_history_campaign ON campaign_amount_history(campaign_id);
CREATE INDEX idx_vote_periods_campaign ON vote_periods(campaign_id);
CREATE INDEX idx_vote_periods_dates ON vote_periods(start_date, end_date);
CREATE INDEX idx_vote_weights_vote ON vote_weights(vote_id);
CREATE INDEX idx_pledge_transactions_pledge ON pledge_transactions(pledge_id);
CREATE INDEX idx_pledge_transactions_status ON pledge_transactions(status);