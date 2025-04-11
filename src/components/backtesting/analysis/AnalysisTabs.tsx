
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, TrendingUp, Timer } from 'lucide-react';
import HistoricalAnalysisTab from './HistoricalAnalysisTab';
import CurrentAnalysisTab from './CurrentAnalysisTab';
import FutureAnalysisTab from './FutureAnalysisTab';

interface AnalysisData {
  historical: {
    keyEvents: Array<{
      event: string;
      date: string;
      impact: string;
    }>;
    trends: Array<{
      period: string;
      direction: string;
      strength: string | number;
    }>;
    cyclicalPatterns: Array<{
      name: string;
      description: string;
    }>;
  };
  current: {
    marketCondition: string;
    sentimentAnalysis: {
      overall: string;
      social: string;
      news: string;
      fearGreedIndex: number;
    };
    keyLevels: Array<{
      price: number;
      type: string;
      strength: string;
    }>;
    technicalIndicators: Array<{
      name: string;
      value: string | number;
      interpretation: string;
    }>;
  };
  future: {
    shortTerm: {
      prediction: string;
      confidence: number;
      keyLevels: Array<{
        scenario: string;
        target: number;
        probability: number;
      }>;
      significantEvents: Array<{
        event: string;
        date: string;
        potentialImpact: string;
      }>;
    };
    longTerm: {
      trend: string;
      keyFactors: string[];
      scenarios: Array<{
        description: string;
        probability: number;
        timeframe: string;
        priceTarget: number;
      }>;
    };
  };
}

interface AnalysisTabsProps {
  analysis: AnalysisData;
}

const AnalysisTabs: React.FC<AnalysisTabsProps> = ({ analysis }) => {
  return (
    <Tabs defaultValue="current">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="historical">
          <History className="h-4 w-4 mr-2" />
          עבר
        </TabsTrigger>
        <TabsTrigger value="current">
          <TrendingUp className="h-4 w-4 mr-2" />
          הווה
        </TabsTrigger>
        <TabsTrigger value="future">
          <Timer className="h-4 w-4 mr-2" />
          עתיד
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="historical" className="text-right">
        <HistoricalAnalysisTab 
          keyEvents={analysis.historical.keyEvents}
          trends={analysis.historical.trends}
          cyclicalPatterns={analysis.historical.cyclicalPatterns}
        />
      </TabsContent>
      
      <TabsContent value="current" className="text-right">
        <CurrentAnalysisTab 
          marketCondition={analysis.current}
          sentimentAnalysis={analysis.current.sentimentAnalysis}
          keyLevels={analysis.current.keyLevels}
          technicalIndicators={analysis.current.technicalIndicators}
        />
      </TabsContent>
      
      <TabsContent value="future" className="text-right">
        <FutureAnalysisTab 
          shortTerm={analysis.future.shortTerm}
          longTerm={analysis.future.longTerm}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AnalysisTabs;
