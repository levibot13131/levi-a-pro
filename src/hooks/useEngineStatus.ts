
import { useState, useEffect } from 'react';
import { engineController } from '@/services/trading/engineController';

interface EngineStatus {
  isRunning: boolean;
  lastSignalTime: Date | null;
  totalSignals: number;
  activeStrategies: any[];
}

export const useEngineStatus = () => {
  const [status, setStatus] = useState<EngineStatus>({
    isRunning: false,
    lastSignalTime: null,
    totalSignals: 0,
    activeStrategies: []
  });

  useEffect(() => {
    const updateStatus = (newStatus: any) => {
      setStatus({
        isRunning: newStatus.isRunning,
        lastSignalTime: newStatus.lastSignalTime ? new Date(newStatus.lastSignalTime) : null,
        totalSignals: newStatus.totalSignals || 0,
        activeStrategies: newStatus.activeStrategies || []
      });
    };

    engineController.addStatusListener(updateStatus);
    
    // Initial status
    const initialStatus = engineController.getStatus();
    updateStatus(initialStatus);

    return () => {
      engineController.removeStatusListener(updateStatus);
    };
  }, []);

  const startEngine = async () => {
    return await engineController.startEngine();
  };

  const stopEngine = async () => {
    engineController.stopEngine();
  };

  return {
    status,
    startEngine,
    stopEngine
  };
};
