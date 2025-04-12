
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWhatsAppIntegration } from '@/hooks/use-whatsapp-integration';
import { Phone, Check, X } from 'lucide-react';

const WhatsAppIntegration: React.FC = () => {
  const { isConnected, phoneNumber, disconnectWhatsApp } = useWhatsAppIntegration();

  return (
    <div className="flex items-center gap-3">
      <Phone className="h-4 w-4 text-muted-foreground" />
      
      {isConnected ? (
        <>
          <span className="text-sm flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-1" />
            WhatsApp מחובר
            <span className="mx-1 text-muted-foreground">({phoneNumber})</span>
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => disconnectWhatsApp()}
            className="h-7 px-2"
          >
            <X className="h-3 w-3 mr-1" />
            נתק
          </Button>
        </>
      ) : (
        <span className="text-sm text-muted-foreground flex items-center">
          <X className="h-4 w-4 text-red-500 mr-1" />
          WhatsApp לא מחובר
        </span>
      )}
    </div>
  );
};

export default WhatsAppIntegration;
