
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SocialPost, NewsItem, Asset } from '@/types/asset';
import { getSocialPostsByAssetId, getNewsByAssetId } from '@/services/mockNewsService';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, Twitter, MessageSquare, ThumbsUp, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SocialMonitoringProps {
  selectedAsset: Asset | null;
}

const SocialMonitoring: React.FC<SocialMonitoringProps> = ({ selectedAsset }) => {
  const { data: socialPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['socialPosts', selectedAsset?.id],
    queryFn: () => selectedAsset ? getSocialPostsByAssetId(selectedAsset.id) : Promise.resolve([]),
    enabled: !!selectedAsset,
  });

  const { data: newsItems = [], isLoading: newsLoading } = useQuery({
    queryKey: ['news', selectedAsset?.id],
    queryFn: () => selectedAsset ? getNewsByAssetId(selectedAsset.id) : Promise.resolve([]),
    enabled: !!selectedAsset,
  });

  if (!selectedAsset) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-right">מידע חברתי וחדשות</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p>בחר נכס כדי להציג מידע חברתי וחדשות</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', { 
      year: '2-digit', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getSentimentBadge = (sentiment: string | undefined) => {
    if (!sentiment) return null;
    
    const classes = sentiment === 'positive' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
      : sentiment === 'negative'
        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    
    const label = sentiment === 'positive' 
      ? 'חיובי' 
      : sentiment === 'negative'
        ? 'שלילי'
        : 'ניטרלי';
    
    return <Badge className={classes}>{label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">
          {selectedAsset.name} - מידע חברתי וחדשות
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="social">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="social">רשתות חברתיות</TabsTrigger>
            <TabsTrigger value="news">חדשות</TabsTrigger>
          </TabsList>
          
          <TabsContent value="social">
            {postsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : socialPosts.length > 0 ? (
              <div className="space-y-4 text-right max-h-[400px] overflow-y-auto">
                {socialPosts.map((post: SocialPost) => (
                  <div key={post.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      {getSentimentBadge(post.sentiment)}
                      <div className="flex items-center">
                        <img 
                          src={post.authorImageUrl || '/placeholder.svg'} 
                          alt={post.author}
                          className="w-6 h-6 rounded-full mr-2" 
                        />
                        <div>
                          <span className="font-medium">{post.author}</span>
                          {post.authorUsername && (
                            <span className="text-gray-500 text-sm"> {post.authorUsername}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm my-2">{post.content}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                      <div className="flex space-x-3 space-x-reverse rtl:space-x-reverse">
                        <span className="flex items-center">
                          <ThumbsUp className="h-3 w-3 ml-1" />
                          {formatNumber(post.likes)}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="h-3 w-3 ml-1" />
                          {formatNumber(post.comments)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 ml-1" />
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Twitter className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p>אין פוסטים חברתיים עבור {selectedAsset.name}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="news">
            {newsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : newsItems.length > 0 ? (
              <div className="space-y-4 text-right max-h-[400px] overflow-y-auto">
                {newsItems.map((news: NewsItem) => (
                  <div key={news.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      {getSentimentBadge(news.sentiment)}
                      <h3 className="font-medium">{news.title}</h3>
                    </div>
                    <p className="text-sm my-2">{news.summary}</p>
                    <div className="flex justify-between items-center mt-2">
                      <a href={news.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 flex items-center">
                        קרא עוד <ArrowUpRight className="h-3 w-3 mr-1" />
                      </a>
                      <div className="text-xs text-gray-500 flex items-center">
                        <span>{news.source}</span>
                        <span className="mx-1">•</span>
                        <Calendar className="h-3 w-3 mx-1" />
                        <span>{formatDate(news.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <ArrowUpRight className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p>אין חדשות עבור {selectedAsset.name}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SocialMonitoring;
