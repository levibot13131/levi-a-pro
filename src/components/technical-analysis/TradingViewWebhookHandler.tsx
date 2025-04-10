
import React from 'react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WebhookSignal {
  id: string;
  timestamp: number;
  symbol: string;
  message: string;
  action: 'buy' | 'sell' | 'info';
  source: string;
}

const TradingViewWebhookHandler = () => {
  const [signals, setSignals] = useState<WebhookSignal[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // בסביבת הפיתוח, יוצרים סיגנלים מדומים לבדיקה
  useEffect(() => {
    // אינטרוול לשליחת איתותים מדומים כדי לדמות קבלת נתונים מטריידינגויו
    const mockInterval = setInterval(() => {
      if (Math.random() > 0.7) { // רק לפעמים מייצרים איתות
        const mockSignal: WebhookSignal = {
          id: `mock-${Date.now()}`,
          timestamp: Date.now(),
          symbol: ['BTC/USD', 'ETH/USD', 'AAPL', 'TSLA'][Math.floor(Math.random() * 4)],
          message: ['פריצה מעל ממוצע נע 200', 'RSI בקנייתיתר (72)', 'תבנית דוג׳י על גרף יומי', 'MACD עם חצייה למעלה'][Math.floor(Math.random() * 4)],
          action: Math.random() > 0.5 ? 'buy' : Math.random() > 0.3 ? 'sell' : 'info',
          source: 'TradingView Webhook'
        };
        
        processSignal(mockSignal);
      }
    }, 15000); // כל 15 שניות
    
    // מדמים חיבור מוצלח
    setTimeout(() => {
      setIsConnected(true);
      toast.success("התחברות לערוץ הסיגנלים בוצעה בהצלחה", {
        description: "המערכת מוכנה לקבל התראות מטריידינגויו"
      });
    }, 2000);
    
    return () => clearInterval(mockInterval);
  }, []);
  
  // טיפול בסיגנל חדש
  const processSignal = (signal: WebhookSignal) => {
    // הוספת הסיגנל לרשימה
    setSignals(prev => [signal, ...prev].slice(0, 100)); // שומרים רק 100 סיגנלים אחרונים
    
    // מציגים התראה
    const toastType = signal.action === 'buy' ? toast.success : 
                      signal.action === 'sell' ? toast.warning : 
                      toast.info;
    
    toastType(`${signal.symbol}: ${signal.message}`, {
      description: `מקור: ${signal.source}`,
      duration: 6000,
    });
    
    // כאן יהיה קוד לשליחת הסיגנל לטלגרם/וואטסאפ לפי הגדרות המשתמש
    console.log("שליחת סיגנל לערוצי התקשורת:", signal);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-right">סיגנלים מטריידינגויו</CardTitle>
        <Badge className={isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {isConnected ? "מחובר" : "מנותק"}
        </Badge>
      </CardHeader>
      <CardContent>
        {signals.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {signals.map(signal => (
                <div 
                  key={signal.id} 
                  className={`p-2 rounded border ${
                    signal.action === 'buy' 
                      ? 'bg-green-50 border-green-200' 
                      : signal.action === 'sell' 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <Badge 
                      className={
                        signal.action === 'buy' 
                          ? 'bg-green-100 text-green-800' 
                          : signal.action === 'sell' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                      }
                    >
                      {signal.action === 'buy' ? 'קנייה' : signal.action === 'sell' ? 'מכירה' : 'מידע'}
                    </Badge>
                    <span className="font-bold">{signal.symbol}</span>
                  </div>
                  <p className="mt-1 text-right">{signal.message}</p>
                  <div className="text-xs text-muted-foreground mt-1 text-right">
                    {new Date(signal.timestamp).toLocaleString('he-IL')}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>אין סיגנלים להצגה</p>
            <p className="text-sm">סיגנלים חדשים מטריידינגויו יופיעו כאן</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingViewWebhookHandler;
