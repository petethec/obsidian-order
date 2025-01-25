import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';

type MilestoneVerification = Database['public']['Tables']['milestone_verifications']['Insert'];

export async function verifyMilestone(verification: MilestoneVerification) {
  const { data, error } = await supabase
    .from('milestone_verifications')
    .insert(verification)
    .select()
    .single();

  if (error) throw error;
  return data;
}