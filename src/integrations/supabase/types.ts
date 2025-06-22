export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_status: {
        Row: {
          api_quota_limit: number | null
          api_quota_used: number | null
          created_at: string | null
          error_count: number | null
          id: string
          is_active: boolean | null
          last_error_message: string | null
          last_health_check: string | null
          service_name: string
          updated_at: string | null
        }
        Insert: {
          api_quota_limit?: number | null
          api_quota_used?: number | null
          created_at?: string | null
          error_count?: number | null
          id?: string
          is_active?: boolean | null
          last_error_message?: string | null
          last_health_check?: string | null
          service_name: string
          updated_at?: string | null
        }
        Update: {
          api_quota_limit?: number | null
          api_quota_used?: number | null
          created_at?: string | null
          error_count?: number | null
          id?: string
          is_active?: boolean | null
          last_error_message?: string | null
          last_health_check?: string | null
          service_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      learning_iterations: {
        Row: {
          accuracy_rate: number | null
          confidence_adjustments: Json | null
          created_at: string | null
          data_points_processed: number | null
          id: string
          iteration_number: number
          market_conditions_learned: Json | null
          strategy_weights: Json | null
          successful_predictions: number | null
          total_predictions: number | null
        }
        Insert: {
          accuracy_rate?: number | null
          confidence_adjustments?: Json | null
          created_at?: string | null
          data_points_processed?: number | null
          id?: string
          iteration_number: number
          market_conditions_learned?: Json | null
          strategy_weights?: Json | null
          successful_predictions?: number | null
          total_predictions?: number | null
        }
        Update: {
          accuracy_rate?: number | null
          confidence_adjustments?: Json | null
          created_at?: string | null
          data_points_processed?: number | null
          id?: string
          iteration_number?: number
          market_conditions_learned?: Json | null
          strategy_weights?: Json | null
          successful_predictions?: number | null
          total_predictions?: number | null
        }
        Relationships: []
      }
      market_data_cache: {
        Row: {
          candlestick_pattern: string | null
          created_at: string
          fibonacci_data: Json | null
          id: string
          macd_data: Json | null
          price: number
          rsi: number | null
          sentiment_data: Json | null
          smc_signals: Json | null
          symbol: string
          volume: number
          volume_profile: number | null
          vwap: number | null
          wyckoff_phase: string | null
        }
        Insert: {
          candlestick_pattern?: string | null
          created_at?: string
          fibonacci_data?: Json | null
          id?: string
          macd_data?: Json | null
          price: number
          rsi?: number | null
          sentiment_data?: Json | null
          smc_signals?: Json | null
          symbol: string
          volume: number
          volume_profile?: number | null
          vwap?: number | null
          wyckoff_phase?: string | null
        }
        Update: {
          candlestick_pattern?: string | null
          created_at?: string
          fibonacci_data?: Json | null
          id?: string
          macd_data?: Json | null
          price?: number
          rsi?: number | null
          sentiment_data?: Json | null
          smc_signals?: Json | null
          symbol?: string
          volume?: number
          volume_profile?: number | null
          vwap?: number | null
          wyckoff_phase?: string | null
        }
        Relationships: []
      }
      market_intelligence: {
        Row: {
          content: string | null
          content_type: string
          id: string
          impact_level: string | null
          is_processed: boolean | null
          metadata: Json | null
          processed_at: string | null
          published_at: string | null
          sentiment: string | null
          source: string
          symbols: string[] | null
          title: string
        }
        Insert: {
          content?: string | null
          content_type: string
          id?: string
          impact_level?: string | null
          is_processed?: boolean | null
          metadata?: Json | null
          processed_at?: string | null
          published_at?: string | null
          sentiment?: string | null
          source: string
          symbols?: string[] | null
          title: string
        }
        Update: {
          content?: string | null
          content_type?: string
          id?: string
          impact_level?: string | null
          is_processed?: boolean | null
          metadata?: Json | null
          processed_at?: string | null
          published_at?: string | null
          sentiment?: string | null
          source?: string
          symbols?: string[] | null
          title?: string
        }
        Relationships: []
      }
      signal_feedback: {
        Row: {
          created_at: string
          execution_time: string
          id: string
          market_conditions: string | null
          outcome: string
          profit_loss_percentage: number
          signal_id: string
          strategy_used: string
          user_id: string
        }
        Insert: {
          created_at?: string
          execution_time: string
          id?: string
          market_conditions?: string | null
          outcome: string
          profit_loss_percentage: number
          signal_id: string
          strategy_used: string
          user_id: string
        }
        Update: {
          created_at?: string
          execution_time?: string
          id?: string
          market_conditions?: string | null
          outcome?: string
          profit_loss_percentage?: number
          signal_id?: string
          strategy_used?: string
          user_id?: string
        }
        Relationships: []
      }
      signal_history: {
        Row: {
          action: string
          actual_profit_loss: number | null
          closed_at: string | null
          confidence: number
          created_at: string | null
          entry_price: number
          exit_price: number | null
          exit_reason: string | null
          id: string
          market_conditions: Json | null
          outcome: string | null
          performance_score: number | null
          reasoning: string | null
          risk_reward_ratio: number
          sentiment_data: Json | null
          signal_id: string
          stop_loss: number
          strategy: string
          symbol: string
          target_price: number
          user_id: string | null
          was_correct: boolean | null
        }
        Insert: {
          action: string
          actual_profit_loss?: number | null
          closed_at?: string | null
          confidence: number
          created_at?: string | null
          entry_price: number
          exit_price?: number | null
          exit_reason?: string | null
          id?: string
          market_conditions?: Json | null
          outcome?: string | null
          performance_score?: number | null
          reasoning?: string | null
          risk_reward_ratio: number
          sentiment_data?: Json | null
          signal_id: string
          stop_loss: number
          strategy: string
          symbol: string
          target_price: number
          user_id?: string | null
          was_correct?: boolean | null
        }
        Update: {
          action?: string
          actual_profit_loss?: number | null
          closed_at?: string | null
          confidence?: number
          created_at?: string | null
          entry_price?: number
          exit_price?: number | null
          exit_reason?: string | null
          id?: string
          market_conditions?: Json | null
          outcome?: string | null
          performance_score?: number | null
          reasoning?: string | null
          risk_reward_ratio?: number
          sentiment_data?: Json | null
          signal_id?: string
          stop_loss?: number
          strategy?: string
          symbol?: string
          target_price?: number
          user_id?: string | null
          was_correct?: boolean | null
        }
        Relationships: []
      }
      strategy_performance: {
        Row: {
          avg_profit_loss: number
          confidence_score: number
          created_at: string
          current_weight: number
          failed_signals: number
          id: string
          last_updated: string
          strategy_id: string
          strategy_name: string
          success_rate: number
          successful_signals: number
          time_of_day_performance: Json | null
          total_signals: number
          user_id: string
        }
        Insert: {
          avg_profit_loss?: number
          confidence_score?: number
          created_at?: string
          current_weight?: number
          failed_signals?: number
          id?: string
          last_updated?: string
          strategy_id: string
          strategy_name: string
          success_rate?: number
          successful_signals?: number
          time_of_day_performance?: Json | null
          total_signals?: number
          user_id: string
        }
        Update: {
          avg_profit_loss?: number
          confidence_score?: number
          created_at?: string
          current_weight?: number
          failed_signals?: number
          id?: string
          last_updated?: string
          strategy_id?: string
          strategy_name?: string
          success_rate?: number
          successful_signals?: number
          time_of_day_performance?: Json | null
          total_signals?: number
          user_id?: string
        }
        Relationships: []
      }
      system_health_log: {
        Row: {
          binance_status: boolean
          coingecko_status: boolean
          created_at: string
          fundamental_data_status: boolean
          id: string
          overall_health_score: number
          telegram_status: boolean
          tradingview_status: boolean
          twitter_status: boolean
          user_id: string
        }
        Insert: {
          binance_status?: boolean
          coingecko_status?: boolean
          created_at?: string
          fundamental_data_status?: boolean
          id?: string
          overall_health_score?: number
          telegram_status?: boolean
          tradingview_status?: boolean
          twitter_status?: boolean
          user_id: string
        }
        Update: {
          binance_status?: boolean
          coingecko_status?: boolean
          created_at?: string
          fundamental_data_status?: boolean
          id?: string
          overall_health_score?: number
          telegram_status?: boolean
          tradingview_status?: boolean
          twitter_status?: boolean
          user_id?: string
        }
        Relationships: []
      }
      trading_engine_status: {
        Row: {
          created_at: string
          id: string
          is_running: boolean
          last_analysis_at: string | null
          profitable_signals: number
          started_at: string | null
          stopped_at: string | null
          success_rate: number
          total_signals_generated: number
          updated_at: string
          user_id: string
          watch_list: string[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_running?: boolean
          last_analysis_at?: string | null
          profitable_signals?: number
          started_at?: string | null
          stopped_at?: string | null
          success_rate?: number
          total_signals_generated?: number
          updated_at?: string
          user_id: string
          watch_list?: string[] | null
        }
        Update: {
          created_at?: string
          id?: string
          is_running?: boolean
          last_analysis_at?: string | null
          profitable_signals?: number
          started_at?: string | null
          stopped_at?: string | null
          success_rate?: number
          total_signals_generated?: number
          updated_at?: string
          user_id?: string
          watch_list?: string[] | null
        }
        Relationships: []
      }
      trading_signals: {
        Row: {
          action: string
          confidence: number
          created_at: string
          executed_at: string | null
          executed_price: number | null
          exit_price: number | null
          exit_reason: string | null
          id: string
          metadata: Json | null
          price: number
          profit: number | null
          profit_percent: number | null
          reasoning: string
          risk_reward_ratio: number
          signal_id: string
          status: string
          stop_loss: number
          strategy: string
          symbol: string
          target_price: number
          telegram_sent: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          action: string
          confidence: number
          created_at?: string
          executed_at?: string | null
          executed_price?: number | null
          exit_price?: number | null
          exit_reason?: string | null
          id?: string
          metadata?: Json | null
          price: number
          profit?: number | null
          profit_percent?: number | null
          reasoning: string
          risk_reward_ratio: number
          signal_id: string
          status?: string
          stop_loss: number
          strategy: string
          symbol: string
          target_price: number
          telegram_sent?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: string
          confidence?: number
          created_at?: string
          executed_at?: string | null
          executed_price?: number | null
          exit_price?: number | null
          exit_reason?: string | null
          id?: string
          metadata?: Json | null
          price?: number
          profit?: number | null
          profit_percent?: number | null
          reasoning?: string
          risk_reward_ratio?: number
          signal_id?: string
          status?: string
          stop_loss?: number
          strategy?: string
          symbol?: string
          target_price?: number
          telegram_sent?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trading_strategies: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          parameters: Json
          profitable_signals: number
          success_rate: number
          total_signals: number
          type: string
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          parameters?: Json
          profitable_signals?: number
          success_rate?: number
          total_signals?: number
          type: string
          updated_at?: string
          user_id: string
          weight?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          parameters?: Json
          profitable_signals?: number
          success_rate?: number
          total_signals?: number
          type?: string
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          id: string
          last_quota_reset: string | null
          signal_quota_daily: number | null
          signals_received_today: number | null
          subscription_tier: string | null
          telegram_chat_id: string | null
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_quota_reset?: string | null
          signal_quota_daily?: number | null
          signals_received_today?: number | null
          subscription_tier?: string | null
          telegram_chat_id?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_quota_reset?: string | null
          signal_quota_daily?: number | null
          signals_received_today?: number | null
          subscription_tier?: string | null
          telegram_chat_id?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      user_trading_settings: {
        Row: {
          auto_trading_enabled: boolean
          binance_api_key: string | null
          binance_secret_key: string | null
          created_at: string
          id: string
          max_risk_per_trade: number
          notification_settings: Json
          strategies_enabled: string[] | null
          telegram_bot_token: string | null
          telegram_chat_id: string | null
          tradingview_username: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_trading_enabled?: boolean
          binance_api_key?: string | null
          binance_secret_key?: string | null
          created_at?: string
          id?: string
          max_risk_per_trade?: number
          notification_settings?: Json
          strategies_enabled?: string[] | null
          telegram_bot_token?: string | null
          telegram_chat_id?: string | null
          tradingview_username?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_trading_enabled?: boolean
          binance_api_key?: string | null
          binance_secret_key?: string | null
          created_at?: string
          id?: string
          max_risk_per_trade?: number
          notification_settings?: Json
          strategies_enabled?: string[] | null
          telegram_bot_token?: string | null
          telegram_chat_id?: string | null
          tradingview_username?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      reset_daily_quotas: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_signal_outcome: {
        Args: {
          p_signal_id: string
          p_outcome: string
          p_exit_price: number
          p_exit_reason?: string
        }
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
