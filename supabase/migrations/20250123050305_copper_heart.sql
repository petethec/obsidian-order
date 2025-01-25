/*
  # Add Mock Campaign Data

  1. New Data
    - Adds realistic mock campaigns across multiple categories and states
    - Includes varied success rates and engagement levels
    - Provides test data for development and demos

  2. Categories
    - Medical
    - Education
    - Emergency Relief
    - Arts & Culture
    - Community Development

  3. Campaign States
    - Active
    - Completed
    - Suspended
*/

-- Insert mock campaigns
INSERT INTO campaigns (
  id,
  creator_id,
  title,
  description,
  type,
  funding_goal,
  current_amount,
  start_date,
  end_date,
  target,
  success_type,
  success_description,
  failure_type,
  failure_description,
  status,
  currency
) VALUES
  -- Medical Campaigns
  (
    gen_random_uuid(),
    '123e4567-e89b-12d3-a456-426614174000',
    'Emergency Medical Equipment for Rural Clinic',
    'Help us purchase vital medical equipment for our rural health clinic serving underserved communities in Montana.',
    'innovation',
    75000,
    45000,
    NOW() - INTERVAL '30 days',
    NOW() + INTERVAL '60 days',
    'Bozeman Health Foundation',
    'reward',
    'When funded, we will install new medical equipment and provide free health screenings for 1000 residents.',
    'charity',
    'If unsuccessful, funds will support mobile clinic visits to the area.',
    'active',
    'USD'
  ),
  (
    gen_random_uuid(),
    '123e4567-e89b-12d3-a456-426614174001',
    'Pediatric Cancer Research Initiative',
    'Support groundbreaking pediatric cancer research at Boston Children''s Hospital.',
    'innovation',
    500000,
    525000,
    NOW() - INTERVAL '90 days',
    NOW() - INTERVAL '10 days',
    'Boston Children''s Hospital',
    'stretch',
    'Additional funding will expand the research to include more rare childhood cancers.',
    'refund',
    'All contributions will be refunded if the goal is not met.',
    'successful',
    'USD'
  ),

  -- Education Campaigns
  (
    gen_random_uuid(),
    '123e4567-e89b-12d3-a456-426614174002',
    'STEM Lab for Inner City School',
    'Create a state-of-the-art STEM laboratory for students at Washington High School in Chicago.',
    'government',
    150000,
    75000,
    NOW() - INTERVAL '45 days',
    NOW() + INTERVAL '45 days',
    'Chicago Public Schools',
    'community',
    'The lab will serve 1000+ students annually and host community STEM events.',
    'challenge',
    'School board must match 50% of raised funds from their budget.',
    'active',
    'USD'
  ),
  (
    gen_random_uuid(),
    '123e4567-e89b-12d3-a456-426614174003',
    'Teacher Technology Training Program',
    'Provide comprehensive technology training for 200 teachers in rural Texas schools.',
    'innovation',
    100000,
    15000,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '5 days',
    'Texas Education Initiative',
    'reward',
    'Teachers will receive certification and classroom technology kits.',
    'charity',
    'Funds will provide basic technology resources to participating schools.',
    'failed',
    'USD'
  ),

  -- Emergency Relief
  (
    gen_random_uuid(),
    '123e4567-e89b-12d3-a456-426614174004',
    'Hurricane Recovery Fund',
    'Support immediate relief efforts for communities affected by Hurricane Laura in Louisiana.',
    'government',
    1000000,
    750000,
    NOW() - INTERVAL '15 days',
    NOW() + INTERVAL '15 days',
    'Louisiana Emergency Response',
    'community',
    'Provide emergency shelter, supplies, and rebuilding assistance.',
    'charity',
    'All funds will directly support affected families through local charities.',
    'active',
    'USD'
  ),
  (
    gen_random_uuid(),
    '123e4567-e89b-12d3-a456-426614174005',
    'Wildfire Prevention Initiative',
    'Fund advanced fire prevention systems in high-risk California communities.',
    'innovation',
    250000,
    275000,
    NOW() - INTERVAL '60 days',
    NOW() - INTERVAL '1 day',
    'California Fire Safety Council',
    'stretch',
    'Additional funding will expand coverage to more communities.',
    'refund',
    '90% refund if prevention systems cannot be implemented.',
    'successful',
    'USD'
  ),

  -- Arts & Culture
  (
    gen_random_uuid(),
    '123e4567-e89b-12d3-a456-426614174006',
    'Historic Theater Restoration',
    'Restore the landmark Palace Theater in downtown Seattle to its former glory.',
    'innovation',
    300000,
    50000,
    NOW() - INTERVAL '30 days',
    NOW() + INTERVAL '60 days',
    'Seattle Arts Foundation',
    'reward',
    'Restored theater will host community events and youth programs.',
    'challenge',
    'City must provide matching funds for restoration.',
    'active',
    'USD'
  ),
  (
    gen_random_uuid(),
    '123e4567-e89b-12d3-a456-426614174007',
    'Indigenous Art Exhibition',
    'Support a traveling exhibition of Native American art across New Mexico.',
    'government',
    80000,
    5000,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '1 day',
    'New Mexico Arts Council',
    'community',
    'Exhibition will visit 12 cities and provide educational programs.',
    'charity',
    'Funds will support local Native American art programs.',
    'suspended',
    'USD'
  ),

  -- Community Development
  (
    gen_random_uuid(),
    '123e4567-e89b-12d3-a456-426614174008',
    'Community Garden Network',
    'Create sustainable community gardens in food desert areas of Atlanta.',
    'innovation',
    120000,
    95000,
    NOW() - INTERVAL '40 days',
    NOW() + INTERVAL '20 days',
    'Atlanta Urban Farming',
    'stretch',
    'Additional gardens will be created with surplus funds.',
    'charity',
    'Funds will support existing food banks in target areas.',
    'active',
    'USD'
  ),
  (
    gen_random_uuid(),
    '123e4567-e89b-12d3-a456-426614174009',
    'Youth Center Renovation',
    'Modernize and expand the Central Youth Center in Detroit.',
    'government',
    200000,
    210000,
    NOW() - INTERVAL '75 days',
    NOW() - INTERVAL '5 days',
    'Detroit Youth Foundation',
    'community',
    'Expanded center will serve twice as many youth with new programs.',
    'refund',
    'Full refund if renovation permits are not approved.',
    'successful',
    'USD'
  );

-- Add mock pledges for each campaign
INSERT INTO pledges (
  campaign_id,
  backer_id,
  amount,
  status,
  created_at
)
SELECT 
  c.id,
  '123e4567-e89b-12d3-a456-426614174' || LPAD(FLOOR(random() * 1000)::text, 3, '0'),
  FLOOR(random() * 1000) + 100,
  CASE WHEN random() < 0.9 THEN 'pending' ELSE 'refunded' END,
  NOW() - (random() * INTERVAL '90 days')
FROM campaigns c
CROSS JOIN generate_series(1, FLOOR(random() * 100 + 50)::int);

-- Update campaign amounts based on pledges
UPDATE campaigns c
SET current_amount = (
  SELECT COALESCE(SUM(amount), 0)
  FROM pledges p
  WHERE p.campaign_id = c.id
  AND p.status = 'pending'
);