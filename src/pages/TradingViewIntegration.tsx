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
import IntegrationTester from '../components/tradingview/IntegrationTester';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Link2, Share2, HelpCircle, Bell, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { sendAlert, createSampleAlert } from '@/services/tradingView/tradingViewAlertService';
import { testAllIntegrations } from '@/services/tradingView/testIntegrations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  
  const sendTestAlert = () => {
    const sampleAlert = createSampleAlert('info');
    sampleAlert.message = "זוהי הודעת בדיקה מהמערכת";
    sampleAlert.details = "בדיקת חיבור ושליחת הודעות";
    
    sendAlert(sampleAlert);
    
    toast.success("הודעת בדיקה נשלחה", {
      description: "ההודעה נשלחה לכל היעדים המוגדרים"
    });
  };
  
  const verifyAllIntegrations = async () => {
    toast.info("בודק את כל החיבורים...");
    await testAllIntegrations();
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
          
          <Button variant="outline" className="gap-1" onClick={verifyAllIntegrations}>
            <Zap className="h-4 w-4" />
            בדוק חיבורים
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
        <TabsList className="w-full md:w-[600px] grid grid-cols-5">
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
          <TabsTrigger value="test">
            <Zap className="h-4 w-4 mr-2" />
            בדיקות
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
        
        <TabsContent value="test">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IntegrationTester />
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">פרטי דיאגנוסטיקה</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2 text-right">
                    <p>לאחר הרפקטורינג, כל המודולים פוצלו לקבצים קטנים יותר:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>sender.ts פוצל למספר מודולים נפרדים</li>
                      <li>formatters.ts מטפל בעיצוב ופורמט ההודעות</li>
                      <li>providers מכיל את השירותים השונים (WhatsApp, Telegram)</li>
                      <li>distributor.ts אחראי על שליחת ההתראות ליעדים</li>
                    </ul>
                    <p className="mt-4">בטוח לשימוש ומעודכן בזמן אמת.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
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
