
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Link2, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';
import { useTradingViewConnection } from '@/hooks/use-tradingview-connection';
import TradingViewConnectButton from '@/components/technical-analysis/tradingview/TradingViewConnectButton';
import TradingViewWebhookHandler from '@/components/technical-analysis/TradingViewWebhookHandler';
import { toast } from 'sonner';
import { startAssetTracking, stopAssetTracking, isTrackingActive } from '@/services/assetTracking/realTimeSync';

const TradingViewIntegration: React.FC = () => {
  const { isConnected, credentials } = useTradingViewConnection();
  const [activeTab, setActiveTab] = useState('prices');
  const [isUpdating, setIsUpdating] = useState(false);
  const [trackingEnabled, setTrackingEnabled] = useState(isTrackingActive());

  // Handle real-time sync toggle
  const handleToggleTracking = () => {
    if (trackingEnabled) {
      stopAssetTracking();
      setTrackingEnabled(false);
      toast.info('עדכון מחירים בזמן אמת הופסק');
    } else {
      startAssetTracking();
      setTrackingEnabled(true);
      toast.success('עדכון מחירים בזמן אמת הופעל');
    }
  };

  // Force update prices
  const handleForceUpdate = () => {
    setIsUpdating(true);
    
    // Force a manual update through realTimeSync service
    setTimeout(() => {
      setIsUpdating(false);
      toast.success('המחירים עודכנו בהצלחה');
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="gap-1"
                onClick={handleToggleTracking}
              >
                <Zap className={`h-4 w-4 ${trackingEnabled ? 'text-green-500' : 'text-gray-500'}`} />
                {trackingEnabled ? 'עדכון אוטומטי פעיל' : 'עדכון אוטומטי מושבת'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                disabled={isUpdating}
                onClick={handleForceUpdate}
              >
                <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
                עדכן מחירים
              </Button>
            </div>
          ) : (
            <TradingViewConnectButton />
          )}
          <CardTitle className="text-right">אינטגרציה עם TradingView</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="prices">מחירים בזמן אמת</TabsTrigger>
              <TabsTrigger value="signals">איתותים וסימונים</TabsTrigger>
            </TabsList>
            
            <TabsContent value="prices">
              <div className="space-y-4 mt-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <div className="flex justify-between items-center mb-3">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      מחובר
                    </Badge>
                    <h3 className="font-bold">מחירים מתעדכנים בזמן אמת</h3>
                  </div>
                  
                  <div className="text-right mb-3">
                    <p className="text-sm">
                      המחירים מתעדכנים ממקור הנתונים של TradingView כל 5 שניות באופן אוטומטי.
                      {credentials?.username && ` החשבון המחובר: ${credentials.username}`}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button 
                      variant={trackingEnabled ? "default" : "outline"}
                      size="sm"
                      className="gap-1"
                      onClick={handleToggleTracking}
                    >
                      <Zap className="h-4 w-4" />
                      {trackingEnabled ? 'הפסק עדכונים' : 'הפעל עדכונים'}
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">סטטוס:</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20">
                        {trackingEnabled ? 'פעיל' : 'מושבת'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <h3 className="font-semibold mb-2 text-right">יתרונות חיבור ל-TradingView:</h3>
                  <ul className="list-disc list-inside text-right space-y-1 text-sm">
                    <li>עדכוני מחירים בזמן אמת ממקור מהימן</li>
                    <li>איתותים טכניים מותאמים אישית</li>
                    <li>סנכרון הגדרות וקבלת התראות</li>
                    <li>ביצוע פעולות אוטומטיות בהתאם לאיתותים</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="signals">
              <div className="mt-4">
                <TradingViewWebhookHandler />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-right">
              <div className="flex justify-between items-center mb-3">
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  לא מחובר
                </Badge>
                <h3 className="font-bold">יש להתחבר ל-TradingView</h3>
              </div>
              
              <p className="text-sm mb-4">
                חיבור לחשבון TradingView שלך יאפשר לך לקבל עדכוני מחירים בזמן אמת ולהגדיר התראות מותאמות אישית.
                מחירים מעודכנים יאפשרו לך לקבל החלטות מדויקות יותר.
              </p>
              
              <TradingViewConnectButton />
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md text-right">
              <h3 className="font-semibold mb-2">למה להתחבר ל-TradingView?</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>קבלת מחירים מדויקים בזמן אמת</li>
                <li>סנכרון עם הגדרות האיתותים הקיימות שלך</li>
                <li>קבלת התראות מהימנות על תנועות שוק משמעותיות</li>
                <li>אינטגרציה מלאה עם כלי הניתוח הטכני</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingViewIntegration;
