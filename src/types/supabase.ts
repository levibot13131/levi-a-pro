
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
      user_access_control: {
        Row: {
          id: string
          user_id: string
          telegram_id: string | null
          telegram_username: string | null
          access_level: 'all' | 'elite' | 'filtered' | 'specific'
          allowed_assets: string[]
          is_active: boolean
          signals_received: number
          last_signal_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          telegram_id?: string | null
          telegram_username?: string | null
          access_level: 'all' | 'elite' | 'filtered' | 'specific'
          allowed_assets: string[]
          is_active?: boolean
          signals_received?: number
          last_signal_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          telegram_id?: string | null
          telegram_username?: string | null
          access_level?: 'all' | 'elite' | 'filtered' | 'specific'
          allowed_assets?: string[]
          is_active?: boolean
          signals_received?: number
          last_signal_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      signal_history: {
        Row: {
          id: string
          signal_id: string
          symbol: string
          action: string
          entry_price: number
          target_price: number
          stop_loss: number
          confidence: number
          risk_reward_ratio: number
          strategy: string
          reasoning: string | null
          outcome: string | null
          market_conditions: Json | null
          sentiment_data: Json | null
          created_at: string | null
          exit_price: number | null
          actual_profit_loss: number | null
          closed_at: string | null
          was_correct: boolean | null
          performance_score: number | null
          exit_reason: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          signal_id: string
          symbol: string
          action: string
          entry_price: number
          target_price: number
          stop_loss: number
          confidence: number
          risk_reward_ratio: number
          strategy: string
          reasoning?: string | null
          outcome?: string | null
          market_conditions?: Json | null
          sentiment_data?: Json | null
          created_at?: string | null
          exit_price?: number | null
          actual_profit_loss?: number | null
          closed_at?: string | null
          was_correct?: boolean | null
          performance_score?: number | null
          exit_reason?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          signal_id?: string
          symbol?: string
          action?: string
          entry_price?: number
          target_price?: number
          stop_loss?: number
          confidence?: number
          risk_reward_ratio?: number
          strategy?: string
          reasoning?: string | null
          outcome?: string | null
          market_conditions?: Json | null
          sentiment_data?: Json | null
          created_at?: string | null
          exit_price?: number | null
          actual_profit_loss?: number | null
          closed_at?: string | null
          was_correct?: boolean | null
          performance_score?: number | null
          exit_reason?: string | null
          user_id?: string | null
        }
      }
      signal_feedback: {
        Row: {
          id: string
          signal_id: string
          strategy_used: string
          outcome: string
          profit_loss_percentage: number
          execution_time: string
          market_conditions: string | null
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          signal_id: string
          strategy_used: string
          outcome: string
          profit_loss_percentage: number
          execution_time: string
          market_conditions?: string | null
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          signal_id?: string
          strategy_used?: string
          outcome?: string
          profit_loss_percentage?: number
          execution_time?: string
          market_conditions?: string | null
          created_at?: string
          user_id?: string
        }
      }
      market_intelligence: {
        Row: {
          id: string
          source: string
          content_type: string
          title: string
          content: string | null
          symbols: string[]
          sentiment: string | null
          impact_level: string | null
          metadata: Json | null
          published_at: string | null
          processed_at: string | null
          is_processed: boolean | null
        }
        Insert: {
          id?: string
          source: string
          content_type: string
          title: string
          content?: string | null
          symbols?: string[]
          sentiment?: string | null
          impact_level?: string | null
          metadata?: Json | null
          published_at?: string | null
          processed_at?: string | null
          is_processed?: boolean | null
        }
        Update: {
          id?: string
          source?: string
          content_type?: string
          title?: string
          content?: string | null
          symbols?: string[]
          sentiment?: string | null
          impact_level?: string | null
          metadata?: Json | null
          published_at?: string | null
          processed_at?: string | null
          is_processed?: boolean | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          username: string | null
          telegram_chat_id: string | null
          subscription_tier: string | null
          signal_quota_daily: number | null
          signals_received_today: number | null
          last_quota_reset: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          username?: string | null
          telegram_chat_id?: string | null
          subscription_tier?: string | null
          signal_quota_daily?: number | null
          signals_received_today?: number | null
          last_quota_reset?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          username?: string | null
          telegram_chat_id?: string | null
          subscription_tier?: string | null
          signal_quota_daily?: number | null
          signals_received_today?: number | null
          last_quota_reset?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_access_control_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          user_id: string
          telegram_id: string | null
          telegram_username: string | null
          access_level: string
          allowed_assets: string[]
          is_active: boolean
          signals_received: number
          last_signal_at: string | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
