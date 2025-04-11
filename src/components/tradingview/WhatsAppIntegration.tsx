
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useWhatsappIntegration } from '@/hooks/use-whatsapp-integration';
import WhatsAppIntegrationHeader from './whatsapp/WhatsAppIntegrationHeader';
import WhatsAppConnected from './whatsapp/WhatsAppConnected';
import WhatsAppDisconnected from './whatsapp/WhatsAppDisconnected';

/**
 * WhatsApp Integration Component
 * Allows users to connect to WhatsApp for receiving trading alerts
 */
const WhatsAppIntegration: React.FC = () => {
  const {
    isConnected,
    webhookUrl,
    isConfiguring,
    configureWhatsapp,
    disconnectWhatsapp,
    sendTestMessage
  } = useWhatsappIntegration();
  
  // Handle connect to WhatsApp
  const handleConnect = async () => {
    if (!webhookUrl.trim()) {
      return;
    }
    
    await configureWhatsapp(webhookUrl);
  };

  // Handle disconnect from WhatsApp
  const handleDisconnect = () => {
    disconnectWhatsapp();
  };

  // Handle toggle active state
  const handleToggleActive = (active: boolean) => {
    if (active) {
      configureWhatsapp(webhookUrl);
    } else {
      disconnectWhatsapp();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <WhatsAppIntegrationHeader isConnected={isConnected} />
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <WhatsAppConnected 
            destination={{
              name: webhookUrl,
              active: isConnected
            }}
            onDisconnect={handleDisconnect}
            onToggleActive={handleToggleActive}
            onSendTest={sendTestMessage}
          />
        ) : (
          <WhatsAppDisconnected 
            webhookUrl={webhookUrl}
            isConfiguring={isConfiguring}
            onConnect={handleConnect}
            onWebhookUrlChange={(url) => configureWhatsapp(url)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsAppIntegration;
