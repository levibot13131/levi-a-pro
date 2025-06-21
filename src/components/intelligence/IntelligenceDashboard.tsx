
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Activity, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { whaleAlertService } from '@/services/intelligence/whaleAlertService';
import { sentimentService } from '@/services/intelligence/sentimentService';
import { fearGreedService } from '@/services/intelligence/fearGreedService';

const IntelligenceDashboard: React.FC = () => {
  const [whaleData, setWhaleData] = useState<Map<string, any>>(new Map());
  const [sentimentData, setSentimentData] = useState<Map<string, any>>(new Map());
  const [fearGreedData, setFearGreedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];

  useEffect(() => {
    const fetchIntelligenceData = async () => {
      try {
        const [whale, sentiment, fearGreed] = await Promise.all([
          whaleAlertService.getWhaleActivity(symbols),
          sentimentService.getSentimentData(symbols),
          fearGreedService.getFearGreedIndex()
        ]);

        setWhaleData(whale);
        setSentimentData(sentiment);
        setFearGreedData(fearGreed);
      } catch (error) {
        console.error('Error fetching intelligence data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntelligenceData();
    const interval = setInterval(fetchIntelligenceData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getFearGreedColor = (classification: string) => {
    switch (classification) {
      case 'Extreme Fear': return 'bg-red-500';
      case 'Fear': return 'bg-orange-500';
      case 'Neutral': return 'bg-gray-500';
      case 'Greed': return 'bg-yellow-500';
      case 'Extreme Greed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
      case 'extreme_greed':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'bearish':
      case 'extreme_fear':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Real-Time Intelligence Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading intelligence data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Real-Time Intelligence Dashboard
            <Badge variant="secondary">Live Data</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Market intelligence layer analyzing whale activity, sentiment, and fear/greed levels in real-time
          </div>
        </CardContent>
      </Card>

      {/* Fear & Greed Index */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Fear & Greed Index</span>
            <Badge className={getFearGreedColor(fearGreedData?.classification || '')}>
              {fearGreedData?.value || 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">{fearGreedData?.classification || 'Unknown'}</p>
              <p className="text-sm text-muted-foreground">
                Trend: {fearGreedData?.trend || 'stable'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Score Multiplier</p>
              <p className="text-lg font-semibold">
                ×{fearGreedService.getScoreMultiplier().toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Whale Activity */}
      <Card>
        <CardHeader>
          <CardTitle>🐋 Whale Activity Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {symbols.map(symbol => {
              const activity = whaleData.get(symbol);
              if (!activity) return null;

              return (
                <div key={symbol} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{symbol}</span>
                    <Badge variant={activity.sentiment === 'bullish' ? 'default' : activity.sentiment === 'bearish' ? 'destructive' : 'secondary'}>
                      {activity.sentiment}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      Net Flow: ${(activity.netFlow / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.largeTransactions} large transactions
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>📱 Market Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {symbols.map(symbol => {
              const sentiment = sentimentData.get(symbol);
              if (!sentiment) return null;

              return (
                <div key={symbol} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{symbol}</span>
                    {getSentimentIcon(sentiment.overallSentiment)}
                    <Badge variant="outline">
                      {sentiment.overallSentiment.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      Score: {sentiment.score.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {sentiment.influencerMentions} mentions
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Intelligence Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Intelligence Layer Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge variant="default" className="mb-2">Active</Badge>
              <p className="text-sm">Whale Monitoring</p>
            </div>
            <div className="text-center">
              <Badge variant="default" className="mb-2">Active</Badge>
              <p className="text-sm">Sentiment Analysis</p>
            </div>
            <div className="text-center">
              <Badge variant="default" className="mb-2">Active</Badge>
              <p className="text-sm">Fear & Greed</p>
            </div>
            <div className="text-center">
              <Badge variant="default" className="mb-2">Active</Badge>
              <p className="text-sm">Risk Scoring</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligenceDashboard;
