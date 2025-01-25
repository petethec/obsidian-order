/*
  # Marketplace Schema Implementation

  1. New Tables
    - `marketplace_listings`
      - Campaign listings with pricing and terms
    - `legacy_agreements`
      - Legacy share arrangements between buyers and sellers
    - `glass_scores`
      - Community trust metrics for campaigns
    - `advisory_relationships`
      - Seller advisory roles and engagement levels

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
    - Ensure proper access controls

  3. Features
    - Automated royalty calculations
    - Transaction tracking
    - Advisory relationship management
*/

-- Create marketplace listings table
CREATE TABLE marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) NOT NULL,
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'pending', 'sold', 'cancelled')),
  legacy_share_enabled BOOLEAN DEFAULT false,
  legacy_share_discount NUMERIC CHECK (
    (NOT legacy_share_enabled) OR 
    (legacy_share_discount >= 0 AND legacy_share_discount <= 100)
  ),
  royalty_percentage NUMERIC CHECK (
    (NOT legacy_share_enabled) OR 
    (royalty_percentage >= 0 AND royalty_percentage <= 100)
  ),
  royalty_duration_months INTEGER CHECK (
    (NOT legacy_share_enabled) OR 
    (royalty_duration_months > 0)
  ),
  advisor_role_enabled BOOLEAN DEFAULT false,
  advisor_engagement_level TEXT CHECK (
    (NOT advisor_role_enabled) OR 
    (advisor_engagement_level IN ('light', 'moderate', 'active'))
  ),
  buyer_criteria JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create legacy agreements table
CREATE TABLE legacy_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES marketplace_listings(id) NOT NULL,
  buyer_id UUID REFERENCES profiles(id) NOT NULL,
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  upfront_payment NUMERIC NOT NULL,
  royalty_percentage NUMERIC NOT NULL,
  royalty_duration_months INTEGER NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'terminated')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Create glass scores table
CREATE TABLE glass_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) NOT NULL,
  score NUMERIC NOT NULL CHECK (score >= 0 AND score <= 100),
  factors JSONB NOT NULL,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (campaign_id)
);

-- Create advisory relationships table
CREATE TABLE advisory_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id UUID REFERENCES legacy_agreements(id) NOT NULL,
  engagement_level TEXT NOT NULL CHECK (engagement_level IN ('light', 'moderate', 'active')),
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'terminated')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Create royalty payments tracking table
CREATE TABLE royalty_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id UUID REFERENCES legacy_agreements(id) NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  payment_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE glass_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisory_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE royalty_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Marketplace Listings
CREATE POLICY "Listings are viewable by everyone"
  ON marketplace_listings FOR SELECT
  USING (true);

CREATE POLICY "Users can create listings for their campaigns"
  ON marketplace_listings FOR INSERT
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can update their listings"
  ON marketplace_listings FOR UPDATE
  USING (seller_id = auth.uid());

-- Legacy Agreements
CREATE POLICY "Users can view their agreements"
  ON legacy_agreements FOR SELECT
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Users can create agreements"
  ON legacy_agreements FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

-- Glass Scores
CREATE POLICY "Glass scores are viewable by everyone"
  ON glass_scores FOR SELECT
  USING (true);

-- Advisory Relationships
CREATE POLICY "Users can view their advisory relationships"
  ON advisory_relationships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM legacy_agreements la
      WHERE la.id = advisory_relationships.agreement_id
      AND (la.buyer_id = auth.uid() OR la.seller_id = auth.uid())
    )
  );

-- Royalty Payments
CREATE POLICY "Users can view their royalty payments"
  ON royalty_payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM legacy_agreements la
      WHERE la.id = royalty_payments.agreement_id
      AND (la.buyer_id = auth.uid() OR la.seller_id = auth.uid())
    )
  );

-- Create functions for marketplace operations
CREATE OR REPLACE FUNCTION calculate_glass_score(campaign_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  score NUMERIC;
  campaign_record RECORD;
BEGIN
  -- Get campaign details
  SELECT 
    current_amount,
    funding_goal,
    (
      SELECT COUNT(*) 
      FROM pledges 
      WHERE pledges.campaign_id = campaigns.id
    ) as backer_count
  INTO campaign_record
  FROM campaigns
  WHERE id = campaign_id;

  -- Calculate base score from funding progress (40% weight)
  score := (campaign_record.current_amount::NUMERIC / campaign_record.funding_goal::NUMERIC) * 40;
  
  -- Add backer count score (30% weight, assume 100+ backers is max score)
  score := score + LEAST((campaign_record.backer_count::NUMERIC / 100) * 30, 30);
  
  -- Add time-based trust factor (30% weight)
  score := score + 30;  -- Simplified for now, expand based on actual metrics
  
  RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating glass scores
CREATE OR REPLACE FUNCTION update_glass_score()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO glass_scores (campaign_id, score, factors, calculated_at)
  VALUES (
    NEW.campaign_id,
    calculate_glass_score(NEW.campaign_id),
    jsonb_build_object(
      'funding_progress', (NEW.current_amount::NUMERIC / NEW.funding_goal::NUMERIC),
      'backer_count', (SELECT COUNT(*) FROM pledges WHERE campaign_id = NEW.campaign_id)
    ),
    NOW()
  )
  ON CONFLICT (campaign_id) 
  DO UPDATE SET 
    score = EXCLUDED.score,
    factors = EXCLUDED.factors,
    calculated_at = EXCLUDED.calculated_at;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_campaign_glass_score
AFTER INSERT OR UPDATE ON campaigns
FOR EACH ROW
EXECUTE FUNCTION update_glass_score();

-- Create indexes for performance
CREATE INDEX idx_marketplace_listings_campaign_id ON marketplace_listings(campaign_id);
CREATE INDEX idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX idx_legacy_agreements_dates ON legacy_agreements(start_date, end_date);
CREATE INDEX idx_glass_scores_score ON glass_scores(score);
CREATE INDEX idx_royalty_payments_agreement ON royalty_payments(agreement_id);