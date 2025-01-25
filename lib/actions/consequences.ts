import { supabase } from '@/lib/supabase/client';

export type ConsequenceType = 'success' | 'failure';
export type ConsequenceStatus = 'pending' | 'approved' | 'rejected';

interface ConsequenceRequest {
  campaign_id: string;
  type: ConsequenceType;
  notes?: string;
}

export async function requestConsequenceTrigger({ 
  campaign_id, 
  type,
  notes 
}: ConsequenceRequest) {
  try {
    // For MVP, just send an email notification (simulated)
    console.log(`Consequence trigger requested for campaign ${campaign_id}`);
    console.log(`Type: ${type}`);
    console.log(`Notes: ${notes}`);

    // In production, this would:
    // 1. Create a record in a consequence_requests table
    // 2. Send email to admin
    // 3. Update campaign status
    
    return {
      success: true,
      message: 'Consequence trigger request submitted for admin review'
    };
  } catch (error) {
    console.error('Failed to request consequence trigger:', error);
    throw error;
  }
}

export async function getConsequenceStatus(campaign_id: string) {
  try {
    // For MVP, just return pending status
    return {
      status: 'pending' as ConsequenceStatus,
      last_updated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to get consequence status:', error);
    throw error;
  }
}