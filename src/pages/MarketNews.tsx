
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NewsItem, SocialPost, Asset } from '@/types/asset';
import { getLatestNews, getSocialPosts } from '@/services/mockNewsService';
import { getAssets } from '@/services/mockDataService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Newspaper, Twitter, MessageCircle, RefreshCcw, ExternalLink, ThumbsUp, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const MarketNews = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
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
  
  // פונקציה לפילטור נתונים לפי נכס
  const filterItems = <T extends { relatedAssets?: string[] }>(items: T[] | undefined): T[] => {
    if (!items) return [];
    if (selectedFilter === 'all') return items;
    return items.filter(item => 
      item.relatedAssets?.includes(selectedFilter)
    );
  };
  
  // סינון הנתונים
  const filteredNews = filterItems(news);
  const filteredPosts = filterItems(socialPosts);
  
  // עיצוב תגית לפי סנטימנט
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
  
  // פורמט למספר גדול
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
  };
  
  // פורמט לתאריך
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('he-IL', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">סקירת שוק וחדשות</h1>
        
        <div className="flex gap-4 items-center">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="כל הנכסים" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הנכסים</SelectItem>
              {assets?.map(asset => (
                <SelectItem key={asset.id} value={asset.id}>
                  {asset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => {
              refetchNews();
              refetchPosts();
            }}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
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
          {newsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredNews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">לא נמצאו חדשות עבור הפילטר שנבחר</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map(item => (
                <Card key={item.id} className="overflow-hidden flex flex-col">
                  {item.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="text-right">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{item.source}</Badge>
                      {getSentimentBadge(item.sentiment)}
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription>{formatDate(item.publishedAt)}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-right flex-grow">
                    <p>{item.summary}</p>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-end">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        קרא עוד
                        <ExternalLink className="h-4 w-4 mr-2" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="social" className="space-y-4">
          {postsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Twitter className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">לא נמצאו פוסטים עבור הפילטר שנבחר</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <Card key={post.id}>
                  <CardHeader className="pb-2 text-right">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">
                        {post.platform === 'twitter' ? 'Twitter' : 
                         post.platform === 'reddit' ? 'Reddit' : 
                         post.platform === 'telegram' ? 'Telegram' : 'רשת חברתית'}
                      </Badge>
                      {getSentimentBadge(post.sentiment)}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {post.authorImageUrl && (
                        <div className="h-10 w-10 overflow-hidden rounded-full">
                          <img 
                            src={post.authorImageUrl} 
                            alt={post.author} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="text-right">
                        <CardTitle className="text-base">{post.author}</CardTitle>
                        {post.authorUsername && (
                          <CardDescription className="text-sm">{post.authorUsername}</CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-right">
                    <p className="whitespace-pre-line">{post.content}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {formatDate(post.publishedAt)}
                    </p>
                    
                    {(post.likes || post.comments || post.shares) && (
                      <div className="flex gap-4 mt-3">
                        {post.likes && (
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span className="text-sm">{formatNumber(post.likes)}</span>
                          </div>
                        )}
                        {post.comments && (
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm">{formatNumber(post.comments)}</span>
                          </div>
                        )}
                        {post.shares && (
                          <div className="flex items-center gap-1">
                            <Share2 className="h-4 w-4" />
                            <span className="text-sm">{formatNumber(post.shares)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-end">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={post.postUrl} target="_blank" rel="noopener noreferrer">
                        צפה בפוסט
                        <ExternalLink className="h-4 w-4 mr-2" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketNews;
