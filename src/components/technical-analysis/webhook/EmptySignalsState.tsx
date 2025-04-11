
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const EmptySignalsState: React.FC = () => {
  return (
    <div className="p-6 text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center mb-4">
        <AlertTriangle className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-medium">אין התראות פעילות</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        אין התראות זמינות כרגע מטריידינגויו. הגדר התראות ב-TradingView המחוברות ל-Webhook שלך כדי לקבל התראות בזמן אמת.
      </p>
    </div>
  );
};

export default EmptySignalsState;
