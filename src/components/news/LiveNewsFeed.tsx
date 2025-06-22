
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Newspaper, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  RefreshCw,
  ExternalLink,
  Radar,
  Activity
} from 'lucide-react';
import { newsAggregationService, NewsItem, NewsArticle, OnChainAlert } from '@/services/news/newsAggregationService';
import { toast } from 'sonner';

const LiveNewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [onChainAlerts, setOnChainAlerts] = useState<OnChainAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('news');

  useEffect(() => {
    fetchNewsData();
    const interval = setInterval(fetchNewsData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const convertNewsItemToArticle = (newsItem: NewsItem): NewsArticle => {
    return {
      id: newsItem.id,
      title: newsItem.title,
      summary: newsItem.content.substring(0, 200) + '...',
      url: `https://example.com/news/${newsItem.id}`,
      source: newsItem.source,
      publishedAt: new Date(newsItem.timestamp).toISOString(),
      impact: newsItem.impact === 'positive' ? 'high' : newsItem.impact === 'negative' ? 'medium' : 'low',
      sentiment: newsItem.impact,
      symbols: ['BTCUSDT', 'ETHUSDT'] // Default symbols based on content analysis
    };
  };

  const fetchNewsData = async () => {
    setIsLoading(true);
    try {
      // Start news service if not running
      if (!newsAggregationService.isServiceRunning()) {
        await newsAggregationService.start();
      }

      // Get latest news and convert to proper format
      const latestNews = newsAggregationService.getLatestNews(10);
      const convertedNews = latestNews.map(convertNewsItemToArticle);
      setNews(convertedNews);

      // Get high impact news
      const highImpactNews = newsAggregationService.getHighImpactNews(5);
      setNews(prev => [...convertedNews, ...highImpactNews]);

      // Get on-chain alerts
      const alerts = newsAggregationService.getOnChainAlerts(10);
      setOnChainAlerts(alerts);

      setLastUpdate(new Date());
      console.log('📰 News data updated successfully');
    } catch (error) {
      console.error('❌ Error fetching news data:', error);
      toast.error('Failed to fetch news data');
    } finally {
      setIsLoading(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('he-IL');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Live News & Market Intelligence
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchNewsData}
              disabled={isLoading}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Updating...' : 'Refresh'}
            </Button>
            {lastUpdate && (
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(lastUpdate.toISOString())}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              Market News ({news.length})
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Radar className="h-4 w-4" />
              On-Chain Alerts ({onChainAlerts.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="news" className="space-y-4">
            {news.length > 0 ? (
              <div className="space-y-3">
                {news.map((article) => (
                  <div key={article.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getImpactColor(article.impact)}>
                          {article.impact.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{article.source}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(article.publishedAt)}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold mb-2 text-right">{article.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 text-right">{article.summary}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getSentimentColor(article.sentiment)}`}>
                          {article.sentiment === 'positive' ? '📈 חיובי' : 
                           article.sentiment === 'negative' ? '📉 שלילי' : '➡️ נייטרלי'}
                        </span>
                        {article.symbols.length > 0 && (
                          <div className="flex gap-1">
                            {article.symbols.slice(0, 3).map((symbol) => (
                              <Badge key={symbol} variant="outline" className="text-xs">
                                {symbol}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button size="sm" variant="ghost" className="p-1">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No news articles available</p>
                <p className="text-sm text-muted-foreground">Click refresh to fetch latest market news</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-4">
            {onChainAlerts.length > 0 ? (
              <div className="space-y-3">
                {onChainAlerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getImpactColor(alert.impact)}>
                          {alert.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <span className="font-semibold">{alert.symbol}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(new Date(alert.timestamp).toISOString())}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <p className="font-semibold">{alert.amount.toLocaleString()} {alert.symbol}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Value:</span>
                        <p className="font-semibold">{formatCurrency(alert.value)}</p>
                      </div>
                    </div>
                    
                    {alert.exchange && (
                      <div className="flex items-center gap-2 mt-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Exchange: {alert.exchange}</span>
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p>From: {alert.fromAddress.substring(0, 10)}...{alert.fromAddress.substring(alert.fromAddress.length - 8)}</p>
                      <p>To: {alert.toAddress.substring(0, 10)}...{alert.toAddress.substring(alert.toAddress.length - 8)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Radar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No on-chain alerts available</p>
                <p className="text-sm text-muted-foreground">Monitoring whale movements and large transactions</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LiveNewsFeed;
