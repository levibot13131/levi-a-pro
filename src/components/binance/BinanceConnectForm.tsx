
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface BinanceConnectFormProps {
  onConnect: (apiKey: string, apiSecret: string) => void;
  isConnected: boolean;
  onDisconnect: () => void;
}

const BinanceConnectForm: React.FC<BinanceConnectFormProps> = ({
  onConnect,
  isConnected,
  onDisconnect
}) => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [autoTrade, setAutoTrade] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim() || !apiSecret.trim()) {
      toast.error('נא להזין מפתח API וסוד API');
      return;
    }
    
    onConnect(apiKey, apiSecret);
  };

  const handleDisconnect = () => {
    setApiKey('');
    setApiSecret('');
    onDisconnect();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">התחברות ל-Binance</CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Switch 
                id="auto-trade"
                checked={autoTrade}
                onCheckedChange={setAutoTrade}
              />
              <Label htmlFor="auto-trade" className="text-right">מסחר אוטומטי</Label>
            </div>
            
            <p className="text-sm text-muted-foreground text-right">
              כאשר מסחר אוטומטי מופעל, המערכת תבצע עסקאות באופן אוטומטי בהתאם לאיתותים.
            </p>
            
            <Button 
              variant="destructive"
              className="w-full mt-4"
              onClick={handleDisconnect}
            >
              נתק מ-Binance
            </Button>
          </div>
        ) : (
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
            
            <p className="text-sm text-muted-foreground text-right">
              מפתחות API משמשים לקריאת נתונים ולביצוע עסקאות. אנו ממליצים להשתמש במפתחות עם הרשאות קריאה בלבד.
            </p>
            
            <Button type="submit" className="w-full mt-4">
              התחבר ל-Binance
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default BinanceConnectForm;
