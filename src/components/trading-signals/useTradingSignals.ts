import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TradeSignal } from '@/types/asset';
import { getTradeSignals, getMarketAnalyses } from '@/services/mockTradingService';
import { getAssets } from '@/services/mockDataService';
import { toast } from 'sonner';

import { startRealTimeAnalysis } from '@/services/backtesting/realTimeAnalysis/alertSystem';
import { useStoredSignals } from '@/services/backtesting/realTimeAnalysis/signalStorage';

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
  
  const { data: realTimeSignals = [], refetch: refetchRealTimeSignals } = useStoredSignals();
  
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
    const combined = [...(mockSignals || []), ...realTimeSignals];
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
