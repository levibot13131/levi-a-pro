
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { telegramBot } from '@/services/telegram/telegramBot';
import { toast } from 'sonner';
import { MessageCircle, Settings, Unplug } from 'lucide-react';

const TelegramSetup: React.FC = () => {
  const [token, setToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const connectionStatus = telegramBot.getConnectionStatus();

  const handleConnect = async () => {
    if (!token || !chatId) {
      toast.error('נא למלא את כל השדות');
      return;
    }

    setIsConnecting(true);
    try {
      const success = await telegramBot.configureTelegram(token, chatId);
      if (success) {
        toast.success('✅ Telegram connected successfully');
        setToken('');
        setChatId('');
      } else {
        toast.error('❌ Failed to connect to Telegram');
      }
    } catch (error) {
      toast.error('❌ Connection error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    telegramBot.disconnect();
    toast.info('📱 Telegram disconnected');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Telegram Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={connectionStatus.connected ? "default" : "secondary"}>
            {connectionStatus.status}
          </Badge>
          {connectionStatus.connected && (
            <span className="text-sm text-muted-foreground">
              Chat ID: {connectionStatus.chatId}
            </span>
          )}
        </div>

        {!connectionStatus.connected ? (
          <div className="space-y-4">
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
              disabled={isConnecting}
              className="w-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              {isConnecting ? 'Connecting...' : 'Connect Telegram'}
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleDisconnect}
            variant="destructive"
            className="w-full"
          >
            <Unplug className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TelegramSetup;
