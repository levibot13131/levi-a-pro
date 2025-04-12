
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Power, PowerOff, BellRing, Bell } from 'lucide-react';
import SignalsList from './SignalsList';
import EmptySignalsState from './EmptySignalsState';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export interface AlertsCardProps {
  signals: any[];
  isActive: boolean;
  toggleRealTimeAlerts: () => void;
  handleClearSignals: () => void;
  enableAutomaticAlerts?: () => void;
  areAutoAlertsEnabled?: boolean;
}

const AlertsCard: React.FC<AlertsCardProps> = ({ 
  signals,
  isActive,
  toggleRealTimeAlerts,
  handleClearSignals,
  enableAutomaticAlerts,
  areAutoAlertsEnabled
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">התראות בזמן אמת</CardTitle>
          <Button
            variant={isActive ? "destructive" : "default"}
            size="sm"
            onClick={toggleRealTimeAlerts}
            className="flex items-center gap-1.5"
          >
            {isActive ? (
              <>
                <PowerOff className="h-4 w-4" />
                <span>הפסק ניטור</span>
              </>
            ) : (
              <>
                <Power className="h-4 w-4" />
                <span>הפעל ניטור</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {signals.length > 0 ? (
          <SignalsList signals={signals} />
        ) : (
          <EmptySignalsState />
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleClearSignals}
          disabled={signals.length === 0}
          className="flex items-center gap-1.5"
        >
          <Trash2 className="h-4 w-4" />
          <span>נקה התראות</span>
        </Button>
        
        {enableAutomaticAlerts && (
          <div className="flex items-center space-x-2 space-x-reverse mr-2">
            <Switch 
              id="auto-alerts" 
              checked={areAutoAlertsEnabled}
              onCheckedChange={enableAutomaticAlerts}
            />
            <Label htmlFor="auto-alerts" className="flex items-center gap-1.5 text-sm">
              <BellRing className="h-4 w-4" />
              <span>התראות אוטומטיות</span>
            </Label>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AlertsCard;
