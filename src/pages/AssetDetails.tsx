import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getAssetById, getAssetHistory } from '@/services/realTimeAssetService';
import { LineChart, BarChart, PieChart, Activity, Info, BarChart2, Globe, Wallet, ExternalLink } from 'lucide-react';
import { Asset, AssetHistoricalData } from '@/types/asset';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import PriceChart from '@/components/charts/PriceChart';
import WhaleTracker from '@/components/technical-analysis/WhaleTracker';
import SocialMonitoring from '@/components/asset-tracker/SocialMonitoring';
import { useAssetTracking } from '@/hooks/use-asset-tracking';
import { toast } from 'sonner';

const AssetDetails = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const [timeframe, setTimeframe] = React.useState<'1d' | '1w' | '1m'>('1d');
  
  const { data: asset, isLoading: assetLoading } = useQuery({
    queryKey: ['asset', assetId],
    queryFn: () => getAssetById(assetId || ''),
    enabled: !!assetId,
  });
  
  const { data: historicalData, isLoading: historyLoading } = useQuery({
    queryKey: ['assetHistory', assetId, timeframe],
    queryFn: () => getAssetHistory(assetId || '', timeframe),
    enabled: !!assetId,
  });
  
  const { 
    isTracked, 
    addToTracking, 
    removeFromTracking 
  } = useAssetTracking();
  
  const handleTrackAsset = () => {
    if (!asset) return;
    
    if (isTracked(asset.id)) {
      removeFromTracking(asset.id);
      toast.success(`${asset.name} הוסר ממעקב`);
    } else {
      addToTracking(asset);
      toast.success(`${asset.name} נוסף למעקב`);
    }
  };
  
  const formatPrice = (price: number) => {
    return formatCurrency(price);
  };
  
  if (assetLoading) {
    return (
      <Container className="py-6">
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-[400px] mt-6" />
        </div>
      </Container>
    );
  }
  
  if (!asset) {
    return (
      <Container className="py-6">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-2">נכס לא נמצא</h1>
          <p className="text-muted-foreground">הנכס המבוקש אינו קיים או שאינו זמין כרגע</p>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center">
          {asset.icon && (
            <img 
              src={asset.icon} 
              alt={asset.name} 
              className="w-12 h-12 mr-4 rounded-full"
            />
          )}
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold tracking-tight">{asset.name}</h1>
              <Badge variant="outline" className="ml-2">{asset.symbol}</Badge>
              <Badge 
                variant="secondary" 
                className="ml-2"
              >
                {asset.type === 'crypto' ? 'קריפטו' : 
                 asset.type === 'stocks' ? 'מניות' : 
                 asset.type === 'forex' ? 'מט״ח' : 'סחורות'}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              דירוג: #{asset.rank || 'N/A'} • נפח מסחר: {formatCurrency(asset.volume24h || 0)}
            </p>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button 
            variant={isTracked(asset.id) ? "destructive" : "default"}
            onClick={handleTrackAsset}
          >
            {isTracked(asset.id) ? 'הסר ממעקב' : 'הוסף למעקב'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-right text-lg">מחיר נוכחי</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatPrice(asset.price)}</div>
            <div className={`flex items-center mt-1 ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {asset.change24h >= 0 ? '▲' : '▼'} {formatPercentage(Math.abs(asset.change24h))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-right text-lg">שווי שוק</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(asset.marketCap || 0)}</div>
            <div className="text-muted-foreground mt-1">
              נפח מסחר: {formatCurrency(asset.volume24h || 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-right text-lg">היצע</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {asset.supply?.circulating ? formatCurrency(asset.supply.circulating, 0) : 'N/A'}
            </div>
            <div className="text-muted-foreground mt-1">
              {asset.supply?.max ? `מקסימלי: ${formatCurrency(asset.supply.max, 0)}` : 
               asset.supply?.total ? `סה״כ: ${formatCurrency(asset.supply.total, 0)}` : ''}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2 space-x-reverse rtl:space-x-reverse">
              <Button 
                variant={timeframe === '1d' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('1d')}
              >
                יום
              </Button>
              <Button 
                variant={timeframe === '1w' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('1w')}
              >
                שבוע
              </Button>
              <Button 
                variant={timeframe === '1m' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('1m')}
              >
                חודש
              </Button>
            </div>
            <CardTitle className="text-right">גרף מחיר</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <PriceChart 
              data={historicalData?.data || []} 
              timeframe={timeframe}
              height={400}
            />
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <WhaleTracker assetId={asset.id} formatPrice={formatPrice} />
        <SocialMonitoring selectedAsset={asset} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-right">מידע נוסף</CardTitle>
          <CardDescription className="text-right">
            פרטים נוספים על {asset.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about" className="flex items-center gap-1">
                <Info className="h-4 w-4 ml-1" />
                אודות
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-1">
                <BarChart2 className="h-4 w-4 ml-1" />
                סטטיסטיקה
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-1">
                <Globe className="h-4 w-4 ml-1" />
                קהילה
              </TabsTrigger>
              <TabsTrigger value="links" className="flex items-center gap-1">
                <ExternalLink className="h-4 w-4 ml-1" />
                קישורים
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="text-right mt-4">
              <p>{asset.description || 'אין תיאור זמין עבור נכס זה.'}</p>
              
              {asset.tags && asset.tags.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">תגיות:</h3>
                  <div className="flex flex-wrap gap-2">
                    {asset.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="stats" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-md p-3 text-right">
                  <div className="text-sm text-muted-foreground">מחיר נוכחי</div>
                  <div className="text-lg font-semibold">{formatPrice(asset.price)}</div>
                </div>
                <div className="border rounded-md p-3 text-right">
                  <div className="text-sm text-muted-foreground">שינוי 24 שעות</div>
                  <div className={`text-lg font-semibold ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatPercentage(asset.change24h)}
                  </div>
                </div>
                <div className="border rounded-md p-3 text-right">
                  <div className="text-sm text-muted-foreground">שווי שוק</div>
                  <div className="text-lg font-semibold">{formatCurrency(asset.marketCap || 0)}</div>
                </div>
                <div className="border rounded-md p-3 text-right">
                  <div className="text-sm text-muted-foreground">נפח מסחר 24 שעות</div>
                  <div className="text-lg font-semibold">{formatCurrency(asset.volume24h || 0)}</div>
                </div>
                <div className="border rounded-md p-3 text-right">
                  <div className="text-sm text-muted-foreground">היצע במחזור</div>
                  <div className="text-lg font-semibold">
                    {asset.supply?.circulating ? formatCurrency(asset.supply.circulating, 0) : 'N/A'}
                  </div>
                </div>
                <div className="border rounded-md p-3 text-right">
                  <div className="text-sm text-muted-foreground">היצע מקסימלי</div>
                  <div className="text-lg font-semibold">
                    {asset.supply?.max ? formatCurrency(asset.supply.max, 0) : 'ללא הגבלה'}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="social" className="mt-4 text-right">
              {asset.socials ? (
                <div className="space-y-4">
                  {asset.socials.twitter && (
                    <div className="flex items-center">
                      <span className="font-semibold ml-2">Twitter:</span>
                      <a href={asset.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {asset.socials.twitter.replace('https://twitter.com/', '@')}
                      </a>
                    </div>
                  )}
                  {asset.socials.telegram && (
                    <div className="flex items-center">
                      <span className="font-semibold ml-2">Telegram:</span>
                      <a href={asset.socials.telegram} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {asset.socials.telegram.replace('https://t.me/', '')}
                      </a>
                    </div>
                  )}
                  {asset.socials.reddit && (
                    <div className="flex items-center">
                      <span className="font-semibold ml-2">Reddit:</span>
                      <a href={asset.socials.reddit} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {asset.socials.reddit.replace('https://reddit.com/r/', 'r/')}
                      </a>
                    </div>
                  )}
                  {asset.socials.github && (
                    <div className="flex items-center">
                      <span className="font-semibold ml-2">GitHub:</span>
                      <a href={asset.socials.github} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {asset.socials.github.replace('https://github.com/', '')}
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <p>אין מידע חברתי זמין עבור נכס זה.</p>
              )}
            </TabsContent>
            
            <TabsContent value="links" className="mt-4 text-right">
              <div className="space-y-4">
                {asset.website && (
                  <div className="flex items-center">
                    <span className="font-semibold ml-2">אתר רשמי:</span>
                    <a href={asset.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {asset.website}
                    </a>
                  </div>
                )}
                {asset.whitepaper && (
                  <div className="flex items-center">
                    <span className="font-semibold ml-2">מסמך לבן:</span>
                    <a href={asset.whitepaper} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      הורד מסמך לבן
                    </a>
                  </div>
                )}
                <div className="flex items-center">
                  <span className="font-semibold ml-2">מקורות מידע נוספים:</span>
                  <a href={`https://www.coingecko.com/en/coins/${asset.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-2">
                    CoinGecko
                  </a>
                  <a href={`https://coinmarketcap.com/currencies/${asset.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-2">
                    CoinMarketCap
                  </a>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AssetDetails;
