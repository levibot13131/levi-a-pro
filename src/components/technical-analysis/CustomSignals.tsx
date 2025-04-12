import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTradeSignals } from '@/services/mockTradingService';
import SignalCard from './SignalCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Send, BarChart, AlertTriangle, Play } from 'lucide-react';
import { toast } from 'sonner';
import { useStoredSignals, startRealTimeAnalysis } from '@/services/backtesting/realTimeAnalysis';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CustomSignalsProps {
  assetId: string;
}

const CustomSignals: React.FC<CustomSignalsProps> = ({ assetId }) => {
  // שליפת איתותים ספציפיים לנכס זה - משלב איתותים מהמערכת המדומה וגם מהמערכת בזמן אמת
  const { data: mockSignals, isLoading: mockSignalsLoading } = useQuery({
    queryKey: ['assetTradeSignals', assetId],
    queryFn: () => getTradeSignals(assetId),
  });
  
  // שליפת איתותים בזמן אמת מהמערכת החדשה
  const { data: realTimeSignals = [], refetch: refetchRealTime } = useStoredSignals(assetId);
  const realTimeSignalsLoading = false;
  
  // פונקציה לשליחת איתות לערוצי התקשורת (טלגרם/וואטסאפ)
  const sendSignal = (signalId: string) => {
    // כאן במערכת אמיתית היינו מתחברים לשרת ושולחים את האיתות
    toast.success("האיתות נשלח בהצלחה", {
      description: "האיתות נשלח לכל ערוצי התקשורת המוגדרים",
    });
  };
  
  // הפעלת ניתוח בזמן אמת עבור נכס זה
  const startAnalysisForAsset = () => {
    startRealTimeAnalysis([assetId], { strategy: "A.A" });
    toast.success("ניתוח בזמן אמת הופעל עבור נכס זה", {
      description: "המערכת תתחיל לשלוח התראות בזמן אמת"
    });
  };
  
  // שילוב האיתותים
  const allSignals = React.useMemo(() => {
    const combined = [...(mockSignals || []), ...realTimeSignals];
    // מיון לפי זמן יצירה (מהחדש לישן)
    return combined.sort((a, b) => b.timestamp - a.timestamp);
  }, [mockSignals, realTimeSignals]);
  
  const isLoading = mockSignalsLoading || realTimeSignalsLoading;
  
  if (isLoading) {
    return <LoadingSpinner className="h-64" />;
  }
  
  if (!allSignals || allSignals.length === 0) {
    return (
      <EmptyState 
        icon={<AlertTriangle className="h-10 w-10 text-yellow-500" />}
        message="לא נמצאו איתותים עבור נכס זה" 
      >
        <Button onClick={startAnalysisForAsset} className="mt-2">
          <Play className="h-4 w-4 mr-2" />
          הפעל ניתוח בזמן אמת
        </Button>
      </EmptyState>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          size="sm" 
          onClick={startAnalysisForAsset}
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          עקוב אחר נכס זה בזמן אמת
        </Button>
        <h3 className="font-bold text-xl text-right">איתותים מותאמים לשיטת KSEM</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {allSignals.map((signal) => (
          <div key={signal.id} className="relative">
            <SignalCard signal={signal} />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="flex items-center gap-2"
                  >
                    <BarChart className="h-4 w-4" />
                    פרטי האיתות
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-right">פרטי איתות {signal.type === 'buy' ? 'קנייה' : 'מכירה'}</DialogTitle>
                    <DialogDescription className="text-right">
                      {new Date(signal.timestamp).toLocaleDateString('he-IL', {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 my-4 text-right">
                    <div>
                      <p className="text-sm text-muted-foreground">מחיר כניסה</p>
                      <p className="text-lg font-bold">${signal.price.toLocaleString()}</p>
                    </div>
                    {signal.targetPrice && (
                      <div>
                        <p className="text-sm text-muted-foreground">יעד מחיר</p>
                        <p className="text-lg font-bold text-green-600">${signal.targetPrice.toLocaleString()}</p>
                      </div>
                    )}
                    {signal.stopLoss && (
                      <div>
                        <p className="text-sm text-muted-foreground">סטופ לוס</p>
                        <p className="text-lg font-bold text-red-600">${signal.stopLoss.toLocaleString()}</p>
                      </div>
                    )}
                    {signal.riskRewardRatio && (
                      <div>
                        <p className="text-sm text-muted-foreground">יחס סיכוי/סיכון</p>
                        <p className="text-lg font-bold">1:{signal.riskRewardRatio}</p>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-right">
                    <p className="font-medium mb-1">הסבר האיתות:</p>
                    <p>{signal.notes}</p>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button
                      className="w-full"
                      onClick={() => sendSignal(signal.id)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      שלח לקבוצות
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button 
                size="sm" 
                variant="default" 
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
