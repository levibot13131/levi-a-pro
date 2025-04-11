
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { generateComprehensiveAnalysis } from '@/services/backtesting/realTimeAnalysis';
import TimeframeSelector from './analysis/TimeframeSelector';
import AnalysisTabs from './analysis/AnalysisTabs';
import LoadingState from './analysis/LoadingState';
import EmptyAnalysisState from './analysis/EmptyAnalysisState';

interface ComprehensiveAnalysisProps {
  assetId: string;
}

const ComprehensiveAnalysis: React.FC<ComprehensiveAnalysisProps> = ({ assetId }) => {
  const [timeframe, setTimeframe] = useState('1d');
  
  const { data: analysis, isLoading, refetch } = useQuery({
    queryKey: ['comprehensiveAnalysis', assetId, timeframe],
    queryFn: () => generateComprehensiveAnalysis(assetId, timeframe),
    refetchOnWindowFocus: false,
  });
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (!analysis) {
    return <EmptyAnalysisState onRefetch={() => refetch()} />;
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <TimeframeSelector timeframe={timeframe} setTimeframe={setTimeframe} />
          <CardTitle className="text-right">ניתוח היסטורי, עכשווי ועתידי</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <AnalysisTabs analysis={analysis} />
      </CardContent>
    </Card>
  );
};

export default ComprehensiveAnalysis;
