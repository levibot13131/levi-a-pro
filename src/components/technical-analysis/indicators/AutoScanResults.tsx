
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Scan } from 'lucide-react';

interface ScanResult {
  symbol: string;
  name: string;
  timeframe: string;
  sentiment: 'buy' | 'sell' | 'neutral';
  strength: number;
  reason: string;
}

interface AutoScanResultsProps {
  autoScanResults: ScanResult[];
  autoScanEnabled: boolean;
}

const AutoScanResults = ({ 
  autoScanResults,
  autoScanEnabled
}: AutoScanResultsProps) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
        <div className="flex justify-between items-start">
          <div className="flex gap-1 items-center">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <span className="text-xs text-orange-500">סריקה אוטומטית שבועית</span>
          </div>
          <h3 className="font-semibold text-lg text-right">מטבעות מומלצים למעקב</h3>
        </div>
        <p className="text-sm text-right mt-2 mb-4">
          המערכת סורקת באופן אוטומטי את כלל המטבעות ומזהה הזדמנויות מסחר על בסיס הסקירות השבועיות. 
          האיתותים מבוססים על אינטגרציה של מגוון רחב של אינדיקטורים טכניים ותבניות מחיר.
        </p>
        
        <div className="space-y-3">
          {autoScanResults.map((coin, idx) => (
            <div key={idx} className="border rounded-md p-3">
              <div className="flex justify-between items-start mb-2">
                <Badge 
                  className={
                    coin.sentiment === 'buy' 
                      ? 'bg-green-100 text-green-800' 
                      : coin.sentiment === 'sell' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                  }
                >
                  {coin.sentiment === 'buy' ? 'קנייה' : coin.sentiment === 'sell' ? 'מכירה' : 'ניטרלי'}
                  {' '}({coin.strength}/10)
                </Badge>
                <div className="text-right">
                  <div className="font-medium">{coin.name} ({coin.symbol})</div>
                  <div className="text-xs text-gray-500">טווח זמן: {coin.timeframe}</div>
                </div>
              </div>
              <p className="text-sm text-right">{coin.reason}</p>
              
              <div className="flex justify-end mt-2">
                <Button variant="outline" size="sm" className="text-xs">
                  צפה בניתוח מלא
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button className="gap-2">
          <Scan className="h-4 w-4" />
          סרוק שוק מחדש
        </Button>
      </div>
    </div>
  );
};

export default AutoScanResults;
