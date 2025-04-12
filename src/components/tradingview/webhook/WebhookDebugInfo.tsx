
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface WebhookDebugInfoProps {
  showDebugInfo: boolean;
  setShowDebugInfo: React.Dispatch<React.SetStateAction<boolean>>;
  destinations: any[];
}

const WebhookDebugInfo: React.FC<WebhookDebugInfoProps> = ({
  showDebugInfo,
  setShowDebugInfo,
  destinations
}) => {
  return (
    <div className="mt-4 pt-4 border-t">
      <Collapsible open={showDebugInfo} onOpenChange={setShowDebugInfo}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex items-center text-xs w-full justify-between p-2 h-auto">
            <span>מידע דיאגנוסטי</span>
            {showDebugInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="text-xs p-3 bg-muted/40 rounded-md mt-2">
          <div className="space-y-2 text-right">
            <div>
              <strong>יעדי התראות:</strong>{" "}
              {destinations.length === 0 ? (
                <span className="text-red-500">לא מוגדרים</span>
              ) : (
                destinations.map((dest, i) => (
                  <Badge 
                    key={i} 
                    variant={dest.active ? "default" : "outline"}
                    className="ml-1 text-xs"
                  >
                    {dest.type} {dest.active ? "(פעיל)" : "(לא פעיל)"}
                  </Badge>
                ))
              )}
            </div>
            <div>
              <strong>כתובת Webhook:</strong>{" "}
              <code dir="ltr" className="text-xs font-mono break-all">
                {window.location.origin}/api/tradingview/webhook
              </code>
            </div>
            <div>
              <strong>פורמט מומלץ:</strong>{" "}
              <code dir="ltr" className="text-xs font-mono">
                {'{"symbol":"BTCUSD", "action":"buy", "price":50000, "message":"Buy signal"}'}
              </code>
            </div>
            <div>
              <strong>פורמט חלופי:</strong>{" "}
              <code dir="ltr" className="text-xs font-mono">
                BTCUSD, buy, 50000, Buy signal
              </code>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default WebhookDebugInfo;
