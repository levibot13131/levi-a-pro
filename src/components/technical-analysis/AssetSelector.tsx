
import React from 'react';
import { Asset } from '@/types/asset';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AssetSelectorProps {
  assets: Asset[] | undefined;
  selectedAssetId: string;
  setSelectedAssetId: (value: string) => void;
  timeframeOptions: { value: string; label: string }[];
  selectedTimeframe: string;
  setSelectedTimeframe: (value: string) => void;
}

const AssetSelector = ({
  assets,
  selectedAssetId,
  setSelectedAssetId,
  timeframeOptions,
  selectedTimeframe,
  setSelectedTimeframe
}: AssetSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-4 justify-end mb-6">
      <div className="flex items-center gap-2">
        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="טווח זמן" />
          </SelectTrigger>
          <SelectContent>
            {timeframeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="בחר נכס" />
          </SelectTrigger>
          <SelectContent>
            {assets?.map(asset => (
              <SelectItem key={asset.id} value={asset.id}>
                {asset.name} ({asset.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AssetSelector;
