import { useState, useEffect } from 'react';
import { getNewsByAssetId } from '@/services/mockNewsService';
import { toast } from 'sonner';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  source: string;
  url?: string;
  imageUrl?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  relatedAssets?: string[];
}

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'לפני פחות מדקה';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `לפני ${diffInMinutes} דקות`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `לפני ${diffInHours} שעות`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `לפני ${diffInDays} ימים`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `לפני ${diffInMonths} חודשים`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `לפני ${diffInYears} שנים`;
};

export type NewsFilter = 'all' | 'positive' | 'negative' | 'neutral' | 'crypto' | 'stocks';

export interface NewsQueryParams {
  limit?: number;
  offset?: number;
  filter?: NewsFilter;
  assetId?: string;
  search?: string;
}

export interface WhaleMovement {
  id: string;
  assetId: string;
  amount: number;
  fromAddress: string;
  toAddress: string;
  timestamp: string;
  transactionType: 'exchange_deposit' | 'exchange_withdrawal' | 'wallet_transfer';
  exchangeName?: string;
  walletAddress: string;
  walletLabel?: string;
  source: string;
  destination: string;
  impact: {
    significance: 'very-high' | 'high' | 'medium' | 'low';
    priceImpact: number;
  };
}

export interface WhaleBehaviorPattern {
  pattern: string;
  description: string;
  confidence: number;
  lastOccurrence: number;
  priceImpact: string;
  recommendation: string;
}

