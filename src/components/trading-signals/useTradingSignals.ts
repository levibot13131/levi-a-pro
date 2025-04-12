
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TradeSignal } from '@/types/asset';
import { getTradeSignals, getMarketAnalyses } from '@/services/mockTradingService';
import { getAssets } from '@/services/mockDataService';
import { startRealTimeAnalysis } from '@/services/backtesting/realTimeAnalysis';
import { useStoredSignals } from '@/services/backtesting/realTimeAnalysis/signalStorage';
import { toast } from 'sonner';

export const useTradingSignals = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('all');
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<string>('all');
  const [realTimeActive, setRealTimeActive] = useState<boolean>(false);
  const [alertInstance, setAlertInstance] = useState<{ stop: () => void } | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Data fetching for mock signals
  const { data: mockSignals, isLoading: mockSignalsLoading } = useQuery({
    queryKey: ['tradeSignals', selectedAssetId],
    queryFn: () => getTradeSignals(selectedAssetId !== 'all' ? selectedAssetId : undefined),
  });
  
  // Real-time signals
  const { data: realTimeSignals = [], refetch: refetchRealTimeSignals } = useStoredSignals();
  
  // Analyses data
  const { data: analyses, isLoading: analysesLoading } = useQuery({
    queryKey: ['marketAnalyses', selectedAssetId, selectedAnalysisType],
    queryFn: () => getMarketAnalyses(
      selectedAssetId !== 'all' ? selectedAssetId : undefined,
      selectedAnalysisType !== 'all' ? selectedAnalysisType as any : undefined
    ),
  });
  
  // Assets data
  const { data: assets } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
  });
  
  // Combined signals
  const allSignals: TradeSignal[] = (() => {
    const combined = [...(mockSignals || []), ...realTimeSignals];
    // Sort by timestamp (newest first)
    return combined.sort((a, b) => b.timestamp - a.timestamp);
  })();
  
  // Periodic refresh of real-time signals
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
  
  // Function to toggle real-time analysis
  const toggleRealTimeAnalysis = () => {
    if (realTimeActive && alertInstance) {
      alertInstance.stop();
      setAlertInstance(null);
      setRealTimeActive(false);
      toast.info("ניתוח בזמן אמת הופסק");
    } else {
      // Start real-time analysis for all assets or selected asset
      const assetsList = selectedAssetId !== 'all' 
        ? [selectedAssetId] 
        : assets?.slice(0, 5).map(a => a.id) || []; // Limit to 5 assets
      
      const instance = startRealTimeAnalysis(assetsList, {
        strategy: "A.A", // Using a valid strategy
      });
      
      setAlertInstance(instance);
      setRealTimeActive(true);
      toast.success("ניתוח בזמן אמת הופעל", {
        description: `המערכת תתחיל לשלוח התראות בזמן אמת עבור ${assetsList.length} נכסים`
      });
    }
  };
  
  // Helper function to get asset name
  const getAssetName = (assetId: string) => {
    return assets?.find(a => a.id === assetId)?.name || assetId;
  };
  
  // Helper function to format date
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
