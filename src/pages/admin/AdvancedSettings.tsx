import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader, RefreshCw, Save, Settings, Trash2, MessageSquare, Database, HardDrive } from 'lucide-react';
import { toast } from 'sonner';
import TelegramConfig from '@/components/messaging/TelegramConfig';

import { 
  clearTelegramCredentials, 
  getTelegramBotToken, 
  getTelegramChatId 
} from '@/services/messaging/telegramService';

import {
  clearCoinGeckoCredentials,
  getCoinGeckoApiKey,
  validateCoinGeckoApiKey
} from '@/services/crypto/coinGeckoIntegration';

import {
  clearBinanceCredentials,
  getBinanceCredentials
} from '@/services/binance/binanceService';

const AdvancedSettings = () => {
  const [activeTab, setActiveTab] = useState('messaging');
  const [isClearingCache, setIsClearingCache] = useState(false);

  // Stats
  const telegramConfigured = !!getTelegramBotToken() && !!getTelegramChatId();
  const binanceConfigured = !!getBinanceCredentials()?.apiKey;
  const coinGeckoConfigured = !!getCoinGeckoApiKey();

  const handleClearCache = async () => {
    setIsClearingCache(true);
    try {
      // Simulate cache clearing
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.removeItem('market_data_cache');
      localStorage.removeItem('assets_cache');
      localStorage.removeItem('watchlist_cache');
      
      toast.success('המטמון נוקה בהצלחה');
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error('שגיאה בניקוי המטמון');
    } finally {
      setIsClearingCache(false);
    }
  };

  const handleResetCredentials = () => {
    try {
      clearTelegramCredentials();
      clearCoinGeckoCredentials();
      clearBinanceCredentials();
      toast.success('כל פרטי ההתחברות נמחקו בהצלחה');
    } catch (error) {
      console.error('Error resetting credentials:', error);
      toast.error('שגיאה במחיקת פרטי ההתחברות');
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">הגדרות מתקדמות</h1>
        <Button variant="outline" onClick={handleResetCredentials}>
          <Trash2 className="h-4 w-4 ml-2" />
          איפוס כל פרטי ההתחברות
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="messaging">
            <MessageSquare className="h-4 w-4 ml-2" />
            מערכת הודעות
          </TabsTrigger>
          <TabsTrigger value="system">
            <Settings className="h-4 w-4 ml-2" />
            הגדרות מערכת
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="h-4 w-4 ml-2" />
            ניהול נתונים
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messaging" className="space-y-6">
          <TelegramConfig />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">הגדרות מערכת</CardTitle>
              <CardDescription className="text-right">
                הגדר את התנהגות המערכת וניהול המשאבים
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-right">מעקב אחר נכסים</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span>מעקב בזמן אמת פעיל</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        פעיל
                      </span>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        <RefreshCw className="h-4 w-4 ml-2" />
                        רענן מעקב
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-right">מצב חיבורים</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center">
                        <span>Telegram</span>
                        <span className={`px-2 py-1 rounded text-xs ${telegramConfigured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {telegramConfigured ? 'מחובר' : 'לא מחובר'}
                        </span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Binance</span>
                        <span className={`px-2 py-1 rounded text-xs ${binanceConfigured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {binanceConfigured ? 'מחובר' : 'לא מחובר'}
                        </span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>CoinGecko</span>
                        <span className={`px-2 py-1 rounded text-xs ${coinGeckoConfigured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {coinGeckoConfigured ? 'מחובר' : 'לא מחובר'}
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">ניהול נתונים</CardTitle>
              <CardDescription className="text-right">
                ניהול מטמון ונתוני מערכת
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-right">נתוני מטמון</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>גודל מטמון</span>
                        <span className="font-mono">~2.4 MB</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>נכסים במטמון</span>
                        <span className="font-mono">150</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>רשימות מעקב</span>
                        <span className="font-mono">3</span>
                      </div>
                      <div className="mt-4">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="w-full"
                          onClick={handleClearCache}
                          disabled={isClearingCache}
                        >
                          {isClearingCache ? (
                            <Loader className="h-4 w-4 ml-2 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 ml-2" />
                          )}
                          נקה מטמון
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-right">אחסון מקומי</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>נתוני localStorage</span>
                        <span className="font-mono">~5.1 MB</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>הגדרות שמורות</span>
                        <span className="font-mono">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>איתותים במערכת</span>
                        <span className="font-mono">24</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                      >
                        <HardDrive className="h-4 w-4 ml-2" />
                        יצא הגדרות
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedSettings;
