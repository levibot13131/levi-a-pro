
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface MarketCondition {
  marketCondition: string;
}

interface SentimentAnalysis {
  overall: string;
  social: string;
  news: string;
  fearGreedIndex: number;
}

interface PriceLevel {
  price: number;
  type: string;
  strength: string;
}

interface TechnicalIndicator {
  name: string;
  value: string | number;
  interpretation: string;
}

interface CurrentAnalysisTabProps {
  marketCondition: MarketCondition;
  sentimentAnalysis: SentimentAnalysis;
  keyLevels: PriceLevel[];
  technicalIndicators: TechnicalIndicator[];
}

const CurrentAnalysisTab: React.FC<CurrentAnalysisTabProps> = ({
  marketCondition,
  sentimentAnalysis,
  keyLevels,
  technicalIndicators
}) => {
  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-bold mb-3">מצב שוק נוכחי</h3>
          <Badge
            className={
              marketCondition.marketCondition === 'bull'
                ? 'bg-green-100 text-green-800'
                : marketCondition.marketCondition === 'bear'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }
          >
            {marketCondition.marketCondition === 'bull'
              ? 'שוק שורי (עולה)'
              : marketCondition.marketCondition === 'bear'
              ? 'שוק דובי (יורד)'
              : 'שוק צידי (דשדוש)'}
          </Badge>
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-bold mb-3">ניתוח סנטימנט</h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-medium">{sentimentAnalysis.overall}</span>
              <span>כללי:</span>
            </div>
            <div className="flex justify-between">
              <span>{sentimentAnalysis.social}</span>
              <span>מדיה חברתית:</span>
            </div>
            <div className="flex justify-between">
              <span>{sentimentAnalysis.news}</span>
              <span>חדשות:</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{sentimentAnalysis.fearGreedIndex}/100</span>
              <span>מדד פחד/חמדנות:</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-bold mb-3">רמות מחיר מרכזיות</h3>
        <div className="space-y-2">
          {keyLevels.map((level, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-2">
              <Badge
                variant={level.type === 'support' ? 'outline' : 'secondary'}
                className={level.strength === 'strong' ? 'border-2' : ''}
              >
                {level.strength === 'strong' ? 'חזק' : level.strength === 'medium' ? 'בינוני' : 'חלש'}
              </Badge>
              <div className="text-right">
                <span className="font-medium">{level.type === 'support' ? 'תמיכה' : 'התנגדות'}: </span>
                <span>${level.price.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-bold mb-3">אינדיקטורים טכניים</h3>
        <div className="space-y-2">
          {technicalIndicators.map((indicator, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-2">
              <span className="text-sm">{indicator.interpretation}</span>
              <div className="text-right">
                <span className="font-medium">{indicator.name}: </span>
                <span>{indicator.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrentAnalysisTab;