export function useMarketNews(params: NewsQueryParams = {}) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  
  const limit = params.limit || 10;
  const filter = params.filter || 'all';
  const assetId = params.assetId;
  const search = params.search || '';
  
  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const offset = (page - 1) * limit;
      let newsItems: NewsItem[] = [];
      
      const fetchedNews = await getNewsByAssetId(assetId || '');
      
      newsItems = fetchedNews.filter(item => {
        if (filter === 'all') {
          return true;
        } else if (filter === 'positive' || filter === 'negative' || filter === 'neutral') {
          return item.sentiment === filter;
        } else if (filter === 'crypto') {
          return item.relatedAssets?.some(asset => 
            ['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot'].includes(asset)
          );
        } else if (filter === 'stocks') {
          return item.relatedAssets?.some(asset => 
            ['aapl', 'amzn', 'googl', 'msft', 'tsla'].includes(asset)
          );
        }
        return true;
      });
      
      if (search) {
        const searchLower = search.toLowerCase();
        newsItems = newsItems.filter(item => 
          item.title.toLowerCase().includes(searchLower) || 
          item.summary.toLowerCase().includes(searchLower) ||
          item.source.toLowerCase().includes(searchLower)
        );
      }
      
      const paginatedItems = newsItems.slice(offset, offset + limit);
      
      setNews(paginatedItems);
      setTotalCount(newsItems.length);
    } catch (err) {
      console.error('Error fetching market news:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch news'));
      toast.error('שגיאה בטעינת חדשות', {
        description: 'לא ניתן לטעון את החדשות האחרונות, אנא נסה שוב מאוחר יותר'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const refetch = () => {
    fetchNews();
  };
  
  const changePage = (newPage: number) => {
    setPage(newPage);
  };
  
  useEffect(() => {
    fetchNews();
  }, [assetId, filter, search, page, limit]);
  
  return {
    news,
    isLoading,
    error,
    totalCount,
    page,
    limit,
    changePage,
    refetch
  };
}

export const getWhaleMovements = async (assetId: string, limit: number = 5): Promise<WhaleMovement[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let mockMovements: WhaleMovement[] = [];
  
  if (assetId === 'bitcoin') {
    mockMovements = [
      {
        id: '1',
        assetId: 'bitcoin',
        amount: 435.78,
        fromAddress: '0x3a1b4C...e5f7',
        toAddress: 'binance_wallet',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        transactionType: 'exchange_deposit',
        exchangeName: 'Binance',
        walletAddress: '0x3a1b4C...e5f7',
        walletLabel: 'Whale Wallet #1',
        source: 'Unknown Wallet',
        destination: 'Binance',
        impact: { significance: 'high', priceImpact: 2.3 }
      },
      {
        id: '2',
        assetId: 'bitcoin',
        amount: 210.45,
        fromAddress: 'coinbase_wallet',
        toAddress: '0x7c2d3F...a1b2',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        transactionType: 'exchange_withdrawal',
        exchangeName: 'Coinbase',
        walletAddress: '0x7c2d3F...a1b2',
        walletLabel: 'Whale Wallet #2',
        source: 'Coinbase',
        destination: 'Unknown Wallet',
        impact: { significance: 'medium', priceImpact: 1.1 }
      }
    ];
  } else {
    mockMovements = [
      {
        id: `${assetId}-1`,
        assetId,
        amount: 100 + Math.random() * 500,
        fromAddress: `0x${Math.random().toString(16).substring(2, 10)}`,
        toAddress: `0x${Math.random().toString(16).substring(2, 10)}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        transactionType: 'exchange_deposit',
        exchangeName: 'Generic Exchange',
        walletAddress: `0x${Math.random().toString(16).substring(2, 10)}`,
        walletLabel: `${assetId.charAt(0).toUpperCase() + assetId.slice(1)} Wallet`,
        source: 'Unknown',
        destination: 'Exchange',
        impact: { 
          significance: Math.random() > 0.5 ? 'high' : 'medium', 
          priceImpact: Math.random() * 3
        }
      }
    ];
  }
  
  return mockMovements.slice(0, limit);
};

export const getWhaleBehaviorPatterns = async (assetId: string): Promise<WhaleBehaviorPattern[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    {
      pattern: 'Accumulation Pattern',
      description: 'Major holders are accumulating this asset quietly',
      confidence: 75,
      lastOccurrence: Date.now() - 172800000,
      priceImpact: '+3.5% expected',
      recommendation: 'Consider adding to position while price is stable'
    },
    {
      pattern: 'Distribution to Exchanges',
      description: 'Whales moving assets to exchanges - possible selling pressure',
      confidence: 68,
      lastOccurrence: Date.now() - 86400000,
      priceImpact: '-2.8% expected',
      recommendation: 'Monitor closely, consider reducing exposure temporarily'
    }
  ];
};

export const getLiquidityFlows = async (timeframe: string = '24h'): Promise<{ inflows: number[], outflows: number[], timeLabels: string[] }> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const now = new Date();
  const timeLabels: string[] = [];
  const inflows: number[] = [];
  const outflows: number[] = [];
  
  let points = 0;
  let interval = 0;
  
  if (timeframe === '24h') {
    points = 24;
    interval = 60 * 60 * 1000;
    for (let i = 0; i < points; i++) {
      const time = new Date(now.getTime() - (points - i) * interval);
      timeLabels.push(time.getHours().toString().padStart(2, '0') + ':00');
      inflows.push(Math.floor(Math.random() * 500) + 100);
      outflows.push(Math.floor(Math.random() * 400) + 50);
    }
  } else if (timeframe === '7d') {
    points = 7;
    interval = 24 * 60 * 60 * 1000;
    for (let i = 0; i < points; i++) {
      const time = new Date(now.getTime() - (points - i) * interval);
      timeLabels.push(time.toLocaleDateString('he-IL', { weekday: 'short' }));
      inflows.push(Math.floor(Math.random() * 2000) + 500);
      outflows.push(Math.floor(Math.random() * 1800) + 300);
    }
  } else if (timeframe === '30d') {
    points = 30;
    interval = 24 * 60 * 60 * 1000;
    for (let i = 0; i < points; i++) {
      const time = new Date(now.getTime() - (points - i) * interval);
      timeLabels.push(time.getDate().toString());
      inflows.push(Math.floor(Math.random() * 5000) + 1000);
      outflows.push(Math.floor(Math.random() * 4500) + 800);
    }
  }
  
  return { inflows, outflows, timeLabels };
};
