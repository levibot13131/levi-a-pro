
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, TrendingDown, AlertCircle, Globe, Twitter, DollarSign } from 'lucide-react';
import { fundamentalDataService, FundamentalData, NewsItem, InfluencerPost, WhaleActivity } from '@/services/fundamentalDataService';
import { toast } from 'sonner';

const Fundamentals = () => {
  const [fundamentalData, setFundamentalData] = useState<FundamentalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [watchSymbols] = useState(['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT']);

  useEffect(() => {
    loadFundamentalData();
    const interval = setInterval(loadFundamentalData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const loadFundamentalData = async () => {
    setLoading(true);
    try {
      const data = await fundamentalDataService.getFundamentalData(watchSymbols);
      setFundamentalData(data);
      console.log('📰 Fundamental data loaded:', data);
    } catch (error) {
      console.error('Error loading fundamental data:', error);
      toast.error('שגיאה בטעינת נתונים פונדמנטליים');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('he-IL');
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
      case 'bullish':
        return 'text-green-600 bg-green-50';
      case 'negative':
      case 'bearish':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
      case 'bullish':
        return <TrendingUp className="h-4 w-4" />;
      case 'negative':
      case 'bearish':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[impact as keyof typeof colors] || colors.low;
  };

  if (!fundamentalData) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">ניתוח פונדמנטלי</h1>
          <p className="text-muted-foreground">חדשות, רשתות חברתיות ופעילות לווייתנים</p>
        </div>
        <Button onClick={loadFundamentalData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          רענן נתונים
        </Button>
      </div>

      {/* Market Sentiment Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            סנטימנט השוק הכללי
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getSentimentColor(fundamentalData.marketSentiment.overall)}`}>
                {getSentimentIcon(fundamentalData.marketSentiment.overall)}
                <span className="font-medium">
                  {fundamentalData.marketSentiment.overall === 'bullish' ? 'עליה' : 
                   fundamentalData.marketSentiment.overall === 'bearish' ? 'ירידה' : 'נייטרלי'}
                </span>
              </div>
              <Badge variant="outline">
                {fundamentalData.marketSentiment.confidence.toFixed(1)}% ביטחון
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              מקורות: {fundamentalData.marketSentiment.sources.join(', ')}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="news" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="news">חדשות</TabsTrigger>
          <TabsTrigger value="social">רשתות חברתיות</TabsTrigger>
          <TabsTrigger value="whales">לווייתנים</TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                חדשות קריפטו ({fundamentalData.news.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fundamentalData.news.map((news: NewsItem) => (
                  <div key={news.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{news.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{news.summary}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline">{news.source}</Badge>
                          <Badge className={getSentimentColor(news.sentiment)}>
                            {getSentimentIcon(news.sentiment)}
                            <span className="mr-1">
                              {news.sentiment === 'positive' ? 'חיובי' : 
                               news.sentiment === 'negative' ? 'שלילי' : 'נייטרלי'}
                            </span>
                          </Badge>
                          <Badge className={getImpactBadge(news.impact)}>
                            {news.impact === 'high' ? 'השפעה גבוהה' : 
                             news.impact === 'medium' ? 'השפעה בינונית' : 'השפעה נמוכה'}
                          </Badge>
                          {news.relatedAssets.map(asset => (
                            <Badge key={asset} variant="secondary">{asset}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground ml-4">
                        {formatDate(news.publishedAt)}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.open(news.url, '_blank')}>
                      קרא עוד
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Twitter className="h-5 w-5" />
                רשתות חברתיות ({fundamentalData.socialPosts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fundamentalData.socialPosts.map((post: InfluencerPost) => (
                  <div key={post.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{post.author}</span>
                          <Badge variant="outline">{post.platform}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {post.followers.toLocaleString()} עוקבים
                          </span>
                        </div>
                        <p className="text-sm mb-3">{post.content}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getSentimentColor(post.sentiment)}>
                            {getSentimentIcon(post.sentiment)}
                            <span className="mr-1">
                              {post.sentiment === 'bullish' ? 'עליה' : 
                               post.sentiment === 'bearish' ? 'ירידה' : 'נייטרלי'}
                            </span>
                          </Badge>
                          <Badge variant="outline">{post.engagement} אינטראקציות</Badge>
                          {post.relatedAssets.map(asset => (
                            <Badge key={asset} variant="secondary">{asset}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground ml-4">
                        {formatDate(post.publishedAt)}
                      </div>
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
                פעילות לווייתנים ({fundamentalData.whaleActivity.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fundamentalData.whaleActivity.map((whale: WhaleActivity) => (
                  <div key={whale.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={whale.transactionType === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {whale.transactionType === 'buy' ? 'קנייה' : 
                             whale.transactionType === 'sell' ? 'מכירה' : 'העברה'}
                          </Badge>
                          <Badge variant="outline">{whale.asset}</Badge>
                          {whale.exchange && <Badge variant="secondary">{whale.exchange}</Badge>}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">כמות: </span>
                            <span className="font-semibold">{whale.amount.toLocaleString()} {whale.asset}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">ערך: </span>
                            <span className="font-semibold">${whale.value.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          כתובת: {whale.walletAddress.slice(0, 10)}...{whale.walletAddress.slice(-8)}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground ml-4">
                        {formatDate(whale.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Fundamentals;
