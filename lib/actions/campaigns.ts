import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';
import { event as logAnalyticsEvent } from '@/lib/analytics';

type Campaign = Database['public']['Tables']['campaigns']['Row'];
type NewCampaign = Database['public']['Tables']['campaigns']['Insert'];
type Milestone = {
  title: string;
  description: string;
  target_date: string;
};

export async function getCampaigns() {
  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return campaigns;
}

export async function getCampaign(id: string) {
  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      profiles (
        username,
        avatar_url
      ),
      pledges (
        amount,
        status
      )
    `)
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return campaign;
}

export async function createCampaign(campaign: NewCampaign) {
  // Validate campaign data
  if (!campaign.title || !campaign.description || !campaign.funding_goal) {
    throw new Error('Missing required campaign fields');
  }

  // Ensure creator_id is a valid UUID
  const creatorId = campaign.creator_id || uuidv4();

  // Ensure dates are valid
  const startDate = new Date(campaign.start_date);
  const endDate = new Date(campaign.end_date);
  if (endDate <= startDate) {
    throw new Error('End date must be after start date');
  }

  // Remove milestones from campaign data
  const { milestones, ...campaignData } = campaign;

  // Create campaign
  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      ...campaignData,
      creator_id: creatorId
    })
    .select()
    .single();
    
  if (error) throw error;

  // Create milestones if provided
  if (milestones?.length) {
    const milestonesData = milestones.map(milestone => ({
      campaign_id: data.id,
      title: milestone.title,
      description: milestone.description,
      target_date: milestone.target_date,
      status: 'pending'
    }));

    const { error: milestonesError } = await supabase
      .from('milestones')
      .insert(milestonesData);

    if (milestonesError) {
      console.error('Failed to create milestones:', milestonesError);
      // Continue anyway since the campaign was created
    }
  }

  // Log campaign creation
  logAnalyticsEvent({
    action: 'create_campaign',
    category: 'campaigns',
    label: campaign.title
  });

  return data;
}

export async function updateCampaign(id: string, updates: Partial<Campaign>) {
  const { data, error } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}