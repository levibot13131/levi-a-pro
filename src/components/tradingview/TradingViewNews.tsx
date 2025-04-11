
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTradingViewConnection } from '@/hooks/use-tradingview-connection';
import { useTradingViewIntegration } from '@/hooks/use-tradingview-integration';
import { Loader2, AlertTriangle, Newspaper, ExternalLink, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TradingViewNewsItem } from '@/services/tradingView/tradingViewIntegrationService';
import TradingViewConnectButton from '@/components/technical-analysis/tradingview/TradingViewConnectButton';

interface TradingViewNewsProps {
  limit?: number;
}

const TradingViewNews: React.FC<TradingViewNewsProps> = ({ limit = 5 }) => {
  const { isConnected } = useTradingViewConnection();
  const { fetchNews } = useTradingViewIntegration();
  const [news, setNews] = useState<TradingViewNewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load news on component mount
  useEffect(() => {
    const loadNews = async () => {
      if (!isConnected) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const newsItems = await fetchNews(limit);
        setNews(newsItems);
      } catch (err) {
        console.error('Error loading news:', err);
        setError('אירעה שגיאה בטעינת החדשות');
      } finally {
        setLoading(false);
      }
    };
    
    loadNews();
  }, [isConnected, fetchNews, limit]);
  
  // Format date
  const formatDate = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffHours = Math.round((now.getTime() - date.getTime()) / (60 * 60 * 1000));
    
    if (diffHours < 24) {
      return `לפני ${diffHours} שעות`;
    } else {
      return date.toLocaleDateString('he-IL');
    }
  };
  
  // Get sentiment badge
  const getSentimentBadge = (sentiment?: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">חיובי</Badge>;
      case 'negative':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">שלילי</Badge>;
      case 'neutral':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">נייטרלי</Badge>;
      default:
        return null;
    }
  };
  
  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-right">חדשות TradingView</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">אינך מחובר לחשבון TradingView</h3>
          <p className="text-sm text-muted-foreground mb-4">
            חבר את חשבון ה-TradingView שלך כדי לצפות בחדשות עדכניות
          </p>
          <TradingViewConnectButton />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://www.tradingview.com/news/', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            פתח באתר
          </Button>
          <CardTitle className="text-right flex items-center">
            <Newspaper className="h-5 w-5 ml-2" />
            חדשות TradingView
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <p>{error}</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Newspaper className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>אין חדשות זמינות כרגע</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {news.map((item) => (
                <div 
                  key={item.id} 
                  className="border rounded-md p-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    {getSentimentBadge(item.sentiment)}
                    <h3 className="font-medium text-right">{item.title}</h3>
                  </div>
                  
                  <p className="text-sm text-right mb-3">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-1 justify-end mb-3">
                    {item.relatedSymbols.map((symbol) => (
                      <Badge key={symbol} variant="outline">{symbol}</Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto"
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      קרא עוד
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <span>{item.source}</span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(item.publishDate)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingViewNews;
