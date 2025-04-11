
import React from 'react';
import { Container } from '../components/ui/container';
import TradingViewConnectionStatus from '../components/tradingview/TradingViewConnectionStatus';
import IntegrationTabs from '../components/tradingview/integration/IntegrationTabs';
import SyncStatusDisplay from '../components/tradingview/integration/SyncStatusDisplay';
import SyncControls from '../components/tradingview/integration/SyncControls';
import { useTradingViewPage } from '../hooks/use-tradingview-page';

const TradingViewIntegration: React.FC = () => {
  const {
    isConnected,
    syncEnabled,
    isSyncing,
    lastSyncTime,
    refreshTimer,
    activeTab,
    setActiveTab,
    formatLastSyncTime,
    handleManualRefresh
  } = useTradingViewPage();
  
  return (
    <Container className="py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-right">אינטגרציה עם TradingView</h1>
        
        {isConnected && (
          <SyncControls 
            activeTab={activeTab}
            isSyncing={isSyncing}
            handleManualRefresh={handleManualRefresh}
          />
        )}
      </div>
      
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
      
      <IntegrationTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lastSyncTime={lastSyncTime}
      />
    </Container>
  );
};

export default TradingViewIntegration;
