
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { validateTradingViewCredentials } from '@/services/tradingView/tradingViewAuthService';
import { toast } from 'sonner';
import { Loader2, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'apikey'>('password');

  const handleConnect = async () => {
    if (!username.trim()) {
      toast.error('אנא הזן את שם המשתמש שלך');
      return;
    }

    if (loginMethod === 'password' && !password.trim()) {
      toast.error('אנא הזן את הסיסמה שלך');
      return;
    }

    if (loginMethod === 'apikey' && !apiKey.trim()) {
      toast.error('אנא הזן את מפתח ה-API שלך');
      return;
    }

    setIsLoading(true);
    try {
      const credentials = loginMethod === 'password' 
        ? { username: username.trim(), password: password.trim() }
        : { username: username.trim(), apiKey: apiKey.trim() };
      
      const isValid = await validateTradingViewCredentials(credentials);

      if (isValid) {
        onConnectSuccess();
        onOpenChange(false);
        
        // הודעה על סימולציה בסביבת פיתוח
        toast.info('המערכת פועלת במצב סימולציה', { 
          description: 'החיבור לTradingView הוא סימולציה בסביבת פיתוח. בסביבת הייצור, ההתחברות תהיה אמיתית.',
          duration: 8000
        });
      } else {
        toast.error('הפרטים שהוזנו אינם תקינים', {
          description: 'אנא וודא שהזנת פרטים תקינים'
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
        
        <div className="flex items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md mb-4">
          <Info className="text-blue-500 h-5 w-5 mr-2" />
          <p className="text-sm text-right">
            חיבור זה פועל במצב סימולציה בסביבת פיתוח. בסביבת הייצור, התחברות אמיתית תאפשר שליחה וקבלה של איתותים.
          </p>
        </div>
        
        <Tabs defaultValue="password" value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'password' | 'apikey')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password">התחברות עם סיסמה</TabsTrigger>
            <TabsTrigger value="apikey">התחברות עם API Key</TabsTrigger>
          </TabsList>
          
          <TabsContent value="password" className="space-y-4 py-2">
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
              <Label htmlFor="password" className="block mb-1">סיסמה</Label>
              <Input
                id="password"
                placeholder="הזן את הסיסמה שלך"
                dir="ltr"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                בסביבת פיתוח, הסיסמה לא נשלחת לשום מקום ומשמשת להדגמה בלבד
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="apikey" className="space-y-4 py-2">
            <div className="text-right">
              <Label htmlFor="username-api" className="block mb-1">שם משתמש TradingView</Label>
              <Input
                id="username-api"
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
          </TabsContent>
        </Tabs>
        
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
