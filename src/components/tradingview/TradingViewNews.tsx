import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { useTradingViewIntegration } from '../../hooks/use-tradingview-integration';
import { TradingViewNewsItem } from '../../services/tradingView/types';
import { Skeleton } from '../ui/skeleton';
import { RefreshCw, ExternalLink } from 'lucide-react';

interface TradingViewNewsProps {
  limit?: number;
  refreshKey?: number;
}

const TradingViewNews: React.FC<TradingViewNewsProps> = ({ 
  limit = 10,
  refreshKey
}) => {
  const [newsItems, setNewsItems] = useState<TradingViewNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { fetchNews, isConnected } = useTradingViewIntegration();
  
  useEffect(() => {
    loadNews();
  }, [limit, refreshKey]);
  
  const loadNews = async () => {
    if (!isConnected) {
      setError('אנא התחבר ל-TradingView תחילה');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await fetchNews(limit);
      if (data && data.length > 0) {
        const formattedNews: TradingViewNewsItem[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || item.content || '',
          summary: item.summary,
          source: item.source,
          url: item.url,
          publishDate: item.publishDate || new Date(item.publishedAt || '').getTime(),
          relatedSymbols: item.relatedSymbols,
          sentiment: item.sentiment,
          category: item.category
        }));
        
        setNewsItems(formattedNews);
        setError(null);
      } else {
        setNewsItems([]);
        setError('לא נמצאו פריטי חדשות');
      }
    } catch (err) {
      console.error('Error loading TradingView news:', err);
      setError('שגיאה בטעינת החדשות');
    } finally {
      setIsLoading(false);
    }
  };
  
  function formatDate(timestamp: number) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `לפני ${diffMinutes} דקות`;
    } else if (diffHours < 24) {
      const hours = Math.floor(diffHours);
      return `לפני ${hours} שעות`;
    } else {
      return date.toLocaleDateString('he-IL', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      });
    }
  }
  
  function getCategoryColor(category: string) {
    switch (category?.toLowerCase()) {
      case 'crypto':
      case 'קריפטו':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'stocks':
      case 'מניות':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'forex':
      case 'פורקס':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'commodities':
      case 'סחורות':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'urgent':
      case 'דחוף':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  }
  
  const categories = ['all', ...new Set(newsItems.filter(item => item.category).map(item => item.category as string))];
  
  const filteredNews = activeCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === activeCategory);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-right">חדשות שוק מ-TradingView</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
            <div className="flex justify-center items-center mt-6">
              <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="mr-2 text-sm text-muted-foreground">טוען חדשות בזמן אמת...</span>
            </div>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : newsItems.length > 0 ? (
          <>
            <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mt-2">
              <TabsList className="mb-4 w-full overflow-x-auto flex flex-nowrap justify-start">
                {categories.map(category => (
                  <TabsTrigger key={category} value={category} className="whitespace-nowrap">
                    {category === 'all' ? 'הכל' : category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value={activeCategory} className="mt-0">
                <div className="space-y-4">
                  {filteredNews.map((news, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        {news.category && (
                          <Badge className={getCategoryColor(news.category)}>
                            {news.category}
                          </Badge>
                        )}
                        <h3 className="text-right font-medium text-base">{news.title}</h3>
                      </div>
                      <p className="text-right text-sm text-muted-foreground mb-2">{news.summary || news.description}</p>
                      <div className="flex justify-between items-center text-xs">
                        <a 
                          href={news.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          קרא עוד <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                        <span className="text-muted-foreground">{formatDate(news.publishDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">אין חדשות זמינות כרגע</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingViewNews;
