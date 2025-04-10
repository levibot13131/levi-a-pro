
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTradeSignals } from '@/services/mockTradingService';
import SignalCard from './SignalCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

interface CustomSignalsProps {
  assetId: string;
}

const CustomSignals: React.FC<CustomSignalsProps> = ({ assetId }) => {
  // שליפת איתותים ספציפיים לנכס זה
  const { data: signals, isLoading: signalsLoading } = useQuery({
    queryKey: ['assetTradeSignals', assetId],
    queryFn: () => getTradeSignals(assetId),
  });
  
  // פונקציה לשליחת איתות לערוצי התקשורת (טלגרם/וואטסאפ)
  const sendSignal = (signalId: string) => {
    // כאן במערכת אמיתית היינו מתחברים לשרת ושולחים את האיתות
    toast.success("האיתות נשלח בהצלחה", {
      description: "האיתות נשלח לכל ערוצי התקשורת המוגדרים",
    });
  };
  
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
          <div key={signal.id} className="relative">
            <SignalCard signal={signal} />
            <div className="absolute bottom-4 left-4">
              <Button 
                size="sm" 
                variant="secondary" 
                className="flex items-center gap-2"
                onClick={() => sendSignal(signal.id)}
              >
                <Send className="h-4 w-4" />
                שלח איתות
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSignals;
