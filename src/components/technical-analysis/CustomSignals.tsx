
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTradeSignals } from '@/services/mockTradingService';
import { useStoredSignals } from '@/services/backtesting/realTimeAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, ChevronRight, ZapOff } from 'lucide-react';
import { TradeSignal } from '@/types/asset';
import { toast } from 'sonner';

interface CustomSignalsProps {
  assetId: string;
  formatPrice: (price: number) => string;
}

const CustomSignals: React.FC<CustomSignalsProps> = ({
  assetId,
  formatPrice,
}) => {
  // שליפת איתותים ממקור נתונים מדומה
  const { data: mockSignals = [], isLoading: mockSignalsLoading } = useQuery({
    queryKey: ['customSignals', assetId],
    queryFn: () => getTradeSignals(assetId),
    refetchOnWindowFocus: false,
    refetchInterval: 60000, // רענון כל דקה
  });
  
  // שליפת איתותים בזמן אמת מהמערכת החדשה
  const { data: realTimeSignals = [], refetch: refetchRealTime } = useStoredSignals();
  const realTimeSignalsLoading = false;
  
  // פונקציה לשליחת איתות לערוצי התקשורת (טלגרם/וואטסאפ)
  const sendSignal = (signalId: string) => {
    toast.success("האיתות נשלח בהצלחה", {
      description: `איתות מספר ${signalId} נשלח לכל הערוצים המוגדרים`
    });
  };
  
  // סינון האיתותים לפי נכס ספציפי
  const filteredRealTimeSignals = assetId === 'all' 
    ? realTimeSignals 
    : realTimeSignals.filter(signal => signal.assetId === assetId);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-right text-xl">איתותים מותאמים אישית</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="custom">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="custom">איתותים מותאמים</TabsTrigger>
            <TabsTrigger value="realtime">איתותים בזמן אמת</TabsTrigger>
          </TabsList>
          
          <TabsContent value="custom">
            {mockSignalsLoading ? (
              <div className="text-center py-4">טוען איתותים...</div>
            ) : mockSignals.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <ZapOff className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">לא נמצאו איתותים מותאמים עבור נכס זה</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mockSignals.map((signal: TradeSignal) => (
                  <SignalCard 
                    key={signal.id}
                    signal={signal}
                    formatPrice={formatPrice}
                    onSend={sendSignal}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="realtime">
            {realTimeSignalsLoading ? (
              <div className="text-center py-4">טוען איתותים בזמן אמת...</div>
            ) : filteredRealTimeSignals.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <ZapOff className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">לא נמצאו איתותים בזמן אמת עבור נכס זה</p>
                <Button variant="outline" size="sm" onClick={() => refetchRealTime()}>
                  רענן איתותים
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRealTimeSignals.map((signal: TradeSignal) => (
                  <SignalCard 
                    key={signal.id}
                    signal={signal}
                    formatPrice={formatPrice}
                    onSend={sendSignal}
                    isRealTime
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// SignalCard Component
interface SignalCardProps {
  signal: TradeSignal;
  formatPrice: (price: number) => string;
  onSend: (id: string) => void;
  isRealTime?: boolean;
}

const SignalCard: React.FC<SignalCardProps> = ({ signal, formatPrice, onSend, isRealTime }) => {
  return (
    <div className="border rounded-md p-3">
      <div className="flex justify-between items-start mb-2">
        <Badge 
          className={signal.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
        >
          {signal.type === 'buy' ? 'קנייה' : 'מכירה'}
        </Badge>
        <div className="text-right">
          <p className="font-medium">{signal.symbol || signal.assetId}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(signal.timestamp).toLocaleString('he-IL')}
          </p>
        </div>
      </div>
      
      <div className="flex justify-between text-sm mb-2">
        <div>מחיר: ${formatPrice(signal.price)}</div>
        <div className="text-right">ביטחון: {signal.confidence || 75}%</div>
      </div>
      
      <div className="text-right text-sm mb-3">
        <div>אינדיקטור: {signal.indicator || 'MACD'}</div>
        <div>{signal.description || 'חצה ממוצע נע 50 כלפי מעלה'}</div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
          onClick={() => onSend(signal.id)}
        >
          <Bell className="h-3 w-3" />
          שלח כהתראה
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
      
      {isRealTime && (
        <div className="mt-2 text-right">
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600">בזמן אמת</Badge>
        </div>
      )}
    </div>
  );
};

export default CustomSignals;
