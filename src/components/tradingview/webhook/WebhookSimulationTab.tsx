
import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowUp, ArrowDown, Info } from 'lucide-react';

interface WebhookSimulationTabProps {
  handleSimulateSignal: (type: 'buy' | 'sell' | 'info') => Promise<void>;
  isTesting: boolean;
}

const WebhookSimulationTab: React.FC<WebhookSimulationTabProps> = ({ 
  handleSimulateSignal, 
  isTesting 
}) => {
  return (
    <>
      <Alert className="mb-4">
        <AlertTitle>סימולציית איתותים</AlertTitle>
        <AlertDescription>
          צור איתותים לדוגמה כדי לבדוק את תצוגת האיתותים והפורמט שלהם בממשק.
          האיתותים יוצגו במערכת אך לא ישלחו לטלגרם או וואטסאפ.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant="outline" 
          className="w-full border-green-500 text-green-600"
          onClick={() => handleSimulateSignal('buy')}
          disabled={isTesting}
        >
          <ArrowUp className="h-4 w-4 mr-2" />
          איתות קנייה
        </Button>
        
        <Button 
          variant="outline"
          className="w-full border-red-500 text-red-600"
          onClick={() => handleSimulateSignal('sell')}
          disabled={isTesting}
        >
          <ArrowDown className="h-4 w-4 mr-2" />
          איתות מכירה
        </Button>
        
        <Button 
          variant="outline"
          className="w-full border-blue-500 text-blue-600"
          onClick={() => handleSimulateSignal('info')}
          disabled={isTesting}
        >
          <Info className="h-4 w-4 mr-2" />
          איתות מידע
        </Button>
      </div>
    </>
  );
};

export default WebhookSimulationTab;
