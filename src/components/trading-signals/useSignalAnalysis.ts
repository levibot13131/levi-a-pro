
import { useMemo } from 'react';
import { TradeSignal } from '@/types/asset';
import { generateSignalAnalysis } from '@/services/backtesting/realTimeAnalysis/analysisGenerator';

export const useSignalAnalysis = (
  allSignals: TradeSignal[],
  selectedAssetId: string
) => {
  return useMemo(() => {
    if (!allSignals || allSignals.length === 0) return null;
    return generateSignalAnalysis(selectedAssetId !== 'all' ? selectedAssetId : undefined);
  }, [allSignals, selectedAssetId]);
};
