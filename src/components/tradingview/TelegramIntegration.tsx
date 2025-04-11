
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrandTelegram, Link, Check, AlertCircle } from 'lucide-react';
import { useTelegramIntegration } from '@/hooks/use-telegram-integration';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TelegramIntegration: React.FC = () => {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const {
    isConnected,
    isConfiguring,
    configureTelegram,
    disconnectTelegram,
    sendTestMessage
  } = useTelegramIntegration();

  const handleConnect = async () => {
    if (!botToken.trim() || !chatId.trim()) {
      return;
    }
    
    await configureTelegram(botToken, chatId);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>התחברות לטלגרם</span>
          <BrandTelegram className="h-5 w-5 text-blue-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <Alert variant="success" className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/50">
              <Check className="h-4 w-4" />
              <AlertTitle>מחובר לטלגרם</AlertTitle>
              <AlertDescription>
                התראות יישלחו אוטומטית לטלגרם
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={sendTestMessage}
              >
                שלח הודעת בדיקה
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
                    href="https://telegram.dev/bots" 
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
