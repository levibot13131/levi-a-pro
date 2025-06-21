
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MessageSquare, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { telegramBot } from '@/services/telegram/telegramBot';
import { toast } from 'sonner';

const TelegramSetup: React.FC = () => {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('809305569'); // Your default chat ID
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(telegramBot.getConnectionStatus());

  useEffect(() => {
    // Update connection status
    setConnectionStatus(telegramBot.getConnectionStatus());
  }, []);

  const handleConfigure = () => {
    if (!botToken.trim()) {
      toast.error('Please enter a valid bot token');
      return;
    }

    setIsConfiguring(true);
    
    try {
      const success = telegramBot.configureTelegram(botToken, chatId);
      
      if (success) {
        setConnectionStatus(telegramBot.getConnectionStatus());
        toast.success('✅ Telegram bot configured successfully!');
      } else {
        toast.error('❌ Failed to configure Telegram bot');
      }
    } catch (error) {
      console.error('Configuration error:', error);
      toast.error('❌ Configuration error occurred');
    } finally {
      setIsConfiguring(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    
    try {
      const success = await telegramBot.testEliteConnection();
      
      if (success) {
        toast.success('✅ Test message sent successfully to @mytrsdingbot!');
      } else {
        toast.error('❌ Test message failed - check bot token and chat ID');
      }
    } catch (error) {
      console.error('Test error:', error);
      toast.error('❌ Test failed with error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleDisconnect = () => {
    try {
      telegramBot.disconnect();
      setConnectionStatus(telegramBot.getConnectionStatus());
      setBotToken('');
      toast.info('🔌 Telegram bot disconnected');
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.error('❌ Failed to disconnect');
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          Telegram Bot Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {connectionStatus.connected ? (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Connected to Telegram</AlertTitle>
              <AlertDescription className="text-green-700">
                Bot: @mytrsdingbot | Chat ID: {connectionStatus.chatId}
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button onClick={handleTest} disabled={isTesting} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                {isTesting ? 'Testing...' : 'Send Test Message'}
              </Button>
              
              <Button variant="outline" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Telegram Not Connected</AlertTitle>
              <AlertDescription className="text-yellow-700">
                Configure your bot token to receive LeviPro signals
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="bot-token">Bot Token</Label>
                <Input
                  id="bot-token"
                  placeholder="Enter your @mytrsdingbot token"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  type="password"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Get this from @BotFather on Telegram
                </p>
              </div>
              
              <div>
                <Label htmlFor="chat-id">Chat ID</Label>
                <Input
                  id="chat-id"
                  placeholder="809305569"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your Telegram chat ID (already set for @mytrsdingbot)
                </p>
              </div>
              
              <Button 
                onClick={handleConfigure} 
                disabled={isConfiguring || !botToken.trim()}
                className="w-full"
              >
                {isConfiguring ? 'Configuring...' : 'Configure Telegram Bot'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TelegramSetup;
