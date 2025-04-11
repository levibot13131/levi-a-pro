
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Link2, ChartLine, Newspaper, Bell, Settings, RefreshCw, Clock, Bot } from 'lucide-react';
import TradingViewConnectionStatus from '../components/tradingview/TradingViewConnectionStatus';
import TradingViewChart from '../components/tradingview/TradingViewChart';
import TradingViewNews from '../components/tradingview/TradingViewNews';
import TradingViewBot from '../components/tradingview/TradingViewBot';
import TradingViewWebhookHandler from '../components/technical-analysis/TradingViewWebhookHandler';
import { useTradingViewConnection } from '../hooks/use-tradingview-connection';
import { useTradingViewIntegration } from '../hooks/use-tradingview-integration';
import { toast } from 'sonner';

const TradingViewIntegration: React.FC = () => {
  const { isConnected } = useTradingViewConnection();
  const { 
    syncEnabled, 
    isSyncing, 
    lastSyncTime, 
    manualSync, 
    toggleAutoSync 
  } = useTradingViewIntegration();
  
  const [refreshTimer, setRefreshTimer] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('charts');
  
  useEffect(() => {
    if (syncEnabled) {
      const timer = setInterval(() => {
        if (lastSyncTime) {
          const seconds = Math.floor((new Date().getTime() - lastSyncTime.getTime()) / 1000);
          setRefreshTimer(seconds);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [syncEnabled, lastSyncTime]);
  
  const formatLastSyncTime = () => {
    if (!lastSyncTime) return 'אף פעם';
    
    if (refreshTimer < 60) {
      return `לפני ${refreshTimer} שניות`;
    }
    
    if (refreshTimer < 3600) {
      const minutes = Math.floor(refreshTimer / 60);
      return `לפני ${minutes} דקות`;
    }
    
    return lastSyncTime.toLocaleTimeString('he-IL', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleManualRefresh = async () => {
    if (isSyncing) return;
    
    const success = await manualSync();
    if (success) {
      if (activeTab === 'charts') {
        toast.success("גרפים עודכנו בהצלחה");
      } else if (activeTab === 'news') {
        toast.success("חדשות עודכנו בהצלחה");
      }
    }
  };
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-right">אינטגרציה עם TradingView</h1>
        
        {isConnected && (
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button 
              variant={syncEnabled ? "default" : "outline"}
              onClick={toggleAutoSync}
              className="gap-1"
            >
              <Clock className="h-4 w-4" />
              {syncEnabled ? 'כיבוי סנכרון אוטומטי' : 'הפעלת סנכרון אוטומטי'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleManualRefresh}
              disabled={isSyncing}
              className="gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              רענן נתונים
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-3">
          <TradingViewConnectionStatus />
          
          {isConnected && syncEnabled && (
            <div className="mt-2 flex justify-end items-center text-sm text-muted-foreground">
              <span>עדכון אחרון: {formatLastSyncTime()}</span>
              <Badge 
                variant="outline" 
                className="mr-2"
              >
                {refreshTimer < 30 ? 'נתונים עדכניים' : 'עדכון בקרוב'}
              </Badge>
            </div>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="charts" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
                מידע מחירים מ-TradingView מתעדכן {syncEnabled ? 'אוטומטית' : 'ידנית'}
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
                
                <div className="flex items-center justify-between mb-4 p-4 border rounded-md">
                  <Button 
                    variant={syncEnabled ? "default" : "outline"}
                    onClick={toggleAutoSync}
                    className="gap-1"
                  >
                    <Clock className="h-4 w-4" />
                    {syncEnabled ? 'כיבוי סנכרון אוטומטי' : 'הפעלת סנכרון אוטומטי'}
                  </Button>
                  
                  <div className="text-right">
                    <h3 className="font-medium mb-1">סנכרון נתונים בזמן אמת</h3>
                    <p className="text-sm text-muted-foreground">
                      {syncEnabled 
                        ? 'נתונים מתעדכנים אוטומטית כל 30 שניות' 
                        : 'הפעל סנכרון אוטומטי לקבלת עדכונים בזמן אמת'}
                    </p>
                  </div>
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
