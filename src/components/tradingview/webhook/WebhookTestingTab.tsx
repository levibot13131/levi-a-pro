
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Info } from 'lucide-react';

interface WebhookTestingTabProps {
  handleTestWebhookFlow: (type: 'buy' | 'sell' | 'info') => Promise<boolean>;
  isTesting: boolean;
}

const WebhookTestingTab: React.FC<WebhookTestingTabProps> = ({
  handleTestWebhookFlow,
  isTesting
}) => {
  return (
    <div className="space-y-4">
      <div className="text-right mb-4">
        <p className="text-sm text-muted-foreground">
          בדיקת Webhook בודקת את תהליך עיבוד האיתות מבלי לסמלץ קריאת Webhook אמיתית.
          השתמש באפשרות זו לבדיקת עיבוד האיתות והשליחה ליעדים.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 h-16"
          onClick={() => handleTestWebhookFlow('buy')}
          disabled={isTesting}
        >
          <ArrowUp className="h-5 w-5 text-green-500" />
          <div className="text-right">
            <div className="font-medium">בדוק איתות קנייה</div>
            <div className="text-xs text-muted-foreground">BTC/USD</div>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 h-16"
          onClick={() => handleTestWebhookFlow('sell')}
          disabled={isTesting}
        >
          <ArrowDown className="h-5 w-5 text-red-500" />
          <div className="text-right">
            <div className="font-medium">בדוק איתות מכירה</div>
            <div className="text-xs text-muted-foreground">ETH/USD</div>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 h-16"
          onClick={() => handleTestWebhookFlow('info')}
          disabled={isTesting}
        >
          <Info className="h-5 w-5 text-blue-500" />
          <div className="text-right">
            <div className="font-medium">בדוק התראת מידע</div>
            <div className="text-xs text-muted-foreground">שוק כללי</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default WebhookTestingTab;
