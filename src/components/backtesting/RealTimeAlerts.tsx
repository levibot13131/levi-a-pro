
import React from 'react';
import { BacktestSettings } from '@/services/backtesting/types';
import RealTimeAlertsService from './realtime/RealTimeAlertsService';
import AlertsCard from './realtime/AlertsCard';

interface RealTimeAlertsProps {
  assetIds: string[];
  settings: Partial<BacktestSettings>;
}

const RealTimeAlerts: React.FC<RealTimeAlertsProps> = ({ assetIds, settings }) => {
  return (
    <RealTimeAlertsService assetIds={assetIds} settings={settings}>
      {({ signals, isActive, toggleRealTimeAlerts, handleClearSignals, enableAutomaticAlerts, areAutoAlertsEnabled }) => (
        <AlertsCard
          signals={signals}
          isActive={isActive}
          toggleRealTimeAlerts={toggleRealTimeAlerts}
          handleClearSignals={handleClearSignals}
          enableAutomaticAlerts={enableAutomaticAlerts}
          areAutoAlertsEnabled={areAutoAlertsEnabled}
        />
      )}
    </RealTimeAlertsService>
  );
};

export default RealTimeAlerts;
