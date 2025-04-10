
import React from 'react';
import { NewsItem } from '@/types/asset';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface NewsCardProps {
  item: NewsItem;
  getSentimentBadge: (sentiment?: 'positive' | 'neutral' | 'negative') => React.ReactNode;
  formatDate: (dateStr: string) => string;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, getSentimentBadge, formatDate }) => {
  return (
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
  );
};

export default NewsCard;
