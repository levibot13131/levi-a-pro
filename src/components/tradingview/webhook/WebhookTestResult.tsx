
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface WebhookTestResultProps {
  lastTestResult: { success: boolean; type: string; time: Date } | null;
}

const WebhookTestResult: React.FC<WebhookTestResultProps> = ({ lastTestResult }) => {
  if (!lastTestResult) return null;
  
  const getTypeHebrew = (type: string) => {
    switch (type) {
      case 'buy': return 'קנייה';
      case 'sell': return 'מכירה';
      case 'info': return 'מידע';
      default: return type;
    }
  };
  
  return (
    <div className="flex justify-center mt-2">
      <Badge 
        variant={lastTestResult.success ? "outline" : "outline"}
        className={`gap-1 ${
          lastTestResult.success 
            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
        }`}
      >
        {lastTestResult.success ? (
          <CheckCircle className="h-3 w-3" />
        ) : (
          <XCircle className="h-3 w-3" />
        )}
        בדיקת התראת {getTypeHebrew(lastTestResult.type)} 
        {lastTestResult.success ? " הצליחה" : " נכשלה"}
        <span className="mx-1">•</span>
        <span className="text-xs opacity-80">
          {lastTestResult.time.toLocaleTimeString('he-IL')}
        </span>
      </Badge>
    </div>
  );
};

export default WebhookTestResult;
