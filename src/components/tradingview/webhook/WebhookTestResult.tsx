
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface TestResult {
  success: boolean;
  type: string;
  time: Date;
}

interface WebhookTestResultProps {
  lastTestResult: TestResult | null;
}

const WebhookTestResult: React.FC<WebhookTestResultProps> = ({ lastTestResult }) => {
  if (!lastTestResult) return null;
  
  return (
    <Alert className={lastTestResult.success ? 
      "mt-2 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-900/50" : 
      "mt-2 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-900/50"
    }>
      <AlertTitle className="flex items-center gap-2">
        {lastTestResult.success ? 
          <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
          <AlertTriangle className="h-4 w-4 text-red-500" />
        }
        {lastTestResult.success ? 'הבדיקה הצליחה' : 'הבדיקה נכשלה'}
      </AlertTitle>
      <AlertDescription>
        איתות {lastTestResult.type === 'buy' ? 'קנייה' : 
             lastTestResult.type === 'sell' ? 'מכירה' : 'מידע'} נבדק ב-{lastTestResult.time.toLocaleTimeString()}
      </AlertDescription>
    </Alert>
  );
};

export default WebhookTestResult;
