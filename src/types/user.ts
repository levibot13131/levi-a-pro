
export type UserRole = 'admin' | 'analyst' | 'trader' | 'viewer';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: number;
  lastLogin?: number;
  isActive: boolean;
  permissions: Permission[];
}

export interface Permission {
  resource: string; // Page or resource name
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

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

export const DefaultPermissions: Permission[] = AvailableResources.map(resource => ({
  resource,
  canView: resource !== 'users' && resource !== 'systemLogs', // By default users can't view these
  canEdit: false,
  canDelete: false
}));

export const adminUser: User = {
  id: 'admin-user',
  email: 'admin@example.com',
  username: 'מנהל מערכת',
  role: 'admin',
  createdAt: Date.now(),
  isActive: true,
  permissions: AvailableResources.map(resource => ({
    resource,
    canView: true,
    canEdit: true,
    canDelete: true
  }))
};
