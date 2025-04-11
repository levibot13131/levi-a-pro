
import React from 'react';
import { Button } from '@/components/ui/button';
import { BellRing } from 'lucide-react';

interface EmptyAlertsStateProps {
  isActive: boolean;
  toggleRealTimeAlerts: () => void;
}

const EmptyAlertsState: React.FC<EmptyAlertsStateProps> = ({ isActive, toggleRealTimeAlerts }) => {
  return (
    <div className="text-center p-10 space-y-2">
      <BellRing className="h-10 w-10 mx-auto text-muted-foreground" />
      <p className="text-muted-foreground">אין התראות עדיין</p>
      {!isActive && (
        <Button onClick={toggleRealTimeAlerts} variant="outline">
          הפעל ניתוח בזמן אמת
        </Button>
      )}
    </div>
  );
};

export default EmptyAlertsState;
