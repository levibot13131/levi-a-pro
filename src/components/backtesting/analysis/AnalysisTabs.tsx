
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
  // Fallback for null/undefined analysis data
  const safeAnalysis = analysis || {
    historical: {
      keyEvents: [],
      trends: [],
      cyclicalPatterns: []
    },
    current: {
      marketCondition: '',
      sentimentAnalysis: {
        overall: '',
        social: '',
        news: '',
        fearGreedIndex: 0
      },
      keyLevels: [],
      technicalIndicators: []
    },
    future: {
      shortTerm: {
        prediction: '',
        confidence: 0,
        keyLevels: [],
        significantEvents: []
      },
      longTerm: {
        trend: '',
        keyFactors: [],
        scenarios: []
      }
    }
  };

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
          keyEvents={safeAnalysis.historical.keyEvents}
          trends={safeAnalysis.historical.trends}
          cyclicalPatterns={safeAnalysis.historical.cyclicalPatterns}
        />
      </TabsContent>
      
      <TabsContent value="current" className="text-right">
        <CurrentAnalysisTab 
          marketCondition={safeAnalysis.current}
          sentimentAnalysis={safeAnalysis.current.sentimentAnalysis}
          keyLevels={safeAnalysis.current.keyLevels}
          technicalIndicators={safeAnalysis.current.technicalIndicators}
        />
      </TabsContent>
      
      <TabsContent value="future" className="text-right">
        <FutureAnalysisTab 
          shortTerm={safeAnalysis.future.shortTerm}
          longTerm={safeAnalysis.future.longTerm}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AnalysisTabs;
