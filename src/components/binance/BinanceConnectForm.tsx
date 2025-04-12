
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateBinanceCredentials } from '@/services/binance/binanceService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface BinanceConnectFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConnectSuccess?: () => void;
}

const BinanceConnectForm: React.FC<BinanceConnectFormProps> = ({
  isOpen,
  onOpenChange,
  onConnectSuccess
}) => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim() || !apiSecret.trim()) {
      toast.error('אנא הזן מפתח API וסיסמה', {
        description: 'שני השדות הם חובה'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('מתחבר לחשבון בינאנס...', { apiKeyLength: apiKey.length, apiSecretLength: apiSecret.length });
      
      const success = await validateBinanceCredentials(apiKey, apiSecret);
      
      if (success) {
        toast.success('התחברת בהצלחה לבינאנס', {
          description: 'המפתחות נשמרו מקומית במכשיר שלך. הנתונים יתחילו להתעדכן בקרוב.'
        });
        
        // reset form
        setApiKey('');
        setApiSecret('');
        onOpenChange(false);
        
        // notify parent component
        if (onConnectSuccess) {
          onConnectSuccess();
        }
        
        // בדיקת חיבור מיידית
        console.log('בודק חיבור לבינאנס...');
        // כאן אפשר להוסיף קריאה לפונקציה שתבדוק את החיבור
      } else {
        toast.error('החיבור לבינאנס נכשל', {
          description: 'ייתכן שהמפתחות שהזנת אינם תקינים. אנא נסה שוב.'
        });
      }
    } catch (error) {
      console.error('שגיאה בחיבור לבינאנס:', error);
      toast.error('שגיאה בחיבור לבינאנס', {
        description: 'אירעה שגיאה בעת ניסיון להתחבר. אנא נסה שוב.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-right">התחברות לחשבון בינאנס</DialogTitle>
            <DialogDescription className="text-right">
              הזן את מפתחות ה-API של חשבון הבינאנס שלך.
              <br />
              המפתחות נשמרים מקומית במכשיר שלך בלבד.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="apiKey" className="text-right">Binance API Key</Label>
              <Input
                id="apiKey"
                placeholder="הזן את מפתח ה-API שלך"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="text-left dir-ltr"
                autoComplete="off"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="apiSecret" className="text-right">Binance API Secret</Label>
              <Input
                id="apiSecret"
                placeholder="הזן את ה-Secret של ה-API שלך"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                className="text-left dir-ltr"
                type="password"
                autoComplete="off"
                required
              />
            </div>
            
            <p className="text-sm text-muted-foreground text-right">
              שים לב: צור מפתח API בהגדרות בינאנס עם הרשאות קריאה בלבד לבטיחות מרבית.
            </p>
          </div>
          
          <DialogFooter className="flex sm:justify-start">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              ביטול
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  מתחבר...
                </>
              ) : (
                'התחבר'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BinanceConnectForm;
