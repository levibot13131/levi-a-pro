
import React from 'react';
import { Container } from '../components/ui/container';
import { useTradingViewPage } from '../hooks/use-tradingview-page';
import IntegrationHeader from '../components/tradingview/integration/IntegrationHeader';
import IntegrationStatusSection from '../components/tradingview/integration/IntegrationStatusSection';
import IntegrationTabsContainer from '../components/tradingview/integration/IntegrationTabsContainer';

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
