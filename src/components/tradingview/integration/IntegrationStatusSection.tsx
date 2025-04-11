
import React from 'react';
import TradingViewConnectionStatus from '../TradingViewConnectionStatus';
import SyncStatusDisplay from './SyncStatusDisplay';

interface IntegrationStatusSectionProps {
  isConnected: boolean;
  syncEnabled: boolean;
  refreshTimer: number;
  lastSyncTime: Date | null;
  formatLastSyncTime: () => string;
}

const IntegrationStatusSection: React.FC<IntegrationStatusSectionProps> = ({
  isConnected,
  syncEnabled,
  refreshTimer,
  lastSyncTime,
  formatLastSyncTime
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-3">
        <TradingViewConnectionStatus />
        
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
