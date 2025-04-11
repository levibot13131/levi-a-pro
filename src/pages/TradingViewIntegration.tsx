
import React from 'react';
import { Container } from '../components/ui/container';
import TradingViewConnectionStatus from '../components/tradingview/TradingViewConnectionStatus';
import IntegrationTabs from '../components/tradingview/integration/IntegrationTabs';
import SyncStatusDisplay from '../components/tradingview/integration/SyncStatusDisplay';
import SyncControls from '../components/tradingview/integration/SyncControls';
import { useTradingViewPage } from '../hooks/use-tradingview-page';
import TelegramIntegration from '../components/tradingview/TelegramIntegration';
import WhatsAppIntegration from '../components/tradingview/WhatsAppIntegration';
import IntegrationGuide from '../components/technical-analysis/integration/IntegrationGuide';
import WebhookTester from '../components/tradingview/webhook/WebhookTester';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Link2, Share2, HelpCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { sendAlert } from '@/services/tradingView/tradingViewAlertService';

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
  
  // פונקציה לשליחת התראת בדיקה
  const sendTestAlert = () => {
    sendAlert({
      symbol: "TEST",
      message: "זוהי הודעת בדיקה מהמערכת",
      indicators: ["System Test"],
      timeframe: "1d",
      timestamp: Date.now(),
      price: 50000,
      action: 'info',
      details: "בדיקת חיבור ושליחת הודעות"
    });

    toast.success("הודעת בדיקה נשלחה", {
      description: "ההודעה נשלחה לכל היעדים המוגדרים"
    });
  };
  
  return (
    <Container className="py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-right">אינטגרציה עם TradingView</h1>
        
        <div className="flex gap-2">
          {isConnected && (
            <SyncControls 
              activeTab={activeTab}
              isSyncing={isSyncing}
              handleManualRefresh={handleManualRefresh}
            />
          )}
          
          <Button variant="outline" onClick={sendTestAlert}>
            שלח התראת בדיקה
          </Button>
        </div>
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
        <TabsList className="w-full md:w-[500px] grid grid-cols-4">
          <TabsTrigger value="integration">
            <Link2 className="h-4 w-4 mr-2" />
            אינטגרציה
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            התראות
          </TabsTrigger>
          <TabsTrigger value="webhook">
            <Bell className="h-4 w-4 mr-2" />
            Webhook
          </TabsTrigger>
          <TabsTrigger value="guide">
            <HelpCircle className="h-4 w-4 mr-2" />
            מדריך הקמה
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
            <WhatsAppIntegration />
          </div>
        </TabsContent>
        
        <TabsContent value="webhook">
          <div className="grid grid-cols-1 gap-6">
            <WebhookTester />
          </div>
        </TabsContent>
        
        <TabsContent value="guide">
          <IntegrationGuide />
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default TradingViewIntegration;
