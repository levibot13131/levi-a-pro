
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AlertSettings from '@/components/technical-analysis/AlertSettings';
import TradingViewWebhookHandler from '@/components/technical-analysis/TradingViewWebhookHandler';
import CustomSignals from '@/components/technical-analysis/CustomSignals';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { BellRing, Link, Brain } from 'lucide-react';

interface SmartTabContentProps {
  assetId: string;
}

const SmartTabContent: React.FC<SmartTabContentProps> = ({ assetId }) => {
  const [smartTabActive, setSmartTabActive] = useState('realtime');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="outline" className="mb-2">
            <Brain className="h-4 w-4 mr-1" />
            מערכת AI-KSEM
          </Badge>
        </div>
        <h2 className="text-2xl font-bold text-right">ניתוח חכם ואיתותים אוטומטיים</h2>
      </div>
      
      <Tabs value={smartTabActive} onValueChange={setSmartTabActive} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="realtime" className="text-xs sm:text-sm">
            <BellRing className="h-4 w-4 mr-1 hidden sm:inline" />
            איתותים בזמן אמת
          </TabsTrigger>
          <TabsTrigger value="tradingview" className="text-xs sm:text-sm">
            <Link className="h-4 w-4 mr-1 hidden sm:inline" />
            חיבור TradingView
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">
            הגדרות התראות
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="realtime" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <CustomSignals assetId={assetId} />
            </div>
            <div>
              <TradingViewWebhookHandler />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tradingview" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">חיבור ל-TradingView</CardTitle>
            </CardHeader>
            <CardContent className="text-right">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                  <h3 className="font-bold mb-2">איך להתחבר לטריידינגויו?</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>היכנס לחשבון TradingView שלך</li>
                    <li>פתח את הגרף של הנכס שברצונך לעקוב אחריו</li>
                    <li>לחץ על 'התראות' (Alerts) בתפריט העליון</li>
                    <li>צור התראה חדשה וקבע את התנאים</li>
                    <li>תחת 'Webhook URL', הכנס את כתובת ה-webhook שתקבל בלשונית 'הגדרות התראות'</li>
                    <li>לחץ על 'שמירה'</li>
                  </ol>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-md">
                  <h3 className="font-bold mb-2">התראות מומלצות להגדרה בטריידינגויו:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>חצייה של ממוצע נע (EMA 50, 200)</li>
                    <li>RSI (כניסה/יציאה מאזורי קנייה/מכירת יתר)</li>
                    <li>שינוי מגמה של MACD</li>
                    <li>פריצה של רמות מחיר חשובות</li>
                    <li>תבניות נרות יפניים (Engulfing, Doji, וכו')</li>
                    <li>תבניות צ'ארטיסטיות (משולשים, דגלים, ראש וכתפיים)</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-md">
                  <h3 className="font-bold mb-2">טיפים לתבניות Webhook:</h3>
                  <p className="mb-2">
                    כאשר אתה מגדיר התראה בטריידינגויו, תוכל להשתמש בתבנית JSON הבאה:
                  </p>
                  <div className="bg-slate-800 text-slate-100 p-3 rounded-md text-sm overflow-x-auto">
                    <pre className="dir-ltr">
{`{
  "symbol": "{{ticker}}",
  "price": {{close}},
  "type": "buy", // או "sell"
  "indicator": "MA Cross",
  "message": "חצייה מעל ממוצע נע 200",
  "timestamp": "{{timenow}}"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Separator className="my-6" />
          
          <TradingViewWebhookHandler />
        </TabsContent>
        
        <TabsContent value="settings" className="pt-4">
          <AlertSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartTabContent;
