
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const EmptySignalsState: React.FC = () => {
  return (
    <div className="p-8 text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center mb-4">
        <AlertTriangle className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-medium">אין איתותים</h3>
      <p className="text-sm text-muted-foreground">
        אין איתותים זמינים כרגע. הפעל את ניתוח הנתונים בזמן אמת כדי לקבל התראות.
      </p>
    </div>
  );
};

export default EmptySignalsState;
