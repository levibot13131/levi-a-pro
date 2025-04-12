
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Info } from 'lucide-react';

interface WebhookSimulationTabProps {
  handleSimulateSignal: (type: 'buy' | 'sell' | 'info') => Promise<boolean>;
  isTesting: boolean;
}

const WebhookSimulationTab: React.FC<WebhookSimulationTabProps> = ({
  handleSimulateSignal,
  isTesting
}) => {
  return (
    <div className="space-y-4">
      <div className="text-right mb-4">
        <p className="text-sm text-muted-foreground">
          סימולצית Webhook מדמה קבלת Webhook מ-TradingView ומעבדת אותו באופן מלא דרך המערכת.
          זוהי הדרך המומלצת לבדוק את החיבור בסביבת הפיתוח.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 h-16"
          onClick={() => handleSimulateSignal('buy')}
          disabled={isTesting}
        >
          <ArrowUp className="h-5 w-5 text-green-500" />
          <div className="text-right">
            <div className="font-medium">סמלץ איתות קנייה</div>
            <div className="text-xs text-muted-foreground">BTC/USD</div>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 h-16"
          onClick={() => handleSimulateSignal('sell')}
          disabled={isTesting}
        >
          <ArrowDown className="h-5 w-5 text-red-500" />
          <div className="text-right">
            <div className="font-medium">סמלץ איתות מכירה</div>
            <div className="text-xs text-muted-foreground">ETH/USD</div>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 h-16"
          onClick={() => handleSimulateSignal('info')}
          disabled={isTesting}
        >
          <Info className="h-5 w-5 text-blue-500" />
          <div className="text-right">
            <div className="font-medium">סמלץ התראת מידע</div>
            <div className="text-xs text-muted-foreground">שוק כללי</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default WebhookSimulationTab;
