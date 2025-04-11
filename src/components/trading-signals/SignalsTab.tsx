
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Play, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TradeSignal, Asset } from '@/types/asset';
import SignalCard from './SignalCard';

interface SignalsTabProps {
  selectedAssetId: string;
  setSelectedAssetId: (id: string) => void;
  assets?: Asset[];
  allSignals: TradeSignal[];
  signalsLoading: boolean;
  realTimeSignals: TradeSignal[];
  formatDate: (timestamp: number) => string;
  getAssetName: (assetId: string) => string;
  realTimeActive: boolean;
  toggleRealTimeAnalysis: () => void;
}

const SignalsTab: React.FC<SignalsTabProps> = ({
  selectedAssetId,
  setSelectedAssetId,
  assets,
  allSignals,
  signalsLoading,
  realTimeSignals,
  formatDate,
  getAssetName,
  realTimeActive,
  toggleRealTimeAnalysis
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
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
      </div>
      
      {signalsLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : allSignals && allSignals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {allSignals.map(signal => {
            const isRealTimeSignal = realTimeSignals.some(s => s.id === signal.id);
            
            return (
              <SignalCard 
                key={signal.id}
                signal={signal}
                assetName={getAssetName(signal.assetId)}
                isRealTimeSignal={isRealTimeSignal}
                formatDate={formatDate}
              />
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <Target className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">אין איתותי מסחר זמינים</p>
            <p className="text-muted-foreground">נסה להחליף את הפילטר או להפעיל ניתוח בזמן אמת</p>
            {!realTimeActive && (
              <Button className="mt-4" onClick={toggleRealTimeAnalysis}>
                <Play className="h-4 w-4 mr-2" />
                הפעל ניתוח בזמן אמת
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SignalsTab;
