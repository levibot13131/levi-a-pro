
import React from 'react';
import { Asset } from '@/types/asset';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface MarketNewsHeaderProps {
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
  assets: Asset[] | undefined;
  onRefresh: () => void;
}

const MarketNewsHeader: React.FC<MarketNewsHeaderProps> = ({
  selectedFilter,
  setSelectedFilter,
  assets,
  onRefresh
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <h1 className="text-3xl font-bold mb-4 md:mb-0">סקירת שוק וחדשות</h1>
      
      <div className="flex gap-4 items-center">
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="כל הנכסים" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הנכסים</SelectItem>
            {assets?.map(asset => (
              <SelectItem key={asset.id} value={asset.id}>
                {asset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={onRefresh}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MarketNewsHeader;
