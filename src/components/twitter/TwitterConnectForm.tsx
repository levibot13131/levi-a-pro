
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Twitter, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { validateTwitterCredentials, isTwitterConnected, disconnectTwitter } from '@/services/twitter/twitterService';

const TwitterConnectForm: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [bearerToken, setBearerToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiSecretVisible, setApiSecretVisible] = useState(false);
  const [bearerTokenVisible, setBearerTokenVisible] = useState(false);
  
  const connected = isTwitterConnected();
  
  const handleConnect = async () => {
    if (!apiKey.trim() || !apiSecret.trim() || !bearerToken.trim()) {
      toast.error('נא למלא את כל השדות');
      return;
    }
    
    setIsConnecting(true);
    
    try {
      const success = await validateTwitterCredentials(apiKey, apiSecret, bearerToken);
      
      if (success) {
        toast.success('חיבור לטוויטר בוצע בהצלחה');
        setApiKey('');
        setApiSecret('');
        setBearerToken('');
      } else {
        toast.error('החיבור לטוויטר נכשל', {
          description: 'אנא בדוק את המפתחות שהזנת ונסה שנית'
        });
      }
    } catch (error) {
      toast.error('שגיאה בחיבור לטוויטר');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnect = () => {
    disconnectTwitter();
  };
  
  const toggleVisibility = (field: 'apiKey' | 'apiSecret' | 'bearerToken') => {
    if (field === 'apiKey') setApiKeyVisible(!apiKeyVisible);
    if (field === 'apiSecret') setApiSecretVisible(!apiSecretVisible);
    if (field === 'bearerToken') setBearerTokenVisible(!bearerTokenVisible);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            {connected ? (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                מחובר
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs font-medium flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                לא מחובר
              </span>
            )}
          </div>
          <CardTitle className="text-right flex items-center">
            <Twitter className="h-5 w-5 ml-2 text-blue-500" />
            חיבור ל-Twitter API
          </CardTitle>
        </div>
        <CardDescription className="text-right">
          חבר את המערכת ל-Twitter API לקבלת עדכונים וציוצים רלוונטיים
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {connected ? (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-right mr-4">
                המערכת מחוברת בהצלחה ל-Twitter API. כעת ניתן לקבל עדכונים וציוצים רלוונטיים.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={handleDisconnect} 
                className="w-40"
              >
                נתק
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-right block">API Key</Label>
              <div className="flex">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => toggleVisibility('apiKey')}
                  className="h-10 w-10"
                >
                  <Key className="h-4 w-4" />
                </Button>
                <Input
                  id="apiKey"
                  type={apiKeyVisible ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="text-right"
                  placeholder="הזן את ה-API Key שלך"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiSecret" className="text-right block">API Secret</Label>
              <div className="flex">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => toggleVisibility('apiSecret')}
                  className="h-10 w-10"
                >
                  <Key className="h-4 w-4" />
                </Button>
                <Input
                  id="apiSecret"
                  type={apiSecretVisible ? "text" : "password"}
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className="text-right"
                  placeholder="הזן את ה-API Secret שלך"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bearerToken" className="text-right block">Bearer Token</Label>
              <div className="flex">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => toggleVisibility('bearerToken')}
                  className="h-10 w-10"
                >
                  <Key className="h-4 w-4" />
                </Button>
                <Input
                  id="bearerToken"
                  type={bearerTokenVisible ? "text" : "password"}
                  value={bearerToken}
                  onChange={(e) => setBearerToken(e.target.value)}
                  className="text-right"
                  placeholder="הזן את ה-Bearer Token שלך"
                />
              </div>
            </div>
            
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-right">
                ניתן לקבל מפתחות Twitter API דרך פורטל המפתחים של Twitter. 
                הרשם ב-<a href="https://developer.twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">developer.twitter.com</a> וצור פרויקט חדש.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-center mt-4">
              <Button 
                onClick={handleConnect} 
                disabled={isConnecting || !apiKey || !apiSecret || !bearerToken}
                className="w-40"
              >
                {isConnecting ? (
                  <>טוען...</>
                ) : (
                  <>התחבר</>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwitterConnectForm;
