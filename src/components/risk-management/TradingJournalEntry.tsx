
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TradeJournalEntry } from '@/types/asset';

interface TradingJournalEntryProps {
  entry: TradeJournalEntry;
}

const TradingJournalEntry = ({ entry }: TradingJournalEntryProps) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="py-2">
        <CardTitle className="flex justify-between items-center">
          <Badge className={
            entry.outcome === 'win' ? 'bg-green-500' : 
            entry.outcome === 'loss' ? 'bg-red-500' : 
            'bg-gray-500'
          }>
            {entry.outcome === 'win' ? 'רווח' : 
             entry.outcome === 'loss' ? 'הפסד' : 
             'פתוח'}
          </Badge>
          <div className="flex items-center">
            <span className="font-medium">{entry.assetName}</span>
            <Badge className="mx-2" variant="outline">
              {entry.direction === 'long' ? 'לונג' : 'שורט'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(entry.date).toLocaleDateString('he-IL')}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <div className="grid grid-cols-3 gap-2 text-right mb-2">
          <div>
            <div className="text-xs text-muted-foreground">כניסה</div>
            <div className="font-medium">{entry.entryPrice}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">סטופ</div>
            <div className="font-medium">{entry.stopLoss}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">יעד</div>
            <div className="font-medium">{entry.targetPrice || '-'}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-right">
          <div>
            <div className="text-xs text-muted-foreground">גודל פוזיציה</div>
            <div className="font-medium">{entry.positionSize}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">סיכון</div>
            <div className="font-medium">
              {entry.risk.toFixed(2)}% 
              ({(entry.risk * 1000).toLocaleString()} ש"ח)
            </div>
          </div>
        </div>
        
        {entry.notes && (
          <div className="mt-2 border-t pt-2">
            <div className="text-xs text-muted-foreground">הערות:</div>
            <p className="text-sm mt-1">{entry.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingJournalEntry;
