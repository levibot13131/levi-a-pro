
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart4 } from 'lucide-react';
import { MarketAnalysis, Asset } from '@/types/asset';
import AnalysisCard from './AnalysisCard';

interface AnalysesTabProps {
  selectedAssetId: string;
  setSelectedAssetId: (id: string) => void;
  selectedAnalysisType: string;
  setSelectedAnalysisType: (type: string) => void;
  assets?: Asset[];
  analyses?: MarketAnalysis[];
  analysesLoading: boolean;
  getAssetName: (assetId: string) => string;
}

const AnalysesTab: React.FC<AnalysesTabProps> = ({
  selectedAssetId,
  setSelectedAssetId,
  selectedAnalysisType,
  setSelectedAnalysisType,
  assets,
  analyses,
  analysesLoading,
  getAssetName
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 justify-end mb-4">
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
        
        <Select value={selectedAnalysisType} onValueChange={setSelectedAnalysisType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="כל סוגי הניתוח" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל סוגי הניתוח</SelectItem>
            <SelectItem value="technical">ניתוח טכני</SelectItem>
            <SelectItem value="fundamental">ניתוח פונדמנטלי</SelectItem>
            <SelectItem value="sentiment">ניתוח סנטימנט</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {analysesLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : analyses && analyses.length > 0 ? (
        <div className="space-y-6">
          {analyses.map(analysis => (
            <AnalysisCard 
              key={analysis.id} 
              analysis={analysis} 
              getAssetName={getAssetName} 
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <BarChart4 className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">אין ניתוחי שוק זמינים</p>
            <p className="text-muted-foreground">נסה להחליף את הפילטרים או לבדוק שוב מאוחר יותר</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalysesTab;
