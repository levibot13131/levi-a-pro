
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TechnicalIndicators from './TechnicalIndicators';
import PatternRecognition from './PatternRecognition';
import CustomSignals from './CustomSignals';
import SentimentAnalysis from './SentimentAnalysis';
import WhaleTracker from './WhaleTracker';
import { formatPrice } from '@/lib/utils';

interface SmartTabContentProps {
  assetId: string;
}

const SmartTabContent: React.FC<SmartTabContentProps> = ({ assetId }) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-right">ניתוח מתקדם</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="technical" className="w-full">
          <TabsList className="w-full mb-4 flex">
            <TabsTrigger value="technical" className="flex-1">אינדיקטורים טכניים</TabsTrigger>
            <TabsTrigger value="patterns" className="flex-1">זיהוי תבניות</TabsTrigger>
            <TabsTrigger value="signals" className="flex-1">איתותי מסחר</TabsTrigger>
            <TabsTrigger value="sentiment" className="flex-1">סנטימנט</TabsTrigger>
            <TabsTrigger value="whales" className="flex-1">תנועות לוויתנים</TabsTrigger>
          </TabsList>
          
          <TabsContent value="technical">
            <TechnicalIndicators assetId={assetId} />
          </TabsContent>
          
          <TabsContent value="patterns">
            <PatternRecognition assetId={assetId} />
          </TabsContent>
          
          <TabsContent value="signals">
            <CustomSignals assetId={assetId} formatPrice={formatPrice} />
          </TabsContent>
          
          <TabsContent value="sentiment">
            <SentimentAnalysis assetId={assetId} />
          </TabsContent>
          
          <TabsContent value="whales">
            <WhaleTracker assetId={assetId} formatPrice={formatPrice} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SmartTabContent;
