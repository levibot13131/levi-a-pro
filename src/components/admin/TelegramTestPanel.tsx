import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { sendTelegramMessage } from '@/services/telegram/telegramService';
import { toast } from 'sonner';

interface TelegramTestPanelProps {
  className?: string;
}

const TelegramTestPanel: React.FC<TelegramTestPanelProps> = ({ className }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<boolean | null>(null);
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);

  const sendTestMessage = async () => {
    setIsTesting(true);
    
    try {
      const testMessage = `
🧪 <b>בדיקת מערכת LeviPro</b>

✅ מערכת: פעילה
🤖 בוט: מחובר  
⏰ זמן: ${new Date().toLocaleString('he-IL')}
📊 מצב: מוכן לאיתותי מסחר

<i>זוהי הודעת בדיקה לאימות החיבור לטלגרם</i>
      `;

      console.log('🧪 Starting Telegram test...');
      const result = await sendTelegramMessage(testMessage, true);
      
      setLastTestResult(result.ok);
      setLastTestTime(new Date());
      
      if (result.ok) {
        toast.success('הודעת בדיקה נשלחה לטלגרם בהצלחה');
        console.log('✅ Test message sent successfully');
      } else {
        toast.error('שליחת הודעת הבדיקה נכשלה', {
          description: result.error || 'שגיאה לא ידועה'
        });
        console.error('❌ Test message failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Test error:', error);
      setLastTestResult(false);
      setLastTestTime(new Date());
      toast.error('שגיאה בשליחת הודעת בדיקה');
    } finally {
      setIsTesting(false);
    }
  };

  const sendSignalTestMessage = async () => {
    setIsTesting(true);
    
    try {
      const signalTestMessage = `
🚀 <b>LeviPro Trading Signal (TEST)</b>

💰 <b>BTCUSDT</b> 
📈 <b>BUY</b> at $68,500.00

🎯 <b>Target:</b> $70,125.00
⛔ <b>Stop Loss:</b> $67,575.00
📊 <b>R/R:</b> 2.17:1

🧠 <b>LeviScore:</b> 85/100
🔥 <b>Confidence:</b> 92%

📋 <b>Analysis:</b>
Multi-TF Alignment: 78% (bullish)
LeviScore: 85/100
R/R Ratio: 2.17:1

⏰ ${new Date().toLocaleString('he-IL')}

<i>זוהי הודעת בדיקה של איתות מסחר</i>
      `;

      console.log('🧪 Starting signal test...');
      const result = await sendTelegramMessage(signalTestMessage, true);
      
      setLastTestResult(result.ok);
      setLastTestTime(new Date());
      
      if (result.ok) {
        toast.success('איתות בדיקה נשלח לטלגרם בהצלחה');
        console.log('✅ Test signal sent successfully');
      } else {
        toast.error('שליחת איתות הבדיקה נכשלה', {
          description: result.error || 'שגיאה לא ידועה'
        });
        console.error('❌ Test signal failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Signal test error:', error);
      setLastTestResult(false);
      setLastTestTime(new Date());
      toast.error('שגיאה בשליחת איתות בדיקה');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          בדיקת טלגרם
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button 
            onClick={sendTestMessage}
            disabled={isTesting}
            variant="outline"
            className="w-full"
          >
            <Send className="mr-2 h-4 w-4" />
            {isTesting ? 'שולח...' : 'הודעת בדיקה'}
          </Button>
          
          <Button 
            onClick={sendSignalTestMessage}
            disabled={isTesting}
            variant="outline" 
            className="w-full"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {isTesting ? 'שולח...' : 'איתות בדיקה'}
          </Button>
        </div>

        {lastTestTime && (
          <div className="mt-4 p-3 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                בדיקה אחרונה: {lastTestTime.toLocaleString('he-IL')}
              </span>
              <div className="flex items-center gap-1">
                {lastTestResult ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">הצליחה</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-600">נכשלה</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-2">
          💡 הודעות הבדיקה נשלחות לצ'אט שהוגדר בהגדרות הטלגרם
        </div>
      </CardContent>
    </Card>
  );
};

export default TelegramTestPanel;