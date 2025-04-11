
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AlertSettings from '@/components/technical-analysis/AlertSettings';
import TradingViewWebhookHandler from '@/components/technical-analysis/TradingViewWebhookHandler';
import CustomSignals from '@/components/technical-analysis/CustomSignals';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { BellRing, Link, Brain, CheckCircle2, AlertTriangle } from 'lucide-react';
import TradingViewConnectButton from './tradingview/TradingViewConnectButton';
import { useTradingViewConnection } from '@/hooks/use-tradingview-connection';

interface SmartTabContentProps {
  assetId: string;
}

const SmartTabContent: React.FC<SmartTabContentProps> = ({ assetId }) => {
  const [smartTabActive, setSmartTabActive] = useState('realtime');
  const { isConnected, credentials, loading } = useTradingViewConnection();
  
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
            {isConnected && (
              <div className="ml-2">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              </div>
            )}
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
              <div className="flex justify-between items-center">
                <TradingViewConnectButton />
                <CardTitle className="text-right">חיבור ל-TradingView</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-right">
              <div className="space-y-4">
                {isConnected ? (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <div className="flex justify-between items-center mb-3">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        מחובר
                      </Badge>
                      <h3 className="font-bold">סטטוס חיבור לטריידינגויו</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-muted-foreground">שם משתמש</div>
                        <div className="font-semibold">{credentials?.username}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">זמן חיבור אחרון</div>
                        <div className="font-semibold">
                          {credentials?.lastConnected
                            ? new Date(credentials.lastConnected).toLocaleString('he-IL')
                            : 'לא ידוע'
                          }
                        </div>
                      </div>
                    </div>
                    <p className="text-sm">
                      החיבור לחשבון TradingView שלך פעיל. כעת תוכל להגדיר התראות ולקבל איתותים בזמן אמת.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                    <div className="flex justify-between items-center mb-3">
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        לא מחובר
                      </Badge>
                      <h3 className="font-bold">סטטוס חיבור לטריידינגויו</h3>
                    </div>
                    <p className="text-sm mb-3">
                      אינך מחובר לחשבון TradingView. חבר את החשבון שלך כדי להתחיל לקבל איתותים בזמן אמת והתראות מותאמות אישית.
                    </p>
                    <TradingViewConnectButton />
                  </div>
                )}
                
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
