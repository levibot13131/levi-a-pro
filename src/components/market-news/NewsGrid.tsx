
import React from 'react';
import { NewsItem } from '@/types/asset';
import { Card, CardContent } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import NewsCard from './NewsCard';

interface NewsGridProps {
  news: NewsItem[];
  isLoading: boolean;
  noResultsMessage?: string;
}

const NewsGrid: React.FC<NewsGridProps> = ({ 
  news, 
  isLoading, 
  noResultsMessage = "אין חדשות זמינות" 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index}>
            <div className="h-48 w-full">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="pt-4">
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-1" />
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-4 w-full mb-2" />
              <div className="flex justify-end">
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (news.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{noResultsMessage}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map(item => (
        <NewsCard 
          key={item.id} 
          item={item}
        />
      ))}
    </div>
  );
};

export default NewsGrid;
