
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PatternListProps {
  patterns: any[];
  onPatternClick: (pattern: any) => void;
}

const PatternList: React.FC<PatternListProps> = ({ patterns, onPatternClick }) => {
  if (!patterns || patterns.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
      <h3 className="font-bold text-lg mb-2 text-right">תבניות מחיר שזוהו</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {patterns.map((pattern, idx) => (
          <div 
            key={idx} 
            className="p-2 border rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => onPatternClick(pattern)}
          >
            <div className="flex justify-between items-start">
              <Badge 
                className={
                  pattern.type?.includes('bullish') || pattern.type?.includes('buy')
                    ? 'bg-green-100 text-green-800' 
                    : pattern.type?.includes('bearish') || pattern.type?.includes('sell')
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                }
              >
                {pattern.type?.includes('bullish') || pattern.type?.includes('buy')
                  ? 'עולה' 
                  : pattern.type?.includes('bearish') || pattern.type?.includes('sell')
                    ? 'יורד'
                    : 'ניטרלי'
                }
              </Badge>
              <h4 className="font-medium text-right">{pattern.name}</h4>
            </div>
            <p className="text-sm text-right mt-1 truncate">{pattern.description}</p>
            
            <div className="flex justify-end mt-1">
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                הצג פרטים
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatternList;
