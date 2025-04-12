
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

// סוגי פילטרים
export type NewsFilter = 'all' | 'positive' | 'negative' | 'neutral' | 'crypto' | 'stocks';

// פרמטרים עבור שאילתת חדשות
export interface NewsQueryParams {
  limit?: number;
  offset?: number;
  filter?: NewsFilter;
  assetId?: string;
  search?: string;
}

// נתונים על תנועות לווייתנים
export interface WhaleMovement {
  id: string;
  assetId: string;
  amount: number;
  fromAddress: string;
  toAddress: string;
  timestamp: string;
  transactionType: 'exchange_deposit' | 'exchange_withdrawal' | 'wallet_transfer';
  exchangeName?: string;
}

// הוק לקבלת חדשות שוק
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
  
  // פונקציה לשליפת חדשות
  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const offset = (page - 1) * limit;
      let newsItems: NewsItem[] = [];
      
      // שליפת נתונים מהשירות
      const fetchedNews = await getNewsByAssetId(assetId || '');
      
      // סינון לפי הפילטר הנבחר
      newsItems = fetchedNews.filter(item => {
        if (filter === 'all') {
          return true;
        } else if (filter === 'positive' || filter === 'negative' || filter === 'neutral') {
          return item.sentiment === filter;
        } else if (filter === 'crypto') {
          // סינון לנכסי קריפטו (לפי המזהה או אחר)
          return item.relatedAssets?.some(asset => 
            ['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot'].includes(asset)
          );
        } else if (filter === 'stocks') {
          // סינון למניות
          return item.relatedAssets?.some(asset => 
            ['aapl', 'amzn', 'googl', 'msft', 'tsla'].includes(asset)
          );
        }
        return true;
      });
      
      // סינון לפי חיפוש אם יש
      if (search) {
        const searchLower = search.toLowerCase();
        newsItems = newsItems.filter(item => 
          item.title.toLowerCase().includes(searchLower) || 
          item.summary.toLowerCase().includes(searchLower) ||
          item.source.toLowerCase().includes(searchLower)
        );
      }
      
      // חיתוך לפי מגבלת העמוד
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
  
  // טעינה מחדש של החדשות
  const refetch = () => {
    fetchNews();
  };
  
  // שינוי עמוד
  const changePage = (newPage: number) => {
    setPage(newPage);
  };
  
  // אפקט לטעינת חדשות בטעינה ראשונית או שינוי פרמטרים
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

// פונקציה להשגת תנועות לווייתנים
export const getWhaleMovements = async (assetId: string, limit: number = 5): Promise<WhaleMovement[]> => {
  // מדמה API call לקבלת תנועות לווייתנים
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // מתאים את התנועות לפי סוג הנכס
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
        exchangeName: 'Binance'
      },
      {
        id: '2',
        assetId: 'bitcoin',
        amount: 210.45,
        fromAddress: 'coinbase_wallet',
        toAddress: '0x7c2d3F...a1b2',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        transactionType: 'exchange_withdrawal',
        exchangeName: 'Coinbase'
      }
    ];
  } else if (assetId === 'ethereum') {
    mockMovements = [
      {
        id: '3',
        assetId: 'ethereum',
        amount: 1205.67,
        fromAddress: '0x1f4a3D...c9e2',
        toAddress: 'kraken_wallet',
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        transactionType: 'exchange_deposit',
        exchangeName: 'Kraken'
      }
    ];
  } else if (assetId === 'solana') {
    mockMovements = [
      {
        id: '4',
        assetId: 'solana',
        amount: 8750.21,
        fromAddress: 'ftx_wallet',
        toAddress: '0x9e4b2D...f1e3',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        transactionType: 'exchange_withdrawal',
        exchangeName: 'FTX'
      }
    ];
  } else {
    // לנכסים אחרים, נייצר תנועות אקראיות
    const exchanges = ['Binance', 'Coinbase', 'Kraken', 'FTX', 'Huobi'];
    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
      const isDeposit = Math.random() > 0.5;
      const exchangeName = exchanges[Math.floor(Math.random() * exchanges.length)];
      mockMovements.push({
        id: `generic-${assetId}-${i}`,
        assetId,
        amount: Math.floor(Math.random() * 1000) + 100,
        fromAddress: isDeposit ? `0x${Math.random().toString(16).substring(2, 10)}...` : `${exchangeName.toLowerCase()}_wallet`,
        toAddress: isDeposit ? `${exchangeName.toLowerCase()}_wallet` : `0x${Math.random().toString(16).substring(2, 10)}...`,
        timestamp: new Date(Date.now() - (Math.random() * 86400000)).toISOString(),
        transactionType: isDeposit ? 'exchange_deposit' : 'exchange_withdrawal',
        exchangeName
      });
    }
  }
  
  return mockMovements.slice(0, limit);
};

// פונקציה להשגת נתוני נוזלות שוק
export const getLiquidityFlows = async (timeframe: string = '24h'): Promise<{ inflows: number[], outflows: number[], timeLabels: string[] }> => {
  // מדמה API call לקבלת נתוני נוזלות
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const now = new Date();
  const timeLabels: string[] = [];
  const inflows: number[] = [];
  const outflows: number[] = [];
  
  // יצירת נתונים מדומים לפי מסגרת הזמן
  let points = 0;
  let interval = 0;
  
  if (timeframe === '24h') {
    points = 24;
    interval = 60 * 60 * 1000; // שעה
    for (let i = 0; i < points; i++) {
      const time = new Date(now.getTime() - (points - i) * interval);
      timeLabels.push(time.getHours().toString().padStart(2, '0') + ':00');
      inflows.push(Math.floor(Math.random() * 500) + 100);
      outflows.push(Math.floor(Math.random() * 400) + 50);
    }
  } else if (timeframe === '7d') {
    points = 7;
    interval = 24 * 60 * 60 * 1000; // יום
    for (let i = 0; i < points; i++) {
      const time = new Date(now.getTime() - (points - i) * interval);
      timeLabels.push(time.toLocaleDateString('he-IL', { weekday: 'short' }));
      inflows.push(Math.floor(Math.random() * 2000) + 500);
      outflows.push(Math.floor(Math.random() * 1800) + 300);
    }
  } else if (timeframe === '30d') {
    points = 30;
    interval = 24 * 60 * 60 * 1000; // יום
    for (let i = 0; i < points; i++) {
      const time = new Date(now.getTime() - (points - i) * interval);
      timeLabels.push(time.getDate().toString());
      inflows.push(Math.floor(Math.random() * 5000) + 1000);
      outflows.push(Math.floor(Math.random() * 4500) + 800);
    }
  }
  
  return { inflows, outflows, timeLabels };
};
