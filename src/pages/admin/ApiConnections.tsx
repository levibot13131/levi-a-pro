import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader, Send, Link, Unlink, RefreshCw, Key } from 'lucide-react';
import { toast } from 'sonner';

import { 
  BinanceCredentials, 
  validateBinanceCredentials, 
  getBinanceCredentials, 
  isBinanceConnected, 
  disconnectBinance 
} from '@/services/binance/binanceService';

import { 
  initializeCoinMarketCap, 
  isCoinMarketCapConnected, 
  getCoinMarketCapApiKey, 
  getCoinMarketCapSetupInstructions 
} from '@/services/coinMarketCap/coinMarketCapService';

import {
  testCoinGeckoConnection,
  getCoinGeckoApiKey,
  setCoinGeckoApiKey,
  validateCoinGeckoApiKey
} from '@/services/crypto/coinGeckoIntegration';

import { 
  isTradingViewConnected, 
  validateTradingViewCredentials, 
  getTradingViewCredentials, 
  disconnectTradingView 
} from '@/services/tradingView/tradingViewAuthService';

import TelegramConfig from '@/components/messaging/TelegramConfig';

const ApiConnections = () => {
  // State for Binance
  const [binanceApiKey, setBinanceApiKey] = useState('');
  const [binanceApiSecret, setBinanceApiSecret] = useState('');
  const [isBinanceLoading, setIsBinanceLoading] = useState(false);
  const [binanceConnected, setBinanceConnected] = useState(false);
  
  // State for CoinMarketCap
  const [cmcApiKey, setCmcApiKey] = useState('');
  const [isCmcLoading, setIsCmcLoading] = useState(false);
  const [cmcConnected, setCmcConnected] = useState(false);
  
  // State for CoinGecko
  const [coinGeckoApiKey, setCoinGeckoApiKey] = useState('');
  const [isCoinGeckoLoading, setIsCoinGeckoLoading] = useState(false);
  const [coinGeckoConnected, setCoinGeckoConnected] = useState(false);
  
  // State for TradingView
  const [tradingViewUsername, setTradingViewUsername] = useState('');
  const [tradingViewApiKey, setTradingViewApiKey] = useState('');
  const [isTradingViewLoading, setIsTradingViewLoading] = useState(false);
  const [tradingViewConnected, setTradingViewConnected] = useState(false);
  
  useEffect(() => {
    // Check Binance connection
    const binanceCreds = getBinanceCredentials();
    if (binanceCreds?.apiKey) {
      setBinanceApiKey(binanceCreds.apiKey);
      setBinanceApiSecret(binanceCreds.apiSecret || '');
    }
    setBinanceConnected(isBinanceConnected());
    
    // Check CoinMarketCap connection
    const cmcKey = getCoinMarketCapApiKey();
    if (cmcKey) {
      setCmcApiKey(cmcKey);
    }
    setCmcConnected(isCoinMarketCapConnected());
    
    // Check CoinGecko connection
    const cgKey = getCoinGeckoApiKey();
    if (cgKey) {
      setCoinGeckoApiKey(cgKey);
    }
    setCoinGeckoConnected(!!cgKey);
    
    // Check TradingView connection
    const tvCreds = getTradingViewCredentials();
    if (tvCreds?.username) {
      setTradingViewUsername(tvCreds.username);
      setTradingViewApiKey(tvCreds.apiKey || '');
    }
    setTradingViewConnected(isTradingViewConnected());
  }, []);
  
  // Binance handlers
  const handleConnectBinance = async () => {
    if (!binanceApiKey || !binanceApiSecret) {
      toast.error('נדרשים מפתח API וסיסמת API');
      return;
    }
    
    setIsBinanceLoading(true);
    
    try {
      const credentials: BinanceCredentials = {
        apiKey: binanceApiKey,
        apiSecret: binanceApiSecret,
        testnet: false,
        isConnected: true,
        lastConnected: Date.now()
      };
      
      const success = await validateBinanceCredentials(credentials);
      
      if (success) {
        setBinanceConnected(true);
        toast.success('התחברות לבינאנס הצליחה');
      }
    } catch (error) {
      console.error('Error connecting to Binance:', error);
      toast.error('שגיאה בהתחברות לבינאנס');
    } finally {
      setIsBinanceLoading(false);
    }
  };
  
  const handleDisconnectBinance = () => {
    disconnectBinance();
    setBinanceConnected(false);
    toast.info('החיבור לבינאנס נותק');
  };
  
  // CoinMarketCap handlers
  const handleConnectCoinMarketCap = async () => {
    if (!cmcApiKey) {
      toast.error('נדרש מפתח API');
      return;
    }
    
    setIsCmcLoading(true);
    
    try {
      const success = initializeCoinMarketCap(cmcApiKey);
      
      if (success) {
        setCmcConnected(true);
        toast.success('התחברות ל-CoinMarketCap הצליחה');
      }
    } catch (error) {
      console.error('Error connecting to CoinMarketCap:', error);
      toast.error('שגיאה בהתחברות ל-CoinMarketCap');
    } finally {
      setIsCmcLoading(false);
    }
  };
  
  // CoinGecko handlers
  const handleConnectCoinGecko = async () => {
    if (!coinGeckoApiKey) {
      toast.error('נדרש מפתח API');
      return;
    }
    
    setIsCoinGeckoLoading(true);
    
    try {
      const isValid = await validateCoinGeckoApiKey(coinGeckoApiKey);
      
      if (isValid) {
        setCoinGeckoApiKey(coinGeckoApiKey);
        setCoinGeckoConnected(true);
        toast.success('התחברות ל-CoinGecko הצליחה');
      } else {
        toast.error('מפתח API של CoinGecko לא תקין');
      }
    } catch (error) {
      console.error('Error connecting to CoinGecko:', error);
      toast.error('שגיאה בהתחברות ל-CoinGecko');
    } finally {
      setIsCoinGeckoLoading(false);
    }
  };
  
  // TradingView handlers
  const handleConnectTradingView = async () => {
    if (!tradingViewUsername) {
      toast.error('נדרש שם משתמש ל-TradingView');
      return;
    }
    
    setIsTradingViewLoading(true);
    
    try {
      const credentials = {
        username: tradingViewUsername,
        apiKey: tradingViewApiKey
      };
      
      const success = await validateTradingViewCredentials(credentials);
      
      if (success) {
        setTradingViewConnected(true);
        toast.success('התחברות ל-TradingView הצליחה');
      } else {
        toast.error('פרטי ההתחברות ל-TradingView לא תקינים');
      }
    } catch (error) {
      console.error('Error connecting to TradingView:', error);
      toast.error('שגיאה בהתחברות ל-TradingView');
    } finally {
      setIsTradingViewLoading(false);
    }
  };
  
  const handleDisconnectTradingView = () => {
    disconnectTradingView();
    setTradingViewConnected(false);
    toast.info('החיבור ל-TradingView נותק');
  };
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6 text-right">חיבורי API</h1>
      
      <Tabs defaultValue="binance" className="space-y-6">
        <TabsList className="grid w-full md:w-[600px] grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="binance">Binance</TabsTrigger>
          <TabsTrigger value="coinmarketcap">CoinMarketCap</TabsTrigger>
          <TabsTrigger value="coingecko">CoinGecko</TabsTrigger>
          <TabsTrigger value="tradingview">TradingView</TabsTrigger>
        </TabsList>
        
        <TabsContent value="binance">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">חיבור ל-Binance</CardTitle>
              <CardDescription className="text-right">
                הזן את פרטי ה-API ���לך ל-Binance כדי להתחבר
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="binance-api-key" className="text-right block">מפתח API</Label>
                <Input
                  id="binance-api-key"
                  value={binanceApiKey}
                  onChange={(e) => setBinanceApiKey(e.target.value)}
                  placeholder="הזן את מפתח ה-API"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="binance-api-secret" className="text-right block">סיסמת API</Label>
                <Input
                  id="binance-api-secret"
                  type="password"
                  value={binanceApiSecret}
                  onChange={(e) => setBinanceApiSecret(e.target.value)}
                  placeholder="הזן את סיסמת ה-API"
                  className="text-right"
                />
              </div>
              
              <div className="flex justify-end">
                {binanceConnected ? (
                  <Button variant="outline" onClick={handleDisconnectBinance}>
                    <Unlink className="h-4 w-4 ml-2" />
                    נתק
                  </Button>
                ) : (
                  <Button onClick={handleConnectBinance} disabled={isBinanceLoading}>
                    {isBinanceLoading ? (
                      <Loader className="h-4 w-4 ml-2 animate-spin" />
                    ) : (
                      <Link className="h-4 w-4 ml-2" />
                    )}
                    התחבר
                  </Button>
                )}
              </div>
              
              {binanceConnected && (
                <div className="bg-green-50 border border-green-200 p-3 rounded text-right">
                  <p className="text-green-800">✅ מחובר ל-Binance</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="coinmarketcap">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">חיבור ל-CoinMarketCap</CardTitle>
              <CardDescription className="text-right">
                הזן את מפתח ה-API שלך ל-CoinMarketCap
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cmc-api-key" className="text-right block">מפתח API</Label>
                <Input
                  id="cmc-api-key"
                  value={cmcApiKey}
                  onChange={(e) => setCmcApiKey(e.target.value)}
                  placeholder="הזן את מפתח ה-API"
                  className="text-right"
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleConnectCoinMarketCap} disabled={isCmcLoading}>
                  {isCmcLoading ? (
                    <Loader className="h-4 w-4 ml-2 animate-spin" />
                  ) : (
                    <Link className="h-4 w-4 ml-2" />
                  )}
                  התחבר
                </Button>
              </div>
              
              {cmcConnected && (
                <div className="bg-green-50 border border-green-200 p-3 rounded text-right">
                  <p className="text-green-800">✅ מחובר ל-CoinMarketCap</p>
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 p-3 rounded text-right mt-4">
                <p className="text-blue-800">
                  <strong>איך להשיג מפתח API:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1 mt-2 pr-4">
                  <li>היכנס ל-<a href="https://coinmarketcap.com/api/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">אתר CoinMarketCap Developer</a></li>
                  <li>הירשם או התחבר לחשבון</li>
                  <li>עבור ל-Dashboard ולחץ על "Create Key"</li>
                  <li>העתק את המפתח והדבק אותו כאן</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="coingecko">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">חיבור ל-CoinGecko Pro</CardTitle>
              <CardDescription className="text-right">
                הזן את מפתח ה-API שלך ל-CoinGecko Pro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coingecko-api-key" className="text-right block">מפתח API (אופציונלי)</Label>
                <Input
                  id="coingecko-api-key"
                  value={coinGeckoApiKey}
                  onChange={(e) => setCoinGeckoApiKey(e.target.value)}
                  placeholder="הזן את מפתח ה-API (אופציונלי)"
                  className="text-right"
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleConnectCoinGecko} disabled={isCoinGeckoLoading}>
                  {isCoinGeckoLoading ? (
                    <Loader className="h-4 w-4 ml-2 animate-spin" />
                  ) : (
                    <Key className="h-4 w-4 ml-2" />
                  )}
                  שמור מפתח
                </Button>
              </div>
              
              {coinGeckoConnected && (
                <div className="bg-green-50 border border-green-200 p-3 rounded text-right">
                  <p className="text-green-800">✅ מפתח CoinGecko Pro מוגדר</p>
                </div>
              )}
              
              <div className="flex justify-end mt-2">
                <Button variant="outline" onClick={() => testCoinGeckoConnection()}>
                  <RefreshCw className="h-4 w-4 ml-2" />
                  בדוק חיבור
                </Button>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 p-3 rounded text-right mt-4">
                <p className="text-blue-800">
                  <strong>הערה חשובה:</strong> ניתן להשתמש ב-CoinGecko גם ללא מפתח API, אך יש מגבלות על מספר הקריאות.
                  להגדלת מכסת הקריאות, ניתן להירשם ל-<a href="https://www.coingecko.com/en/api/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">CoinGecko Pro</a>.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tradingview">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">חיבור ל-TradingView</CardTitle>
              <CardDescription className="text-right">
                הזן את פרטי החשבון שלך ב-TradingView
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tradingview-username" className="text-right block">שם משתמש</Label>
                <Input
                  id="tradingview-username"
                  value={tradingViewUsername}
                  onChange={(e) => setTradingViewUsername(e.target.value)}
                  placeholder="הזן את שם המשתמש שלך ב-TradingView"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tradingview-api-key" className="text-right block">מפתח API (אופציונלי)</Label>
                <Input
                  id="tradingview-api-key"
                  value={tradingViewApiKey}
                  onChange={(e) => setTradingViewApiKey(e.target.value)}
                  placeholder="הזן את מפתח ה-API (אופציונלי)"
                  className="text-right"
                />
              </div>
              
              <div className="flex justify-end">
                {tradingViewConnected ? (
                  <Button variant="outline" onClick={handleDisconnectTradingView}>
                    <Unlink className="h-4 w-4 ml-2" />
                    נתק
                  </Button>
                ) : (
                  <Button onClick={handleConnectTradingView} disabled={isTradingViewLoading}>
                    {isTradingViewLoading ? (
                      <Loader className="h-4 w-4 ml-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 ml-2" />
                    )}
                    התחבר
                  </Button>
                )}
              </div>
              
              {tradingViewConnected && (
                <div className="bg-green-50 border border-green-200 p-3 rounded text-right">
                  <p className="text-green-800">✅ מחובר ל-TradingView</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-right">הגדרות טלגרם</h2>
        <TelegramConfig />
      </div>
    </div>
  );
};

export default ApiConnections;
