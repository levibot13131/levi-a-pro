
import { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

// Type definitions
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  publishedAt: string;
  source: string;
  url: string;
  imageUrl?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  relatedAssets?: string[];
}

export interface MarketUpdate {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
}

export interface TrendingTopic {
  name: string;
  count: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

// Mock data for development
const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'ביטקוין חצה את רף ה-$50,000',
    summary: 'לאחר עליות משמעותיות, ביטקוין חצה את רף ה-$50,000 לראשונה מאז ינואר.',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    source: 'Crypto News',
    url: '#',
    imageUrl: 'https://picsum.photos/seed/crypto1/800/600',
    sentiment: 'positive',
    relatedAssets: ['bitcoin']
  },
  {
    id: '2',
    title: 'אתריום מתקרב לשיא חדש',
    summary: 'אתריום ממשיך במגמה חיובית ומתקרב לשיא היסטורי חדש, בעקבות התקדמות בעדכון הרשת.',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    source: 'DeFi Times',
    url: '#',
    imageUrl: 'https://picsum.photos/seed/crypto2/800/600',
    sentiment: 'positive',
    relatedAssets: ['ethereum']
  },
  {
    id: '3',
    title: 'רגולטורים מחמירים את הפיקוח על בורסות קריפטו',
    summary: 'רשויות רגולטוריות בארה"ב ובאירופה מודיעות על הידוק הפיקוח על בורסות קריפטו.',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    source: 'Regulation Today',
    url: '#',
    sentiment: 'negative'
  },
  {
    id: '4',
    title: 'CBDC של ישראל: בנק ישראל בוחן אפשרות להנפיק שקל דיגיטלי',
    summary: 'בנק ישראל פרסם נייר עמדה על האפשרות להנפיק מטבע דיגיטלי של הבנק המרכזי (CBDC).',
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    source: 'Banking News IL',
    url: '#',
    imageUrl: 'https://picsum.photos/seed/crypto4/800/600',
    sentiment: 'neutral'
  },
  {
    id: '5',
    title: 'חברת סולנה משיקה קרן לפיתוח אפליקציות DeFi',
    summary: 'חברת סולנה הכריזה על הקמת קרן של 100 מיליון דולר לתמיכה בפיתוח אפליקציות DeFi על הפלטפורמה.',
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    source: 'DeFi Daily',
    url: '#',
    imageUrl: 'https://picsum.photos/seed/crypto5/800/600',
    sentiment: 'positive',
    relatedAssets: ['solana']
  },
  {
    id: '6',
    title: 'קרדנו משחררת עדכון משמעותי לרשת',
    summary: 'קרדנו השיקה עדכון חדש לרשת שלה, שמטרתו לשפר את הביצועים והתמיכה בחוזים חכמים.',
    publishedAt: new Date(Date.now() - 21600000).toISOString(),
    source: 'ADA News',
    url: '#',
    sentiment: 'positive',
    relatedAssets: ['cardano']
  },
];

const mockMarketUpdates: MarketUpdate[] = [
  {
    id: '1',
    title: 'נפח מסחר גלובלי',
    summary: 'נפח המסחר היומי עלה ב-15% ל-$120 מיליארד',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    title: 'דומיננטיות ביטקוין',
    summary: 'דומיננטיות ביטקוין ירדה ל-47.5%, הרמה הנמוכה ביותר ב-3 חודשים',
    timestamp: new Date().toISOString()
  },
  {
    id: '3',
    title: 'כלל שווי שוק',
    summary: 'שווי שוק כולל של הקריפטו עלה ב-5.3% ל-$1.8 טריליון',
    timestamp: new Date().toISOString()
  }
];

const mockTrendingTopics: TrendingTopic[] = [
  { name: 'ביטקוין', count: 5, sentiment: 'positive' },
  { name: 'רגולציה', count: 3, sentiment: 'negative' },
  { name: 'דיפיי', count: 2, sentiment: 'positive' },
  { name: 'NFT', count: 2, sentiment: 'neutral' },
  { name: 'אתריום', count: 4, sentiment: 'positive' },
  { name: 'Web3', count: 1, sentiment: 'positive' },
  { name: 'CBDC', count: 2, sentiment: 'neutral' }
];

// Format time ago in Hebrew
export function formatTimeAgo(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: he });
}

// The hook
interface UseMarketNewsOptions {
  externalFetch?: () => Promise<NewsItem[]>;
}

export default function useMarketNews(options?: UseMarketNewsOptions) {
  const [latestNews, setLatestNews] = useState<NewsItem[]>(mockNews);
  const [marketUpdates, setMarketUpdates] = useState<MarketUpdate[]>(mockMarketUpdates);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>(mockTrendingTopics);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(new Date());
  
  // פונקציה לפילטור נתונים לפי נכס
  const filterItems = <T extends { relatedAssets?: string[] }>(
    items: T[] | undefined, 
    selectedFilter: string
  ): T[] => {
    if (!items) return [];
    if (selectedFilter === 'all') return items;
    return items.filter(item => 
      item.relatedAssets?.includes(selectedFilter)
    );
  };
  
  // עיצוב תגית לפי סנטימנט
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
  
  // פורמט למספר גדול
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
  };
  
  // פורמט לתאריך
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('he-IL', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    try {
      // If external fetch function is provided, use it
      if (options?.externalFetch) {
        const data = await options.externalFetch();
        if (data) {
          setLatestNews(data);
        }
      } else {
        // Otherwise use mock data with a small delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLatestNews(mockNews);
        setMarketUpdates(mockMarketUpdates);
        setTrendingTopics(mockTrendingTopics);
      }
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setIsLoading(false);
    }
  }, [options?.externalFetch]);
  
  // Initial fetch
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);
  
  return {
    latestNews,
    marketUpdates,
    trendingTopics,
    isLoading,
    refetch: fetchNews,
    lastUpdate,
    filterItems,
    getSentimentBadge,
    formatNumber,
    formatDate
  };
}
