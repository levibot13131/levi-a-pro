
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Check, X, ExternalLink, RefreshCw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

// API Services
import { getBinanceCredentials, validateBinanceCredentials, disconnectBinance, testBinanceConnection } from '@/services/binance/binanceService';
import { isTwitterConnected, validateTwitterCredentials, disconnectTwitter, getTwitterCredentials } from '@/services/twitter/twitterService';
import { isCoinMarketCapConnected, initializeCoinMarketCap, getCoinMarketCapApiKey } from '@/services/coinMarketCap/coinMarketCapService';
import { getExternalSources } from '@/services/marketInformation/externalSourcesService';
import { testConnection as testCoinGeckoConnection } from '@/services/crypto/coinGeckoService';

interface ApiConnectionProps {
  title: string;
  description: string;
  isConnected: boolean;
  lastConnected?: number | null;
  apiKey?: string;
  apiSecret?: string;
  onConnect: (key: string, secret?: string) => void;
  onDisconnect: () => void;
  onTest?: () => Promise<boolean>;
  needsSecret?: boolean;
  showApiDetails?: boolean;
  setupUrl?: string;
  setupInstructions?: React.ReactNode;
}

const ApiConnection: React.FC<ApiConnectionProps> = ({
  title,
  description,
  isConnected,
  lastConnected,
  apiKey,
  apiSecret,
  onConnect,
  onDisconnect,
  onTest,
  needsSecret = false,
  showApiDetails = true,
  setupUrl,
  setupInstructions
}) => {
  const [key, setKey] = useState(apiKey || '');
  const [secret, setSecret] = useState(apiSecret || '');
  const [isTesting, setIsTesting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleConnect = () => {
    if (!key) {
      toast.error('יש להזין מפתח API');
      return;
    }
    
    if (needsSecret && !secret) {
      toast.error('יש להזין סוד API');
      return;
    }
    
    onConnect(key, needsSecret ? secret : undefined);
  };

  const handleTest = async () => {
    if (!onTest) return;
    
    setIsTesting(true);
    try {
      const success = await onTest();
      if (success) {
        toast.success(`החיבור ל-${title} פעיל`);
      } else {
        toast.error(`החיבור ל-${title} אינו פעיל`);
      }
    } catch (error) {
      toast.error(`שגיאה בבדיקת החיבור ל-${title}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Badge variant={isConnected ? "success" : "secondary"} className="ml-2">
            {isConnected ? "מחובר" : "לא מחובר"}
          </Badge>
          <CardTitle className="text-right">{title}</CardTitle>
        </div>
        <CardDescription className="text-right">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            {showApiDetails && (
              <div className="space-y-3">
                <div className="text-right">
                  <Label className="block">מפתח API</Label>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono truncate">
                    {apiKey ? apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4) : 'לא זמין'}
                  </div>
                </div>
                
                {needsSecret && (
                  <div className="text-right">
                    <Label className="block">סוד API</Label>
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono">
                      ••••••••••••••••
                    </div>
                  </div>
                )}
                
                {lastConnected && (
                  <div className="text-right">
                    <Label className="block">חובר לאחרונה</Label>
                    <div className="text-sm">
                      {new Date(lastConnected).toLocaleString('he-IL')}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                onClick={handleTest} 
                disabled={isTesting || !onTest}
                className="ml-2"
              >
                <RefreshCw className={`h-4 w-4 ml-2 ${isTesting ? 'animate-spin' : ''}`} />
                בדוק חיבור
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={onDisconnect}
              >
                <X className="h-4 w-4 ml-2" />
                נתק
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="text-right">
                <Label htmlFor={`${title}-api-key`} className="block">מפתח API</Label>
                <Input
                  id={`${title}-api-key`}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="הזן מפתח API"
                  className="text-right"
                />
              </div>
              
              {needsSecret && (
                <div className="text-right">
                  <Label htmlFor={`${title}-api-secret`} className="block">סוד API</Label>
                  <Input
                    id={`${title}-api-secret`}
                    type="password"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="הזן סוד API"
                    className="text-right"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-4">
              {setupUrl && (
                <a 
                  href={setupUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 flex items-center"
                >
                  <ExternalLink className="h-4 w-4 ml-1" />
                  פתח אתר
                </a>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => setShowInstructions(!showInstructions)}
                className="ml-2"
              >
                {showInstructions ? 'הסתר הוראות' : 'הצג הוראות'}
              </Button>
              
              <Button 
                onClick={handleConnect}
              >
                <Check className="h-4 w-4 ml-2" />
                חבר
              </Button>
            </div>
            
            {showInstructions && setupInstructions && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-right">
                {setupInstructions}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ApiConnections = () => {
  const [binanceConnected, setBinanceConnected] = useState(false);
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [coinMarketCapConnected, setCoinMarketCapConnected] = useState(false);
  const [coinGeckoConnected, setCoinGeckoConnected] = useState(true); // Always connected since no API key required
  
  const [binanceCredentials, setBinanceCredentials] = useState<any>(null);
  const [twitterCredentials, setTwitterCredentials] = useState<any>(null);
  const [coinMarketCapApiKey, setCoinMarketCapApiKey] = useState<string | null>(null);
  
  // Load connection statuses
  useEffect(() => {
    // Get Binance credentials
    const binanceCreds = getBinanceCredentials();
    setBinanceConnected(!!binanceCreds?.isConnected);
    setBinanceCredentials(binanceCreds);
    
    // Get Twitter connection status
    setTwitterConnected(isTwitterConnected());
    setTwitterCredentials(getTwitterCredentials());
    
    // Get CoinMarketCap connection status
    setCoinMarketCapConnected(isCoinMarketCapConnected());
    setCoinMarketCapApiKey(getCoinMarketCapApiKey());
    
    // Test CoinGecko connection
    testCoinGeckoConnection().then(isConnected => {
      setCoinGeckoConnected(isConnected);
    });
  }, []);
  
  // Binance handlers
  const handleConnectBinance = async (apiKey: string, apiSecret?: string) => {
    if (!apiSecret) return;
    
    try {
      const success = await validateBinanceCredentials({
        apiKey,
        apiSecret
      });
      
      if (success) {
        setBinanceConnected(true);
        setBinanceCredentials({
          apiKey,
          apiSecret,
          isConnected: true,
          lastConnected: Date.now()
        });
        toast.success('התחברות לבינאנס הצליחה');
      } else {
        toast.error('התחברות לבינאנס נכשלה');
      }
    } catch (error) {
      toast.error('שגיאה בהתחברות לבינאנס');
    }
  };
  
  const handleDisconnectBinance = () => {
    disconnectBinance();
    setBinanceConnected(false);
    setBinanceCredentials(null);
  };
  
  // Twitter handlers
  const handleConnectTwitter = async (apiKey: string, apiSecret?: string) => {
    if (!apiSecret) return;
    
    try {
      const success = await validateTwitterCredentials(apiKey, apiSecret, "");
      
      if (success) {
        setTwitterConnected(true);
        setTwitterCredentials({
          apiKey,
          apiSecret,
          isConnected: true,
          lastConnected: Date.now()
        });
        toast.success('התחברות לטוויטר הצליחה');
      } else {
        toast.error('התחברות לטוויטר נכשלה');
      }
    } catch (error) {
      toast.error('שגיאה בהתחברות לטוויטר');
    }
  };
  
  const handleDisconnectTwitter = () => {
    disconnectTwitter();
    setTwitterConnected(false);
    setTwitterCredentials(null);
  };
  
  // CoinMarketCap handlers
  const handleConnectCoinMarketCap = (apiKey: string) => {
    try {
      const success = initializeCoinMarketCap(apiKey);
      
      if (success) {
        setCoinMarketCapConnected(true);
        setCoinMarketCapApiKey(apiKey);
        toast.success('התחברות ל-CoinMarketCap הצליחה');
      } else {
        toast.error('התחברות ל-CoinMarketCap נכשלה');
      }
    } catch (error) {
      toast.error('שגיאה בהתחברות ל-CoinMarketCap');
    }
  };
  
  const handleDisconnectCoinMarketCap = () => {
    localStorage.removeItem('coinmarketcap_api_key');
    setCoinMarketCapConnected(false);
    setCoinMarketCapApiKey(null);
    toast.info('החיבור ל-CoinMarketCap נותק');
  };

  return (
    <Container className="py-6">
      <h1 className="text-3xl font-bold mb-6 text-right">ניהול חיבורי API</h1>
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right">סטטוס חיבורים</CardTitle>
            <CardDescription className="text-right">מצב חיבורי ה-API הנוכחיים</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="text-lg font-medium mb-2">Binance</div>
                {binanceConnected ? (
                  <Badge variant="success" className="mx-auto">מחובר</Badge>
                ) : (
                  <Badge variant="destructive" className="mx-auto">לא מחובר</Badge>
                )}
              </div>
              
              <div className="border rounded-lg p-4 text-center">
                <div className="text-lg font-medium mb-2">Twitter</div>
                {twitterConnected ? (
                  <Badge variant="success" className="mx-auto">מחובר</Badge>
                ) : (
                  <Badge variant="destructive" className="mx-auto">לא מחובר</Badge>
                )}
              </div>
              
              <div className="border rounded-lg p-4 text-center">
                <div className="text-lg font-medium mb-2">CoinMarketCap</div>
                {coinMarketCapConnected ? (
                  <Badge variant="success" className="mx-auto">מחובר</Badge>
                ) : (
                  <Badge variant="destructive" className="mx-auto">לא מחובר</Badge>
                )}
              </div>
              
              <div className="border rounded-lg p-4 text-center">
                <div className="text-lg font-medium mb-2">CoinGecko</div>
                {coinGeckoConnected ? (
                  <Badge variant="success" className="mx-auto">מחובר</Badge>
                ) : (
                  <Badge variant="destructive" className="mx-auto">לא מחובר</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="binance">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="binance">Binance</TabsTrigger>
          <TabsTrigger value="twitter">Twitter</TabsTrigger>
          <TabsTrigger value="coinmarketcap">CoinMarketCap</TabsTrigger>
          <TabsTrigger value="coingecko">CoinGecko</TabsTrigger>
        </TabsList>
        
        <TabsContent value="binance">
          <ApiConnection
            title="Binance"
            description="חיבור למסחר ונתונים בזמן אמת מבורסת Binance"
            isConnected={binanceConnected}
            lastConnected={binanceCredentials?.lastConnected}
            apiKey={binanceCredentials?.apiKey}
            apiSecret={binanceCredentials?.apiSecret}
            onConnect={handleConnectBinance}
            onDisconnect={handleDisconnectBinance}
            onTest={testBinanceConnection}
            needsSecret={true}
            setupUrl="https://www.binance.com/en/my/settings/api-management"
            setupInstructions={
              <ol className="list-decimal list-inside space-y-2">
                <li>היכנס לחשבון ה-Binance שלך</li>
                <li>לך להגדרות API Management</li>
                <li>צור מפתח API חדש</li>
                <li>הגדר את הרשאות הקריאה והמסחר הנדרשות</li>
                <li>העתק את מפתח ה-API והסוד</li>
                <li>הזן אותם בטופס הנ"ל</li>
              </ol>
            }
          />
        </TabsContent>
        
        <TabsContent value="twitter">
          <ApiConnection
            title="Twitter (X)"
            description="חיבור לקבלת ציוצים ונתוני מדיה חברתית מטוויטר"
            isConnected={twitterConnected}
            lastConnected={twitterCredentials?.lastConnected}
            apiKey={twitterCredentials?.apiKey}
            apiSecret={twitterCredentials?.apiSecret}
            onConnect={handleConnectTwitter}
            onDisconnect={handleDisconnectTwitter}
            needsSecret={true}
            setupUrl="https://developer.twitter.com/en/portal/dashboard"
            setupInstructions={
              <ol className="list-decimal list-inside space-y-2">
                <li>צור חשבון פיתוח ב-Twitter Developer Portal</li>
                <li>צור פרויקט ואפליקציה חדשים</li>
                <li>הגדר את רמת הגישה הנדרשת (מומלץ Elevated)</li>
                <li>צור מפתחות OAuth וגישה</li>
                <li>העתק את מפתח הצרכן וסוד הצרכן</li>
                <li>הזן אותם בטופס הנ"ל</li>
              </ol>
            }
          />
        </TabsContent>
        
        <TabsContent value="coinmarketcap">
          <ApiConnection
            title="CoinMarketCap"
            description="חיבור לנתוני שוק, מטבעות ומגמות מ-CoinMarketCap"
            isConnected={coinMarketCapConnected}
            apiKey={coinMarketCapApiKey || undefined}
            onConnect={handleConnectCoinMarketCap}
            onDisconnect={handleDisconnectCoinMarketCap}
            needsSecret={false}
            setupUrl="https://coinmarketcap.com/api/pricing/"
            setupInstructions={
              <ol className="list-decimal list-inside space-y-2">
                <li>צור חשבון ב-CoinMarketCap</li>
                <li>הירשם לתוכנית Basic (חינמית) או מתקדמת יותר</li>
                <li>צור מפתח API חדש</li>
                <li>העתק את מפתח ה-API והזן אותו בטופס הנ"ל</li>
              </ol>
            }
          />
        </TabsContent>
        
        <TabsContent value="coingecko">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <Badge variant={coinGeckoConnected ? "success" : "secondary"} className="ml-2">
                  {coinGeckoConnected ? "מחובר" : "לא מחובר"}
                </Badge>
                <CardTitle className="text-right">CoinGecko</CardTitle>
              </div>
              <CardDescription className="text-right">
                חיבור לנתוני מטבעות קריפטו בזמן אמת ללא צורך במפתח API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-right mb-4">
                <p>CoinGecko מספק גישה ישירה למידע ללא צורך ברישום או קבלת מפתח API במגבלות מסוימות:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>עד 10-30 בקשות בדקה בגרסה החינמית</li>
                  <li>גישה לנתוני מחירים, היסטוריה ומטבעות</li>
                  <li>האתר מתעדכן באופן אוטומטי מדי 30 שניות</li>
                </ul>
                <p className="mt-2">לקבלת גבולות גבוהים יותר, ניתן לבדוק את <a href="https://www.coingecko.com/en/api/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">תוכניות ה-API המקצועיות</a>.</p>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={async () => {
                    const isConnected = await testCoinGeckoConnection();
                    setCoinGeckoConnected(isConnected);
                    if (isConnected) {
                      toast.success('החיבור ל-CoinGecko פעיל');
                    } else {
                      toast.error('החיבור ל-CoinGecko אינו פעיל');
                    }
                  }}
                >
                  <RefreshCw className="h-4 w-4 ml-2" />
                  בדוק חיבור
                </Button>
                
                <a
                  href="https://www.coingecko.com/en/api/documentation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  <ExternalLink className="h-4 w-4 ml-2" />
                  תיעוד ה-API
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default ApiConnections;
