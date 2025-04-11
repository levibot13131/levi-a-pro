
import { useState, useEffect } from 'react';
import { WebhookSignal } from '@/types/webhookSignal';
import { toast } from 'sonner';

export function useWebhookSignals() {
  const [signals, setSignals] = useState<WebhookSignal[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://your-app.com/api/tradingview-webhook');
  
  // Set up mock signals for development environment
  useEffect(() => {
    // Connect to signals
    setTimeout(() => {
      setIsConnected(true);
      toast.success("התחברות לערוץ הסיגנלים בוצעה בהצלחה", {
        description: "המערכת מוכנה לקבל התראות מטריידינגויו"
      });
    }, 2000);
    
    // Interval for sending mock signals to simulate receiving data from TradingView
    const mockInterval = setInterval(() => {
      if (Math.random() > 0.7) { // Only sometimes generate a signal
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
    }, 15000); // Every 15 seconds
    
    return () => clearInterval(mockInterval);
  }, []);
  
  // Process a new signal
  const processSignal = (signal: WebhookSignal) => {
    // Add the signal to the list
    setSignals(prev => [signal, ...prev].slice(0, 100)); // Keep only 100 most recent signals
    
    // Display a notification
    const toastType = signal.action === 'buy' ? toast.success : 
                      signal.action === 'sell' ? toast.warning : 
                      toast.info;
    
    toastType(`${signal.symbol}: ${signal.message}`, {
      description: `מקור: ${signal.source}`,
      duration: 6000,
    });
    
    // Here would be code to send the signal to Telegram/WhatsApp according to user settings
    console.log("Sending signal to communication channels:", signal);
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success("כתובת ה-Webhook הועתקה ללוח", {
      description: "כעת תוכל להדביק אותה בהגדרות ההתראות בטריידינגויו"
    });
  };

  return {
    signals,
    isConnected,
    webhookUrl,
    copyWebhookUrl
  };
}
