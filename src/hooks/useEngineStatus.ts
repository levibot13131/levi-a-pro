
import { useState, useEffect } from 'react';
import { engineController } from '@/services/trading/engineController';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface EngineStatus {
  isRunning: boolean;
  lastSignalTime: Date | null;
  totalSignals: number;
  activeStrategies: string[];
}

export const useEngineStatus = () => {
  const [status, setStatus] = useState<EngineStatus>({
    isRunning: false,
    lastSignalTime: null,
    totalSignals: 0,
    activeStrategies: []
  });

  // Fetch engine status from database
  const { data: dbStatus } = useQuery({
    queryKey: ['engine-status'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('trading_engine_status')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching engine status:', error);
        return null;
      }
      
      return data;
    },
    refetchInterval: 5000,
    enabled: true
  });

  useEffect(() => {
    const updateStatus = (newStatus: EngineStatus) => {
      setStatus(newStatus);
    };

    engineController.addStatusListener(updateStatus);
    
    // Initial status
    setStatus(engineController.getStatus());

    return () => {
      engineController.removeStatusListener(updateStatus);
    };
  }, []);

  useEffect(() => {
    if (dbStatus) {
      setStatus(prev => ({
        ...prev,
        isRunning: dbStatus.is_running,
        totalSignals: dbStatus.total_signals_generated,
        lastSignalTime: dbStatus.last_analysis_at ? new Date(dbStatus.last_analysis_at) : null
      }));
    }
  }, [dbStatus]);

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
