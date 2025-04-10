
import React from 'react';
import { NewsItem } from '@/types/asset';
import { Card, CardContent } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';
import NewsCard from './NewsCard';
import LoadingSpinner from '../common/LoadingSpinner';

interface NewsTabProps {
  newsLoading: boolean;
  filteredNews: NewsItem[];
  getSentimentBadge: (sentiment?: 'positive' | 'neutral' | 'negative') => React.ReactNode;
  formatDate: (dateStr: string) => string;
}

const NewsTab: React.FC<NewsTabProps> = ({ 
  newsLoading, 
  filteredNews, 
  getSentimentBadge, 
  formatDate 
}) => {
  if (newsLoading) {
    return <LoadingSpinner />;
  }
  
  if (filteredNews.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">לא נמצאו חדשות עבור הפילטר שנבחר</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredNews.map(item => (
        <NewsCard 
          key={item.id}
          item={item} 
          getSentimentBadge={getSentimentBadge} 
          formatDate={formatDate}
        />
      ))}
    </div>
  );
};

export default NewsTab;
