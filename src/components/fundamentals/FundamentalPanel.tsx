
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
  Brain
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
}

interface WhaleAlert {
  amount: number;
  symbol: string;
  type: 'buy' | 'sell';
  timestamp: string;
}

export const FundamentalPanel: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [whaleAlerts, setWhaleAlerts] = useState<WhaleAlert[]>([]);
  const [fearGreedIndex, setFearGreedIndex] = useState<number>(50);
  const [nextEvent, setNextEvent] = useState<string>('FOMC Meeting');
  const [nextEventDate, setNextEventDate] = useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFundamentalData();
    const interval = setInterval(loadFundamentalData, 5 * 60 * 1000); // Every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const loadFundamentalData = async () => {
    try {
      console.log('📰 Loading fundamental data...');
      
      // Load news from market_intelligence
      const { data: newsData } = await supabase
        .from('market_intelligence')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(10);

      if (newsData) {
        const formattedNews: NewsItem[] = newsData.map(item => ({
          id: item.id,
          title: item.title,
          content: item.content || '',
          sentiment: (item.sentiment as 'positive' | 'negative' | 'neutral') || 'neutral',
          source: item.source,
          published_at: item.published_at || item.processed_at || new Date().toISOString(),
          symbols: item.symbols || []
        }));
        setNews(formattedNews);
      }

      // Mock whale alerts and fear/greed for now
      setWhaleAlerts([
        { amount: 15000000, symbol: 'BTC', type: 'buy', timestamp: new Date().toISOString() },
        { amount: 8500000, symbol: 'ETH', type: 'sell', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
      ]);

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

  const getFearGreedColor = (index: number) => {
    if (index <= 25) return 'text-red-600';
    if (index <= 50) return 'text-orange-600';
    if (index <= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📊 פאנל פונדמנטלי</h1>
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
        {/* News Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              זרם חדשות קריפטו
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {news.length > 0 ? news.map((item) => (
                <div key={item.id} className="border-b pb-3 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-12 rounded ${getSentimentColor(item.sentiment)}`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
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
                  <p className="text-gray-500">אין חדשות זמינות</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fear & Greed + Events */}
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
                  {fearGreedIndex <= 25 && 'פחד קיצוני'}
                  {fearGreedIndex > 25 && fearGreedIndex <= 50 && 'פחד'}
                  {fearGreedIndex > 50 && fearGreedIndex <= 75 && 'תאוות בצע'}
                  {fearGreedIndex > 75 && 'תאוות בצע קיצונית'}
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
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{nextEvent}</div>
                    <div className="text-sm text-gray-500">
                      {Math.ceil((nextEventDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))} ימים
                    </div>
                  </div>
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                </div>
                
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  האירוע הבא עשוי להשפיע על השווקים הפיננסיים
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fish className="h-5 w-5" />
                התראות לוויתן
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {whaleAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-semibold">
                        ${(alert.amount / 1000000).toFixed(1)}M {alert.symbol}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleTimeString('he-IL')}
                      </div>
                    </div>
                    <Badge variant={alert.type === 'buy' ? 'default' : 'secondary'}>
                      {alert.type === 'buy' ? 'קנייה' : 'מכירה'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
