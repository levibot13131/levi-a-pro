
import React, { useEffect } from 'react';
import { Container } from '../components/ui/container';
import { useTradingViewPage } from '../hooks/use-tradingview-page';
import IntegrationHeader from '../components/tradingview/integration/IntegrationHeader';
import IntegrationStatusSection from '../components/tradingview/integration/IntegrationStatusSection';
import IntegrationTabsContainer from '../components/tradingview/integration/IntegrationTabsContainer';
import BasicAccountNotification from '../components/tradingview/BasicAccountNotification';
import DeploymentChecklist from '../components/tradingview/DeploymentChecklist';
import { toast } from 'sonner';
import { initializeTradingViewServices } from '../services/tradingView/startup';

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
  
  // Initialize all TradingView services when the page loads
  useEffect(() => {
    const initServices = async () => {
      const success = initializeTradingViewServices();
      if (!success) {
        toast.error('שגיאה באתחול שירותי TradingView', {
          description: 'ייתכן שחלק מהפונקציות לא יעבדו כראוי'
        });
      }
    };
    
    initServices();
  }, []);
  
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
      
      <BasicAccountNotification />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <IntegrationStatusSection
            isConnected={isConnected}
            syncEnabled={syncEnabled}
            refreshTimer={refreshTimer}
            lastSyncTime={lastSyncTime}
            formatLastSyncTime={formatLastSyncTime}
            toggleAutoSync={toggleAutoSync}
          />
        </div>
        <div className="md:col-span-1">
          <DeploymentChecklist />
        </div>
      </div>
      
      <IntegrationTabsContainer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lastSyncTime={lastSyncTime}
      />
    </Container>
  );
};

export default TradingViewIntegration;
