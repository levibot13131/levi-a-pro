
import React from 'react';
import { Container } from '../components/ui/container';
import { useTradingViewPage } from '../hooks/use-tradingview-page';
import IntegrationHeader from '../components/tradingview/integration/IntegrationHeader';
import IntegrationStatusSection from '../components/tradingview/integration/IntegrationStatusSection';
import IntegrationTabsContainer from '../components/tradingview/integration/IntegrationTabsContainer';
import { useEffect } from 'react';

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
    handleManualRefresh,
    toggleAutoSync
  } = useTradingViewPage();
  
  // רענון מצב ההתחברות בטעינת הדף
  useEffect(() => {
    console.log(`TradingViewIntegration page loaded - connection status: ${isConnected ? 'Connected' : 'Not connected'}`);
    console.log(`Sync status: ${syncEnabled ? 'Enabled' : 'Disabled'}, Last sync: ${lastSyncTime?.toLocaleString() || 'Never'}`);
    
    // נבצע סנכרון ראשוני אם מחוברים
    if (isConnected && !isSyncing && !lastSyncTime) {
      console.log('Performing initial sync on page load');
      handleManualRefresh();
    }
  }, [isConnected, isSyncing, lastSyncTime, handleManualRefresh, syncEnabled]);
  
  return (
    <Container className="py-6">
      <IntegrationHeader
        isConnected={isConnected}
        isSyncing={isSyncing}
        activeTab={activeTab}
        handleManualRefresh={handleManualRefresh}
      />
      
      <IntegrationStatusSection
        isConnected={isConnected}
        syncEnabled={syncEnabled}
        refreshTimer={refreshTimer}
        lastSyncTime={lastSyncTime}
        formatLastSyncTime={formatLastSyncTime}
      />
      
      <IntegrationTabsContainer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lastSyncTime={lastSyncTime}
      />
    </Container>
  );
};

export default TradingViewIntegration;
