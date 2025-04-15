
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, BellOff, Trash2, BellRing, ShieldAlert, Link as LinkIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TradeSignal } from '@/types/asset';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { getProxyConfig } from '@/services/proxy/proxyConfig';

import SignalsList from './SignalsList';
import EmptySignalsState from './EmptySignalsState';
import EmptyAlertsState from './EmptyAlertsState';
import AlertsControls from './AlertsControls';

interface AlertsCardProps {
  signals: TradeSignal[];
  isActive: boolean;
  toggleRealTimeAlerts: () => void;
  handleClearSignals: () => void;
  enableAutomaticAlerts: () => void;
  areAutoAlertsEnabled: boolean;
  isBinanceConnected: boolean;
  binanceMarketData?: any;
  proxyStatus?: { isEnabled: boolean; hasUrl: boolean };
}

const AlertsCard: React.FC<AlertsCardProps> = ({
  signals,
  isActive,
  toggleRealTimeAlerts,
  handleClearSignals,
  enableAutomaticAlerts,
  areAutoAlertsEnabled,
  isBinanceConnected,
  binanceMarketData,
  proxyStatus = { isEnabled: false, hasUrl: false }
}) => {
  const showProxyWarning = isActive && !proxyStatus.isEnabled;
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between bg-muted/50 pb-2">
        <div className="flex items-center gap-2">
          <Badge
            variant={isActive ? "default" : "outline"}
            className={isActive ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {isActive ? "פעיל" : "לא פעיל"}
          </Badge>
          {signals.length > 0 && (
            <Badge variant="secondary">{signals.length} התראות</Badge>
          )}
        </div>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          התראות וניתוח בזמן אמת
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {showProxyWarning && (
          <Alert variant="warning" className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-right text-amber-800 dark:text-amber-300">התראות בזמן אמת ללא פרוקסי</AlertTitle>
            <AlertDescription className="text-right text-amber-700 dark:text-amber-400">
              מומלץ להגדיר פרוקסי לקבלת התראות מתקדמות וחיבור API מאובטח
              <div className="mt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/proxy-settings">
                    <LinkIcon className="mr-2 h-3 w-3" />
                    הגדר פרוקסי
                  </Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      
        <AlertsControls
          isActive={isActive}
          toggleRealTimeAlerts={toggleRealTimeAlerts}
          signalsCount={signals.length}
          handleClearSignals={handleClearSignals}
          isBinanceConnected={isBinanceConnected}
          enableAutomaticAlerts={enableAutomaticAlerts}
          areAutoAlertsEnabled={areAutoAlertsEnabled}
        />
        
        <div className="mt-4">
          {signals.length > 0 ? (
            <SignalsList signals={signals} marketData={binanceMarketData} />
          ) : isActive ? (
            <EmptySignalsState />
          ) : (
            <EmptyAlertsState 
              isActive={isActive}
              toggleRealTimeAlerts={toggleRealTimeAlerts}
              enableAutomaticAlerts={enableAutomaticAlerts} 
              areAutoAlertsEnabled={areAutoAlertsEnabled}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsCard;
