
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TradeSignal } from '@/types/asset';
import SignalCard from './SignalCard';

interface SignalsListProps {
  signals: TradeSignal[];
}

const SignalsList: React.FC<SignalsListProps> = ({ signals }) => {
  const getSortedSignals = () => {
    return [...signals].sort((a, b) => b.timestamp - a.timestamp);
  };

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-3">
        {getSortedSignals().map((signal: TradeSignal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default SignalsList;
