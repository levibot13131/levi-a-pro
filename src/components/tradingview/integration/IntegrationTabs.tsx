
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { ChartLine, Newspaper, Bot, Bell, Settings } from 'lucide-react';
import TradingViewChart from '../TradingViewChart';
import TradingViewNews from '../TradingViewNews';
import TradingViewBot from '../TradingViewBot';
import TradingViewWebhookHandler from '../../technical-analysis/TradingViewWebhookHandler';
import SettingsTabContent from './SettingsTabContent';

interface IntegrationTabsProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  lastSyncTime: Date | null;
}

const IntegrationTabs: React.FC<IntegrationTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  lastSyncTime 
}) => {
  return (
    <Tabs 
      defaultValue="charts" 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="space-y-4"
    >
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="charts" className="flex items-center gap-1">
          <ChartLine className="h-4 w-4" />
          גרפים בזמן אמת
        </TabsTrigger>
        <TabsTrigger value="news" className="flex items-center gap-1">
          <Newspaper className="h-4 w-4" />
          חדשות
        </TabsTrigger>
        <TabsTrigger value="bot" className="flex items-center gap-1">
          <Bot className="h-4 w-4" />
          בוט מסחר
        </TabsTrigger>
        <TabsTrigger value="alerts" className="flex items-center gap-1">
          <Bell className="h-4 w-4" />
          התראות
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          הגדרות
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="charts">
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-right">גרפים בזמן אמת</CardTitle>
            <CardDescription className="text-right">
              מידע מחירים מ-TradingView מתעדכן אוטומטית
            </CardDescription>
          </CardHeader>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TradingViewChart symbol="BTCUSD" key={`btc-${lastSyncTime?.getTime() || 'default'}`} />
          <TradingViewChart symbol="ETHUSD" key={`eth-${lastSyncTime?.getTime() || 'default'}`} />
        </div>
      </TabsContent>
      
      <TabsContent value="news">
        <TradingViewNews limit={10} refreshKey={lastSyncTime?.getTime()} />
      </TabsContent>
      
      <TabsContent value="bot">
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-right">בוט מסחר אוטומטי</CardTitle>
            <CardDescription className="text-right">
              ניתוח מחירים וקבלת איתותים בזמן אמת
            </CardDescription>
          </CardHeader>
        </Card>
        
        <TradingViewBot />
      </TabsContent>
      
      <TabsContent value="alerts">
        <TradingViewWebhookHandler />
      </TabsContent>
      
      <TabsContent value="settings">
        <SettingsTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default IntegrationTabs;
