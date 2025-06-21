
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { unifiedTelegramService } from '@/services/telegram/unifiedTelegramService';
import { toast } from 'sonner';
import { MessageCircle, Settings, Unplug, Send, TestTube } from 'lucide-react';

const TelegramSetup: React.FC = () => {
  const [token, setToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(unifiedTelegramService.getConnectionStatus());

  useEffect(() => {
    // Update connection status every 5 seconds
    const interval = setInterval(() => {
      setConnectionStatus(unifiedTelegramService.getConnectionStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Pre-fill with production credentials
    const PRODUCTION_TOKEN = '7607389220:AAHSUnDPTR_9iQEmMjZkSy5i0kepBotAUbA';
    const PRODUCTION_CHAT_ID = '809305569';
    
    if (!connectionStatus.connected) {
      setToken(PRODUCTION_TOKEN);
      setChatId(PRODUCTION_CHAT_ID);
    }
  }, [connectionStatus.connected]);

  const handleConnect = async () => {
    if (!token || !chatId) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsConnecting(true);
    try {
      const success = await unifiedTelegramService.configureTelegram(token, chatId);
      if (success) {
        setConnectionStatus(unifiedTelegramService.getConnectionStatus());
        setToken('');
        setChatId('');
        toast.success('✅ Telegram connected and verified!');
      }
    } catch (error) {
      toast.error('❌ Connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    unifiedTelegramService.disconnect();
    setConnectionStatus(unifiedTelegramService.getConnectionStatus());
    toast.info('📱 Telegram disconnected');
  };

  const handleTestMessage = async () => {
    setIsTesting(true);
    try {
      const success = await unifiedTelegramService.sendTestMessage();
      if (success) {
        toast.success('✅ Test message sent successfully!');
      } else {
        toast.error('❌ Test message failed');
      }
    } catch (error) {
      toast.error('❌ Test failed');
    } finally {
      setIsTesting(false);
    }
  };

  const handleQuickConnect = async () => {
    const PRODUCTION_TOKEN = '7607389220:AAHSUnDPTR_9iQEmMjZkSy5i0kepBotAUbA';
    const PRODUCTION_CHAT_ID = '809305569';
    
    setIsConnecting(true);
    try {
      const success = await unifiedTelegramService.configureTelegram(PRODUCTION_TOKEN, PRODUCTION_CHAT_ID);
      if (success) {
        setConnectionStatus(unifiedTelegramService.getConnectionStatus());
        toast.success('✅ Production bot connected!');
      }
    } catch (error) {
      toast.error('❌ Quick connect failed');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Telegram Bot Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={connectionStatus.connected ? "default" : "secondary"}>
            {connectionStatus.connected ? 'Connected' : 'Disconnected'}
          </Badge>
          {connectionStatus.connected && (
            <span className="text-sm text-muted-foreground">
              Chat: {connectionStatus.chatId}
            </span>
          )}
        </div>

        {connectionStatus.connected ? (
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Bot is connected and ready to send messages
              </p>
              <p className="text-xs text-green-600 mt-1">
                Last connected: {new Date(connectionStatus.lastConnected).toLocaleString()}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleTestMessage}
                disabled={isTesting}
                variant="outline"
                className="flex-1"
              >
                <TestTube className="h-4 w-4 mr-2" />
                {isTesting ? 'Sending...' : 'Send Test Message'}
              </Button>
              
              <Button
                onClick={handleDisconnect}
                variant="destructive"
              >
                <Unplug className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={handleQuickConnect}
              disabled={isConnecting}
              className="w-full"
              variant="default"
            >
              <Settings className="h-4 w-4 mr-2" />
              {isConnecting ? 'Connecting...' : 'Quick Connect Production Bot'}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or configure manually
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="token">Bot Token</Label>
                <Input
                  id="token"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter your Telegram bot token"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chatId">Chat ID</Label>
                <Input
                  id="chatId"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  placeholder="Enter your chat ID"
                />
              </div>

              <Button
                onClick={handleConnect}
                disabled={isConnecting || !token.trim() || !chatId.trim()}
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect Custom Bot'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TelegramSetup;
