
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Code } from '@/components/ui/code';
import { 
  Settings, 
  Link as LinkIcon, 
  Save, 
  Trash2, 
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Terminal,
  Server
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  getProxyConfig, 
  setProxyConfig, 
  clearProxyConfig, 
  testProxyConnection,
  initializeProxySettings 
} from '@/services/proxy/proxyConfig';
import axios from 'axios';

const ProxySettings = () => {
  const [proxyUrl, setProxyUrl] = useState(getProxyConfig().baseUrl);
  const [proxyEnabled, setProxyEnabled] = useState(getProxyConfig().isEnabled);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'success' | 'error'>('none');
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  
  // Initialize from the environment or storage on page load
  useEffect(() => {
    initializeProxySettings();
    const config = getProxyConfig();
    setProxyUrl(config.baseUrl);
    setProxyEnabled(config.isEnabled);
    
    // Test connection on load if proxy is enabled
    if (config.isEnabled && config.baseUrl) {
      setTimeout(() => {
        testProxyConnection()
          .then(success => {
            setConnectionStatus(success ? 'success' : 'error');
          })
          .catch(() => {
            setConnectionStatus('error');
          });
      }, 1000);
    }
  }, []);

  const addDiagnosticLog = (message: string) => {
    setDiagnosticLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleSaveProxy = () => {
    if (proxyEnabled && !proxyUrl.trim()) {
      toast.error('אנא הזן כתובת פרוקסי תקפה');
      return;
    }

    // Ensure the URL includes protocol
    let finalUrl = proxyUrl.trim();
    if (proxyEnabled && finalUrl && !finalUrl.startsWith('http')) {
      finalUrl = `https://${finalUrl}`;
      setProxyUrl(finalUrl);
    }

    setProxyConfig({
      baseUrl: finalUrl,
      isEnabled: proxyEnabled
    });
    
    // Dispatch config change event
    window.dispatchEvent(new CustomEvent('proxy-config-changed'));
    
    toast.success('הגדרות הפרוקסי נשמרו בהצלחה');
    addDiagnosticLog(`Proxy settings saved: ${finalUrl} (${proxyEnabled ? 'enabled' : 'disabled'})`);
    
    // Test the connection after saving
    if (proxyEnabled && finalUrl) {
      setTimeout(() => testProxyConnection(), 500);
    }
  };

  const handleClearProxy = () => {
    clearProxyConfig();
    setProxyUrl('');
    setProxyEnabled(false);
    setConnectionStatus('none');
    setDiagnosticLogs([]);
    window.dispatchEvent(new CustomEvent('proxy-config-changed'));
    addDiagnosticLog('Proxy settings cleared');
  };

  const testProxyConnection = async () => {
    if (!proxyUrl.trim()) {
      toast.error('אנא הזן כתובת פרוקסי לבדיקה');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('none');
    
    // Clean up the URL
    let testUrl = proxyUrl.trim();
    if (!testUrl.startsWith('http')) {
      testUrl = `https://${testUrl}`;
    }
    if (testUrl.endsWith('/')) {
      testUrl = testUrl.slice(0, -1);
    }
    
    addDiagnosticLog(`Testing connection to ${testUrl}...`);

    try {
      // Try multiple test methods sequentially
      let success = false;
      
      // Method 1: /ping endpoint
      try {
        addDiagnosticLog(`Trying /ping endpoint...`);
        const pingResponse = await axios.get(`${testUrl}/ping`, { 
          timeout: 8000,
          headers: { 'Accept': 'application/json' }
        });
        
        addDiagnosticLog(`Ping response: ${pingResponse.status} ${JSON.stringify(pingResponse.data)}`);
        if (pingResponse.status === 200) {
          success = true;
        }
      } catch (pingError) {
        addDiagnosticLog(`Ping failed: ${(pingError as Error).message}`);
      }
      
      // Method 2: HEAD request to root
      if (!success) {
        try {
          addDiagnosticLog(`Trying HEAD request...`);
          const headResponse = await axios.head(testUrl, { timeout: 8000 });
          addDiagnosticLog(`HEAD response: ${headResponse.status}`);
          if (headResponse.status === 200 || headResponse.status === 204) {
            success = true;
          }
        } catch (headError) {
          addDiagnosticLog(`HEAD failed: ${(headError as Error).message}`);
        }
      }
      
      // Method 3: OPTIONS request for CORS check
      if (!success) {
        try {
          addDiagnosticLog(`Trying OPTIONS request...`);
          const optionsResponse = await axios.options(testUrl, { 
            timeout: 8000,
            headers: { 'Access-Control-Request-Method': 'GET' }
          });
          addDiagnosticLog(`OPTIONS response: ${optionsResponse.status}`);
          if (optionsResponse.status === 200 || optionsResponse.status === 204) {
            success = true;
          }
        } catch (optionsError) {
          addDiagnosticLog(`OPTIONS failed: ${(optionsError as Error).message}`);
        }
      }
      
      // Update connection status
      setConnectionStatus(success ? 'success' : 'error');
      
      if (success) {
        toast.success('חיבור לפרוקסי פעיל ותקין');
        addDiagnosticLog('Connection test successful');
      } else {
        // In development, allow failing tests
        const isProduction = process.env.NODE_ENV === 'production';
        if (!isProduction) {
          toast.warning('פרוקסי לא מגיב, אך מותר במצב פיתוח. ניתן להמשיך בהגדרות.');
          addDiagnosticLog('Connection failed, but allowed in development mode');
        } else {
          toast.error('שגיאה בחיבור לפרוקסי, בדוק את הכתובת והזמינות');
          addDiagnosticLog('Connection test failed');
        }
      }
    } catch (error) {
      console.error('Error testing proxy connection:', error);
      setConnectionStatus('error');
      addDiagnosticLog(`Connection test error: ${(error as Error).message}`);
      
      // In development, allow failing tests
      const isProduction = process.env.NODE_ENV === 'production';
      if (!isProduction) {
        toast.warning('פרוקסי לא מגיב, אך מותר במצב פיתוח. ניתן להמשיך בהגדרות.');
      } else {
        toast.error('שגיאה בחיבור לפרוקסי, בדוק את הכתובת והזמינות');
      }
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" asChild>
          <Link to="/admin/advanced-settings">
            <Settings className="mr-2 h-4 w-4" />
            חזרה להגדרות מתקדמות
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">הגדרות פרוקסי</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">הגדרת פרוקסי</CardTitle>
              <CardDescription className="text-right">
                הגדר את כתובת הפרוקסי לתקשורת עם שירותים חיצוניים
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Switch 
                  checked={proxyEnabled}
                  onCheckedChange={setProxyEnabled}
                  id="proxy-enable"
                />
                <label htmlFor="proxy-enable" className="text-sm font-medium cursor-pointer">
                  הפעל פרוקסי
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium block text-right">כתובת פרוקסי (מלאה כולל http/https)</label>
                <Input
                  placeholder="לדוגמה: https://tuition-colony-climb-gently.trycloudflare.com"
                  value={proxyUrl}
                  onChange={(e) => setProxyUrl(e.target.value)}
                  dir="ltr"
                  className="text-left"
                  disabled={!proxyEnabled}
                />
                <p className="text-xs text-muted-foreground text-right">
                  כתובת מלאה של שרת הפרוקסי, כולל פרוטוקול (http:// או https://)
                </p>
              </div>

              <Separator />

              <div className="flex flex-wrap gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={handleClearProxy}
                  size="sm"
                >
                  <Trash2 className="ml-2 h-4 w-4" />
                  נקה הגדרות
                </Button>
                <Button 
                  variant="outline" 
                  onClick={testProxyConnection}
                  size="sm"
                  disabled={isTestingConnection || !proxyUrl.trim()}
                >
                  <RefreshCw className={`ml-2 h-4 w-4 ${isTestingConnection ? 'animate-spin' : ''}`} />
                  בדוק חיבור
                </Button>
                <Button 
                  onClick={handleSaveProxy}
                  size="sm"
                  disabled={proxyEnabled && !proxyUrl.trim()}
                >
                  <Save className="ml-2 h-4 w-4" />
                  שמור הגדרות
                </Button>
              </div>

              {connectionStatus === 'success' && (
                <Alert variant="default" className="bg-green-50 text-green-900 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                  <AlertTitle className="text-right">החיבור לפרוקסי תקין</AlertTitle>
                  <AlertDescription className="text-right mt-2">
                    פרוקסי עם כתובת {proxyUrl} פעיל ועובד כראוי. 
                    ניתן להשתמש בפרוקסי זה לתקשורת עם שירותים חיצוניים.
                  </AlertDescription>
                </Alert>
              )}

              {connectionStatus === 'error' && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4 ml-2" />
                  <AlertTitle className="text-right">שגיאה בחיבור לפרוקסי</AlertTitle>
                  <AlertDescription className="text-right mt-2">
                    לא ניתן להתחבר לפרוקסי בכתובת שסופקה. אנא בדוק את הכתובת והאם הפרוקסי פעיל.
                    <br />
                    בדוק שה-CORS מוגדר נכון בצד השרת ושהוא מאפשר בקשות מהדומיין הזה.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Diagnostic logs */}
              {diagnosticLogs.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setDiagnosticLogs([])}
                    >
                      נקה לוגים
                    </Button>
                    <h3 className="text-sm font-medium">לוגים אבחוניים</h3>
                  </div>
                  <Code className="text-xs overflow-auto h-40 dir-ltr">
                    {diagnosticLogs.map((log, index) => (
                      <div key={index} className="whitespace-pre-wrap">{log}</div>
                    ))}
                  </Code>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-right">מידע על פרוקסי</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-right">
                פרוקסי מאפשר לאפליקציה להתחבר לשירותים חיצוניים כמו Binance, CoinGecko וטלגרם דרך שרת מתווך.
              </p>
              
              <div className="text-sm space-y-2">
                <h3 className="font-medium text-right">יתרונות השימוש בפרוקסי:</h3>
                <ul className="list-disc list-inside space-y-1 text-right">
                  <li>עוקף מגבלות CORS</li>
                  <li>מסתיר מפתחות API ומידע רגיש</li>
                  <li>מאפשר חיבור לשירותים חיצוניים</li>
                  <li>מחזק את האבטחה באפליקציה</li>
                </ul>
              </div>

              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/proxy-guide">
                  <ExternalLink className="ml-2 h-4 w-4" />
                  מדריך מפורט להגדרת פרוקסי
                </Link>
              </Button>
              
              <Button variant="outline" size="sm" className="w-full flex items-center" onClick={() => {
                window.open('https://tuition-colony-climb-gently.trycloudflare.com/ping', '_blank');
              }}>
                <Terminal className="ml-2 h-4 w-4" />
                בדוק את נקודת הקצה /ping
              </Button>
              
              <Button variant="outline" size="sm" className="w-full flex items-center" onClick={() => {
                navigator.clipboard.writeText('https://tuition-colony-climb-gently.trycloudflare.com');
                toast.success('כתובת הפרוקסי הועתקה');
              }}>
                <Server className="ml-2 h-4 w-4" />
                העתק כתובת Cloudflare
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-right">סטטוס נוכחי</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={proxyEnabled ? 'text-green-500' : 'text-red-500'}>
                    {proxyEnabled ? 'פעיל' : 'לא פעיל'}
                  </span>
                  <span className="font-medium">סטטוס פרוקסי:</span>
                </div>
                {proxyEnabled && proxyUrl && (
                  <div className="flex flex-col text-xs mt-2">
                    <span className="text-right font-medium">כתובת נוכחית:</span>
                    <code className="bg-muted p-1 rounded mt-1 text-left break-all">{proxyUrl}</code>
                  </div>
                )}
                <div className="flex justify-between items-center mt-2">
                  <span className={connectionStatus === 'success' ? 'text-green-500' : 'text-red-500'}>
                    {connectionStatus === 'success' ? 'תקין' : connectionStatus === 'error' ? 'בעיה' : 'לא נבדק'}
                  </span>
                  <span className="font-medium">בדיקת חיבור:</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProxySettings;

