
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface WebhookDestinationBadgesProps {
  destinations: any[];
}

const WebhookDestinationBadges: React.FC<WebhookDestinationBadgesProps> = ({ destinations }) => {
  const hasTelegram = destinations.some(d => d.type === 'telegram' && d.active);
  const hasWhatsApp = destinations.some(d => d.type === 'whatsapp' && d.active);
  
  return (
    <div className="flex gap-2">
      <Badge 
        variant={hasTelegram ? "default" : "destructive"}
        className={`${hasTelegram ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
      >
        {hasTelegram ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
        Telegram
      </Badge>
      
      <Badge 
        variant={hasWhatsApp ? "default" : "destructive"}
        className={`${hasWhatsApp ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
      >
        {hasWhatsApp ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
        WhatsApp
      </Badge>
    </div>
  );
};

export default WebhookDestinationBadges;
