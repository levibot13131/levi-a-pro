
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, BarChartHorizontal, Send, Star, StarOff } from 'lucide-react';
import { toast } from 'sonner';

interface ConclusionPanelProps {
  conclusion: string;
  overallSignal: 'buy' | 'sell' | 'neutral';
  signalStrength: number;
  selectedAsset: any;
}

const ConclusionPanel = ({ 
  conclusion, 
  overallSignal, 
  signalStrength,
  selectedAsset
}: ConclusionPanelProps) => {
  const [watchlistEnabled, setWatchlistEnabled] = useState<boolean>(true);
  
  const generateSignal = () => {
    if (!selectedAsset) return;
    
    toast.success('איתות נשלח בהצלחה', {
      description: `ניתוח טכני ל-${selectedAsset.name} בטווח ${selectedAsset.timeframe} נשלח למכשירך`,
      action: {
        label: 'הצג פרטים',
        onClick: () => console.log('הצגת פרטי איתות'),
      },
    });
  };

  const toggleWatchlist = () => {
    const action = watchlistEnabled ? 'הוסר מ' : 'נוסף ל';
    setWatchlistEnabled(!watchlistEnabled);
    
    toast.info(`${selectedAsset?.name} ${action}רשימת המעקב`, {
      description: watchlistEnabled 
        ? 'לא תקבל עוד התראות על נכס זה' 
        : 'תקבל התראות על הזדמנויות מסחר בנכס זה',
    });
  };

  return (
    <div className="p-4 border-2 rounded-md border-primary">
      <h3 className="font-bold text-lg mb-2 text-right">סיכום והמלצה</h3>
      <p className="text-right mb-4">{conclusion}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            className="gap-2" 
            onClick={generateSignal}
          >
            <Send className="h-4 w-4" />
            שלח איתות למכשיר
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={toggleWatchlist}
            title={watchlistEnabled ? "הסר מרשימת מעקב" : "הוסף לרשימת מעקב"}
          >
            {watchlistEnabled ? (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ) : (
              <StarOff className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge 
            className={
              overallSignal === 'buy' 
                ? 'bg-green-100 text-green-800 text-lg p-2' 
                : overallSignal === 'sell' 
                  ? 'bg-red-100 text-red-800 text-lg p-2'
                  : 'bg-blue-100 text-blue-800 text-lg p-2'
            }
          >
            {overallSignal === 'buy' 
              ? (
                <div className="flex items-center gap-1">
                  <ArrowUp className="h-4 w-4" />
                  קנייה
                </div>
              ) 
              : overallSignal === 'sell' 
                ? (
                  <div className="flex items-center gap-1">
                    <ArrowDown className="h-4 w-4" />
                    מכירה
                  </div>
                )
                : (
                  <div className="flex items-center gap-1">
                    <BarChartHorizontal className="h-4 w-4" />
                    המתנה
                  </div>
                )
            }
          </Badge>
          
          <Badge 
            variant="outline" 
            className="text-lg p-2"
          >
            עוצמה: {signalStrength}/10
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ConclusionPanel;
