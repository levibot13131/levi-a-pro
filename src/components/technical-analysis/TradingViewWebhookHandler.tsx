
import React from 'react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Lightbulb, AlertTriangle, ExternalLink, Copy } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface WebhookSignal {
  id: string;
  timestamp: number;
  symbol: string;
  message: string;
  action: 'buy' | 'sell' | 'info';
  source: string;
  details?: string;
}

const TradingViewWebhookHandler = () => {
  const [signals, setSignals] = useState<WebhookSignal[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://your-app.com/api/tradingview-webhook');
  
  // בסביבת הפיתוח, יוצרים סיגנלים מדומים לבדיקה
  useEffect(() => {
    // אינטרוול לשליחת איתותים מדומים כדי לדמות קבלת נתונים מטריידינגויו
    const mockInterval = setInterval(() => {
      if (Math.random() > 0.7) { // רק לפעמים מייצרים איתות
        const signalType = Math.random() > 0.5 ? 'buy' : Math.random() > 0.3 ? 'sell' : 'info';
        const symbols = ['BTC/USD', 'ETH/USD', 'AAPL', 'TSLA', 'AMZN', 'GOLD', 'S&P500'];
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        
        let message = '';
        let details = '';
        
        if (signalType === 'buy') {
          const buyMessages = [
            'פריצה מעל ממוצע נע 200',
            'RSI יצא מאזור קנייתיתר (28)',
            'תבנית דוג׳י על גרף יומי',
            'MACD עם חצייה למעלה',
            'פריצת התנגדות משמעותית',
            'Bollinger Bands squeeze עם פריצה למעלה'
          ];
          message = buyMessages[Math.floor(Math.random() * buyMessages.length)];
          
          // הוספת פרטים נוספים
          if (message.includes('ממוצע נע')) {
            details = 'המחיר פרץ מעל ממוצע נע 200, מה שמצביע על מגמה עולה חזקה. זהו אחד האינדיקטורים המשמעותיים ביותר למגמה ארוכת טווח. מומלץ לשקול פוזיציית קנייה עם סטופ לוס מתחת לממוצע הנע.';
          } else if (message.includes('RSI')) {
            details = 'ה-RSI יצא מאזור קנייתיתר, מה שמצביע על סיום תקופת מכירת יתר והתחלה של מומנטום חיובי חדש. זוהי נקודת כניסה אפשרית לפוזיציית קנייה.';
          } else if (message.includes('MACD')) {
            details = 'ה-MACD חצה את קו האיתות כלפי מעלה, מה שמצביע על תחילתה של מגמה עולה. זהו סיגנל קנייה קלאסי בניתוח טכני.';
          } else {
            details = 'זוהה סיגנל קנייה טכני. בדוק את הגרף למידע נוסף ואישור.';
          }
        } else if (signalType === 'sell') {
          const sellMessages = [
            'שבירה מתחת לממוצע נע 50',
            'RSI בקנייתיתר (72)',
            'תבנית ראש וכתפיים שלילית',
            'MACD עם חצייה למטה',
            'שבירת תמיכה משמעותית',
            'שבירה של תחתית ערוץ מחיר'
          ];
          message = sellMessages[Math.floor(Math.random() * sellMessages.length)];
          
          // הוספת פרטים נוספים
          if (message.includes('ממוצע נע')) {
            details = 'המחיר שבר מתחת לממוצע נע 50, מה שמצביע על חולשה במגמה הנוכחית. זהו סימן אזהרה למחזיקים בפוזיציות ארוכות.';
          } else if (message.includes('RSI')) {
            details = 'ה-RSI הגיע לאזור קנייתיתר (72), מה שמצביע על התחממות יתר של השוק. זוהי נקודה אפשרית ליציאה מפוזיציות ארוכות או כניסה לפוזיציות קצרות.';
          } else if (message.includes('ראש וכתפיים')) {
            details = 'זוהתה תבנית ראש וכתפיים שלילית, שהיא תבנית היפוך קלאסית. שבירה של קו הצוואר מהווה סיגנל מכירה משמעותי.';
          } else {
            details = 'זוהה סיגנל מכירה טכני. בדוק את הגרף למידע נוסף ואישור.';
          }
        } else {
          const infoMessages = [
            'נפח מסחר חריג ב-30 דקות האחרונות',
            'המחיר מתקרב לתמיכה חשובה',
            'צפויה הודעה כלכלית משמעותית בקרוב',
            'התכנסות בולינגר בנדס - צפויה תנועה חדה',
            'המחיר נמצא באזור של ערוץ מחיר'
          ];
          message = infoMessages[Math.floor(Math.random() * infoMessages.length)];
          
          // הוספת פרטים נוספים
          if (message.includes('נפח מסחר')) {
            details = 'זוהה נפח מסחר חריג, מה שעשוי להצביע על תחילתה של תנועה משמעותית. כדאי לעקוב בתשומת לב אחר התפתחויות בשעות הקרובות.';
          } else if (message.includes('תמיכה')) {
            details = 'המחיר מתקרב לרמת תמיכה חשובה. אם התמיכה תחזיק, זו עשויה להיות הזדמנות לכניסה לפוזיציית קנייה. אם התמיכה תישבר, זה עשוי להוביל לירידות נוספות.';
          } else {
            details = 'מידע חשוב על מצב השוק. מומלץ לעקוב אחר ההתפתחויות.';
          }
        }
        
        const mockSignal: WebhookSignal = {
          id: `mock-${Date.now()}`,
          timestamp: Date.now(),
          symbol,
          message,
          action: signalType,
          source: 'TradingView Webhook',
          details
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

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success("כתובת ה-Webhook הועתקה ללוח", {
      description: "כעת תוכל להדביק אותה בהגדרות ההתראות בטריידינגויו"
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Badge className={isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {isConnected ? "מחובר" : "מנותק"}
        </Badge>
        <div>
          <CardTitle className="text-right">איתותים מטריידינגויו</CardTitle>
          <CardDescription className="text-right">
            מקבל איתותים אוטומטיים מהגדרות ההתראות שלך
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 bg-blue-50 p-3 rounded-md">
          <div className="flex justify-between items-start">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 p-0 px-2" 
              onClick={copyWebhookUrl}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <div className="text-right">
              <span className="font-medium text-sm">כתובת ה-Webhook שלך:</span>
              <code dir="ltr" className="ml-2 bg-blue-100 p-1 rounded text-xs">{webhookUrl}</code>
            </div>
          </div>
        </div>

        <Accordion type="single" collapsible className="mb-4">
          <AccordionItem value="guide">
            <AccordionTrigger className="text-right">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span>מדריך להגדרת התראות בטריידינגויו</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-right">
              <div className="space-y-3 text-sm">
                <p className="font-medium">כדי להגדיר התראות בטריידינגויו שישלחו לכאן:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>היכנס לחשבון TradingView שלך</li>
                  <li>פתח את הגרף של הנכס הרצוי</li>
                  <li>לחץ על כפתור "התראות" (Alerts) בתפריט העליון</li>
                  <li>הגדר תנאי להתראה (לדוגמה: מחיר מעל/מתחת לרמה מסוימת)</li>
                  <li>תחת "התראה-פעולות" בחר "Webhook"</li>
                  <li>העתק את כתובת ה-Webhook מלמעלה והדבק</li>
                  <li>תחת "הודעה", הכנס מבנה JSON כמו בדוגמה למטה</li>
                  <li>לחץ "שמור"</li>
                </ol>
                
                <div className="bg-gray-800 text-gray-100 p-2 rounded-md mt-2">
                  <p className="mb-1 text-xs">דוגמה למבנה JSON להודעה:</p>
                  <pre dir="ltr" className="text-xs overflow-x-auto whitespace-pre">
{`{
  "symbol": "{{ticker}}",
  "price": {{close}},
  "action": "buy",
  "message": "פריצה מעל ממוצע נע 200",
  "timestamp": "{{timenow}}"
}`}
                  </pre>
                </div>
                
                <p className="font-medium mt-3">התראות מומלצות להגדרה:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>פריצה/שבירה של ממוצעים נעים (50, 200)</li>
                  <li>כניסה/יציאה של RSI מאזורי קנייתיתר/מכירתיתר</li>
                  <li>חציית MACD את קו האיתות</li>
                  <li>פריצה/שבירה של רמות מחיר חשובות</li>
                  <li>תבניות נרות ספציפיות</li>
                </ul>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2 text-xs"
                  onClick={() => window.open('https://www.tradingview.com/support/solutions/43000529348-webhooks/', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  למדריך המלא של טריידינגויו
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
                  <p className="mt-1 text-right font-medium">{signal.message}</p>
                  
                  {signal.details && (
                    <div className="mt-1 text-xs text-gray-600 bg-white p-1.5 rounded">
                      <p className="text-right">{signal.details}</p>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                    <Button variant="ghost" size="sm" className="h-6 px-1 py-0 text-xs">
                      פתח בגרף
                    </Button>
                    <span>{new Date(signal.timestamp).toLocaleString('he-IL')}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
            <p>אין סיגנלים להצגה</p>
            <p className="text-sm">סיגנלים חדשים מטריידינגויו יופיעו כאן</p>
            <p className="text-xs mt-2">עקוב אחר המדריך למעלה כדי להגדיר התראות בטריידינגויו</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingViewWebhookHandler;
