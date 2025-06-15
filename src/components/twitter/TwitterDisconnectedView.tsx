
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Twitter, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { saveTwitterCredentials, validateTwitterCredentials } from '@/services/twitter/twitterService';
import { toast } from 'sonner';

interface TwitterDisconnectedViewProps {
  onConnect: () => void;
}

const TwitterDisconnectedView: React.FC<TwitterDisconnectedViewProps> = ({ onConnect }) => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [bearerToken, setBearerToken] = useState('');
  const [showSecrets, setShowSecrets] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!apiKey || !apiSecret || !bearerToken) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsConnecting(true);
    try {
      const credentials = { apiKey, apiSecret, bearerToken };
      
      // Validate credentials
      const isValid = await validateTwitterCredentials(credentials);
      if (!isValid) {
        toast.error('Invalid Twitter credentials');
        return;
      }

      // Save credentials
      saveTwitterCredentials(credentials);
      
      // Notify parent component
      onConnect();
      
      toast.success('Successfully connected to Twitter');
    } catch (error) {
      console.error('Error connecting to Twitter:', error);
      toast.error('Failed to connect to Twitter');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Twitter className="h-4 w-4" />
        <AlertDescription className="text-right">
          חבר את חשבון Twitter שלך כדי לקבל ניתוח סנטימנט בזמן אמת
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center justify-end gap-2">
            <Twitter className="h-5 w-5" />
            התחברות ל-Twitter API
          </CardTitle>
          <CardDescription className="text-right">
            הזן את פרטי ה-API שלך מ-Twitter Developer Portal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-right block">
              API Key
            </Label>
            <Input
              id="apiKey"
              type={showSecrets ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="הזן API Key"
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiSecret" className="text-right block">
              API Secret
            </Label>
            <Input
              id="apiSecret"
              type={showSecrets ? 'text' : 'password'}
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="הזן API Secret"
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bearerToken" className="text-right block">
              Bearer Token
            </Label>
            <Input
              id="bearerToken"
              type={showSecrets ? 'text' : 'password'}
              value={bearerToken}
              onChange={(e) => setBearerToken(e.target.value)}
              placeholder="הזן Bearer Token"
              className="text-right"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSecrets(!showSecrets)}
            >
              {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showSecrets ? 'הסתר' : 'הצג'}
            </Button>
          </div>

          <Button 
            onClick={handleConnect} 
            disabled={isConnecting || !apiKey || !apiSecret || !bearerToken}
            className="w-full"
          >
            {isConnecting ? 'מתחבר...' : 'התחבר ל-Twitter'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-right">איך לקבל מפתחות API?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-right">
          <p>1. היכנס ל-Twitter Developer Portal</p>
          <p>2. צור אפליקציה חדשה או השתמש באפליקציה קיימת</p>
          <p>3. עבור ל-Keys and Tokens</p>
          <p>4. העתק את API Key, API Secret ו-Bearer Token</p>
          
          <Button
            variant="outline"
            onClick={() => window.open('https://developer.twitter.com/en/portal/dashboard', '_blank')}
            className="w-full mt-4"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            פתח Twitter Developer Portal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwitterDisconnectedView;
