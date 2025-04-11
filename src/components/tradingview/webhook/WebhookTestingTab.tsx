
import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowUp, ArrowDown, Info } from 'lucide-react';

interface WebhookTestingTabProps {
  handleTestWebhookFlow: (type: 'buy' | 'sell' | 'info') => Promise<void>;
  isTesting: boolean;
}

const WebhookTestingTab: React.FC<WebhookTestingTabProps> = ({ 
  handleTestWebhookFlow, 
  isTesting 
}) => {
  return (
    <>
      <Alert className="mb-4">
        <AlertTitle>בדיקת זרימת Webhook מלאה</AlertTitle>
        <AlertDescription>
          בדוק את הזרימה המלאה של Webhook, כולל פירוק הנתונים, עיבוד ושליחה לכל יעדי ההתראות המוגדרים.
          התראות יישלחו בפועל לטלגרם ולוואטסאפ אם הם מוגדרים.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant="default" 
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={() => handleTestWebhookFlow('buy')}
          disabled={isTesting}
        >
          <ArrowUp className="h-4 w-4 mr-2" />
          בדוק איתות קנייה
        </Button>
        
        <Button 
          variant="default"
          className="w-full bg-red-600 hover:bg-red-700"
          onClick={() => handleTestWebhookFlow('sell')}
          disabled={isTesting}
        >
          <ArrowDown className="h-4 w-4 mr-2" />
          בדוק איתות מכירה
        </Button>
        
        <Button 
          variant="default"
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={() => handleTestWebhookFlow('info')}
          disabled={isTesting}
        >
          <Info className="h-4 w-4 mr-2" />
          בדוק איתות מידע
        </Button>
      </div>
    </>
  );
};

export default WebhookTestingTab;
