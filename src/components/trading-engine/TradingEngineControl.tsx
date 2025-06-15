
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Play, Pause, Plus, X } from 'lucide-react';
import { tradingEngine } from '@/services/trading/tradingEngine';

const TradingEngineControl = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [watchList, setWatchList] = useState<string[]>([]);
  const [newSymbol, setNewSymbol] = useState('');
  const [manualSignal, setManualSignal] = useState({
    symbol: '',
    action: 'buy' as 'buy' | 'sell',
    reasoning: ''
  });

  useEffect(() => {
    updateStatus();
  }, []);

  const updateStatus = () => {
    setIsRunning(tradingEngine.getIsRunning());
    setWatchList(tradingEngine.getWatchList());
  };

  const handleToggleEngine = async () => {
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
    if (newSymbol && !watchList.includes(newSymbol.toUpperCase())) {
      tradingEngine.addToWatchList(newSymbol.toUpperCase());
      setNewSymbol('');
      updateStatus();
      toast.success(`${newSymbol.toUpperCase()} נוסף לרשימת המעקב`);
    }
  };

  const handleRemoveSymbol = (symbol: string) => {
    tradingEngine.removeFromWatchList(symbol);
    updateStatus();
    toast.info(`${symbol} הוסר מרשימת המעקב`);
  };

  const handleManualSignal = async () => {
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
      toast.success('איתות ידני נוצר בהצלחה');
    } catch (error) {
      toast.error('שגיאה ביצירת איתות ידני');
    }
  };

  return (
    <div className="space-y-6">
      {/* Engine Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            בקרת מנוע המסחר
            <Badge variant={isRunning ? "default" : "secondary"}>
              {isRunning ? 'פועל' : 'כבוי'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              {watchList.length} נכסים במעקב
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Watch List Management */}
      <Card>
        <CardHeader>
          <CardTitle>ניהול רשימת מעקב</CardTitle>
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
          <CardTitle>איתות ידני</CardTitle>
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
                  <SelectItem value="buy">קנייה</SelectItem>
                  <SelectItem value="sell">מכירה</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>נימוק</Label>
            <Input
              placeholder="תיאור הסיבה לאיתות..."
              value={manualSignal.reasoning}
              onChange={(e) => setManualSignal({
                ...manualSignal,
                reasoning: e.target.value
              })}
            />
          </div>
          
          <Button onClick={handleManualSignal} className="w-full">
            צור איתות ידני
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingEngineControl;
