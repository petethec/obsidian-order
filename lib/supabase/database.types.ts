export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          creator_id: string
          title: string
          description: string
          type: 'government' | 'innovation'
          funding_goal: number
          current_amount: number
          start_date: string
          end_date: string
          target: string
          success_type: 'reward' | 'stretch' | 'community'
          success_description: string
          failure_type: 'refund' | 'charity' | 'challenge'
          failure_description: string
          charity_name: string | null
          refund_percentage: number | null
          status: 'draft' | 'active' | 'successful' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          title: string
          description: string
          type: 'government' | 'innovation'
          funding_goal: number
          current_amount?: number
          start_date: string
          end_date: string
          target: string
          success_type: 'reward' | 'stretch' | 'community'
          success_description: string
          failure_type: 'refund' | 'charity' | 'challenge'
          failure_description: string
          charity_name?: string | null
          refund_percentage?: number | null
          status?: 'draft' | 'active' | 'successful' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          title?: string
          description?: string
          type?: 'government' | 'innovation'
          funding_goal?: number
          current_amount?: number
          start_date?: string
          end_date?: string
          target?: string
          success_type?: 'reward' | 'stretch' | 'community'
          success_description?: string
          failure_type?: 'refund' | 'charity' | 'challenge'
          failure_description?: string
          charity_name?: string | null
          refund_percentage?: number | null
          status?: 'draft' | 'active' | 'successful' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
      pledges: {
        Row: {
          id: string
          campaign_id: string
          backer_id: string
          amount: number
          status: 'pending' | 'successful' | 'refunded' | 'redirected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          backer_id: string
          amount: number
          status?: 'pending' | 'successful' | 'refunded' | 'redirected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          backer_id?: string
          amount?: number
          status?: 'pending' | 'successful' | 'refunded' | 'redirected'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}