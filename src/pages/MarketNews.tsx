
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLatestNews, getSocialPosts } from '@/services/mockNewsService';
import { getAssets } from '@/services/mockDataService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Newspaper, Twitter } from 'lucide-react';

// Custom hook and components
import { useMarketNews } from '@/hooks/useMarketNews';
import MarketNewsHeader from '@/components/market-news/MarketNewsHeader';
import NewsTab from '@/components/market-news/NewsTab';
import SocialTab from '@/components/market-news/SocialTab';

const MarketNews = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const { filterItems, getSentimentBadge, formatNumber, formatDate } = useMarketNews();
  
  // שליפת נתוני חדשות ופוסטים
  const { data: news, isLoading: newsLoading, refetch: refetchNews } = useQuery({
    queryKey: ['news'],
    queryFn: getLatestNews,
  });
  
  const { data: socialPosts, isLoading: postsLoading, refetch: refetchPosts } = useQuery({
    queryKey: ['socialPosts'],
    queryFn: getSocialPosts,
  });
  
  const { data: assets } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
  });
  
  // סינון הנתונים
  const filteredNews = filterItems(news, selectedFilter);
  const filteredPosts = filterItems(socialPosts, selectedFilter);
  
  const handleRefresh = () => {
    refetchNews();
    refetchPosts();
  };
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <MarketNewsHeader 
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        assets={assets}
        onRefresh={handleRefresh}
      />
      
      <Tabs defaultValue="news" className="space-y-4">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="news">
            <Newspaper className="h-4 w-4 mr-2" />
            חדשות
          </TabsTrigger>
          <TabsTrigger value="social">
            <Twitter className="h-4 w-4 mr-2" />
            רשתות חברתיות
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="news" className="space-y-4">
          <NewsTab 
            newsLoading={newsLoading}
            filteredNews={filteredNews}
            getSentimentBadge={getSentimentBadge}
            formatDate={formatDate}
          />
        </TabsContent>
        
        <TabsContent value="social" className="space-y-4">
          <SocialTab 
            postsLoading={postsLoading}
            filteredPosts={filteredPosts}
            getSentimentBadge={getSentimentBadge}
            formatDate={formatDate}
            formatNumber={formatNumber}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketNews;
