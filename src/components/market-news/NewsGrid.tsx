
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTimeAgo } from '@/lib/utils';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishDate: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  assetTags: string[];
  imageUrl?: string;
}

interface NewsGridProps {
  news: NewsItem[];
  isLoading: boolean;
}

const NewsGrid: React.FC<NewsGridProps> = ({ news, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="flex justify-between items-center mt-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">לא נמצאו חדשות</h3>
        <p className="text-muted-foreground mt-1">
          נסה לשנות את הסינון או לחפש מונח אחר
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {news.map((item) => (
        <a 
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          key={item.id}
          className="block transition-all hover:scale-[1.02]"
        >
          <Card className="overflow-hidden h-full">
            {item.imageUrl && (
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
                <div 
                  className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium ${
                    item.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                    item.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}
                >
                  {item.sentiment === 'positive' ? 'חיובי' : 
                   item.sentiment === 'negative' ? 'שלילי' : 'ניטרלי'}
                </div>
              </div>
            )}
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-lg text-right">{item.title}</h3>
              <p className="text-muted-foreground text-sm text-right line-clamp-2">
                {item.summary}
              </p>
              <div className="flex justify-between items-center mt-4 text-sm">
                <span className="text-muted-foreground">
                  {formatTimeAgo(item.publishDate)}
                </span>
                <span className="font-medium">{item.source}</span>
              </div>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
};

export default NewsGrid;
