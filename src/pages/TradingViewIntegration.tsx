
import React from 'react';
import { Container } from '../components/ui/container';
import TradingViewConnectionStatus from '../components/tradingview/TradingViewConnectionStatus';
import IntegrationTabs from '../components/tradingview/integration/IntegrationTabs';
import SyncStatusDisplay from '../components/tradingview/integration/SyncStatusDisplay';
import SyncControls from '../components/tradingview/integration/SyncControls';
import { useTradingViewPage } from '../hooks/use-tradingview-page';
import TelegramIntegration from '../components/tradingview/TelegramIntegration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Link2, Share2 } from 'lucide-react';

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
      
      <Tabs defaultValue="integration" className="space-y-4">
        <TabsList className="w-full md:w-[400px] grid grid-cols-2">
          <TabsTrigger value="integration">
            <Link2 className="h-4 w-4 mr-2" />
            אינטגרציה עם טריידינגויו
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            התראות והודעות
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integration">
          <IntegrationTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            lastSyncTime={lastSyncTime}
          />
        </TabsContent>

        <TabsContent value="messages">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TelegramIntegration />
            
            <div className="bg-card border rounded-lg p-6 flex flex-col justify-center items-center">
              <Share2 className="h-12 w-12 text-primary opacity-50 mb-4" />
              <h3 className="text-lg font-bold mb-2">יעדי התראה נוספים בקרוב</h3>
              <p className="text-center text-sm text-muted-foreground">
                בקרוב נוסיף יעדי התראה נוספים כגון אימייל ו-SMS
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default TradingViewIntegration;
