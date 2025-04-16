
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTimeAgo } from '@/lib/utils';
import { Twitter, MessageCircle, Heart, Repeat, CheckCircle } from 'lucide-react';

interface SocialPost {
  id: string;
  username: string;
  userAvatar?: string;
  platform: 'twitter' | 'reddit' | 'telegram';
  content: string;
  timestamp: number;
  likes: number;
  shares: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  assetTags: string[];
  verified: boolean;
}

interface SocialTabProps {
  socialPosts: SocialPost[];
  isLoading: boolean;
}

const SocialTab: React.FC<SocialTabProps> = ({ socialPosts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (socialPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">לא נמצאו פוסטים</h3>
        <p className="text-muted-foreground mt-1">
          נסה לשנות את הסינון או לחפש מונח אחר
        </p>
      </div>
    );
  }

  const getPlatformIcon = (platform: 'twitter' | 'reddit' | 'telegram') => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-4 w-4 text-[#1DA1F2]" />;
      case 'reddit':
        // Using MessageCircle with reddit color instead of Reddit icon since it's not available
        return <MessageCircle className="h-4 w-4 text-[#FF4500]" />;
      case 'telegram':
        return <MessageCircle className="h-4 w-4 text-[#0088cc]" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {socialPosts.map((post) => (
        <Card key={post.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.userAvatar} />
                <AvatarFallback>{post.username[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-muted-foreground text-sm">
                    {formatTimeAgo(post.timestamp)}
                  </span>
                  <div className="flex items-center gap-1 text-right">
                    <div className="flex items-center">
                      {post.verified && (
                        <CheckCircle className="h-3 w-3 text-blue-500 mr-1" />
                      )}
                      <span className="font-medium">{post.username}@</span>
                    </div>
                    {getPlatformIcon(post.platform)}
                  </div>
                </div>
                
                <p className="text-right mb-3">{post.content}</p>
                
                <div className="flex items-center gap-4 text-muted-foreground text-sm justify-end">
                  <div className="flex items-center gap-1">
                    <span>{post.shares}</span>
                    <Repeat className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{post.likes}</span>
                    <Heart className="h-4 w-4" />
                  </div>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-1 justify-end">
                  {post.assetTags.map(tag => (
                    <span 
                      key={tag} 
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        post.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                        post.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SocialTab;
