
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { FinalSignalPanel } from './';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown, BarChartHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TimeframeData {
  timeframe: string;
  signal: 'buy' | 'sell' | 'neutral';
  strength: number;
  keyIndicators: string[];
  details?: string;
  lastUpdated?: number;
}

interface FinalSignalData {
  signal: 'buy' | 'sell' | 'neutral';
  strength: number;
  confidence: number;
  description: string;
}

interface MultiTimeframeAnalysisProps {
  multiTimeframeData: TimeframeData[];
  finalSignal: FinalSignalData;
}

const MultiTimeframeAnalysis = ({ 
  multiTimeframeData, 
  finalSignal 
}: MultiTimeframeAnalysisProps) => {
  const [expandedTimeframes, setExpandedTimeframes] = useState<Record<string, boolean>>({});

  const toggleTimeframe = (timeframe: string) => {
    setExpandedTimeframes(prev => ({
      ...prev,
      [timeframe]: !prev[timeframe]
    }));
  };

  const getSignalIcon = (signal: 'buy' | 'sell' | 'neutral') => {
    switch (signal) {
      case 'buy':
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'sell':
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      default:
        return <BarChartHorizontal className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gray-50 dark:bg-gray-800">
        <h3 className="font-semibold text-lg mb-3 text-right">ניתוח רב-טווחי בזמן אמת</h3>
        <p className="text-sm text-right mb-4">
          הניתוח מציג את הסיגנלים בטווחי זמן שונים כדי לספק תמונה מלאה על המגמות בנכס. 
          איתות אופטימלי יתרחש כאשר רוב טווחי הזמן מצביעים על אותו הכיוון.
        </p>
        
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {multiTimeframeData.map((tf, idx) => {
              const isExpanded = expandedTimeframes[tf.timeframe] || false;
              
              return (
                <div 
                  key={idx} 
                  className={`
                    border rounded-lg p-3 transition-all
                    ${tf.signal === 'buy' 
                      ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20' 
                      : tf.signal === 'sell' 
                        ? 'border-red-200 bg-red-50/50 dark:bg-red-950/20'
                        : 'border-blue-200 bg-blue-50/50 dark:bg-blue-950/20'
                    }
                  `}
                >
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleTimeframe(tf.timeframe)}
                  >
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={
                          tf.signal === 'buy' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300 flex items-center gap-1' 
                            : tf.signal === 'sell' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/70 dark:text-red-300 flex items-center gap-1'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-300 flex items-center gap-1'
                        }
                      >
                        {getSignalIcon(tf.signal)}
                        {tf.signal === 'buy' ? 'קנייה' : tf.signal === 'sell' ? 'מכירה' : 'ניטרלי'}
                      </Badge>
                      <div className="text-sm flex items-center">
                        <span>עוצמה:</span> 
                        <div className="flex ml-1">
                          {Array(10).fill(0).map((_, i) => (
                            <div 
                              key={i}
                              className={`
                                h-1.5 w-1.5 rounded-full mx-0.5
                                ${i < tf.strength 
                                  ? tf.signal === 'buy' 
                                    ? 'bg-green-500'
                                    : tf.signal === 'sell'
                                      ? 'bg-red-500'
                                      : 'bg-blue-500' 
                                  : 'bg-gray-200 dark:bg-gray-700'
                                }
                              `}
                            />
                          ))}
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">{tf.timeframe}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">
                        עדכון אחרון: {tf.lastUpdated 
                          ? new Date(tf.lastUpdated).toLocaleString('he-IL', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })
                          : 'עדכני'}
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="space-y-2">
                        <div>
                          <div className="font-medium text-right mb-1">אינדיקטורים מובילים:</div>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {tf.keyIndicators.map((indicator, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {indicator}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {tf.details && (
                          <div className="text-sm text-right mt-2 bg-white/80 dark:bg-gray-900/50 p-2 rounded">
                            {tf.details}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </Card>
      
      <FinalSignalPanel finalSignal={finalSignal} />
    </div>
  );
};

export default MultiTimeframeAnalysis;
