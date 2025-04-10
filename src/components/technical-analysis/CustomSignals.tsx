
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTradeSignals } from '@/services/mockTradingService';
import SignalCard from './SignalCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';

interface CustomSignalsProps {
  assetId: string;
}

const CustomSignals: React.FC<CustomSignalsProps> = ({ assetId }) => {
  // שליפת איתותים ספציפיים לנכס זה
  const { data: signals, isLoading: signalsLoading } = useQuery({
    queryKey: ['assetTradeSignals', assetId],
    queryFn: () => getTradeSignals(assetId),
  });
  
  if (signalsLoading) {
    return <LoadingSpinner className="h-64" />;
  }
  
  if (!signals || signals.length === 0) {
    return <EmptyState message="לא נמצאו איתותים עבור נכס זה" />;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-xl text-right">איתותים מותאמים לשיטת KSEM</h3>
      <div className="grid grid-cols-1 gap-4">
        {signals.map((signal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>
    </div>
  );
};

export default CustomSignals;
