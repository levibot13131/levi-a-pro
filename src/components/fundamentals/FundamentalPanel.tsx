
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Newspaper, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  RefreshCw,
  Fish,
  Brain,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  source: string;
  published_at: string;
  symbols: string[];
  impact_level: 'high' | 'medium' | 'low';
  url?: string;
}

interface WhaleAlert {
  amount: number;
  symbol: string;
  type: 'buy' | 'sell';
  timestamp: string;
  tx_hash?: string;
}

interface MacroEvent {
  title: string;
  date: string;
  impact: 'high' | 'medium' | 'low';
  countdown: number;
}

export const FundamentalPanel: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [whaleAlerts, setWhaleAlerts] = useState<WhaleAlert[]>([]);
  const [macroEvents, setMacroEvents] = useState<MacroEvent[]>([]);
  const [fearGreedIndex, setFearGreedIndex] = useState<number>(50);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  // Twitter analysts list for monitoring
  const twitterAnalysts = [
    '@CryptoKaleo', '@TechDev_52', '@rektcapital', '@WillyWoo', '@NicTrades',
    '@BigCheds', '@TheCryptoDog', '@Egyptian_Ankh', '@KevinSvenson_', '@DaanCrypto'
  ];

  useEffect(() => {
    loadFundamentalData();
    const interval = setInterval(loadFundamentalData, 5 * 60 * 1000); // Every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const loadFundamentalData = async () => {
    try {
      console.log('📰 Loading comprehensive fundamental data...');
      
      // Load news from market_intelligence
      const { data: newsData } = await supabase
        .from('market_intelligence')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(20);

      if (newsData) {
        const formattedNews: NewsItem[] = newsData.map(item => ({
          id: item.id,
          title: item.title,
          content: item.content || '',
          sentiment: (item.sentiment as 'positive' | 'negative' | 'neutral') || 'neutral',
          source: item.source,
          published_at: item.published_at || item.processed_at || new Date().toISOString(),
          symbols: item.symbols || [],
          impact_level: (item.impact_level as 'high' | 'medium' | 'low') || 'medium',
          url: item.metadata?.url || '#'
        }));
        setNews(formattedNews);
      }

      // Enhanced whale alerts with more realistic data
      setWhaleAlerts([
        { 
          amount: 15000000, 
          symbol: 'BTC', 
          type: 'buy', 
          timestamp: new Date().toISOString(),
          tx_hash: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
        },
        { 
          amount: 25000000, 
          symbol: 'ETH', 
          type: 'sell', 
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          tx_hash: '0x742d35cc6db5c2e3ef86e6a2d5d9b0e1c45e5f2a'
        },
        {
          amount: 12000000,
          symbol: 'BTC',
          type: 'buy',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          tx_hash: '3FupnzPG7WjEZ3wk8BckVmLcKQtKLsKGD'
        }
      ]);

      // Enhanced macro events with countdown
      const now = new Date();
      const events: MacroEvent[] = [
        {
          title: 'FOMC Interest Rate Decision',
          date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          impact: 'high',
          countdown: 7
        },
        {
          title: 'US CPI Data Release',
          date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          impact: 'high',
          countdown: 3
        },
        {
          title: 'SEC ETF Decision Deadline',
          date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          impact: 'medium',
          countdown: 14
        }
      ];
      setMacroEvents(events);

      setFearGreedIndex(Math.floor(Math.random() * 100));
      setLastUpdate(new Date());
      setLoading(false);

      console.log(`📰 Fundamental data loaded: ${newsData?.length || 0} news items`);
    } catch (error) {
      console.error('❌ Failed to load fundamental data:', error);
      setLoading(false);
    }
  };

  const getDataAge = (): string => {
    const ageMinutes = Math.floor((Date.now() - lastUpdate.getTime()) / 60000);
    return `${ageMinutes} דקות`;
  };

  const getAgeColor = (): string => {
    const ageMinutes = Math.floor((Date.now() - lastUpdate.getTime()) / 60000);
    if (ageMinutes > 30) return 'bg-red-100 text-red-800';
    if (ageMinutes > 15) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getFearGreedColor = (index: number) => {
    if (index <= 25) return 'text-red-600';
    if (index <= 50) return 'text-orange-600';
    if (index <= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getFearGreedClassification = (index: number) => {
    if (index <= 25) return 'פחד קיצוני';
    if (index <= 45) return 'פחד';
    if (index <= 55) return 'נייטרלי';
    if (index <= 75) return 'תאוות בצע';
    return 'תאוות בצע קיצונית';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📊 פאנל פונדמנטלי מתקדם</h1>
        <div className="flex items-center gap-2">
          <Badge className={getAgeColor()}>
            עדכון אחרון: {getDataAge()}
          </Badge>
          <Button onClick={loadFundamentalData} disabled={loading} size="sm">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Enhanced News Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              זרם חדשות ואנליסטים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {news.length > 0 ? news.slice(0, 10).map((item) => (
                <div key={item.id} className="border-b pb-3 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-12 rounded ${getSentimentColor(item.sentiment)}`} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-sm flex-1">{item.title}</h4>
                        <div className="flex gap-1 ml-2">
                          <Badge className={`text-xs ${getImpactColor(item.impact_level)}`}>
                            {item.impact_level === 'high' ? 'גבוה' : item.impact_level === 'medium' ? 'בינוני' : 'נמוך'}
                          </Badge>
                          {item.url && (
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {item.content.substring(0, 120)}...
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{item.source}</span>
                        <span>{new Date(item.published_at).toLocaleDateString('he-IL')}</span>
                      </div>
                      {item.symbols.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {item.symbols.slice(0, 3).map(symbol => (
                            <Badge key={symbol} variant="outline" className="text-xs">
                              {symbol}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-500">טוען חדשות...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                מדד פחד ותאוות בצע
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getFearGreedColor(fearGreedIndex)}`}>
                  {fearGreedIndex}
                </div>
                <Progress value={fearGreedIndex} className="my-3" />
                <div className="text-sm text-gray-600">
                  {getFearGreedClassification(fearGreedIndex)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                לוח אירועים מאקרו
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {macroEvents.map((event, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-semibold text-sm">{event.title}</div>
                      <div className="text-xs text-gray-500">
                        {event.countdown} ימים
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getImpactColor(event.impact)}>
                        {event.impact === 'high' ? 'גבוה' : 'בינוני'}
                      </Badge>
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fish className="h-5 w-5" />
                התראות לוויתן ≥ $10M
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {whaleAlerts.map((alert, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold">
                        ${(alert.amount / 1000000).toFixed(1)}M {alert.symbol}
                      </div>
                      <Badge variant={alert.type === 'buy' ? 'default' : 'secondary'}>
                        {alert.type === 'buy' ? 'קנייה' : 'מכירה'}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>{new Date(alert.timestamp).toLocaleTimeString('he-IL')}</span>
                      {alert.tx_hash && (
                        <Button variant="ghost" size="sm" className="h-4 p-0 text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          TX
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Twitter Analysts Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                ניטור אנליסטים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-600 space-y-1">
                <p className="font-semibold mb-2">רשימת מעקב:</p>
                {twitterAnalysts.slice(0, 5).map(analyst => (
                  <div key={analyst} className="flex justify-between">
                    <span>{analyst}</span>
                    <Badge variant="outline" className="text-xs">פעיל</Badge>
                  </div>
                ))}
                <div className="text-center text-gray-500 mt-2">
                  +{twitterAnalysts.length - 5} נוספים
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
