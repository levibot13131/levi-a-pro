
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPrice } from '@/lib/utils';
import { useTradeSignals } from '@/hooks/use-trade-signals';
import SignalList from './signals/SignalList';

export interface CustomSignalsProps {
  assetId: string;
  formatPrice?: (price: number) => string;
}

const CustomSignals: React.FC<CustomSignalsProps> = ({ 
  assetId, 
  formatPrice: propsFormatPrice 
}) => {
  const [activeTab, setActiveTab] = useState('current');
  const { currentSignals, pastSignals, isLoading } = useTradeSignals({ assetId });
  
  // Use the formatPrice from props if provided, otherwise use the imported one
  const priceFormatter = propsFormatPrice || formatPrice;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-right">איתותי מסחר ספציפיים לנכס</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="current" className="flex-1">איתותים נוכחיים</TabsTrigger>
            <TabsTrigger value="past" className="flex-1">איתותי עבר</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <SignalList 
                signals={currentSignals} 
                type="current" 
                formatPriceFn={priceFormatter} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <SignalList 
                signals={pastSignals} 
                type="past" 
                formatPriceFn={priceFormatter} 
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CustomSignals;
