
import React from 'react';
import { Bell, BarChart } from 'lucide-react';

const EmptySignalsState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center text-muted-foreground">
      <Bell className="h-12 w-12 mb-3 text-muted-foreground/50" />
      <h3 className="text-lg font-medium mb-1">אין התראות</h3>
      <p className="text-sm max-w-xs">
        הפעל את ניטור בזמן אמת כדי לקבל התראות על שינויים משמעותיים בנכסים שלך
      </p>
      <div className="flex items-center mt-4 text-xs">
        <BarChart className="h-3 w-3 mr-1" />
        <span>התראות יופיעו כאן כשיזוהו איתותים</span>
      </div>
    </div>
  );
};

export default EmptySignalsState;
