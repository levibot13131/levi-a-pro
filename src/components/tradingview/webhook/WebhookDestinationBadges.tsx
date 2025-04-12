
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Send } from 'lucide-react';

interface WebhookDestinationBadgesProps {
  destinations: any[];
}

const WebhookDestinationBadges: React.FC<WebhookDestinationBadgesProps> = ({ destinations }) => {
  const activeDestinations = destinations.filter(d => d.active);
  
  if (activeDestinations.length === 0) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        <Send className="h-3 w-3 mr-1" />
        אין יעדים פעילים
      </Badge>
    );
  }
  
  return (
    <div className="flex space-x-1">
      {activeDestinations.map((dest, index) => (
        <Badge key={index} variant="outline" className="bg-muted/50 text-foreground">
          <Send className="h-3 w-3 mr-1" />
          {dest.type === 'telegram' ? 'טלגרם' : 
           dest.type === 'whatsapp' ? 'וואטסאפ' : 
           dest.type}
        </Badge>
      ))}
    </div>
  );
};

export default WebhookDestinationBadges;
