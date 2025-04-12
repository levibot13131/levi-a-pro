
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const BasicAccountNotification: React.FC = () => {
  return (
    <Alert className="mb-6 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-900/50">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle className="text-right">הודעה חשובה</AlertTitle>
      <AlertDescription className="text-right">
        המערכת מותאמת לעבודה עם החשבון הבסיסי של TradingView. 
        אין צורך בחשבון Pro כדי להשתמש בכל התכונות.
        התראות, ניתוחים וחיבורים למערכות חיצוניות זמינים גם בחבילה הבסיסית.
      </AlertDescription>
    </Alert>
  );
};

export default BasicAccountNotification;
