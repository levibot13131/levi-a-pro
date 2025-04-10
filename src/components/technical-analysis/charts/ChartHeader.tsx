
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';
import ChartToolbar from './ChartToolbar';

interface ChartHeaderProps {
  showVolume: boolean;
  setShowVolume: (value: boolean) => void;
  showPatterns: boolean;
  setShowPatterns: (value: boolean) => void;
  showSignals: boolean;
  setShowSignals: (value: boolean) => void;
  analyzeStrategy: () => void;
  analysisBusy: boolean;
  historyLoading: boolean;
  assetHistory: any;
}

const ChartHeader: React.FC<ChartHeaderProps> = ({
  showVolume,
  setShowVolume,
  showPatterns,
  setShowPatterns,
  showSignals,
  setShowSignals,
  analyzeStrategy,
  analysisBusy,
  historyLoading,
  assetHistory
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <ChartToolbar
          showVolume={showVolume}
          setShowVolume={setShowVolume}
          showPatterns={showPatterns} 
          setShowPatterns={setShowPatterns}
          showSignals={showSignals}
          setShowSignals={setShowSignals}
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={analyzeStrategy}
          disabled={analysisBusy || historyLoading || !assetHistory}
          className="flex items-center gap-1"
        >
          {analysisBusy ? (
            <div className="h-4 w-4 border-t-2 border-primary animate-spin rounded-full" />
          ) : (
            <History className="h-4 w-4" />
          )}
          ניתוח אסטרטגיה
        </Button>
      </div>
      <CardTitle className="text-right">גרף מחיר</CardTitle>
    </div>
  );
};

export default ChartHeader;
