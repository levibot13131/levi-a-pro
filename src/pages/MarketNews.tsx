
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Newspaper, Search, Filter, Rss } from 'lucide-react';
import { useMarketNews, formatTimeAgo } from '@/hooks/use-market-news';
import NewsTab from '@/components/market-news/NewsTab';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useTradingViewConnection } from '@/hooks/use-tradingview-connection';
import TradingViewConnectButton from '@/components/tradingview/TradingViewConnectButton';

const MarketNews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'crypto' | 'stocks' | 'positive' | 'negative'>('all');
  
  const { news, isLoading: newsLoading } = useMarketNews({
    limit: 12,
    filter: filter
  });
  
  const filteredNews = searchTerm 
    ? news.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : news;
  
  const { isConnected: isTradingViewConnected } = useTradingViewConnection();
  
  const getSentimentBadge = (sentiment?: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">חיובי</Badge>;
      case 'negative':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">שלילי</Badge>;
      case 'neutral':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">ניטרלי</Badge>;
      default:
        return null;
    }
  };
  
  const formatDate = (dateStr: string) => {
    return formatTimeAgo(dateStr);
  };
  
  const handleTradingViewConnectSuccess = () => {
    // Reload news data when connected
    // This would normally fetch news from TradingView
  };
  
  return (
    <Container className="py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">חדשות שוק</h1>
          <p className="text-muted-foreground">עדכוני שוק, חדשות וניתוחים אחרונים</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-4 space-x-reverse rtl:space-x-reverse">
          {!isTradingViewConnected && (
            <TradingViewConnectButton onConnectSuccess={handleTradingViewConnectSuccess} />
          )}
          <Button variant="outline" size="sm" className="gap-2">
            <Rss className="h-4 w-4" />
            הירשם לעדכונים
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חפש חדשות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('all')}
            >
              הכל
            </Button>
            <Button 
              variant={filter === 'crypto' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('crypto')}
            >
              קריפטו
            </Button>
            <Button 
              variant={filter === 'stocks' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('stocks')}
            >
              מניות
            </Button>
            <Button 
              variant={filter === 'positive' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('positive')}
            >
              חיובי
            </Button>
            <Button 
              variant={filter === 'negative' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('negative')}
            >
              שלילי
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="news">
        <TabsList className="mb-6">
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            חדשות
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            ניתוחים
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="news">
          <NewsTab 
            newsLoading={newsLoading}
            filteredNews={filteredNews}
            getSentimentBadge={getSentimentBadge}
            formatDate={formatDate}
          />
        </TabsContent>
        
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">ניתוחי שוק</CardTitle>
              <CardDescription className="text-right">
                ניתוחים מעמיקים על מגמות שוק ונכסים מרכזיים
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-muted-foreground">
                תוכן ניתוחי השוק יופיע כאן בקרוב
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default MarketNews;
