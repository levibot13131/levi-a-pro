
import React from 'react';
import { Button } from '@/components/ui/button';
import { BellRing, XCircle, Activity, Zap } from 'lucide-react';

interface AlertsControlsProps {
  isActive: boolean;
  signalsCount: number;
  toggleRealTimeAlerts: () => void;
  handleClearSignals: () => void;
  enableAutomaticAlerts?: () => void;
  areAutoAlertsEnabled?: boolean;
}

const AlertsControls: React.FC<AlertsControlsProps> = ({
  isActive,
  signalsCount,
  toggleRealTimeAlerts,
  handleClearSignals,
  enableAutomaticAlerts,
  areAutoAlertsEnabled
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-end">
      <Button
        variant={isActive ? "destructive" : "default"}
        size="sm"
        onClick={toggleRealTimeAlerts}
        className="gap-1"
      >
        {isActive ? (
          <>
            <XCircle className="h-4 w-4" />
            הפסק ניטור
          </>
        ) : (
          <>
            <BellRing className="h-4 w-4" />
            הפעל ניטור
          </>
        )}
      </Button>
      
      {enableAutomaticAlerts && !areAutoAlertsEnabled && (
        <Button
          variant="outline"
          size="sm"
          onClick={enableAutomaticAlerts}
          className="gap-1"
        >
          <Zap className="h-4 w-4" />
          התראות אוטומטיות
        </Button>
      )}
      
      {signalsCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearSignals}
          className="gap-1"
        >
          <XCircle className="h-4 w-4" />
          נקה התראות
        </Button>
      )}
    </div>
  );
};

export default AlertsControls;
