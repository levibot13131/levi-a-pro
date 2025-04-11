
import React from 'react';
import { Asset } from '@/types/asset';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown, BadgeInfo, BarChart4 } from 'lucide-react';
import AssetMetricCard from './AssetMetricCard';

interface AssetMetricsGridProps {
  asset: Asset;
  formatPrice: (price: number) => string;
}

const AssetMetricsGrid = ({ asset, formatPrice }: AssetMetricsGridProps) => {
  // סימולציית נתונים נוספים
  const marketSentiment = Math.random() > 0.5 ? 'positive' : Math.random() > 0.3 ? 'neutral' : 'negative';
  const communityScore = Math.floor(Math.random() * 100);
  const priceTarget = {
    low: asset.price * 0.9,
    avg: asset.price * 1.15,
    high: asset.price * 1.3
  };
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
      {/* כרטיס נפח מסחר */}
      <AssetMetricCard 
        title="נפח מסחר"
        value={`$${(asset.volume24h / 1000000).toFixed(1)}M`}
        badge="24ש"
      />
      
      {/* כרטיס סנטימנט */}
      <AssetMetricCard 
        title="סנטימנט"
        value={`${communityScore}% חיובי`}
        badge={
          <span className={marketSentiment === 'positive' ? 'text-green-600' : marketSentiment === 'negative' ? 'text-red-600' : ''}>
            {marketSentiment === 'positive' ? 'חיובי' : marketSentiment === 'negative' ? 'שלילי' : 'ניטרלי'}
          </span>
        }
        icon={marketSentiment === 'positive' ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : marketSentiment === 'negative' ? (
          <TrendingDown className="h-4 w-4 text-red-600" />
        ) : (
          <BarChart4 className="h-4 w-4 text-blue-600" />
        )}
      />
      
      {/* כרטיס מחיר יעד */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="w-full">
            <AssetMetricCard 
              title="מחיר יעד"
              value={`$${formatPrice(priceTarget.avg)}`}
              badge="יעד"
            />
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm space-y-1">
              <p>יעד גבוה: ${formatPrice(priceTarget.high)}</p>
              <p>יעד ממוצע: ${formatPrice(priceTarget.avg)}</p>
              <p>יעד נמוך: ${formatPrice(priceTarget.low)}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* כרטיס שווי שוק */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="w-full">
            <AssetMetricCard 
              title="שווי שוק"
              value={asset.marketCap 
                ? `$${(asset.marketCap / 1000000000).toFixed(2)}B`
                : 'לא ידוע'
              }
              badge={
                <div className="flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <BadgeInfo className="h-4 w-4 text-blue-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">
                          {asset.type === 'crypto' 
                            ? 'שווי שוק (Market Cap)'
                            : asset.type === 'stocks'
                              ? 'הון שוק (Market Cap)'
                              : 'נפח מסחר יומי כולל'
                          }
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span>גודל</span>
                </div>
              }
            />
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default AssetMetricsGrid;
