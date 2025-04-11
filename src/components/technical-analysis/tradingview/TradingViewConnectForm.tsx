
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { validateTradingViewCredentials } from '@/services/tradingView/tradingViewAuthService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface TradingViewConnectFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConnectSuccess: () => void;
}

const TradingViewConnectForm: React.FC<TradingViewConnectFormProps> = ({
  isOpen,
  onOpenChange,
  onConnectSuccess
}) => {
  const [username, setUsername] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    if (!username.trim() || !apiKey.trim()) {
      toast.error('אנא הזן את כל פרטי ההתחברות');
      return;
    }

    setIsLoading(true);
    try {
      const isValid = await validateTradingViewCredentials({
        username: username.trim(),
        apiKey: apiKey.trim()
      });

      if (isValid) {
        onConnectSuccess();
        onOpenChange(false);
      } else {
        toast.error('הפרטים שהוזנו אינם תקינים', {
          description: 'אנא וודא שהזנת שם משתמש ומפתח API תקינים'
        });
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
          <DialogTitle className="text-right">התחברות ל-TradingView</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="text-right">
            <Label htmlFor="username" className="block mb-1">שם משתמש TradingView</Label>
            <Input
              id="username"
              placeholder="הזן את שם המשתמש שלך ב-TradingView"
              dir="ltr"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="text-right">
            <Label htmlFor="apiKey" className="block mb-1">מפתח API</Label>
            <Input
              id="apiKey"
              placeholder="הזן את מפתח ה-API שלך"
              dir="ltr"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              ניתן למצוא את מפתח ה-API בהגדרות החשבון שלך ב-TradingView
            </p>
          </div>
        </div>
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

export default TradingViewConnectForm;
