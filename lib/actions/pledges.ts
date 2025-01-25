import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';
import { updateMockCampaignAmount } from '@/lib/mock-data';

type NewPledge = Database['public']['Tables']['pledges']['Insert'];

export async function createPledge(pledge: NewPledge) {
  // For development/demo, simulate pledge creation with mock data
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  
  // Update the mock campaign amount
  updateMockCampaignAmount(pledge.campaign_id, pledge.amount);
  
  return {
    id: `pledge_${Date.now()}`,
    ...pledge,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}