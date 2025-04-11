
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PriceVolumeChart from '@/components/technical-analysis/PriceVolumeChart';
import { Asset } from '@/types/asset';

interface PriceChartSectionProps {
  selectedAsset: Asset | undefined;
  historyLoading: boolean;
  assetHistory: any;
  showVolume: boolean;
  setShowVolume: (show: boolean) => void;
  formatPrice: (price: number) => string;
  technicalAnalysis: any;
}

const PriceChartSection: React.FC<PriceChartSectionProps> = ({
  selectedAsset,
  historyLoading,
  assetHistory,
  showVolume,
  setShowVolume,
  formatPrice,
  technicalAnalysis
}) => {
  if (!selectedAsset) return null;

  return (
    <div className="mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-right flex items-center justify-between">
            <Badge 
              variant={selectedAsset.change24h >= 0 ? 'default' : 'destructive'}
              className={selectedAsset.change24h >= 0 ? 'bg-green-500' : 'bg-red-500'}
            >
              {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h.toFixed(2)}%
            </Badge>
            <div>{selectedAsset.name} ({selectedAsset.symbol})</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PriceVolumeChart 
            historyLoading={historyLoading}
            assetHistory={assetHistory}
            showVolume={showVolume}
            setShowVolume={setShowVolume}
            formatPrice={formatPrice}
            analysisData={technicalAnalysis}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceChartSection;
