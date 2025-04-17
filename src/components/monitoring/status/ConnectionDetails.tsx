
import React from 'react';
import { StatusIndicator } from './StatusIndicator';
import { RealTimeStatus } from '@/services/realtime/realtimeService';

interface ConnectionDetailsProps {
  status: RealTimeStatus | null;
  isLoading: boolean;
}

export const ConnectionDetails: React.FC<ConnectionDetailsProps> = ({ 
  status, 
  isLoading 
}) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <StatusIndicator 
        label="TradingView" 
        isActive={!!status?.tradingView} 
        isLoading={isLoading}
      />
      <StatusIndicator 
        label="Binance" 
        isActive={!!status?.binance} 
        isLoading={isLoading}
      />
      <StatusIndicator 
        label="Twitter" 
        isActive={!!status?.twitter} 
        isLoading={isLoading}
      />
    </div>
  );
};
