
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Trash2 } from 'lucide-react';

interface AlertsControlsProps {
  isActive: boolean;
  signalsCount: number;
  toggleRealTimeAlerts: () => void;
  handleClearSignals: () => void;
}

const AlertsControls: React.FC<AlertsControlsProps> = ({
  isActive,
  signalsCount,
  toggleRealTimeAlerts,
  handleClearSignals
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant={isActive ? "destructive" : "default"}
        onClick={toggleRealTimeAlerts}
        className="gap-2"
      >
        {isActive ? (
          <>
            <Pause className="h-4 w-4" />
            הפסק התראות
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            הפעל התראות בזמן אמת
          </>
        )}
      </Button>
      {signalsCount > 0 && (
        <Button
          variant="outline"
          onClick={handleClearSignals}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          נקה התראות
        </Button>
      )}
    </div>
  );
};

export default AlertsControls;
