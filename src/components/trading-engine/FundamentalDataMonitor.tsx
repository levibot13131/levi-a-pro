
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw, Activity } from 'lucide-react';

interface FearGreedData {
  value: number;
  classification: string;
  timestamp: number;
}

interface WhaleActivity {
  symbol: string;
  amount: number;
  value: number;
  type: 'buy' | 'sell';
  timestamp: number;
}

interface NewsItem {
  title: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  timestamp: number;
}

const FundamentalDataMonitor: React.FC = () => {
  const [fearGreedIndex, setFearGreedIndex] = useState<FearGreedData>({
    value: 67,
    classification: 'Greed',
    timestamp: Date.now()
  });

  const [whaleActivities, setWhaleActivities] = useState<WhaleActivity[]>([
    {
      symbol: 'BTCUSDT',
      amount: 500,
      value: 21500000,
      type: 'buy',
      timestamp: Date.now() - 1200000
    },
    {
      symbol: 'ETHUSDT',
      amount: 2500,
      value: 6250000,
      type: 'sell', 
      timestamp: Date.now() - 2400000
    }
  ]);

  const [recentNews, setRecentNews] = useState<NewsItem[]>([
    {
      title: 'Bitcoin institutional adoption accelerates',
      sentiment: 'positive',
      impact: 'high',
      timestamp: Date.now() - 1800000
    },
    {
      title: 'Regulatory clarity expected for crypto markets',
      sentiment: 'neutral',
      impact: 'medium',
      timestamp: Date.now() - 3600000
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshFundamentalData = async () => {
    setIsRefreshing(true);
    
    try {
      // Simulate API calls to refresh fundamental data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update Fear & Greed Index
      const newValue = Math.floor(Math.random() * 100);
      let classification = 'Neutral';
      if (newValue >= 75) classification = 'Extreme Greed';
      else if (newValue >= 55) classification = 'Greed';
      else if (newValue >= 45) classification = 'Neutral';
      else if (newValue >= 25) classification = 'Fear';
      else classification = 'Extreme Fear';

      setFearGreedIndex({
        value: newValue,
        classification,
        timestamp: Date.now()
      });

      console.log('📊 Fundamental data refreshed');
    } catch (error) {
      console.error('Error refreshing fundamental data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      refreshFundamentalData();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const getFearGreedColor = (value: number) => {
    if (value >= 75) return 'text-red-600';
    if (value >= 55) return 'text-orange-600';
    if (value >= 45) return 'text-yellow-600';
    if (value >= 25) return 'text-blue-600';
    return 'text-purple-600';
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('he-IL');
  };

  return (
    <div className="space-y-6">
      {/* Fear & Greed Index */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshFundamentalData}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              מדד פחד ותאוות בצע
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className={`text-6xl font-bold ${getFearGreedColor(fearGreedIndex.value)}`}>
              {fearGreedIndex.value}
            </div>
            <div className="space-y-2">
              <Badge className={`text-lg px-4 py-2 ${getFearGreedColor(fearGreedIndex.value)}`}>
                {fearGreedIndex.classification}
              </Badge>
              <Progress value={fearGreedIndex.value} className="h-3" />
            </div>
            <div className="text-sm text-muted-foreground">
              עודכן: {formatTime(fearGreedIndex.timestamp)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Whale Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            פעילות לווייתנים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {whaleActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {activity.type === 'buy' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <Badge className={activity.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {activity.type === 'buy' ? 'קנייה' : 'מכירה'}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-bold">{activity.symbol}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.amount.toLocaleString()} | ${activity.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent News */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            חדשות אחרונות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentNews.map((news, index) => (
              <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getSentimentIcon(news.sentiment)}
                  <Badge 
                    className={
                      news.impact === 'high' ? 'bg-red-100 text-red-800' :
                      news.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }
                  >
                    {news.impact}
                  </Badge>
                </div>
                <div className="text-right flex-1 mr-3">
                  <p className="font-medium text-sm">{news.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(news.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FundamentalDataMonitor;
