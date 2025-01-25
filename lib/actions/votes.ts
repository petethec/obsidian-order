import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';

type Vote = Database['public']['Tables']['votes']['Insert'];

export async function castVote(vote: Vote) {
  const { data, error } = await supabase
    .from('votes')
    .insert(vote)
    .select()
    .single();

  if (error) throw error;
  return data;
}