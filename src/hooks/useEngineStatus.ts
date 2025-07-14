
import { useState, useEffect } from 'react';
import { engineController } from '@/services/trading/engineController';

interface EngineStatus {
  isRunning: boolean;
  lastSignalTime: Date | null;
  totalSignals: number;
  totalRejections: number;
  lastAnalysis: number;
  analysisCount: number;
  lastAnalysisReport: string;
  signalsLast24h: number;
  lastSuccessfulSignal: number;
  failedTelegram: number;
  activeStrategies: any[];
  healthCheck?: {
    overallHealth: string;
    dataConnection: boolean;
    telegramConnection: boolean;
    apiConnections: boolean;
  };
}

export const useEngineStatus = () => {
  const [status, setStatus] = useState<EngineStatus>({
    isRunning: false,
    lastSignalTime: null,
    totalSignals: 0,
    totalRejections: 0,
    lastAnalysis: 0,
    analysisCount: 0,
    lastAnalysisReport: '',
    signalsLast24h: 0,
    lastSuccessfulSignal: 0,
    failedTelegram: 0,
    activeStrategies: []
  });

  useEffect(() => {
    const updateStatus = (newStatus: any) => {
      setStatus({
        isRunning: newStatus.isRunning || false,
        lastSignalTime: newStatus.lastSignalTime ? new Date(newStatus.lastSignalTime) : null,
        totalSignals: newStatus.totalSignals || 0,
        totalRejections: newStatus.totalRejections || 0,
        lastAnalysis: newStatus.lastAnalysis || 0,
        analysisCount: newStatus.analysisCount || 0,
        lastAnalysisReport: newStatus.lastAnalysisReport || '',
        signalsLast24h: newStatus.signalsLast24h || 0,
        lastSuccessfulSignal: newStatus.lastSuccessfulSignal || 0,
        failedTelegram: newStatus.failedTelegram || 0,
        activeStrategies: newStatus.activeStrategies || [],
        healthCheck: newStatus.healthCheck
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
