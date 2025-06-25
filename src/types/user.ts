
export interface UserAccessControl {
  id: string;
  user_id: string;
  telegram_id: string | null;
  telegram_username: string | null;
  access_level: 'all' | 'elite' | 'filtered' | 'specific';
  allowed_assets: string[];
  is_active: boolean;
  signals_received: number;
  last_signal_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  username: string | null;
  telegram_chat_id: string | null;
  subscription_tier: string;
  signal_quota_daily: number;
  signals_received_today: number;
  last_quota_reset: string;
  created_at: string;
  updated_at: string;
}

export interface AccessStats {
  totalUsers: number;
  activeUsers: number;
  eliteUsers: number;
  totalSignalsDelivered: number;
  avgEngagementRate: number;
  topAssets: string[];
}
