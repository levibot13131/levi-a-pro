
import React from 'react';
import { Button } from '../../../components/ui/button';
import { Clock, RefreshCw } from 'lucide-react';
import { useTradingViewIntegration } from '../../../hooks/use-tradingview-integration';
import { toast } from 'sonner';

interface SyncControlsProps {
  activeTab: string;
  isSyncing: boolean;
  handleManualRefresh: () => Promise<void>;
}

const SyncControls: React.FC<SyncControlsProps> = ({
  activeTab,
  isSyncing,
  handleManualRefresh
}) => {
  const { syncEnabled, toggleAutoSync } = useTradingViewIntegration();
  
  return (
    <div className="flex items-center gap-2 mt-4 md:mt-0">
      <Button 
        variant={syncEnabled ? "default" : "outline"}
        onClick={toggleAutoSync}
        className="gap-1"
      >
        <Clock className="h-4 w-4" />
        {syncEnabled ? 'כיבוי סנכרון אוטומטי' : 'הפעלת סנכרון אוטומטי'}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleManualRefresh}
        disabled={isSyncing}
        className="gap-1"
      >
        <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
        רענן נתונים
      </Button>
    </div>
  );
};

export default SyncControls;
