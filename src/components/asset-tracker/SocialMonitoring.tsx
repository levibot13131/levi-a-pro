
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getLatestNews, getSocialPosts } from '@/services/mockNewsService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, ThumbsUp, Share2, ExternalLink, Twitter, MessageSquare } from 'lucide-react';

const SocialMonitoring: React.FC = () => {
  // Fetch latest news and social posts
  const { data: news = [], isLoading: newsLoading } = useQuery({
    queryKey: ['latestNews'],
    queryFn: getLatestNews,
    refetchInterval: 30000, // Every 30 seconds
  });
  
  const { data: socialPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['socialPosts'],
    queryFn: getSocialPosts,
    refetchInterval: 30000, // Every 30 seconds
  });
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const renderSentimentBadge = (sentiment?: string) => {
    const sentimentMap: Record<string, { label: string, className: string }> = {
      'positive': {
        label: 'חיובי',
        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      },
      'negative': {
        label: 'שלילי',
        className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      },
      'neutral': {
        label: 'ניטרלי',
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      }
    };
    
    const config = sentiment ? sentimentMap[sentiment] : sentimentMap.neutral;
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };
  
  const renderPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-4 w-4 text-blue-500" />;
      case 'reddit':
        return <MessageCircle className="h-4 w-4 text-orange-500" />;
      case 'telegram':
        return <MessageSquare className="h-4 w-4 text-blue-400" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">מעקב חדשות ורשתות חברתיות</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="news">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="news">חדשות ופרסומים</TabsTrigger>
            <TabsTrigger value="social">רשתות חברתיות</TabsTrigger>
          </TabsList>
          
          <TabsContent value="news">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {news.map((item) => (
                  <div key={item.id} className="border rounded-md p-3 hover:bg-accent/20 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {renderSentimentBadge(item.sentiment)}
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(item.publishedAt)}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold mt-2 text-right">{item.title}</h3>
                    <p className="text-sm mt-1 text-muted-foreground text-right">{item.summary}</p>
                    
                    <div className="flex justify-between items-center mt-3">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        קרא עוד
                      </a>
                      <div className="text-sm text-right">
                        מקור: {item.source}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="social">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {socialPosts.map((post) => (
                  <div key={post.id} className="border rounded-md p-3 hover:bg-accent/20 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {renderSentimentBadge(post.sentiment)}
                        {renderPlatformIcon(post.platform)}
                        <span className="text-xs">{post.platform}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2 justify-end">
                      <div className="text-right">
                        <div className="font-semibold">{post.author}</div>
                        {post.authorUsername && (
                          <div className="text-xs text-muted-foreground">{post.authorUsername}</div>
                        )}
                      </div>
                      
                      <Avatar className="h-8 w-8">
                        {post.authorImageUrl && <AvatarImage src={post.authorImageUrl} />}
                        <AvatarFallback>{post.author?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <p className="text-sm mt-2 text-right whitespace-pre-line">
                      {post.content}
                    </p>
                    
                    <div className="flex justify-between items-center mt-3">
                      <a 
                        href={post.postUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        צפה במקור
                      </a>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {post.likes && (
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {post.likes.toLocaleString()}
                          </div>
                        )}
                        {post.comments && (
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {post.comments.toLocaleString()}
                          </div>
                        )}
                        {post.shares && (
                          <div className="flex items-center gap-1">
                            <Share2 className="h-3 w-3" />
                            {post.shares.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SocialMonitoring;
