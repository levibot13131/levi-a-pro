
import React from 'react';
import { SocialPost } from '@/types/asset';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

interface SocialPostCardProps {
  post: SocialPost;
  getSentimentBadge: (sentiment?: 'positive' | 'neutral' | 'negative') => React.ReactNode;
  formatDate: (dateStr: string) => string;
  formatNumber: (num: number) => string;
}

const SocialPostCard: React.FC<SocialPostCardProps> = ({ 
  post, 
  getSentimentBadge, 
  formatDate,
  formatNumber 
}) => {
  return (
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
  );
};

export default SocialPostCard;
