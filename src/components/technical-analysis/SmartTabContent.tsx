
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, BookOpen, Target } from 'lucide-react';
import TradingLearningSystem from './TradingLearningSystem';
import TradingStrategy from './TradingStrategy';
import CustomSignals from './CustomSignals';

interface SmartTabContentProps {
  assetId: string;
}

const SmartTabContent: React.FC<SmartTabContentProps> = ({
  assetId,
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<string>("learning");
  
  return (
    <div className="space-y-6">
      <Tabs value={selectedSubTab} onValueChange={setSelectedSubTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-4">
          <TabsTrigger value="learning" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            מערכת למידה
          </TabsTrigger>
          <TabsTrigger value="strategy" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            השיטה שלי
          </TabsTrigger>
          <TabsTrigger value="signals" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            איתותים מותאמים
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="learning">
          <TradingLearningSystem assetId={assetId} />
        </TabsContent>
        
        <TabsContent value="strategy">
          <TradingStrategy />
        </TabsContent>
        
        <TabsContent value="signals">
          <CustomSignals assetId={assetId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartTabContent;
