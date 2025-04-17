
import React from 'react';
import { TradeSignal } from '@/types/asset';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface SignalCardProps {
  signal: TradeSignal;
  isPast?: boolean;
  formatPriceFn?: (price: number) => string;
}

const SignalCard: React.FC<SignalCardProps> = ({ 
  signal, 
  isPast = false,
  formatPriceFn 
}) => {
  // Use the provided formatPrice function or the imported one
  const priceFormatter = formatPriceFn || formatPrice;
  
  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isPast) {
    return (
      <div key={signal.id} className="border rounded-md p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline">
            {signal.type === 'buy' ? 'קנייה' : 'מכירה'}
          </Badge>
          <div className="text-right">
            <h3 className="font-medium">{signal.symbolName} / {signal.strategy}</h3>
            <p className="text-sm text-muted-foreground">{formatDate(signal.timestamp)}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">מחיר כניסה</p>
            <p className="font-medium">{priceFormatter(signal.price)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">תוצאה</p>
            <p className="font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
              הצלחה
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div key={signal.id} className="border rounded-md p-4">
      <div className="flex justify-between items-start mb-2">
        <Badge variant={signal.type === 'buy' ? 'default' : 'destructive'}>
          {signal.type === 'buy' ? 'קנייה' : 'מכירה'}
        </Badge>
        <div className="text-right">
          <h3 className="font-medium">{signal.symbolName} / {signal.strategy}</h3>
          <p className="text-sm text-muted-foreground">{formatDate(signal.timestamp)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">מחיר כניסה</p>
          <p className="font-medium">{priceFormatter(signal.price)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">ביטחון</p>
          <p className="font-medium">{signal.confidence}%</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">סטופ לוס</p>
          <p className="font-medium">{priceFormatter(signal.stopLoss || 0)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">יעד מחיר</p>
          <p className="font-medium">{priceFormatter(signal.targetPrice || 0)}</p>
        </div>
      </div>
      
      <div className="text-right mb-2">
        <p className="text-sm font-medium">אינדיקטור: {signal.indicator}</p>
        <p className="text-sm text-muted-foreground">{signal.description}</p>
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" size="sm">הוסף ליומן המסחר</Button>
      </div>
    </div>
  );
};

export default SignalCard;
