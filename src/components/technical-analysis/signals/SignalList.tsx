
import React from 'react';
import { TradeSignal } from '@/types/asset';
import SignalCard from './SignalCard';
import EmptySignalState from './EmptySignalState';

interface SignalListProps {
  signals: TradeSignal[];
  type: 'current' | 'past';
  formatPriceFn?: (price: number) => string;
}

const SignalList: React.FC<SignalListProps> = ({ signals, type, formatPriceFn }) => {
  if (signals.length === 0) {
    return <EmptySignalState type={type} />;
  }

  return (
    <div className="space-y-4">
      {signals.map(signal => (
        <SignalCard 
          key={signal.id} 
          signal={signal} 
          isPast={type === 'past'} 
          formatPriceFn={formatPriceFn} 
        />
      ))}
    </div>
  );
};

export default SignalList;
