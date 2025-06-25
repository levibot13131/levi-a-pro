
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

// Add missing User interface
export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: number;
  lastLogin?: number;
  permissions: Permission[];
}

// Add missing UserRole type
export type UserRole = 'admin' | 'analyst' | 'trader' | 'viewer';

// Add missing Permission interface
export interface Permission {
  resource: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

// Add available resources
export const AvailableResources = [
  'dashboard',
  'backtesting',
  'technicalAnalysis',
  'riskManagement',
  'marketData',
  'tradingSignals',
  'tradingView',
  'assetTracker',
  'socialMonitoring',
  'settings',
  'users',
  'systemLogs'
];

// Add default permissions
export const DefaultPermissions: Permission[] = AvailableResources.map(resource => ({
  resource,
  canView: false,
  canEdit: false,
  canDelete: false
}));

// Add admin user
export const adminUser: User = {
  id: 'admin-001',
  email: 'almogahronov1997@gmail.com',
  username: 'מנהל המערכת',
  role: 'admin',
  isActive: true,
  isAdmin: true,
  createdAt: Date.now(),
  permissions: DefaultPermissions.map(p => ({
    ...p,
    canView: true,
    canEdit: true,
    canDelete: true
  }))
};
