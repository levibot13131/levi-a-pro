
import React from 'react';
import { Container } from '../components/ui/container';
import { useTradingViewIntegration } from '../hooks/use-tradingview-integration';
import IntegrationHeader from '../components/tradingview/integration/IntegrationHeader';
import IntegrationStatusSection from '../components/tradingview/integration/IntegrationStatusSection';
import IntegrationTabsContainer from '../components/tradingview/integration/IntegrationTabsContainer';

const TradingViewIntegration: React.FC = () => {
  const {
    isConnected,
    syncEnabled,
    isSyncing,
    lastSyncTime,
    manualSync,
    toggleAutoSync
  } = useTradingViewIntegration();
  
  // טיימר לתצוגה של הזמן שעבר מאז העדכון האחרון
  const [refreshTimer, setRefreshTimer] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("charts");
  
  // עדכון טיימר כל שניה
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (lastSyncTime) {
        const seconds = Math.floor((Date.now() - lastSyncTime.getTime()) / 1000);
        setRefreshTimer(seconds);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lastSyncTime]);
  
  // פורמט להצגת זמן העדכון האחרון
  const formatLastSyncTime = () => {
    if (!lastSyncTime) return "לא היה סנכרון";
    
    const rtf = new Intl.RelativeTimeFormat('he', { numeric: 'auto' });
    const seconds = Math.floor((Date.now() - lastSyncTime.getTime()) / 1000);
    
    if (seconds < 60) {
      return rtf.format(-seconds, 'second');
    } else if (seconds < 3600) {
      return rtf.format(-Math.floor(seconds / 60), 'minute');
    } else {
      return rtf.format(-Math.floor(seconds / 3600), 'hour');
    }
  };
  
  // פונקציה לסנכרון ידני
  const handleManualRefresh = async () => {
    await manualSync(true);
  };
  
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
