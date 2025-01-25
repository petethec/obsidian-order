# Code Structure Documentation

## Directory Structure

```
/app                    # Next.js app directory
  /api                  # API route handlers
  /campaigns            # Campaign-related pages
  /marketplace         # Marketplace pages
  /profile             # User profile pages
/components            # React components
  /ui                  # Reusable UI components
  /campaigns           # Campaign-specific components
  /marketplace         # Marketplace components
  /profile             # Profile components
/lib                   # Shared utilities and functions
  /actions             # Server actions
  /supabase            # Supabase client and types
  /validations         # Form validation schemas
/public                # Static assets
/supabase              # Supabase configuration
  /migrations          # Database migrations
```

## Key Components

### Campaign Components

#### CampaignForm (`components/campaigns/create/campaign-form.tsx`)
Main form component for creating campaigns. Handles:
- Basic campaign details
- Milestone configuration
- Success/failure outcomes
- Type-specific fields

#### MilestoneList (`components/campaigns/milestone-list.tsx`)
Displays and manages campaign milestones:
- Progress tracking
- Milestone verification
- Status updates

#### PledgeForm (`components/campaigns/pledge-form.tsx`)
Handles campaign pledges:
- Amount selection
- Payment processing
- Pledge confirmation

### Marketplace Components

#### MarketplaceListing (`components/marketplace/listing.tsx`)
Displays campaign listings:
- Price and terms
- Legacy share options
- Advisor role details

#### GlassScoreCard (`components/marketplace/glass-score-card.tsx`)
Shows campaign trust metrics:
- Overall score
- Contributing factors
- Historical trends

### Profile Components

#### ReputationCard (`components/profile/reputation-card.tsx`)
Displays user reputation:
- Reputation score
- Achievements
- Campaign history

## Core Functions

### Campaign Management

```typescript
// lib/actions/campaigns.ts
export async function createCampaign(campaign: NewCampaign) {
  // Validate campaign data
  // Create campaign record
  // Initialize milestones
  // Return campaign details
}

export async function updateCampaign(id: string, updates: Partial<Campaign>) {
  // Validate updates
  // Apply changes
  // Update related records
}
```

### Consequence Handling

```typescript
// lib/actions/consequences.ts
export async function requestConsequenceTrigger({
  campaign_id,
  type,
  notes
}: ConsequenceRequest) {
  // Validate request
  // Create consequence request
  // Notify stakeholders
}

export async function getConsequenceStatus(campaign_id: string) {
  // Check request status
  // Return current state
}
```

### Marketplace Operations

```typescript
// lib/actions/marketplace.ts
export async function createListing(listing: NewListing) {
  // Validate listing details
  // Create listing record
  // Initialize legacy share terms
}

export async function purchaseListing(id: string, options: PurchaseOptions) {
  // Validate purchase
  // Process payment
  // Transfer ownership
  // Set up legacy agreement
}
```

## Database Interactions

### Supabase Client

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Row Level Security

```sql
-- Example RLS policies
CREATE POLICY "Campaigns are viewable by everyone"
  ON campaigns FOR SELECT
  USING (true);

CREATE POLICY "Users can create campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() = creator_id);
```

## Form Validation

```typescript
// lib/validations/campaign.ts
export const campaignFormSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['corporate_advocacy', 'refundable_milestone']),
  description: z.string().min(10),
  // ... other fields
});
```

## Error Handling

```typescript
// lib/utils/error-handling.ts
export function handleError(error: unknown) {
  if (error instanceof Error) {
    // Log error details
    // Return user-friendly message
  }
  // Handle unknown errors
}
```