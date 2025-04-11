
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2, ChartLine, Newspaper, Bell, Settings } from 'lucide-react';
import TradingViewConnectionStatus from '@/components/tradingview/TradingViewConnectionStatus';
import TradingViewChart from '@/components/tradingview/TradingViewChart';
import TradingViewNews from '@/components/tradingview/TradingViewNews';
import TradingViewWebhookHandler from '@/components/technical-analysis/TradingViewWebhookHandler';
import { useTradingViewConnection } from '@/hooks/use-tradingview-connection';

const TradingViewIntegration: React.FC = () => {
  const { isConnected } = useTradingViewConnection();
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-right">אינטגרציה עם TradingView</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-3">
          <TradingViewConnectionStatus />
        </div>
      </div>
      
      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="charts" className="flex items-center gap-1">
            <ChartLine className="h-4 w-4" />
            גרפים
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-1">
            <Newspaper className="h-4 w-4" />
            חדשות
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TradingViewChart symbol="BTCUSD" />
            <TradingViewChart symbol="ETHUSD" />
          </div>
        </TabsContent>
        
        <TabsContent value="news">
          <TradingViewNews limit={10} />
        </TabsContent>
        
        <TabsContent value="alerts">
          <TradingViewWebhookHandler />
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">הגדרות אינטגרציה</CardTitle>
            </CardHeader>
            <CardContent className="text-right">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md mb-4">
                  <h3 className="font-semibold mb-2">הוראות סנכרון TradingView:</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>התחבר לחשבון TradingView שלך</li>
                    <li>הפעל את סנכרון אוטומטי לעדכוני מחיר</li>
                    <li>הגדר התראות עבור הנכסים שברצונך לעקוב אחריהם</li>
                    <li>קבל עדכונים בזמן אמת ישירות לתוך המערכת</li>
                  </ol>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <h3 className="font-semibold mb-2">יתרונות האינטגרציה:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>גישה למידע מחירים בזמן אמת</li>
                    <li>קבלת חדשות עדכניות מהשוק</li>
                    <li>התראות מותאמות אישית</li>
                    <li>גישה למגוון רחב של כלי ניתוח טכני</li>
                    <li>סנכרון הגדרות בין חשבון TradingView למערכת</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingViewIntegration;
