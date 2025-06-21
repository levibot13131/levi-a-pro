
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { unifiedTelegramService } from '@/services/telegram/unifiedTelegramService';
import { toast } from 'sonner';

const TelegramStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState(unifiedTelegramService.getConnectionStatus());
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(unifiedTelegramService.getConnectionStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleQuickTest = async () => {
    setIsTesting(true);
    try {
      const success = await unifiedTelegramService.sendTestMessage();
      if (success) {
        toast.success('✅ Test message sent!');
      } else {
        toast.error('❌ Test failed');
      }
    } catch (error) {
      toast.error('❌ Test error');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <MessageCircle className="h-4 w-4 text-blue-500" />
      <Badge variant={status.connected ? "default" : "destructive"}>
        {status.connected ? (
          <>
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </>
        ) : (
          <>
            <AlertCircle className="h-3 w-3 mr-1" />
            Disconnected
          </>
        )}
      </Badge>
      
      {status.connected && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleQuickTest}
          disabled={isTesting}
        >
          <Send className="h-3 w-3 mr-1" />
          {isTesting ? 'Testing...' : 'Test'}
        </Button>
      )}
    </div>
  );
};

export default TelegramStatusIndicator;
