
import React from 'react';
import TradingViewConnectionStatus from '../TradingViewConnectionStatus';
import SyncStatusDisplay from './SyncStatusDisplay';
import { getAllAssets } from '@/services/realTimeAssetService';
import { Badge } from '@/components/ui/badge';

interface IntegrationStatusSectionProps {
  isConnected: boolean;
  syncEnabled: boolean;
  refreshTimer: number;
  lastSyncTime: Date | null;
  formatLastSyncTime: () => string;
  toggleAutoSync: () => void;
}

const IntegrationStatusSection: React.FC<IntegrationStatusSectionProps> = ({
  isConnected,
  syncEnabled,
  refreshTimer,
  lastSyncTime,
  formatLastSyncTime,
  toggleAutoSync
}) => {
  // Get total assets count across all markets for display
  const totalAssets = getAllAssets().length;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-3">
        <div className="mb-3 flex items-center justify-between">
          <Badge variant="outline" className="px-3 py-1">
            <span className="text-sm font-medium">נכסים פעילים: {totalAssets}</span>
          </Badge>
        </div>
        
        <TradingViewConnectionStatus 
          syncEnabled={syncEnabled}
          toggleAutoSync={toggleAutoSync}
        />
        
        <SyncStatusDisplay 
          isConnected={isConnected}
          syncEnabled={syncEnabled}
          refreshTimer={refreshTimer}
          lastSyncTime={lastSyncTime}
          formatLastSyncTime={formatLastSyncTime}
        />
      </div>
    </div>
  );
};

export default IntegrationStatusSection;
