
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SignalListProps {
  signals: any[];
  formatPrice: (price: number) => string;
}

const SignalList: React.FC<SignalListProps> = ({ signals, formatPrice }) => {
  if (!signals || signals.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
      <h3 className="font-bold text-lg mb-2 text-right">הסברים לסיגנלים שזוהו</h3>
      <div className="space-y-2">
        {signals.map((signal, idx) => (
          <div key={idx} className="p-2 border rounded-md flex justify-between items-start">
            <div>
              <Badge className={signal.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {signal.type === 'buy' ? 'קנייה' : 'מכירה'}
              </Badge>
              <div className="text-xs mt-1">
                מחיר: {formatPrice(signal.price)}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{signal.indicator}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{signal.reason || 'אין הסבר נוסף'}</p>
              <p className="text-xs">
                {new Date(signal.timestamp).toLocaleDateString('he-IL', { 
                  day: 'numeric', 
                  month: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignalList;
