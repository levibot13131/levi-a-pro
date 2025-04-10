
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getWhaleMovements, getWhaleBehaviorPatterns, WhaleMovement } from "@/services/whaleTrackerService";
import { BarChart, Eye, TrendingUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface WhaleTrackerProps {
  assetId: string;
  formatPrice: (price: number) => string;
}

const WhaleTracker = ({ assetId, formatPrice }: WhaleTrackerProps) => {
  const [timeRange, setTimeRange] = useState<number>(7);
  const [minAmount, setMinAmount] = useState<number>(500000);
  
  const { data: whaleMovements, isLoading: movementsLoading } = useQuery({
    queryKey: ['whaleMovements', assetId, timeRange],
    queryFn: () => getWhaleMovements(assetId, timeRange),
  });
  
  const { data: behaviorPatterns, isLoading: patternsLoading } = useQuery({
    queryKey: ['whaleBehaviorPatterns', assetId],
    queryFn: () => getWhaleBehaviorPatterns(assetId),
  });

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('he-IL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    } else {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
  };
  
  const getSignificanceColor = (significance: WhaleMovement['impact']['significance']) => {
    switch(significance) {
      case 'very-high': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  const handleSliderChange = (value: number[]) => {
    if (value && value.length > 0) {
      setMinAmount(value[0]);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">מעקב ארנקים גדולים</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="movements" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="movements" className="flex items-center gap-1">
              <Eye className="h-4 w-4 ml-1" />
              תנועות ארנקים
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 ml-1" />
              דפוסי התנהגות
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="movements" className="mt-4 space-y-4">
            <div className="flex flex-col space-y-2 mb-4">
              <div className="flex justify-between">
                <span>טווח זמן: {timeRange} ימים</span>
                <span>סכום מינימלי: {formatAmount(minAmount)}</span>
              </div>
              <div className="py-2">
                <Slider 
                  defaultValue={[7]} 
                  max={90} 
                  min={1} 
                  step={1} 
                  onValueChange={(value) => setTimeRange(value[0])}
                />
              </div>
              <div className="py-2">
                <Slider 
                  defaultValue={[500000]} 
                  max={5000000} 
                  min={100000} 
                  step={100000} 
                  onValueChange={handleSliderChange}
                />
              </div>
            </div>
            
            {movementsLoading ? (
              <div className="text-center py-4">טוען נתונים...</div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {whaleMovements && whaleMovements
                  .filter(movement => movement.amount >= minAmount)
                  .map(movement => (
                    <div key={movement.id} className="border rounded-lg p-3 text-right">
                      <div className="flex justify-between items-start">
                        <Badge className={getSignificanceColor(movement.impact.significance)}>
                          {movement.impact.significance === 'very-high' ? 'משמעותי מאוד' :
                           movement.impact.significance === 'high' ? 'משמעותי' :
                           movement.impact.significance === 'medium' ? 'בינוני' : 'נמוך'}
                        </Badge>
                        <div>
                          <h4 className="font-semibold">
                            {movement.transactionType === 'buy' ? 'קנייה' : 
                             movement.transactionType === 'sell' ? 'מכירה' : 'העברה'}
                          </h4>
                          <p className="text-sm text-gray-500">{formatTimestamp(movement.timestamp)}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p>סכום: <span className="font-semibold">{formatAmount(movement.amount)}</span></p>
                        <p className="text-sm">
                          {movement.walletLabel ? movement.walletLabel : 
                           `ארנק: ${movement.walletAddress.substring(0, 6)}...${movement.walletAddress.substring(movement.walletAddress.length - 4)}`}
                        </p>
                        <p className="text-sm">
                          {movement.transactionType === 'transfer' ? 
                            `מ${movement.source} אל ${movement.destination}` : 
                            movement.transactionType === 'buy' ? 
                              `מ${movement.source}` : `אל ${movement.destination}`}
                        </p>
                      </div>
                      <div className="mt-2 text-sm">
                        <p>השפעה על המחיר: <span className={movement.impact.priceImpact > 2 ? 'text-red-500' : 'text-green-500'}>
                          {movement.impact.priceImpact.toFixed(2)}%
                        </span></p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="patterns" className="mt-4 space-y-4">
            {patternsLoading ? (
              <div className="text-center py-4">טוען נתונים...</div>
            ) : (
              <div className="space-y-6">
                {behaviorPatterns && behaviorPatterns.map((pattern, index) => (
                  <div key={index} className="border rounded-lg p-4 text-right">
                    <div className="flex justify-between items-center mb-2">
                      <Badge className={pattern.priceImpact.includes('+') ? 'bg-green-500' : 
                        pattern.priceImpact.includes('-') ? 'bg-red-500' : 'bg-gray-500'}>
                        {pattern.priceImpact}
                      </Badge>
                      <h3 className="text-lg font-semibold">{pattern.pattern}</h3>
                    </div>
                    <p className="mb-2">{pattern.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>התרחש לאחרונה: {formatTimestamp(pattern.lastOccurrence)}</span>
                      <span>רמת ביטחון: {pattern.confidence}%</span>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <p className="font-semibold">המלצה:</p>
                      <p>{pattern.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WhaleTracker;
