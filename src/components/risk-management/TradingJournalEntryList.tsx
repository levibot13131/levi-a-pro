
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, ArrowUpDown } from 'lucide-react';
import { TradeJournalEntry } from '@/types/asset';
import TradingJournalEntry from './TradingJournalEntry';

interface TradingJournalEntryListProps {
  entries: TradeJournalEntry[];
}

const TradingJournalEntryList = ({ entries }: TradingJournalEntryListProps) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>אין עסקאות ביומן המסחר. הוסף את העסקה הראשונה שלך!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 rtl:space-x-reverse">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 ml-1" />
            סנן
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="h-4 w-4 ml-1" />
            מיין
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          סה"כ {entries.length} עסקאות ביומן
        </div>
      </div>
      
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {entries.map((entry) => (
          <TradingJournalEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
};

export default TradingJournalEntryList;
