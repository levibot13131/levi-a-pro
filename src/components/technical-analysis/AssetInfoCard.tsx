
import React from 'react';
import { Asset } from '@/types/asset';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  BadgeInfo, 
  Globe,
  BarChart4 
} from 'lucide-react';

interface AssetInfoCardProps {
  asset: Asset;
  formatPrice: (price: number) => string;
}

const AssetInfoCard = ({ asset, formatPrice }: AssetInfoCardProps) => {
  // יצירת נתונים נוספים מדומים לצורך הדוגמה
  const marketSentiment = Math.random() > 0.5 ? 'positive' : Math.random() > 0.3 ? 'neutral' : 'negative';
  const communityScore = Math.floor(Math.random() * 100);
  const priceTarget = {
    low: asset.price * 0.9,
    avg: asset.price * 1.15,
    high: asset.price * 1.3
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {asset.imageUrl && (
              <img 
                src={asset.imageUrl} 
                alt={asset.name} 
                className="w-10 h-10 object-contain"
              />
            )}
          </div>
          <div className="text-right">
            <CardTitle className="text-2xl">{asset.name} ({asset.symbol})</CardTitle>
            <div className="flex items-center gap-2 justify-end mt-1">
              <Badge variant="outline">
                {asset.type === 'crypto' 
                  ? 'קריפטו' 
                  : asset.type === 'stocks' 
                    ? 'מניה' 
                    : 'מט"ח'}
              </Badge>
              <CardDescription className="text-lg">
                מחיר: ${formatPrice(asset.price)}
              </CardDescription>
              <Badge className={asset.change24h >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
              </Badge>
            </div>
          </div>
        </div>
        
        {/* מידע נוסף על הנכס */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
          <div className="p-2 border rounded-md text-right">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">24ש</Badge>
              <span className="text-muted-foreground text-xs">נפח מסחר</span>
            </div>
            <p className="font-medium mt-1">
              ${(asset.volume24h / 1000000).toFixed(1)}M
            </p>
          </div>
          
          <div className="p-2 border rounded-md text-right">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                <span className={marketSentiment === 'positive' ? 'text-green-600' : marketSentiment === 'negative' ? 'text-red-600' : ''}>
                  {marketSentiment === 'positive' ? 'חיובי' : marketSentiment === 'negative' ? 'שלילי' : 'ניטרלי'}
                </span>
              </Badge>
              <span className="text-muted-foreground text-xs">סנטימנט</span>
            </div>
            <p className="font-medium mt-1 flex items-center justify-end gap-1">
              {marketSentiment === 'positive' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : marketSentiment === 'negative' ? (
                <TrendingDown className="h-4 w-4 text-red-600" />
              ) : (
                <BarChart4 className="h-4 w-4 text-blue-600" />
              )}
              <span>
                {communityScore}% חיובי
              </span>
            </p>
          </div>
          
          <div className="p-2 border rounded-md text-right">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">יעד</Badge>
              <span className="text-muted-foreground text-xs">מחיר יעד</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full">
                  <p className="font-medium mt-1 text-green-600">
                    ${formatPrice(priceTarget.avg)}
                  </p>
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
          </div>
          
          <div className="p-2 border rounded-md text-right">
            <div className="flex items-center justify-between">
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
                <Badge variant="outline" className="text-xs">גודל</Badge>
              </div>
              <span className="text-muted-foreground text-xs">שווי שוק</span>
            </div>
            <p className="font-medium mt-1">
              {asset.marketCap 
                ? `$${(asset.marketCap / 1000000000).toFixed(2)}B`
                : 'לא ידוע'
              }
            </p>
          </div>
        </div>
        
        {/* כפתור התראות וקישורים נוספים */}
        <div className="flex justify-between mt-3 text-sm">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="cursor-pointer flex gap-1 items-center">
                    <Globe className="h-3.5 w-3.5" />
                    <span>אתר רשמי</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">פתיחת אתר רשמי של הנכס</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="cursor-pointer flex gap-1 items-center">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>הגדר התראה</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">הגדרת התראות מחיר לנכס זה</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Badge 
            variant="outline" 
            className={
              asset.change24h > 5 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : asset.change24h < -5 
                  ? 'bg-red-100 text-red-800 border-red-200'
                  : ''
            }
          >
            {asset.change24h > 5 
              ? 'מומנטום חזק'
              : asset.change24h < -5
                ? 'ירידה משמעותית'
                : 'יציבות יחסית'
            }
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
};

export default AssetInfoCard;
