
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp } from 'lucide-react';

interface ShortTermPrediction {
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
}

interface LongTermAnalysis {
  trend: string;
  keyFactors: string[];
  scenarios: Array<{
    description: string;
    probability: number;
    timeframe: string;
    priceTarget: number;
  }>;
}

interface FutureAnalysisTabProps {
  shortTerm: ShortTermPrediction;
  longTerm: LongTermAnalysis;
}

const FutureAnalysisTab: React.FC<FutureAnalysisTabProps> = ({ shortTerm, longTerm }) => {
  return (
    <div className="space-y-4 mt-4">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-bold flex items-center justify-end mb-3">
          <Lightbulb className="ml-2 h-4 w-4" />
          תחזית טווח קצר
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Badge className={
              shortTerm.prediction === 'עלייה'
                ? 'bg-green-100 text-green-800'
                : shortTerm.prediction === 'ירידה'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }>
              {shortTerm.prediction}
            </Badge>
            <div>
              <span>הערכה: </span>
              <span className="font-bold">{shortTerm.confidence}% ביטחון</span>
            </div>
          </div>
          
          <div className="mt-2">
            <h4 className="font-medium mb-1">יעדי מחיר אפשריים:</h4>
            <div className="space-y-2">
              {shortTerm.keyLevels.map((level, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{level.probability}%</span>
                  <span className="mx-2">סבירות:</span>
                  <span>${level.target.toLocaleString()}</span>
                  <span className="mx-2">תרחיש {level.scenario}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-3">
            <h4 className="font-medium mb-1">אירועים קרובים משמעותיים:</h4>
            <div className="space-y-2">
              {shortTerm.significantEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-1">
                  <Badge variant="outline">השפעה: {event.potentialImpact}</Badge>
                  <div className="text-right">
                    <span>{event.event}</span>
                    <span className="text-sm text-muted-foreground mr-2">{event.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-bold flex items-center justify-end mb-3">
          <TrendingUp className="ml-2 h-4 w-4" />
          תחזית טווח ארוך
        </h3>
        <div>
          <div className="flex justify-between items-center mb-3">
            <Badge className={
              longTerm.trend === 'חיובי'
                ? 'bg-green-100 text-green-800'
                : longTerm.trend === 'שלילי'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }>
              {longTerm.trend}
            </Badge>
            <div>
              <span>מגמה כללית: </span>
            </div>
          </div>
          
          <div className="mb-3">
            <h4 className="font-medium mb-1">גורמי מפתח:</h4>
            <ul className="list-disc list-inside space-y-1">
              {longTerm.keyFactors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">תרחישים אפשריים:</h4>
            <div className="space-y-4">
              {longTerm.scenarios.map((scenario, index) => (
                <div key={index} className="border-r-2 pr-3 border-primary/50">
                  <p className="font-medium">{scenario.description}</p>
                  <div className="flex justify-between text-sm mt-1">
                    <span>סבירות: {scenario.probability}%</span>
                    <span>טווח זמן: {scenario.timeframe}</span>
                    <span>יעד: ${scenario.priceTarget.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureAnalysisTab;
