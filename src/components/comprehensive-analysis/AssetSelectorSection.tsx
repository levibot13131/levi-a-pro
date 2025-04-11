
import React from 'react';
import { Badge } from '@/components/ui/badge';
import AssetSelector from '@/components/technical-analysis/AssetSelector';
import { Asset } from '@/types/asset';

interface AssetSelectorSectionProps {
  assets: Asset[] | undefined;
  selectedAssetId: string;
  setSelectedAssetId: (id: string) => void;
  timeframeOptions: Array<{ value: string; label: string }>;
  selectedTimeframe: string;
  setSelectedTimeframe: (timeframe: string) => void;
  selectedAsset: Asset | undefined;
}

const AssetSelectorSection: React.FC<AssetSelectorSectionProps> = ({
  assets,
  selectedAssetId,
  setSelectedAssetId,
  timeframeOptions,
  selectedTimeframe,
  setSelectedTimeframe,
  selectedAsset,
}) => {
  return (
    <>
      {/* Asset and Timeframe Selection */}
      <AssetSelector 
        assets={assets}
        selectedAssetId={selectedAssetId}
        setSelectedAssetId={setSelectedAssetId}
        timeframeOptions={timeframeOptions}
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
      />
      
      {/* Price Chart Header */}
      {selectedAsset && (
        <div className="mb-6">
          <Badge 
            className={selectedAsset.change24h >= 0 ? 'bg-green-500' : 'bg-red-500'}
            variant={selectedAsset.change24h >= 0 ? 'default' : 'destructive'}
          >
            {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h.toFixed(2)}%
          </Badge>
          <span className="ml-2 font-medium">
            {selectedAsset.name} ({selectedAsset.symbol})
          </span>
        </div>
      )}
    </>
  );
};

export default AssetSelectorSection;
