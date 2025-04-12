import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InfoIcon, Newspaper, LineChart, AlertTriangle, Zap, ChevronDown, HelpCircle } from 'lucide-react';
import NewsGrid from '@/components/market-news/NewsGrid';
import SimpleTable from '@/components/ui/simple-table';
import MarketQuickStats from '@/components/market-news/MarketQuickStats';
import useMarketNews, { formatTimeAgo } from '@/hooks/use-market-news';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTradingViewConnection } from '@/hooks/use-tradingview-connection';
import TradingViewConnectButton from '@/components/technical-analysis/tradingview/TradingViewConnectButton';
import LiquidityFlowsChart from '@/components/charts/LiquidityFlowsChart';
import { useTradingViewIntegration } from '@/hooks/use-tradingview-integration';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import TopInfluencers from '@/components/market-news/TopInfluencers';
import UpcomingEvents from '@/components/market-news/UpcomingEvents';
import RequireAuth from '@/components/auth/RequireAuth';
import GuideModal from '@/components/GuideModal';

const MarketNews = () => {
  const [filter, setFilter] = useState('');
  const { isConnected } = useTradingViewConnection();
  const { fetchNews } = useTradingViewIntegration();
  const [showConnectModal, setShowConnectModal] = useState(!isConnected);
  const [guideOpen, setGuideOpen] = useState(false);
  
  const {
    latestNews,
    marketUpdates,
    trendingTopics,
    isLoading,
    refetch,
    lastUpdate
  } = useMarketNews({ externalFetch: isConnected ? fetchNews : undefined });

  const filteredNews = filter 
    ? latestNews.filter(news => 
        news.title.toLowerCase().includes(filter.toLowerCase()) || 
        news.summary.toLowerCase().includes(filter.toLowerCase()) ||
        news.source.toLowerCase().includes(filter.toLowerCase())
      )
    : latestNews;

  return (
    <RequireAuth>
      <Container className="py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">חדשות שוק וניתוח מגמות</h1>
            <p className="text-muted-foreground">עדכוני שוק, ניתוחים וחדשות מהעולם הפיננסי</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={() => setGuideOpen(true)}
            >
              <HelpCircle className="h-4 w-4" />
              מדריך התחברות
            </Button>
            
            <Sheet open={showConnectModal} onOpenChange={setShowConnectModal}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1" disabled={isConnected}>
                  <LineChart className="h-4 w-4" />
                  {isConnected ? 'מחובר ל-TradingView' : 'התחבר ל-TradingView'}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="text-right">התחברות ל-TradingView</SheetTitle>
                  <SheetDescription className="text-right">
                    חיבור לחשבון TradingView שלך יאפשר לקבל חדשות ועדכונים בזמן אמת
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <div className="rounded-lg bg-muted p-6 mb-6">
                    <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-center mb-4 font-medium">התחברות לקבלת נתונים מעודכנים</p>
                    <p className="text-sm text-center text-muted-foreground mb-4">
                      החיבור יאפשר לך לקבל נתונים מעודכנים, חדשות ומגמות שוק בזמן אמת
                    </p>
                    <TradingViewConnectButton onConnectSuccess={() => setShowConnectModal(false)} />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowConnectModal(false)}
                    >
                      סגור
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <MarketQuickStats />

        <Tabs defaultValue="news" className="mt-6">
          <TabsList>
            <TabsTrigger value="news" className="flex gap-1 items-center">
              <News className="h-4 w-4 mr-1" />
              חדשות שוק
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex gap-1 items-center">
              <LineChart className="h-4 w-4 mr-1" />
              ניתוח מגמות
            </TabsTrigger>
            <TabsTrigger value="events" className="flex gap-1 items-center">
              <Zap className="h-4 w-4 mr-1" />
              אירועים קרובים
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="mt-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-3/4">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-full max-w-sm">
                    <Input
                      className="h-8"
                      placeholder="חיפוש חדשות..."
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {lastUpdate && (
                      <span>עודכן: {formatTimeAgo(lastUpdate)}</span>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => refetch()}
                    >
                      <span className="sr-only">רענן</span>
                      {isLoading ? (
                        <Skeleton className="h-4 w-4 rounded-full animate-spin" />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M20 11A8.1 8.1 0 0 0 4.5 9"></path>
                          <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <path d="M3 12a9 9 0 0 0 9 9"></path>
                          <path d="M13 17a4 4 0 0 1-4 4"></path>
                        </svg>
                      )}
                    </Button>
                  </div>
                </div>

                <NewsGrid
                  news={filteredNews}
                  isLoading={isLoading}
                  noResultsMessage={
                    filter ? 
                      "לא נמצאו תוצאות לחיפוש זה" : 
                      isConnected ? 
                        "אין חדשות זמינות כרגע" : 
                        "התחבר ל-TradingView לקבלת חדשות מעודכנות"
                  }
                />
              </div>

              <div className="md:w-1/4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">נושאים חמים</CardTitle>
                    <CardDescription className="text-right">הנושאים המדוברים ביותר</CardDescription>
                  </CardHeader>
                  <div className="px-4 pb-4">
                    {isLoading ? (
                      <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} className="h-4 w-full" />
                        ))}
                      </div>
                    ) : trendingTopics.length > 0 ? (
                      <div className="flex flex-wrap gap-2 justify-end">
                        {trendingTopics.map((topic, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-muted transition-colors text-xs"
                            onClick={() => setFilter(topic.name)}
                          >
                            {topic.name}
                            {topic.count > 1 && <span className="text-xs ml-1">({topic.count})</span>}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-center text-muted-foreground">
                        אין נושאים חמים זמינים כרגע
                      </p>
                    )}
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">עדכוני שוק</CardTitle>
                    <CardDescription className="text-right">עדכונים אחרונים מהשוק</CardDescription>
                  </CardHeader>
                  <div className="px-4 pb-4">
                    {isLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="space-y-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-full" />
                          </div>
                        ))}
                      </div>
                    ) : marketUpdates.length > 0 ? (
                      <div className="space-y-3 text-right">
                        {marketUpdates.map((update, index) => (
                          <div key={index} className="border-b pb-2 last:border-b-0 last:pb-0">
                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium">{update.title}</h4>
                                <p className="text-xs text-muted-foreground">{update.summary}</p>
                              </div>
                              <InfoIcon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-center text-muted-foreground">
                        אין עדכוני שוק זמינים כרגע
                      </p>
                    )}
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-right flex justify-between items-center">
                      <Button variant="ghost" size="sm" className="h-auto p-1">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      מקורות מידע
                    </CardTitle>
                  </CardHeader>
                  <div className="px-4 pb-4">
                    <div className="space-y-2 text-right">
                      <div className="flex justify-between items-center px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer">
                        <span className="text-xs font-medium">100%</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">TradingView</span>
                          <Newspaper className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
              <div className="lg:col-span-5">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">כניסות ויציאות נזילות</CardTitle>
                    <CardDescription className="text-right">זרימת הנזילות לשוק בחודש האחרון</CardDescription>
                  </CardHeader>
                  <div className="px-6 pb-6">
                    <div className="h-[350px]">
                      <LiquidityFlowsChart />
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <TopInfluencers />
              </div>
              
              <div className="lg:col-span-7">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">מגמות נכסים מובילים</CardTitle>
                    <CardDescription className="text-right">ביצועי הנכסים המובילים ב-24 השעות האחרונות</CardDescription>
                  </CardHeader>
                  <div className="p-6">
                    <SimpleTable
                      data={[
                        { asset: 'Bitcoin', symbol: 'BTC', price: '$51,342.10', change: '+2.4%', volume: '$32.4B', mcap: '$965.8B' },
                        { asset: 'Ethereum', symbol: 'ETH', price: '$2,984.76', change: '-0.8%', volume: '$18.7B', mcap: '$352.1B' },
                        { asset: 'Binance Coin', symbol: 'BNB', price: '$578.23', change: '+1.2%', volume: '$2.1B', mcap: '$89.4B' },
                        { asset: 'Solana', symbol: 'SOL', price: '$103.45', change: '+4.6%', volume: '$2.9B', mcap: '$42.7B' },
                        { asset: 'Cardano', symbol: 'ADA', price: '$0.57', change: '-1.3%', volume: '$0.9B', mcap: '$18.6B' },
                      ]}
                      columns={[
                        {
                          header: 'נכס',
                          accessorKey: 'asset',
                          cell: (row) => (
                            <div className="flex items-center">
                              <div className="h-6 w-6 rounded-full bg-primary/10 mr-2"></div>
                              <div>
                                <div className="font-medium">{row.asset}</div>
                                <div className="text-xs text-muted-foreground">{row.symbol}</div>
                              </div>
                            </div>
                          )
                        },
                        {
                          header: 'מחיר',
                          accessorKey: 'price',
                        },
                        {
                          header: 'שינוי 24ש',
                          accessorKey: 'change',
                          cell: (row) => (
                            <div className={row.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                              {row.change}
                            </div>
                          )
                        },
                        {
                          header: 'מחזור 24ש',
                          accessorKey: 'volume',
                        },
                        {
                          header: 'שווי שוק',
                          accessorKey: 'mcap',
                        },
                      ]}
                    />
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-4">
            <UpcomingEvents />
          </TabsContent>
        </Tabs>
      </Container>
      
      <GuideModal open={guideOpen} onOpenChange={setGuideOpen} />
    </RequireAuth>
  );
};

export default MarketNews;
