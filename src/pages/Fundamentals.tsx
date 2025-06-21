
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Globe, 
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  coins: string[];
}

interface WhaleMovement {
  id: string;
  amount: number;
  fromAddress: string;
  toAddress: string;
  coin: string;
  timestamp: number;
  type: 'inflow' | 'outflow';
  exchange?: string;
}

interface MarketSentiment {
  fearGreedIndex: number;
  twitterSentiment: number;
  redditSentiment: number;
  whaleActivity: number;
  overallScore: number;
}

const Fundamentals: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [whaleMovements, setWhaleMovements] = useState<WhaleMovement[]>([]);
  const [sentiment, setSentiment] = useState<MarketSentiment>({
    fearGreedIndex: 65,
    twitterSentiment: 58,
    redditSentiment: 62,
    whaleActivity: 45,
    overallScore: 57.5
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Mock news data - in production would fetch from CoinTelegraph, CoinDesk APIs
  useEffect(() => {
    const mockNews: NewsItem[] = [
      {
        id: '1',
        title: 'Bitcoin ETF Inflows Reach Record High',
        summary: 'institutional adoption continues with $2.1B in weekly inflows to Bitcoin ETFs, signaling strong institutional demand.',
        source: 'CoinTelegraph',
        timestamp: Date.now() - 1800000,
        sentiment: 'bullish',
        impact: 'high',
        coins: ['BTC', 'ETH']
      },
      {
        id: '2',
        title: 'Fed Officials Signal Rate Cut Considerations',
        summary: 'Federal Reserve members discuss potential rate adjustments, which could impact crypto market liquidity.',
        source: 'Bloomberg',
        timestamp: Date.now() - 3600000,
        sentiment: 'bullish',
        impact: 'high',
        coins: ['BTC', 'ETH', 'SOL']
      },
      {
        id: '3',
        title: 'Major DeFi Protocol Reports Security Vulnerability',
        summary: 'Popular DeFi platform discovers potential exploit, temporarily pausing operations for security audit.',
        source: 'CoinDesk',
        timestamp: Date.now() - 7200000,
        sentiment: 'bearish',
        impact: 'medium',
        coins: ['ETH', 'AVAX']
      }
    ];

    const mockWhaleMovements: WhaleMovement[] = [
      {
        id: '1',
        amount: 1250000000,
        fromAddress: '1A1zP1eP...unknown',
        toAddress: 'Binance Hot Wallet',
        coin: 'USDT',
        timestamp: Date.now() - 900000,
        type: 'inflow',
        exchange: 'Binance'
      },
      {
        id: '2',
        amount: 45000000,
        fromAddress: 'Coinbase Pro',
        toAddress: '3FZbgi29...unknown',
        coin: 'BTC',
        timestamp: Date.now() - 1800000,
        type: 'outflow',
        exchange: 'Coinbase'
      }
    ];

    setNews(mockNews);
    setWhaleMovements(mockWhaleMovements);
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update sentiment scores with some variation
      setSentiment(prev => ({
        fearGreedIndex: Math.max(0, Math.min(100, prev.fearGreedIndex + (Math.random() - 0.5) * 10)),
        twitterSentiment: Math.max(0, Math.min(100, prev.twitterSentiment + (Math.random() - 0.5) * 8)),
        redditSentiment: Math.max(0, Math.min(100, prev.redditSentiment + (Math.random() - 0.5) * 6)),
        whaleActivity: Math.max(0, Math.min(100, prev.whaleActivity + (Math.random() - 0.5) * 12)),
        overallScore: 0
      }));

      // Calculate overall score
      setSentiment(prev => ({
        ...prev,
        overallScore: (prev.fearGreedIndex + prev.twitterSentiment + prev.redditSentiment + prev.whaleActivity) / 4
      }));

      setLastUpdate(new Date());
      toast.success('נתונים פונדמנטליים עודכנו בהצלחה');
    } catch (error) {
      toast.error('שגיאה בעדכון נתונים פונדמנטליים');
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-yellow-600" />;
    }
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">ניתוח פונדמנטלי</h1>
          <p className="text-muted-foreground">
            מעקב אחר חדשות, סנטימנט ותנועות לווייתנים בזמן אמת
          </p>
        </div>
        
        <Button onClick={refreshData} disabled={isLoading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          עדכן נתונים
        </Button>
      </div>

      {/* Market Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fear & Greed</p>
                <p className={`text-2xl font-bold ${getSentimentColor(sentiment.fearGreedIndex)}`}>
                  {sentiment.fearGreedIndex.toFixed(0)}
                </p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Twitter</p>
                <p className={`text-2xl font-bold ${getSentimentColor(sentiment.twitterSentiment)}`}>
                  {sentiment.twitterSentiment.toFixed(0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reddit</p>
                <p className={`text-2xl font-bold ${getSentimentColor(sentiment.redditSentiment)}`}>
                  {sentiment.redditSentiment.toFixed(0)}
                </p>
              </div>
              <Globe className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">פעילות לווייתנים</p>
                <p className={`text-2xl font-bold ${getSentimentColor(sentiment.whaleActivity)}`}>
                  {sentiment.whaleActivity.toFixed(0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ציון כללי</p>
                <p className={`text-2xl font-bold ${getSentimentColor(sentiment.overallScore)}`}>
                  {sentiment.overallScore.toFixed(0)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="news" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="news">חדשות</TabsTrigger>
          <TabsTrigger value="whales">לווייתנים</TabsTrigger>
          <TabsTrigger value="calendar">לוח אירועים</TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                חדשות קריפטו בזמן אמת
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {news.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getSentimentIcon(item.sentiment)}
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={item.impact === 'high' ? 'destructive' : item.impact === 'medium' ? 'default' : 'secondary'}>
                          השפעה {item.impact === 'high' ? 'גבוהה' : item.impact === 'medium' ? 'בינונית' : 'נמוכה'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.timestamp).toLocaleTimeString('he-IL')}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{item.summary}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">מטבעות מושפעים:</span>
                        {item.coins.map(coin => (
                          <Badge key={coin} variant="outline">{coin}</Badge>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{item.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                תנועות לווייתנים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {whaleMovements.map((movement) => (
                  <div key={movement.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {movement.type === 'inflow' ? (
                          <TrendingUp className="h-6 w-6 text-green-600" />
                        ) : (
                          <TrendingDown className="h-6 w-6 text-red-600" />
                        )}
                        <div>
                          <p className="font-semibold">
                            {formatAmount(movement.amount)} {movement.coin}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {movement.type === 'inflow' ? 'זרימה פנימה' : 'זרימה החוצה'}
                            {movement.exchange && ` - ${movement.exchange}`}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(movement.timestamp).toLocaleTimeString('he-IL')}
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <p><strong>מ:</strong> {movement.fromAddress}</p>
                      <p><strong>אל:</strong> {movement.toAddress}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                לוח אירועים כלכליים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">FOMC Meeting Minutes</h3>
                    <Badge variant="destructive">השפעה גבוהה</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    פרסום פרוטוקול ישיבת הפד - עשוי להשפיע על מדיניות הריבית
                  </p>
                  <p className="text-xs text-muted-foreground">
                    📅 מחר, 20:00 (שעון ישראל)
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">CPI Data Release</h3>
                    <Badge variant="default">השפעה בינונית</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    פרסום נתוני אינפלציה - חשוב לגישת הבנקים המרכזיים
                  </p>
                  <p className="text-xs text-muted-foreground">
                    📅 יום חמישי, 16:30 (שעון ישראל)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center text-sm text-muted-foreground">
        עדכון אחרון: {lastUpdate.toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })}
      </div>
    </div>
  );
};

export default Fundamentals;
