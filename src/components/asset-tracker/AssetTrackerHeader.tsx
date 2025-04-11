
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Pause, 
  Play, 
  RefreshCw, 
  PlusCircle
} from 'lucide-react';

interface AssetTrackerHeaderProps {
  trackingActive: boolean;
  handleToggleTracking: () => void;
  refetch: () => void;
  openAssetSearch: () => void;
  totalAssetsCount: number;
}

const AssetTrackerHeader: React.FC<AssetTrackerHeaderProps> = ({
  trackingActive,
  handleToggleTracking,
  refetch,
  openAssetSearch,
  totalAssetsCount
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="order-2 md:order-1">
        <Button 
          onClick={handleToggleTracking}
          variant={trackingActive ? "destructive" : "default"}
          className="flex items-center gap-2"
        >
          {trackingActive ? (
            <>
              <Pause className="h-4 w-4" />
              הפסק מעקב בזמן אמת
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              הפעל מעקב בזמן אמת
            </>
          )}
        </Button>
        
        <Button variant="outline" className="ml-2" onClick={refetch}>
          <RefreshCw className="h-4 w-4 mr-2" />
          רענן נתונים
        </Button>
        
        <Button variant="outline" className="ml-2" onClick={openAssetSearch}>
          <PlusCircle className="h-4 w-4 mr-2" />
          הוסף נכס למעקב
        </Button>
      </div>
      
      <div className="order-1 md:order-2 flex-1 text-right">
        <h1 className="text-3xl font-bold">מערכת מעקב נכסים</h1>
        <p className="text-muted-foreground">
          עוקב אחר {totalAssetsCount} נכסים בזמן אמת
        </p>
      </div>
    </div>
  );
};

export default AssetTrackerHeader;
