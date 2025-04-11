
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, BarChart4 } from 'lucide-react';

interface HistoricalEvent {
  event: string;
  date: string;
  impact: string;
}

interface HistoricalTrend {
  period: string;
  direction: string;
  strength: string | number;
}

interface CyclicalPattern {
  name: string;
  description: string;
}

interface HistoricalAnalysisTabProps {
  keyEvents: HistoricalEvent[];
  trends: HistoricalTrend[];
  cyclicalPatterns: CyclicalPattern[];
}

const HistoricalAnalysisTab: React.FC<HistoricalAnalysisTabProps> = ({ 
  keyEvents, 
  trends, 
  cyclicalPatterns 
}) => {
  return (
    <div className="space-y-4 mt-4">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-bold flex items-center justify-end mb-3">
          <Calendar className="ml-2 h-4 w-4" />
          אירועים מרכזיים בהיסטוריה
        </h3>
        <div className="space-y-2">
          {keyEvents.map((event, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-2">
              <Badge variant={event.impact === 'חיובי' ? 'outline' : 'destructive'}>
                {event.impact}
              </Badge>
              <div className="text-right">
                <p>{event.event}</p>
                <p className="text-sm text-muted-foreground">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-bold flex items-center justify-end mb-3">
          <TrendingUp className="ml-2 h-4 w-4" />
          מגמות היסטוריות
        </h3>
        <div className="space-y-2">
          {trends.map((trend, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-2">
              <div>
                <span className="text-sm">עוצמה: </span>
                <span className="font-bold">{trend.strength}/10</span>
              </div>
              <div className="text-right">
                <span className="font-medium">{trend.period}: </span>
                <span>{trend.direction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-bold flex items-center justify-end mb-3">
          <BarChart4 className="ml-2 h-4 w-4" />
          תבניות מחזוריות
        </h3>
        <div className="space-y-2">
          {cyclicalPatterns.map((pattern, index) => (
            <div key={index} className="border-b pb-2">
              <p className="font-medium">{pattern.name}</p>
              <p className="text-sm">{pattern.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoricalAnalysisTab;
