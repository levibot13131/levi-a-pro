
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ChartArea } from '@/types/asset';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PatternProcessorProps {
  chartData: any;
  timeframe: string;
  onPatternDetected?: (patterns: ChartArea[]) => void;
}

const PatternProcessor: React.FC<PatternProcessorProps> = ({
  chartData,
  timeframe,
  onPatternDetected
}) => {
  const [detectedPatterns, setDetectedPatterns] = useState<ChartArea[]>([]);
  
  useEffect(() => {
    if (!chartData || chartData.length < 20) return;
    
    // Basic pattern detection logic for demonstration
    const patterns: ChartArea[] = [];
    
    // Detect potential support/resistance zones
    const prices = chartData.map((point: any) => point.price);
    const max = Math.max(...prices);
    const min = Math.min(...prices);
    
    // Detect a simple "double bottom" pattern
    // This is very simplified - real pattern detection would be more complex
    for (let i = 10; i < chartData.length - 10; i++) {
      const windowPrices = prices.slice(i - 10, i + 10);
      const localMin = Math.min(...windowPrices);
      
      if (Math.abs(chartData[i].price - localMin) < 0.01 * localMin) {
        // Potential support level
        patterns.push({
          id: `support-${i}`,
          assetId: 'current-asset',
          name: 'תמיכה אפשרית',
          description: 'זוהתה רמת תמיכה אפשרית',
          startTimestamp: chartData[i - 5].timestamp,
          endTimestamp: chartData[i + 5].timestamp,
          minPrice: localMin * 0.99,
          maxPrice: localMin * 1.01,
          type: 'support'
        });
      }
    }
    
    // Detect a simple resistance level
    for (let i = 10; i < chartData.length - 10; i++) {
      const windowPrices = prices.slice(i - 10, i + 10);
      const localMax = Math.max(...windowPrices);
      
      if (Math.abs(chartData[i].price - localMax) < 0.01 * localMax) {
        patterns.push({
          id: `resistance-${i}`,
          assetId: 'current-asset',
          name: 'התנגדות אפשרית',
          description: 'זוהתה רמת התנגדות אפשרית',
          startTimestamp: chartData[i - 5].timestamp,
          endTimestamp: chartData[i + 5].timestamp,
          minPrice: localMax * 0.99,
          maxPrice: localMax * 1.01,
          type: 'resistance'
        });
      }
    }
    
    setDetectedPatterns(patterns);
    if (onPatternDetected) {
      onPatternDetected(patterns);
    }
  }, [chartData, timeframe, onPatternDetected]);
  
  if (detectedPatterns.length === 0) {
    return null;
  }
  
  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <h3 className="text-right font-medium mb-2">דפוסים שזוהו על הגרף</h3>
        <div className="flex flex-wrap gap-2 justify-end">
          {detectedPatterns.map((pattern, index) => (
            <Badge 
              key={index}
              variant="outline" 
              className={
                pattern.type === 'support' 
                  ? 'bg-green-100 text-green-800' 
                  : pattern.type === 'resistance'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
              }
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              {pattern.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatternProcessor;
