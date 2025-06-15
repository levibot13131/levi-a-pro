
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
      {(alertProps) => (
        <AlertsCard
          signals={alertProps.signals}
          isActive={alertProps.isActive}
          toggleRealTimeAlerts={alertProps.toggleRealTimeAlerts}
          handleClearSignals={alertProps.handleClearSignals}
          enableAutomaticAlerts={alertProps.enableAutomaticAlerts}
          areAutoAlertsEnabled={alertProps.areAutoAlertsEnabled}
          isBinanceConnected={alertProps.isBinanceConnected}
          binanceMarketData={alertProps.binanceMarketData}
          proxyStatus={alertProps.proxyStatus}
        />
      )}
    </RealTimeAlertsService>
  );
};

export default RealTimeAlerts;
