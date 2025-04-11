
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BellRing, Activity } from 'lucide-react';
import { TradeSignal } from '@/types/asset';
import AlertsControls from './AlertsControls';
import SignalsList from './SignalsList';
import EmptyAlertsState from './EmptyAlertsState';

interface AlertsCardProps {
  signals: TradeSignal[];
  isActive: boolean;
  toggleRealTimeAlerts: () => void;
  handleClearSignals: () => void;
}

const AlertsCard: React.FC<AlertsCardProps> = ({
  signals,
  isActive,
  toggleRealTimeAlerts,
  handleClearSignals,
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <AlertsControls 
            isActive={isActive} 
            signalsCount={signals.length} 
            toggleRealTimeAlerts={toggleRealTimeAlerts} 
            handleClearSignals={handleClearSignals} 
          />
          <div>
            <CardTitle className="text-right">התראות ואיתותים בזמן אמת</CardTitle>
            <CardDescription className="text-right">
              {isActive ? (
                <span className="flex items-center justify-end gap-1 text-green-600">
                  <Activity className="h-3 w-3 animate-pulse" />
                  מערכת ניתוח פעילה
                </span>
              ) : (
                "מערכת ניתוח מושבתת"
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {signals.length > 0 ? (
          <SignalsList signals={signals} />
        ) : (
          <EmptyAlertsState isActive={isActive} toggleRealTimeAlerts={toggleRealTimeAlerts} />
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsCard;
