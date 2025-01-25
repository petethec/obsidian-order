# Database Schema Documentation

## Core Tables

### Profiles
Stores user profile information and links to Supabase Auth.

```sql
profiles (
  id: uuid PRIMARY KEY,              -- Links to auth.users
  username: text UNIQUE NOT NULL,    -- Public display name
  full_name: text,                   -- Optional full name
  avatar_url: text,                  -- Profile picture URL
  website: text,                     -- Optional website
  bio: text,                         -- Optional biography
  created_at: timestamptz,           -- Account creation timestamp
  updated_at: timestamptz            -- Last update timestamp
)
```

### Campaigns
Main campaign data storage.

```sql
campaigns (
  id: uuid PRIMARY KEY,
  creator_id: uuid,                  -- References profiles
  title: text NOT NULL,
  description: text NOT NULL,
  type: text NOT NULL,               -- government/innovation
  funding_goal: numeric NOT NULL,
  current_amount: numeric DEFAULT 0,
  start_date: timestamptz NOT NULL,
  end_date: timestamptz NOT NULL,
  target: text NOT NULL,
  success_type: text NOT NULL,       -- reward/stretch/community
  success_description: text NOT NULL,
  failure_type: text NOT NULL,       -- refund/charity/challenge
  failure_description: text NOT NULL,
  charity_name: text,                -- For charity failure type
  refund_percentage: integer,        -- For refund failure type
  status: text DEFAULT 'draft',      -- draft/active/successful/failed
  created_at: timestamptz,
  updated_at: timestamptz
)
```

### Pledges
Records of campaign contributions.

```sql
pledges (
  id: uuid PRIMARY KEY,
  campaign_id: uuid,                 -- References campaigns
  backer_id: uuid,                   -- References profiles
  amount: numeric NOT NULL,
  status: text DEFAULT 'pending',    -- pending/successful/refunded/redirected
  created_at: timestamptz,
  updated_at: timestamptz
)
```

## Campaign Management

### Milestones
Tracks campaign progress points.

```sql
milestones (
  id: uuid PRIMARY KEY,
  campaign_id: uuid,                 -- References campaigns
  title: text NOT NULL,
  description: text NOT NULL,
  target_date: timestamptz NOT NULL,
  status: text NOT NULL,             -- pending/completed/failed
  completion_date: timestamptz,
  created_at: timestamptz,
  updated_at: timestamptz
)
```

### Milestone Verifications
Records verification attempts for milestones.

```sql
milestone_verifications (
  id: uuid PRIMARY KEY,
  milestone_id: uuid,                -- References milestones
  verified_by: uuid,                 -- References profiles
  status: text NOT NULL,             -- pending/approved/rejected
  notes: text,
  created_at: timestamptz,
  updated_at: timestamptz
)
```

## Marketplace Features

### Marketplace Listings
Campaigns available for purchase.

```sql
marketplace_listings (
  id: uuid PRIMARY KEY,
  campaign_id: uuid,                 -- References campaigns
  seller_id: uuid,                   -- References profiles
  price: numeric NOT NULL,
  status: text NOT NULL,             -- draft/active/pending/sold/cancelled
  legacy_share_enabled: boolean,
  legacy_share_discount: numeric,
  royalty_percentage: numeric,
  royalty_duration_months: integer,
  advisor_role_enabled: boolean,
  advisor_engagement_level: text,    -- light/moderate/active
  buyer_criteria: jsonb,
  created_at: timestamptz,
  updated_at: timestamptz
)
```

### Legacy Agreements
Records of campaign transfers with legacy sharing.

```sql
legacy_agreements (
  id: uuid PRIMARY KEY,
  listing_id: uuid,                  -- References marketplace_listings
  buyer_id: uuid,                    -- References profiles
  seller_id: uuid,                   -- References profiles
  upfront_payment: numeric NOT NULL,
  royalty_percentage: numeric NOT NULL,
  royalty_duration_months: integer NOT NULL,
  start_date: timestamptz NOT NULL,
  end_date: timestamptz NOT NULL,
  status: text NOT NULL,             -- active/completed/terminated
  created_at: timestamptz,
  updated_at: timestamptz
)
```

## Reputation System

### Glass Scores
Campaign trust metrics.

```sql
glass_scores (
  id: uuid PRIMARY KEY,
  campaign_id: uuid,                 -- References campaigns
  score: numeric NOT NULL,           -- 0-100 scale
  factors: jsonb NOT NULL,           -- Scoring factors
  calculated_at: timestamptz
)
```

### Reputation Scores
User reputation tracking.

```sql
reputation_scores (
  id: uuid PRIMARY KEY,
  creator_id: uuid,                  -- References profiles
  score: integer NOT NULL DEFAULT 0,
  successful_campaigns: integer DEFAULT 0,
  total_raised: numeric DEFAULT 0,
  total_backers: integer DEFAULT 0,
  updated_at: timestamptz
)
```

### Achievements
Available user achievements.

```sql
achievements (
  id: uuid PRIMARY KEY,
  name: text NOT NULL UNIQUE,
  description: text NOT NULL,
  icon: text NOT NULL,
  criteria: jsonb NOT NULL,
  created_at: timestamptz
)
```

### Creator Achievements
Links users to earned achievements.

```sql
creator_achievements (
  id: uuid PRIMARY KEY,
  creator_id: uuid,                  -- References profiles
  achievement_id: uuid,              -- References achievements
  unlocked_at: timestamptz,
  UNIQUE (creator_id, achievement_id)
)
```

## Voting System

### Votes
Campaign voting records.

```sql
votes (
  id: uuid PRIMARY KEY,
  campaign_id: uuid,                 -- References campaigns
  voter_id: uuid,                    -- References profiles
  vote_weight: integer DEFAULT 1,
  created_at: timestamptz,
  UNIQUE (campaign_id, voter_id)
)
```

### Vote Weights
Calculated voting power based on pledges and reputation.

```sql
vote_weights (
  id: uuid PRIMARY KEY,
  vote_id: uuid,                     -- References votes
  base_weight: integer NOT NULL DEFAULT 1,
  pledge_multiplier: numeric DEFAULT 1.0,
  reputation_multiplier: numeric DEFAULT 1.0,
  final_weight: numeric NOT NULL,
  calculated_at: timestamptz
)
```

## Transaction Tracking

### Campaign Amount History
Tracks changes in campaign funding.

```sql
campaign_amount_history (
  id: uuid PRIMARY KEY,
  campaign_id: uuid,                 -- References campaigns
  previous_amount: numeric NOT NULL,
  new_amount: numeric NOT NULL,
  change_amount: numeric NOT NULL,
  change_type: text NOT NULL,        -- pledge/refund/adjustment
  reference_id: uuid,                -- Optional reference to pledge/refund
  notes: text,
  created_at: timestamptz
)
```

### Pledge Transactions
Payment processing records.

```sql
pledge_transactions (
  id: uuid PRIMARY KEY,
  pledge_id: uuid,                   -- References pledges
  amount: numeric NOT NULL,
  payment_provider: text NOT NULL,
  provider_transaction_id: text,
  status: text NOT NULL,             -- pending/processing/completed/failed
  error_message: text,
  created_at: timestamptz,
  updated_at: timestamptz
)
```