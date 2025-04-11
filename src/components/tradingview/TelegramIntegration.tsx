
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Link, Check, AlertCircle, Send } from 'lucide-react';
import { useTelegramIntegration } from '@/hooks/use-telegram-integration';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { testTelegramConnection, sendFormattedTestAlert, parseTelegramConfig } from '@/services/tradingView/telegramService';
import { toast } from 'sonner';

const TelegramIntegration: React.FC = () => {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const {
    isConnected,
    isConfiguring,
    config,
    configureTelegram,
    disconnectTelegram,
    sendTestMessage
  } = useTelegramIntegration();

  const handleConnect = async () => {
    if (!botToken.trim() || !chatId.trim()) {
      toast.error('אנא הזן את כל הפרטים הנדרשים');
      return;
    }
    
    console.log('Connecting to Telegram with:', { botToken: botToken.substring(0, 5) + '...', chatId });
    await configureTelegram(botToken, chatId);
  };
  
  // Send a formatted test alert with all elements
  const handleSendFormattedTest = async () => {
    if (!isConnected || !config) {
      toast.error('טלגרם לא מחובר. אנא חבר תחילה.');
      return;
    }
    
    setIsSendingTest(true);
    try {
      console.log('Sending formatted test alert with config:', {
        hasToken: !!config.botToken,
        hasChatId: !!config.chatId,
        configType: typeof config
      });
      
      const parsedConfig = parseTelegramConfig(JSON.stringify(config));
      if (!parsedConfig) {
        toast.error('תצורת טלגרם לא תקינה');
        console.error('Failed to parse Telegram config:', config);
        return;
      }
      
      console.log('Parsed config successfully:', {
        hasToken: !!parsedConfig.botToken,
        hasChatId: !!parsedConfig.chatId
      });
      
      const success = await sendFormattedTestAlert(parsedConfig);
      if (success) {
        toast.success('הודעת בדיקה מעוצבת נשלחה בהצלחה');
      } else {
        toast.error('שליחת הודעת בדיקה מעוצבת נכשלה');
      }
    } catch (error) {
      console.error('Error sending formatted test:', error);
      toast.error('שגיאה בשליחת הודעה מעוצבת');
    } finally {
      setIsSendingTest(false);
    }
  };

  // Test direct API call to Telegram
  const handleDirectTest = async () => {
    if (!isConnected || !config) {
      toast.error('טלגרם לא מחובר. אנא חבר תחילה.');
      return;
    }
    
    setIsSendingTest(true);
    try {
      const { botToken, chatId } = config;
      console.log('Sending direct API test to Telegram:', {
        hasToken: !!botToken,
        hasChatId: !!chatId
      });
      
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: '🧪 *בדיקת API ישיר*\nזוהי בדיקה ישירה של הAPI של טלגרם.',
          parse_mode: 'Markdown'
        })
      });
      
      const data = await response.json();
      console.log('Direct API response:', data);
      
      if (data.ok) {
        toast.success('בדיקת API ישיר הצליחה');
      } else {
        console.error('Telegram API error:', data);
        toast.error(`שגיאת API: ${data.description || 'שגיאה לא ידועה'}`);
      }
    } catch (error) {
      console.error('Error in direct API test:', error);
      toast.error('שגיאה בבדיקת API ישיר');
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>התחברות לטלגרם</span>
          <MessageSquare className="h-5 w-5 text-blue-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <Alert variant="default" className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/50">
              <Check className="h-4 w-4" />
              <AlertTitle>מחובר לטלגרם</AlertTitle>
              <AlertDescription>
                התראות יישלחו אוטומטית לטלגרם בזמן אמת
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={sendTestMessage}
              >
                <Send className="mr-2 h-4 w-4" />
                שלח הודעת בדיקה רגילה
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleSendFormattedTest}
                disabled={isSendingTest}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {isSendingTest ? 'שולח הודעה...' : 'שלח הודעת בדיקה מעוצבת'}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleDirectTest}
                disabled={isSendingTest}
              >
                <Send className="mr-2 h-4 w-4" />
                בדיקת API ישיר
              </Button>
              
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={disconnectTelegram}
              >
                נתק את חשבון הטלגרם
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>לא מחובר לטלגרם</AlertTitle>
              <AlertDescription>
                חבר את בוט הטלגרם שלך כדי לקבל התראות
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="bot-token" className="text-sm font-medium block mb-1 text-right">
                  Bot Token
                </label>
                <Input
                  id="bot-token"
                  placeholder="1234567890:ABCDefGhIJKlmNoPQRsTUVwxyZ"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  dir="ltr"
                  className="font-mono text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="chat-id" className="text-sm font-medium block mb-1 text-right">
                  Chat ID
                </label>
                <Input
                  id="chat-id"
                  placeholder="-1001234567890 או 123456789"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  dir="ltr"
                  className="font-mono text-sm"
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleConnect} 
                disabled={isConfiguring || !botToken.trim() || !chatId.trim()}
              >
                {isConfiguring ? 'מתחבר...' : 'חבר לטלגרם'}
              </Button>
              
              <div className="text-center mt-4">
                <Button 
                  variant="link" 
                  className="text-xs gap-1"
                  asChild
                >
                  <a 
                    href="https://core.telegram.org/bots#how-do-i-create-a-bot" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Link className="h-3 w-3" />
                    למדריך ליצירת בוט בטלגרם
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TelegramIntegration;
