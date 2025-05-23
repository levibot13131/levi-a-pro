
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, LineChart, ShieldCheck } from 'lucide-react';
import ComprehensiveTab from './tabs/ComprehensiveTab';
import RecommendationTab from './tabs/RecommendationTab';
import StrategyTab from './tabs/StrategyTab';
import { Skeleton } from '@/components/ui/skeleton';

interface UserStrategy {
  description: string;
  riskRules: string[];
  entryRules: string[];
  exitRules: string[];
}

interface AnalysisSectionProps {
  technicalAnalysis: any;
  wyckoffPatterns: any;
  smcPatterns: any;
  whaleMovements: any;
  whaleBehavior: any;
  newsItems: any;
  selectedAsset: any;
  assetHistory: any;
  userStrategy: UserStrategy;
  formatPrice: (price: number) => string;
  calculateOverallRecommendation: () => { 
    signal: 'buy' | 'sell' | 'neutral'; 
    strength: number; 
    reasoning: string[] 
  };
  generateTradePlan: () => any;
  isLoading?: boolean;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({
  technicalAnalysis,
  wyckoffPatterns,
  smcPatterns,
  whaleMovements,
  whaleBehavior,
  newsItems,
  selectedAsset,
  assetHistory,
  userStrategy,
  formatPrice,
  calculateOverallRecommendation,
  generateTradePlan,
  isLoading = false
}) => {
  // Calculate only if not loading
  const recommendation = isLoading ? { signal: 'neutral' as const, strength: 0, reasoning: [] } : calculateOverallRecommendation();
  const tradePlan = isLoading ? null : generateTradePlan();

  if (isLoading) {
    return (
      <div className="mb-6">
        <Skeleton className="h-[400px] w-full mb-2" />
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <Tabs defaultValue="comprehensive" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="comprehensive" className="flex items-center gap-1">
            <Brain className="h-4 w-4 ml-1" />
            אנליזה מקיפה
          </TabsTrigger>
          <TabsTrigger value="recommendation" className="flex items-center gap-1">
            <LineChart className="h-4 w-4 ml-1" />
            המלצת מערכת
          </TabsTrigger>
          <TabsTrigger value="strategy" className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 ml-1" />
            אסטרטגיה אישית
          </TabsTrigger>
        </TabsList>
        
        {/* Comprehensive Analysis Content */}
        <TabsContent value="comprehensive">
          <ComprehensiveTab 
            technicalAnalysis={technicalAnalysis}
            wyckoffPatterns={wyckoffPatterns}
            smcPatterns={smcPatterns}
            whaleMovements={whaleMovements}
            whaleBehavior={whaleBehavior}
            newsItems={newsItems}
          />
        </TabsContent>
        
        {/* System Recommendation Content */}
        <TabsContent value="recommendation">
          <RecommendationTab 
            recommendation={recommendation}
            tradePlan={tradePlan}
            formatPrice={formatPrice}
          />
        </TabsContent>
        
        {/* Personal Strategy Content */}
        <TabsContent value="strategy">
          <StrategyTab userStrategy={userStrategy} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisSection;
