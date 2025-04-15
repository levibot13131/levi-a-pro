
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TradeSignal } from '@/types/asset';
import { getTradeSignals, getMarketAnalyses } from '@/services/mockTradingService';
import { getAssets } from '@/services/mockDataService';
import { toast } from 'sonner';

import { startRealTimeAnalysis } from '@/services/backtesting/realTimeAnalysis/alertSystem';
import { useStoredSignals, getSignals } from '@/services/backtesting/realTimeAnalysis/signalStorage';
import { TradeSignal as RealTimeTradeSignal } from '@/services/backtesting/realTimeAnalysis/signalStorage';

// Helper function to convert RealTimeTradeSignal to TradeSignal
const convertSignal = (signal: RealTimeTradeSignal): TradeSignal => {
  return {
    id: signal.id,
    assetId: signal.asset, // Map asset to assetId
    type: signal.type === 'alert' ? 'buy' : signal.type, // Convert 'alert' to 'buy' to satisfy type constraints
    message: signal.message,
    timestamp: typeof signal.timestamp === 'string' ? parseInt(signal.timestamp, 10) : signal.timestamp, // Ensure timestamp is a number
    price: signal.price || 0,
    strength: 'medium', // Default value
    strategy: signal.source || 'real-time', // Use source or default
    timeframe: '1h', // Default value
    createdAt: new Date(signal.timestamp).toISOString(),
  };
};

export const useTradingSignals = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('all');
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<string>('all');
  const [realTimeActive, setRealTimeActive] = useState<boolean>(false);
  const [alertInstance, setAlertInstance] = useState<{ stop: () => void } | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  const { data: mockSignals, isLoading: mockSignalsLoading } = useQuery({
    queryKey: ['tradeSignals', selectedAssetId],
    queryFn: () => getTradeSignals(selectedAssetId !== 'all' ? selectedAssetId : undefined),
  });
  
  const { data: realTimeSignalsRaw = [], refetch: refetchRealTimeSignals } = useStoredSignals();
  
  // Convert RealTimeTradeSignal to TradeSignal
  const realTimeSignals = realTimeSignalsRaw.map(convertSignal);
  
  const { data: analyses, isLoading: analysesLoading } = useQuery({
    queryKey: ['marketAnalyses', selectedAssetId, selectedAnalysisType],
    queryFn: () => getMarketAnalyses(
      selectedAssetId !== 'all' ? selectedAssetId : undefined,
      selectedAnalysisType !== 'all' ? selectedAnalysisType as any : undefined
    ),
  });
  
  const { data: assets } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
  });
  
  const allSignals: TradeSignal[] = (() => {
    const mockSignalsArray = mockSignals || [];
    const combined = [...mockSignalsArray, ...realTimeSignals];
    return combined.sort((a, b) => b.timestamp - a.timestamp);
  })();
  
  useEffect(() => {
    const interval = setInterval(() => {
      refetchRealTimeSignals();
    }, 5000);
    
    return () => {
      clearInterval(interval);
      if (alertInstance) {
        alertInstance.stop();
      }
    };
  }, [refetchRealTimeSignals, alertInstance]);
  
  const toggleRealTimeAnalysis = () => {
    if (realTimeActive && alertInstance) {
      alertInstance.stop();
      setAlertInstance(null);
      setRealTimeActive(false);
      toast.info("ניתוח בזמן אמת הופסק");
    } else {
      const assetsList = selectedAssetId !== 'all' 
        ? [selectedAssetId] 
        : assets?.slice(0, 5).map(a => a.id) || [];
      
      const instance = startRealTimeAnalysis(assetsList, {
        strategy: "A.A",
      });
      
      setAlertInstance(instance);
      setRealTimeActive(true);
      toast.success("ניתוח בזמן אמת הופעל", {
        description: `המערכת תתחיל לשלוח התראות בזמן אמת עבור ${assetsList.length} נכסים`
      });
    }
  };
  
  const getAssetName = (assetId: string) => {
    return assets?.find(a => a.id === assetId)?.name || assetId;
  };
  
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('he-IL', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return {
    selectedAssetId,
    setSelectedAssetId,
    selectedAnalysisType,
    setSelectedAnalysisType,
    realTimeActive,
    showSettings,
    setShowSettings,
    assets,
    allSignals,
    signalsLoading: mockSignalsLoading,
    realTimeSignals,
    analyses,
    analysesLoading,
    formatDate,
    getAssetName,
    toggleRealTimeAnalysis
  };
};
