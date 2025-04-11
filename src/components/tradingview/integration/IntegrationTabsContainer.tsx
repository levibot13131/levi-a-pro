
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Link2, HelpCircle, Bell, Zap } from 'lucide-react';
import IntegrationTabs from './IntegrationTabs';
import TelegramIntegration from '../TelegramIntegration';
import WhatsAppIntegration from '../WhatsAppIntegration';
import IntegrationGuide from '../../technical-analysis/integration/IntegrationGuide';
import WebhookTester from '../webhook/WebhookTester';
import IntegrationTester from '../IntegrationTester';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IntegrationTabsContainerProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  lastSyncTime: Date | null;
}

const IntegrationTabsContainer: React.FC<IntegrationTabsContainerProps> = ({
  activeTab,
  setActiveTab,
  lastSyncTime
}) => {
  return (
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
  );
};

export default IntegrationTabsContainer;
