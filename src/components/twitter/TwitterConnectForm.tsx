
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { connectToTwitter, disconnectFromTwitter } from '@/services/twitter/twitterService';
import { toast } from 'sonner';
import { Loader2, Info } from 'lucide-react';

interface TwitterConnectFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConnectSuccess: () => void;
}

const TwitterConnectForm: React.FC<TwitterConnectFormProps> = ({
  isOpen,
  onOpenChange,
  onConnectSuccess
}) => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [bearerToken, setBearerToken] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    if (!apiKey || !apiSecret || !bearerToken || !username) {
      toast.error('כל השדות נדרשים');
      return;
    }

    setIsLoading(true);
    try {
      const success = await connectToTwitter(apiKey, apiSecret, bearerToken, username);

      if (success) {
        onConnectSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      toast.error('שגיאה בתהליך ההתחברות', {
        description: 'אנא נסה שנית מאוחר יותר'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right">התחברות לטוויטר (Twitter)</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md mb-4">
          <Info className="text-blue-500 h-5 w-5 mr-2" />
          <p className="text-sm text-right">
            הגדר את פרטי הגישה ל-Twitter API כדי לקבל נתוני סנטימנט וטרנדים בזמן אמת.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="text-right">
            <Label htmlFor="username" className="block mb-1">שם משתמש Twitter</Label>
            <Input
              id="username"
              placeholder="הזן את שם המשתמש שלך בטוויטר"
              dir="ltr"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="text-right">
            <Label htmlFor="apiKey" className="block mb-1">API Key</Label>
            <Input
              id="apiKey"
              placeholder="הזן את מפתח ה-API"
              dir="ltr"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          
          <div className="text-right">
            <Label htmlFor="apiSecret" className="block mb-1">API Secret</Label>
            <Input
              id="apiSecret"
              placeholder="הזן את ה-API Secret"
              dir="ltr"
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
            />
          </div>
          
          <div className="text-right">
            <Label htmlFor="bearerToken" className="block mb-1">Bearer Token</Label>
            <Input
              id="bearerToken"
              placeholder="הזן את ה-Bearer Token"
              dir="ltr"
              type="password"
              value={bearerToken}
              onChange={(e) => setBearerToken(e.target.value)}
            />
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-1 text-right">
          פרטי ה-API נשמרים באופן מקומי בדפדפן שלך בלבד ולא נשלחים לשרתים חיצוניים.
        </p>
        
        <DialogFooter className="sm:justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            ביטול
          </Button>
          <Button 
            type="button"
            onClick={handleConnect}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                מתחבר...
              </>
            ) : (
              'התחבר'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TwitterConnectForm;
