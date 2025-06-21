
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Play, Pause, Plus, X, Send, TestTube } from 'lucide-react';
import { tradingEngine } from '@/services/trading/tradingEngine';
import { telegramBot } from '@/services/telegram/telegramBot';
import { useAuth } from '@/contexts/AuthContext';

// Authorized users list
const AUTHORIZED_USERS = [
  'almogahronov1997@gmail.com',
  'avraham.oron@gmail.com'
];

const TradingEngineControl = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [watchList, setWatchList] = useState<string[]>([]);
  const [newSymbol, setNewSymbol] = useState('');
  const [manualSignal, setManualSignal] = useState({
    symbol: '',
    action: 'buy' as 'buy' | 'sell',
    reasoning: ''
  });
  const [isTestingSend, setIsTestingSend] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    updateStatus();
  }, []);

  // Authorization check
  const isUserAuthorized = () => {
    return user?.email && AUTHORIZED_USERS.includes(user.email);
  };

  const updateStatus = () => {
    setIsRunning(tradingEngine.getIsRunning());
    setWatchList(tradingEngine.getWatchList());
  };

  const handleToggleEngine = async () => {
    if (!isUserAuthorized()) {
      toast.error('🚫 גישה מוגבלת - משתמש לא מורשה');
      return;
    }

    try {
      if (isRunning) {
        tradingEngine.stop();
      } else {
        await tradingEngine.start();
      }
      updateStatus();
    } catch (error) {
      toast.error('שגיאה בהפעלת/הפסקת המנוע');
    }
  };

  const handleAddSymbol = () => {
    if (!isUserAuthorized()) {
      toast.error('🚫 גישה מוגבלת - משתמש לא מורשה');
      return;
    }

    if (newSymbol && !watchList.includes(newSymbol.toUpperCase())) {
      tradingEngine.addToWatchList(newSymbol.toUpperCase());
      setNewSymbol('');
      updateStatus();
      toast.success(`${newSymbol.toUpperCase()} נוסף לרשימת המעקב`);
    }
  };

  const handleRemoveSymbol = (symbol: string) => {
    if (!isUserAuthorized()) {
      toast.error('🚫 גישה מוגבלת - משתמש לא מורשה');
      return;
    }

    tradingEngine.removeFromWatchList(symbol);
    updateStatus();
    toast.info(`${symbol} הוסר מרשימת המעקב`);
  };

  const handleManualSignal = async () => {
    if (!isUserAuthorized()) {
      toast.error('🚫 גישה מוגבלת - משתמש לא מורשה');
      return;
    }

    if (!manualSignal.symbol || !manualSignal.reasoning) {
      toast.error('נא למלא את כל השדות');
      return;
    }

    try {
      await tradingEngine.executeManualSignal(
        manualSignal.symbol.toUpperCase(),
        manualSignal.action,
        manualSignal.reasoning
      );
      
      setManualSignal({ symbol: '', action: 'buy', reasoning: '' });
      toast.success('✅ איתות ידני נוצר ונשלח בהצלחה');
    } catch (error) {
      toast.error('❌ שגיאה ביצירת איתות ידני');
    }
  };

  const handleTestTelegramSignal = async () => {
    if (!isUserAuthorized()) {
      toast.error('🚫 גישה מוגבלת - משתמש לא מורשה');
      return;
    }

    setIsTestingSend(true);
    try {
      console.log('🧪 Sending demo signal to Telegram...');
      const success = await telegramBot.sendSignalDemo();
      
      if (success) {
        toast.success('🎯 איתות בדיקה נשלח לטלגרם בהצלחה!');
      } else {
        toast.error('❌ שליחת איתות בדיקה נכשלה');
      }
    } catch (error) {
      console.error('Error sending demo signal:', error);
      toast.error('❌ שגיאה בשליחת איתות בדיקה');
    } finally {
      setIsTestingSend(false);
    }
  };

  const handleTestConnection = async () => {
    if (!isUserAuthorized()) {
      toast.error('🚫 גישה מוגבלת - משתמש לא מורשה');
      return;
    }

    try {
      const success = await telegramBot.sendTestMessage();
      if (success) {
        toast.success('✅ בדיקת חיבור הצליחה');
      }
    } catch (error) {
      toast.error('❌ שגיאה בבדיקת חיבור');
    }
  };

  // Show access denied if user not authorized
  if (!isUserAuthorized()) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600 text-center">🚫 גישה מוגבלת</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-red-600">המערכת מוגבלת למשתמשים מורשים בלבד</p>
            <p className="text-sm text-gray-600">
              משתמש נוכחי: {user?.email || 'לא מחובר'}
            </p>
            <p className="text-xs text-gray-500">
              אנא פנה למנהל המערכת לקבלת הרשאות
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Authorization Status */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="default" className="bg-green-600">
                ✅ משתמש מורשה
              </Badge>
              <p className="text-sm text-green-700 mt-1">{user?.email}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-800">סטטוס טלגרם</p>
              <Badge variant="outline" className="text-green-600">
                מחובר: {telegramBot.getConnectionStatus().chatId}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engine Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            🤖 בקרת מנוע המסחר
            <Badge variant={isRunning ? "default" : "secondary"}>
              {isRunning ? '🟢 פועל' : '🔴 כבוי'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleToggleEngine}
              variant={isRunning ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isRunning ? 'הפסק מנוע' : 'הפעל מנוע'}
            </Button>
            
            <div className="text-sm text-muted-foreground">
              📊 {watchList.length} נכסים במעקב
            </div>
          </div>

          {/* Telegram Test Buttons */}
          <div className="flex gap-2 pt-2 border-t">
            <Button 
              onClick={handleTestConnection} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
            >
              <Send className="h-4 w-4" />
              בדיקת חיבור טלגרם
            </Button>
            
            <Button 
              onClick={handleTestTelegramSignal} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              disabled={isTestingSend}
            >
              <TestTube className="h-4 w-4" />
              {isTestingSend ? 'שולח איתות...' : 'שלח איתות לבדיקה'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Watch List Management */}
      <Card>
        <CardHeader>
          <CardTitle>📈 ניהול רשימת מעקב</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="BTCUSDT"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSymbol()}
            />
            <Button onClick={handleAddSymbol} className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              הוסף
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {watchList.map((symbol) => (
              <Badge key={symbol} variant="outline" className="flex items-center gap-1">
                {symbol}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-red-500" 
                  onClick={() => handleRemoveSymbol(symbol)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manual Signal */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ איתות ידני</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>סימבול</Label>
              <Input
                placeholder="BTCUSDT"
                value={manualSignal.symbol}
                onChange={(e) => setManualSignal({
                  ...manualSignal,
                  symbol: e.target.value.toUpperCase()
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>פעולה</Label>
              <Select 
                value={manualSignal.action}
                onValueChange={(value: 'buy' | 'sell') => setManualSignal({
                  ...manualSignal,
                  action: value
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">🟢 קנייה</SelectItem>
                  <SelectItem value="sell">🔴 מכירה</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>נימוק ושיטות</Label>
            <Input
              placeholder="פריצה מעל התנגדות + RSI > 55 + נר engulfing..."
              value={manualSignal.reasoning}
              onChange={(e) => setManualSignal({
                ...manualSignal,
                reasoning: e.target.value
              })}
            />
          </div>
          
          <Button onClick={handleManualSignal} className="w-full">
            🚀 צור ושלח איתות ידני
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingEngineControl;
