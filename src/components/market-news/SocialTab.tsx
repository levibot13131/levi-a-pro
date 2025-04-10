
import React from 'react';
import { SocialPost } from '@/types/asset';
import { Card, CardContent } from '@/components/ui/card';
import { Twitter } from 'lucide-react';
import SocialPostCard from './SocialPostCard';
import LoadingSpinner from '../common/LoadingSpinner';

interface SocialTabProps {
  postsLoading: boolean;
  filteredPosts: SocialPost[];
  getSentimentBadge: (sentiment?: 'positive' | 'neutral' | 'negative') => React.ReactNode;
  formatDate: (dateStr: string) => string;
  formatNumber: (num: number) => string;
}

const SocialTab: React.FC<SocialTabProps> = ({ 
  postsLoading, 
  filteredPosts, 
  getSentimentBadge, 
  formatDate,
  formatNumber 
}) => {
  if (postsLoading) {
    return <LoadingSpinner />;
  }
  
  if (filteredPosts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Twitter className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">לא נמצאו פוסטים עבור הפילטר שנבחר</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {filteredPosts.map(post => (
        <SocialPostCard 
          key={post.id}
          post={post}
          getSentimentBadge={getSentimentBadge}
          formatDate={formatDate}
          formatNumber={formatNumber}
        />
      ))}
    </div>
  );
};

export default SocialTab;
