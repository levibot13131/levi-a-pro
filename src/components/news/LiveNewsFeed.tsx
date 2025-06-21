
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, ExternalLink, Newspaper, Activity, AlertTriangle } from 'lucide-react';
import { newsAggregationService, NewsArticle, OnChainAlert } from '@/services/news/newsAggregationService';
import { formatDistanceToNow } from 'date-fns';

const LiveNewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [onChainAlerts, setOnChainAlerts] = useState<OnChainAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('news');

  useEffect(() => {
    // Start news service if not running
    if (!newsAggregationService.isServiceRunning()) {
      newsAggregationService.start();
    }

    // Load initial data
    loadData();

    // Listen for real-time updates
    const handleNewsUpdate = (event: CustomEvent) => {
      setArticles(event.detail.articles);
    };

    const handleOnChainUpdate = (event: CustomEvent) => {
      setOnChainAlerts(event.detail.alerts);
    };

    window.addEventListener('news-update', handleNewsUpdate as EventListener);
    window.addEventListener('onchain-update', handleOnChainUpdate as EventListener);

    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('news-update', handleNewsUpdate as EventListener);
      window.removeEventListener('onchain-update', handleOnChainUpdate as EventListener);
    };
  }, []);

  const loadData = () => {
    setArticles(newsAggregationService.getLatestNews(15));
    setOnChainAlerts(newsAggregationService.getOnChainAlerts(10));
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Force refresh by restarting service
    newsAggregationService.stop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await newsAggregationService.start();
    loadData();
    setIsLoading(false);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'negative': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Live Market Intelligence
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              News ({articles.length})
            </TabsTrigger>
            <TabsTrigger value="onchain" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              On-Chain ({onChainAlerts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="space-y-4 mt-4">
            {articles.length > 0 ? (
              articles.map((article) => (
                <div key={article.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getImpactColor(article.impact)}>
                        {article.impact.toUpperCase()}
                      </Badge>
                      <Badge className={getSentimentColor(article.sentiment)}>
                        {article.sentiment}
                      </Badge>
                      <Badge variant="outline">{article.source}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{article.summary}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {article.symbols.map(symbol => (
                        <Badge key={symbol} variant="secondary" className="text-xs">
                          {symbol}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Read More
                      </a>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Newspaper className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading news feed...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="onchain" className="space-y-4 mt-4">
            {onChainAlerts.length > 0 ? (
              onChainAlerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getImpactColor(alert.impact)}>
                        {alert.impact.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{alert.type.replace('_', ' ').toUpperCase()}</Badge>
                      <Badge variant="secondary">{alert.symbol}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <div className="font-semibold">{alert.amount.toLocaleString()} {alert.symbol}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Value:</span>
                      <div className="font-semibold">${alert.value.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">From:</span>
                      <div className="font-mono text-xs">{alert.fromAddress}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">To:</span>
                      <div className="font-mono text-xs">{alert.toAddress}</div>
                    </div>
                  </div>
                  
                  {alert.exchange && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {alert.exchange}
                      </Badge>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading on-chain alerts...</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LiveNewsFeed;
