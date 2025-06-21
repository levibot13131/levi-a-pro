
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Shield, MessageCircle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('809305569');
  const [autoTradingEnabled, setAutoTradingEnabled] = useState(false);
  const [maxRiskPerTrade, setMaxRiskPerTrade] = useState('2.0');

  const handleSave = () => {
    toast.success('הגדרות נשמרו בהצלחה');
  };

  return (
    <div className="space-y-6">
      <div className="text-right">
        <h1 className="text-3xl font-bold flex items-center gap-2 justify-end">
          <SettingsIcon className="h-8 w-8" />
          הגדרות מערכת
        </h1>
        <p className="text-gray-600">ניהול הגדרות מסחר, התראות וביטחון</p>
      </div>

      <Tabs defaultValue="trading" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trading">מסחר</TabsTrigger>
          <TabsTrigger value="notifications">התראות</TabsTrigger>
          <TabsTrigger value="security">אבטחה</TabsTrigger>
          <TabsTrigger value="strategies">אסטרטגיות</TabsTrigger>
        </TabsList>

        <TabsContent value="trading" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                הגדרות מסחר
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxRisk" className="text-right">מקסימום סיכון לעסקה (%)</Label>
                  <Input
                    id="maxRisk"
                    value={maxRiskPerTrade}
                    onChange={(e) => setMaxRiskPerTrade(e.target.value)}
                    placeholder="2.0"
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTrades" className="text-right">מקסימום עסקאות יומיות</Label>
                  <Input
                    id="maxTrades"
                    defaultValue="3"
                    placeholder="3"
                    className="text-right"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <Switch
                  checked={autoTradingEnabled}
                  onCheckedChange={setAutoTradingEnabled}
                />
                <div className="text-right">
                  <h3 className="font-medium">מסחר אוטומטי</h3>
                  <p className="text-sm text-gray-600">ביצוע עסקאות אוטומטי (נדרשת זהירות!)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyLoss" className="text-right">מגבלת הפסד יומית (%)</Label>
                  <Input
                    id="dailyLoss"
                    defaultValue="5.0"
                    placeholder="5.0"
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minRR" className="text-right">יחס רווח/סיכון מינימלי</Label>
                  <Input
                    id="minRR"
                    defaultValue="1.5"
                    placeholder="1.5"
                    className="text-right"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                הגדרות התראות
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="telegramToken" className="text-right">Telegram Bot Token</Label>
                <Input
                  id="telegramToken"
                  value={telegramToken}
                  onChange={(e) => setTelegramToken(e.target.value)}
                  placeholder="הכנס את ה-Token של הבוט"
                  type="password"
                  className="text-right"
                />
                <p className="text-xs text-gray-500 text-right">
                  צור בוט חדש ב-@BotFather כדי לקבל Token
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chatId" className="text-right">Telegram Chat ID</Label>
                <Input
                  id="chatId"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="809305569"
                  className="text-right"
                />
                <p className="text-xs text-gray-500 text-right">
                  ה-ID של הצ'אט לשליחת התראות
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium text-right">סוגי התראות</h3>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Switch defaultChecked />
                  <div className="text-right">
                    <h4 className="font-medium">איתותי מסחר</h4>
                    <p className="text-sm text-gray-600">התראה על איתות חדש</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Switch defaultChecked />
                  <div className="text-right">
                    <h4 className="font-medium">ביצוע עסקאות</h4>
                    <p className="text-sm text-gray-600">התראה על פתיחה/סגירה</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Switch />
                  <div className="text-right">
                    <h4 className="font-medium">התראות מערכת</h4>
                    <p className="text-sm text-gray-600">עדכונים על סטטוס המערכת</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right flex items-center gap-2">
                <Shield className="h-5 w-5" />
                הגדרות אבטחה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="binanceApi" className="text-right">Binance API Key</Label>
                <Input
                  id="binanceApi"
                  placeholder="הכנס API Key"
                  type="password"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="binanceSecret" className="text-right">Binance Secret Key</Label>
                <Input
                  id="binanceSecret"
                  placeholder="הכנס Secret Key"
                  type="password"
                  className="text-right"
                />
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 text-right">הערת אבטחה חשובה</h4>
                <p className="text-sm text-yellow-700 text-right mt-1">
                  ודא שמפתחות ה-API מוגבלים לקריאה בלבד או למסחר עם הגבלות נפח מתאימות
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">ניהול אסטרטגיות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border-l-4 border-l-blue-500 rounded">
                <h4 className="font-medium text-blue-800 text-right">השיטה האישית של אלמוג</h4>
                <p className="text-sm text-blue-700 text-right mt-1">
                  עדיפות עליונה - לא ניתן להשבתה
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium text-blue-800">85%</span>
                  <span className="text-sm text-blue-700">משקל נוכחי:</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'RSI + MACD', weight: 72, enabled: true },
                  { name: 'Smart Money Concepts', weight: 68, enabled: true },
                  { name: 'Elliott Wave', weight: 65, enabled: true },
                  { name: 'Wyckoff Method', weight: 61, enabled: true },
                  { name: 'Fibonacci Retracements', weight: 58, enabled: true },
                  { name: 'VWAP + Volume Profile', weight: 55, enabled: true },
                  { name: 'Candlestick Patterns', weight: 45, enabled: false },
                  { name: 'Quarter Theory', weight: 0, enabled: false },
                ].map((strategy, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Switch checked={strategy.enabled} />
                      <span className="text-sm font-medium">{strategy.weight}%</span>
                    </div>
                    <div className="text-right">
                      <h4 className="font-medium">{strategy.name}</h4>
                      <p className="text-xs text-gray-600">
                        {strategy.enabled ? 'פעיל' : 'מושבת'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button onClick={handleSave} className="px-8">
          שמור הגדרות
        </Button>
      </div>
    </div>
  );
};

export default Settings;
