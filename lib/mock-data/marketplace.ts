// Define campaign ID type for type safety
export type CampaignId = 
  | 'clean-energy'
  | 'education-reform'
  | 'healthcare-access'
  | 'ceo-climate-action'
  | 'fact-checker'
  | 'public-apology'
  | 'voter-pledge'
  | 'insulin-challenge';

// Mock data for marketplace features
export const mockListings: Array<{
  id: string;
  campaign_id: CampaignId;
  seller_id: string;
  price: number;
  status: string;
  legacy_share_enabled: boolean;
  legacy_share_discount: number;
  royalty_percentage: number;
  royalty_duration_months: number;
  advisor_role_enabled: boolean;
  advisor_engagement_level: string;
  buyer_criteria: {
    required_experience: string[];
    minimum_glass_score: number;
  };
  glass_score: number;
  campaign: {
    title: string;
    current_amount: number;
    funding_goal: number;
    backer_count: number;
    description: string;
  };
}> = [
  {
    id: 'listing_1',
    campaign_id: 'clean-energy',
    seller_id: 'user_1',
    price: 50000,
    status: 'active',
    legacy_share_enabled: true,
    legacy_share_discount: 10,
    royalty_percentage: 15,
    royalty_duration_months: 24,
    advisor_role_enabled: true,
    advisor_engagement_level: 'moderate',
    buyer_criteria: {
      required_experience: ['renewable energy', 'community organizing'],
      minimum_glass_score: 75
    },
    glass_score: 85,
    campaign: {
      title: 'Clean Energy Initiative',
      current_amount: 75000,
      funding_goal: 100000,
      backer_count: 1234,
      description: 'Support the transition to 100% renewable energy in our city by 2030.'
    }
  }
];

interface GlassScore {
  score: number;
  factors: Record<string, number>;
  details: Array<{ name: string; score: number; weight: number; }>;
}

export const mockGlassScores: Partial<Record<CampaignId, GlassScore>> = {
  'clean-energy': {
    score: 85,
    factors: {
      funding_progress: 0.75,
      backer_count: 1234,
      community_engagement: 0.9,
      transparency: 0.85
    },
    details: [
      { name: 'Funding Progress', score: 75, weight: 40 },
      { name: 'Backer Count', score: 90, weight: 30 },
      { name: 'Community Engagement', score: 90, weight: 15 },
      { name: 'Transparency', score: 85, weight: 15 }
    ]
  }
};