
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Settings, 
  Link as LinkIcon, 
  Save, 
  Trash2, 
  RefreshCw,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { getProxyConfig, setProxyConfig, clearProxyConfig } from '@/services/proxy/proxyConfig';
import axios from 'axios';

const ProxySettings = () => {
  const [proxyUrl, setProxyUrl] = useState(getProxyConfig().baseUrl);
  const [proxyEnabled, setProxyEnabled] = useState(getProxyConfig().isEnabled);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'success' | 'error'>('none');

  const handleSaveProxy = () => {
    if (proxyEnabled && !proxyUrl.trim()) {
      toast.error('אנא הזן כתובת פרוקסי תקפה');
      return;
    }

    setProxyConfig({
      baseUrl: proxyUrl.trim(),
      isEnabled: proxyEnabled
    });
  };

  const handleClearProxy = () => {
    clearProxyConfig();
    setProxyUrl('');
    setProxyEnabled(false);
    setConnectionStatus('none');
  };

  const testProxyConnection = async () => {
    if (!proxyUrl.trim()) {
      toast.error('אנא הזן כתובת פרוקסי לבדיקה');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('none');

    try {
      const response = await axios.get(`${proxyUrl.trim()}/ping`, { timeout: 5000 });
      
      if (response.status === 200) {
        setConnectionStatus('success');
        toast.success('חיבור לפרוקסי פעיל ותקין');
      } else {
        setConnectionStatus('error');
        toast.error('שגיאה בחיבור לפרוקסי');
      }
    } catch (error) {
      console.error('Error testing proxy connection:', error);
      setConnectionStatus('error');
      
      // בסביבת פיתוח, נאפשר להמשיך גם אם החיבור נכשל
      const isProduction = window.location.hostname.includes('lovable.app');
      if (!isProduction) {
        toast.warning('פרוקסי לא מגיב, אך מותר במצב פיתוח');
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
                  placeholder="לדוגמה: https://your-proxy-url.ngrok.io"
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
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <AlertTitle className="text-right">החיבור לפרוקסי תקין</AlertTitle>
                  </div>
                  <AlertDescription className="text-right mt-2">
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
                  </AlertDescription>
                </Alert>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProxySettings;
