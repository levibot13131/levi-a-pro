
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCw, Send, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getTelegramBotToken, 
  getTelegramChatId, 
  saveTelegramCredentials, 
  clearTelegramCredentials, 
  testTelegramConnection, 
  isTelegramConfigured 
} from '@/services/messaging/telegramService';

interface TelegramConfigProps {
  onStatusChange?: (isConfigured: boolean) => void;
}

const TelegramConfig: React.FC<TelegramConfigProps> = ({ onStatusChange }) => {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [autoSendEnabled, setAutoSendEnabled] = useState(true);

  useEffect(() => {
    const savedBotToken = getTelegramBotToken();
    const savedChatId = getTelegramChatId();
    
    if (savedBotToken) setBotToken(savedBotToken);
    if (savedChatId) setChatId(savedChatId);
    
    const isConfig = isTelegramConfigured();
    setIsConfigured(isConfig);
    
    if (onStatusChange) {
      onStatusChange(isConfig);
    }
  }, [onStatusChange]);

  const handleSave = () => {
    try {
      saveTelegramCredentials(botToken, chatId);
      setIsConfigured(true);
      
      if (onStatusChange) {
        onStatusChange(true);
      }
      
      toast.success('הגדרות טלגרם נשמרו בהצלחה');
    } catch (error) {
      console.error('Error saving Telegram credentials:', error);
      toast.error('שגיאה בשמירת הגדרות טלגרם');
    }
  };

  const handleClear = () => {
    try {
      clearTelegramCredentials();
      setIsConfigured(false);
      
      if (onStatusChange) {
        onStatusChange(false);
      }
      
      toast.success('הגדרות טלגרם נמחקו');
    } catch (error) {
      console.error('Error clearing Telegram credentials:', error);
      toast.error('שגיאה במחיקת הגדרות טלגרם');
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    
    try {
      const success = await testTelegramConnection();
      if (success) {
        toast.success('הודעת בדיקה נשלחה בהצלחה');
      } else {
        toast.error('שליחת הודעת בדיקה נכשלה');
      }
    } catch (error) {
      console.error('Error testing Telegram connection:', error);
      toast.error('שגיאה בבדיקת חיבור לטלגרם');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">הגדרות טלגרם</CardTitle>
        <CardDescription className="text-right">
          הגדר את פרטי הבוט והצ'אט לשליחת איתותים והתראות
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bot-token" className="text-right block">מפתח בוט טלגרם (Bot Token)</Label>
            <Input
              id="bot-token"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="הכנס את מפתח הבוט"
              className="text-right"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="chat-id" className="text-right block">מזהה צ'אט (Chat ID)</Label>
            <Input
              id="chat-id"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="הכנס את מזהה הצ'אט"
              className="text-right"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Switch
                id="auto-send"
                checked={autoSendEnabled}
                onCheckedChange={setAutoSendEnabled}
              />
              <Label htmlFor="auto-send">שליחה אוטומטית של איתותים</Label>
            </div>
          </div>
          
          {isConfigured && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>טלגרם מוגדר</AlertTitle>
              <AlertDescription>
                המערכת תשלח איתותים והתראות לבוט ולצ'אט שהוגדרו.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-between pt-4">
            <div>
              <Button variant="outline" onClick={handleClear} disabled={!isConfigured}>
                נקה הגדרות
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleTest} disabled={isTesting || !botToken || !chatId}>
                <RefreshCw className={`h-4 w-4 ml-2 ${isTesting ? 'animate-spin' : ''}`} />
                בדיקת חיבור
              </Button>
              
              <Button onClick={handleSave} disabled={!botToken || !chatId}>
                <Send className="h-4 w-4 ml-2" />
                שמור הגדרות
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelegramConfig;
