
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartLine, TrendingUp, Clock, ArrowUpRightFromCircle, BarChart3, Wallet, Bitcoin, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import CoinGeckoDashboard from '@/components/crypto/CoinGeckoDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getGlobalData } from '@/services/crypto/coinGeckoService';
import { toast } from 'sonner';

const MarketData = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [globalData, setGlobalData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch global market data
  const fetchGlobalData = async () => {
    try {
      setRefreshing(true);
      const data = await getGlobalData();
      if (data && data.data) {
        setGlobalData(data.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching global data:', error);
      toast.error('שגיאה בטעינת נתוני שוק גלובליים');
    } finally {
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchGlobalData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchGlobalData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  const marketStats = [
    { 
      name: 'מדד מחיר ביטקוין', 
      value: globalData?.market_data?.total_market_cap?.usd ? 
        `$${globalData.market_data.price_usd_change_percentage_24h_utc.toFixed(2)}` : 
        '$67,485.23', 
      change: globalData?.market_data?.price_usd_change_percentage_24h_utc ? 
        `${globalData.market_data.price_usd_change_percentage_24h_utc > 0 ? '+' : ''}${globalData.market_data.price_usd_change_percentage_24h_utc.toFixed(2)}%` : 
        '+2.4%', 
      isPositive: globalData?.market_data?.price_usd_change_percentage_24h_utc ? 
        globalData.market_data.price_usd_change_percentage_24h_utc > 0 : 
        true 
    },
    { 
      name: 'שווי שוק גלובלי', 
      value: globalData?.total_market_cap?.usd ? 
        `$${(globalData.total_market_cap.usd / 1e12).toFixed(2)}T` : 
        '$2.41T', 
      change: globalData?.market_cap_change_percentage_24h_usd ? 
        `${globalData.market_cap_change_percentage_24h_usd > 0 ? '+' : ''}${globalData.market_cap_change_percentage_24h_usd.toFixed(2)}%` : 
        '-1.8%', 
      isPositive: globalData?.market_cap_change_percentage_24h_usd ? 
        globalData.market_cap_change_percentage_24h_usd > 0 : 
        false 
    },
    { 
      name: 'דומיננטיות BTC', 
      value: globalData?.market_cap_percentage?.btc ? 
        `${globalData.market_cap_percentage.btc.toFixed(1)}%` : 
        '53.7%', 
      change: '+0.5%', 
      isPositive: true 
    },
    { 
      name: 'נפח מסחר 24ש', 
      value: globalData?.total_volume?.usd ? 
        `$${(globalData.total_volume.usd / 1e9).toFixed(1)}B` : 
        '$48.2B', 
      change: globalData?.total_volume?.usd ?
        '-5.1%' : 
        '-5.1%',
      isPositive: false 
    }
  ];

  const upcomingEvents = [
    { date: '15 אפר׳', title: 'פגישת הפד', description: 'החלטת ריבית של הבנק המרכזי האמריקאי' },
    { date: '20 אפר׳', title: 'האלבינג ביטקוין', description: 'חצייה של תגמולי הכרייה' },
    { date: '1 מאי', title: 'שחרור נתוני תעסוקה', description: 'פרסום דו״ח התעסוקה החודשי בארה״ב' }
  ];

  return (
    <Container className="py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-right">נתוני שוק</h1>
          <p className="text-muted-foreground text-right">מידע על מחירים, מגמות ונתונים כלכליים בזמן אמת</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 ml-2" />
            עדכון אחרון: {lastUpdated ? 
              `${lastUpdated.toLocaleTimeString()}` : 
              'טוען...'
            }
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={fetchGlobalData}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ml-2 ${refreshing ? 'animate-spin' : ''}`} />
            רענן נתונים
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            סקירה כללית
          </TabsTrigger>
          <TabsTrigger value="crypto" className="flex items-center gap-1">
            <Bitcoin className="h-4 w-4" />
            מטבעות קריפטו
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-1">
            <Wallet className="h-4 w-4" />
            תיק השקעות
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {marketStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{stat.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-sm font-medium ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change}
                      </span>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-right">
                  <div className="flex items-center justify-end">
                    <span>מגמות מחירים עיקריות</span>
                    <ChartLine className="ml-2 h-5 w-5" />
                  </div>
                </CardTitle>
                <CardDescription className="text-right">
                  השינוי ב-24 השעות האחרונות עבור המטבעות המובילים
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CoinGeckoDashboard refreshInterval={60000} showDetails={false} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-right">
                  <div className="flex items-center justify-end">
                    <span>אירועים קרובים</span>
                    <Clock className="ml-2 h-5 w-5" />
                  </div>
                </CardTitle>
                <CardDescription className="text-right">
                  אירועים מהותיים שעשויים להשפיע על השוק
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="border-b last:border-0 pb-3 last:pb-0">
                      <div className="flex justify-between items-start">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                          {event.date}
                        </span>
                        <div className="text-right">
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">
                  <div className="flex items-center justify-end">
                    <span>נכסים מובילים לפי נפח מסחר</span>
                    <TrendingUp className="ml-2 h-5 w-5" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">טבלת נכסים תוצג כאן</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-right">
                  <div className="flex items-center justify-end">
                    <span>מחקרי שוק ואנליזות</span>
                    <ChartLine className="ml-2 h-5 w-5" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] flex flex-col gap-6 justify-center items-center">
                  <p className="text-muted-foreground">ניתן לראות מחקרי שוק ואנליזות נוספות בדפים:</p>
                  <div className="flex gap-3">
                    <Button asChild>
                      <Link to="/technical-analysis">ניתוח טכני</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/information-sources">מקורות מידע</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="crypto">
          <CoinGeckoDashboard refreshInterval={30000} showDetails={true} />
        </TabsContent>
        
        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">תיק ההשקעות שלך</CardTitle>
              <CardDescription className="text-right">
                עקוב אחר ביצועי הנכסים שלך בזמן אמת
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
              <p className="text-muted-foreground mb-4">עדיין אין נכסים בתיק ההשקעות</p>
              <Button asChild>
                <Link to="/asset-tracker">הוסף נכסים לתיק</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default MarketData;
