
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader, MessageCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { connectToTwitter, disconnectFromTwitter } from '@/services/twitter/twitterService';

interface TwitterConnectFormProps {
  onConnect: () => void;
  isConnected: boolean;
  onDisconnect: () => void;
}

const TwitterConnectForm: React.FC<TwitterConnectFormProps> = ({
  onConnect,
  isConnected,
  onDisconnect
}) => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [accessTokenSecret, setAccessTokenSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoAnalysis, setAutoAnalysis] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey || !apiSecret) {
      toast.error('נא להזין לפחות מפתח API וסוד API');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await connectToTwitter({
        apiKey,
        apiSecret,
        accessToken,
        accessTokenSecret
      });
      
      if (success) {
        onConnect();
        toast.success('התחברות לטוויטר הצליחה');
      } else {
        toast.error('שגיאה בהתחברות לטוויטר');
      }
    } catch (error) {
      console.error('Error connecting to Twitter:', error);
      toast.error('שגיאה בהתחברות לטוויטר');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectFromTwitter();
      onDisconnect();
      setAutoAnalysis(false);
      toast.info('החיבור לטוויטר נותק');
    } catch (error) {
      console.error('Error disconnecting from Twitter:', error);
      toast.error('שגיאה בניתוק מטוויטר');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        {isConnected ? (
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Switch 
                  id="auto-analysis"
                  checked={autoAnalysis}
                  onCheckedChange={setAutoAnalysis}
                />
                <Label htmlFor="auto-analysis" className="text-right">ניתוח אוטומטי</Label>
              </div>
              
              <p className="text-sm text-muted-foreground text-right">
                כאשר ניתוח אוטומטי מופעל, המערכת תנתח מגמות וסנטימנט בזמן אמת ותיצור התראות לפי הצורך.
              </p>
              
              <Button 
                variant="destructive"
                className="w-full mt-4"
                onClick={handleDisconnect}
              >
                נתק מטוויטר
              </Button>
            </div>
          </CardContent>
        ) : (
          <div>
            <CardHeader>
              <CardTitle className="text-right">התחברות לטוויטר</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key" className="text-right block">מפתח API</Label>
                  <Input
                    id="api-key"
                    type="text"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="הזן את מפתח ה-API שלך"
                    className="text-left"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-secret" className="text-right block">סוד API</Label>
                  <Input
                    id="api-secret"
                    type="password"
                    value={apiSecret}
                    onChange={e => setApiSecret(e.target.value)}
                    placeholder="הזן את סוד ה-API שלך"
                    className="text-left"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="access-token" className="text-right block">אסימון גישה (אופציונלי)</Label>
                  <Input
                    id="access-token"
                    type="text"
                    value={accessToken}
                    onChange={e => setAccessToken(e.target.value)}
                    placeholder="הזן את אסימון הגישה"
                    className="text-left"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="access-token-secret" className="text-right block">סוד אסימון גישה (אופציונלי)</Label>
                  <Input
                    id="access-token-secret"
                    type="password"
                    value={accessTokenSecret}
                    onChange={e => setAccessTokenSecret(e.target.value)}
                    placeholder="הזן את סוד אסימון הגישה"
                    className="text-left"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      מתחבר...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      התחבר לטוויטר
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </div>
        )}
      </Card>
      
      <Card className="bg-muted/40">
        <CardHeader>
          <CardTitle className="text-right">הנחיות חיבור לטוויטר</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal list-inside space-y-2 text-right">
            <li>היכנס ל<a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">פורטל המפתחים של טוויטר</a></li>
            <li>צור פרויקט חדש ואפליקציה</li>
            <li>וודא שהאפליקציה מוגדרת עם הרשאות קריאה (Read)</li>
            <li>העתק את ה-API Key וה-API Secret</li>
            <li>אם נדרש, צור גם את ה-Access Token וה-Access Token Secret</li>
          </ol>
          
          <div className="bg-primary/10 p-3 rounded-md text-right">
            <p className="text-sm">
              <strong>שים לב:</strong> המפתחות נשמרים בדפדפן שלך בלבד ולא נשלחים לשרת.
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" size="sm" asChild className="mt-2">
              <a href="https://developer.twitter.com/en/docs/twitter-api" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                תיעוד Twitter API
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwitterConnectForm;
