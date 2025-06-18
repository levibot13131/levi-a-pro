
export type UserRole = 'admin' | 'analyst' | 'trader' | 'viewer';

export interface Permission {
  resource: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

// Main User interface - this was missing the export!
export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  isAdmin: boolean;
  createdAt: number;
  lastLogin?: number;
  isActive: boolean;
  permissions: Permission[];
}

// Extended user interface for backward compatibility
export interface ExtendedUser extends User {}

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
] as const;

export const DefaultPermissions: Permission[] = [
  { resource: 'dashboard', canView: true, canEdit: false, canDelete: false },
  { resource: 'trading-signals', canView: true, canEdit: false, canDelete: false },
  { resource: 'technical-analysis', canView: true, canEdit: false, canDelete: false },
  { resource: 'assets', canView: true, canEdit: false, canDelete: false },
  { resource: 'alerts', canView: true, canEdit: false, canDelete: false },
  { resource: 'settings', canView: true, canEdit: true, canDelete: false },
  { resource: 'admin', canView: false, canEdit: false, canDelete: false },
];

export const adminUser: User = {
  id: 'admin-001',
  email: 'almogahronov1997@gmail.com',
  username: 'מנהל המערכת',
  displayName: 'מנהל המערכת',
  role: 'admin',
  isAdmin: true,
  createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
  lastLogin: Date.now(),
  isActive: true,
  permissions: DefaultPermissions.map(p => ({
    ...p,
    canView: true,
    canEdit: true,
    canDelete: true
  }))
};
