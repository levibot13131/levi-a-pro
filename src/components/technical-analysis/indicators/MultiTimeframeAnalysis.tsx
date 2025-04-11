
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FinalSignalPanel } from './';

interface TimeframeData {
  timeframe: string;
  signal: string;
  strength: number;
  keyIndicators: string[];
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
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
        <h3 className="font-semibold text-lg mb-3 text-right">ניתוח רב-טווחי</h3>
        <p className="text-sm text-right mb-4">
          הניתוח מציג את הסיגנלים בטווחי זמן שונים כדי לספק תמונה מלאה על המגמות בנכס. 
          איתות אופטימלי יתרחש כאשר רוב טווחי הזמן מצביעים על אותו הכיוון.
        </p>
        
        <div className="space-y-2">
          {multiTimeframeData.map((tf, idx) => (
            <div key={idx} className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-2">
                <Badge 
                  className={
                    tf.signal === 'buy' 
                      ? 'bg-green-100 text-green-800' 
                      : tf.signal === 'sell' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                  }
                >
                  {tf.signal === 'buy' ? 'קנייה' : tf.signal === 'sell' ? 'מכירה' : 'ניטרלי'}
                </Badge>
                <span className="text-sm">עוצמה: {tf.strength}/10</span>
              </div>
              
              <div className="text-right">
                <div className="font-medium">{tf.timeframe}</div>
                <div className="text-xs text-gray-500 truncate max-w-[200px]">
                  {tf.keyIndicators.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <FinalSignalPanel finalSignal={finalSignal} />
    </div>
  );
};

export default MultiTimeframeAnalysis;
