
import { useState, useEffect } from 'react';
import { engineController } from '@/services/trading/engineController';

interface EngineStatus {
  isRunning: boolean;
  lastSignalTime: Date | null;
  totalSignals: number;
  activeStrategies: string[];
}

export const useEngineStatus = () => {
  const [status, setStatus] = useState<EngineStatus>(engineController.getStatus());

  useEffect(() => {
    const handleStatusUpdate = (newStatus: EngineStatus) => {
      setStatus(newStatus);
    };

    engineController.addStatusListener(handleStatusUpdate);

    return () => {
      engineController.removeStatusListener(handleStatusUpdate);
    };
  }, []);

  const startEngine = async () => {
    return await engineController.startEngine();
  };

  const stopEngine = async () => {
    await engineController.stopEngine();
  };

  return {
    status,
    startEngine,
    stopEngine
  };
};
