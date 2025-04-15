
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LogOut, Twitter } from 'lucide-react';
import { connectToTwitter, disconnectFromTwitter } from '@/services/twitter/twitterService';
import { toast } from 'sonner';

export interface TwitterConnectFormProps {
  isConnected: boolean;
  onDisconnect: () => void;
}

const TwitterConnectForm: React.FC<TwitterConnectFormProps> = ({ 
  isConnected,
  onDisconnect
}) => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [bearerToken, setBearerToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await connectToTwitter({
        apiKey,
        apiSecret,
        bearerToken,
      });
      
      if (success) {
        setApiKey('');
        setApiSecret('');
        setBearerToken('');
      }
    } catch (error) {
      toast.error('שגיאה בהתחברות לטוויטר');
      console.error('Error connecting to Twitter:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDisconnect = () => {
    disconnectFromTwitter();
    onDisconnect();
  };
  
  if (isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-right">מחובר לטוויטר</CardTitle>
          <CardDescription className="text-right">
            אתה מחובר כעת לחשבון הטוויטר שלך
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-right mb-4">
            המפתחות נשמרים מקומית במכשיר שלך ולא נשלחים לשרת.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="destructive" onClick={handleDisconnect}>
            <LogOut className="ml-2 h-4 w-4" />
            התנתק מטוויטר
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">התחבר לטוויטר</CardTitle>
        <CardDescription className="text-right">
          הזן את פרטי API של טוויטר שלך כדי להתחבר
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleConnect} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-right block">מפתח API</Label>
            <Input 
              id="api-key"
              placeholder="הזן את מפתח ה-API שלך"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              dir="ltr"
              className="text-left"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api-secret" className="text-right block">מפתח סודי של API</Label>
            <Input 
              id="api-secret"
              type="password"
              placeholder="הזן את המפתח הסודי של ה-API שלך"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              dir="ltr"
              className="text-left"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bearer-token" className="text-right block">Bearer Token</Label>
            <Input 
              id="bearer-token"
              type="password"
              placeholder="הזן את Bearer Token שלך"
              value={bearerToken}
              onChange={(e) => setBearerToken(e.target.value)}
              dir="ltr"
              className="text-left"
              required
            />
          </div>
          
          <p className="text-xs text-muted-foreground text-right">
            מפתחות אלו נשמרים מקומית במכשיר שלך בלבד ולא נשלחים לשום שרת.
            <a href="https://developer.twitter.com/en/portal/dashboard" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-primary hover:underline block"
            >
              למידע על איך להשיג את המפתחות, בקר בפורטל המפתחים של טוויטר
            </a>
          </p>
          
          <div className="pt-2 flex justify-end">
            <Button type="submit" disabled={isLoading}>
              <Twitter className="ml-2 h-4 w-4" />
              {isLoading ? 'מתחבר...' : 'התחבר לטוויטר'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TwitterConnectForm;
