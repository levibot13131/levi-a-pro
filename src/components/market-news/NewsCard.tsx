
import React from 'react';
import { NewsItem } from '@/hooks/use-market-news';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { formatTimeAgo } from '@/hooks/use-market-news';

interface NewsCardProps {
  item: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  // Helper function to get badge based on sentiment
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
        <CardDescription>{formatTimeAgo(item.publishedAt)}</CardDescription>
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
