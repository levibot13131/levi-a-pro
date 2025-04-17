
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Lock, Key, LogIn, LogOut } from 'lucide-react';
import { useBinanceConnection } from '@/hooks/use-binance-connection';
import { connectToBinance, disconnectBinance, testBinanceConnection } from '@/services/binance/binanceService';
import { toast } from 'sonner';

interface BinanceConnectButtonProps {
  onConnectSuccess?: () => void;
}

const BinanceConnectButton: React.FC<BinanceConnectButtonProps> = ({ onConnectSuccess }) => {
  const { isConnected, refreshConnection } = useBinanceConnection();
  const [showDialog, setShowDialog] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  
  const handleConnect = async () => {
    if (!apiKey || !apiSecret) {
      toast.error('שגיאה בהתחברות', {
        description: 'יש להזין מפתח API וסיסמה'
      });
      return;
    }
    
    setIsTesting(true);
    
    try {
      // Connect to Binance with credentials
      const success = await connectToBinance({
        apiKey,
        apiSecret,
        testnet: false
      });
      
      if (success) {
        // Test the connection
        const testResult = await testBinanceConnection();
        
        if (testResult) {
          toast.success('התחברות לבינאנס בוצעה בהצלחה');
          refreshConnection();
          setShowDialog(false);
          
          if (onConnectSuccess) {
            onConnectSuccess();
          }
        } else {
          toast.error('בדיקת חיבור נכשלה', {
            description: 'המפתחות שהוזנו אינם תקפים או שיש בעיה בחיבור'
          });
          disconnectBinance();
        }
      } else {
        toast.error('שגיאה בהתחברות לבינאנס');
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('שגיאה בהתחברות', {
        description: 'אירעה שגיאה בעת ההתחברות לבינאנס'
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  const handleDisconnect = () => {
    disconnectBinance();
    refreshConnection();
    toast.success('נותק מבינאנס בהצלחה');
  };
  
  // מילוי אוטומטי לסביבת פיתוח
  const fillTestCredentials = () => {
    setApiKey('demo_api_key_12345678901234567890');
    setApiSecret('demo_api_secret_12345678901234567890abcdefghijklmnopqrstuvwxyz');
    toast.info('מפתחות דמו הוזנו', {
      description: 'ניתן להשתמש במפתחות אלו לבדיקת המערכת'
    });
  };
  
  return (
    <>
      {isConnected ? (
        <Button 
          variant="outline"
          onClick={handleDisconnect}
          className="gap-1"
        >
          <LogOut className="h-4 w-4 ml-1" />
          התנתק מבינאנס
        </Button>
      ) : (
        <Button 
          onClick={() => setShowDialog(true)}
          className="gap-1"
        >
          <LogIn className="h-4 w-4 ml-1" />
          התחבר לבינאנס
        </Button>
      )}
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px] text-right">
          <DialogHeader>
            <DialogTitle>התחברות לחשבון Binance</DialogTitle>
            <DialogDescription>
              הזן את מפתחות ה-API של חשבון ה-Binance שלך כדי להתחבר.
              <div className="mt-2 text-xs text-muted-foreground">
                <span className="font-medium">הערה:</span> המפתחות נשמרים ברמה המקומית במכשיר שלך בלבד ולא נשלחים לשרת.
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="apiKey" className="text-right">מפתח API</Label>
              <div className="relative">
                <Input 
                  id="apiKey" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)} 
                  className="pl-10 text-left"
                  dir="ltr"
                />
                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="apiSecret" className="text-right">סיסמת API (Secret)</Label>
              <div className="relative">
                <Input 
                  id="apiSecret" 
                  value={apiSecret} 
                  onChange={(e) => setApiSecret(e.target.value)} 
                  className="pl-10 text-left"
                  dir="ltr"
                  type="password"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <Button 
              type="button"
              onClick={() => {
                setApiKey('demo_api_key_12345678901234567890');
                setApiSecret('demo_api_secret_12345678901234567890abcdefghijklmnopqrstuvwxyz');
                toast.info('מפתחות דמו הוזנו', {
                  description: 'ניתן להשתמש במפתחות אלו לבדיקת המערכת'
                });
              }}
              variant="ghost"
              size="sm"
              className="justify-start mt-1"
            >
              השתמש במפתחות דמו
            </Button>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleConnect} 
              disabled={!apiKey || !apiSecret || isTesting}
            >
              {isTesting ? 'בודק חיבור...' : 'התחבר'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BinanceConnectButton;
