
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

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

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'ביטקוין שובר שיא חדש לאחר אישור ETF',
    summary: 'מחיר הביטקוין הגיע לשיא חדש של כל הזמנים לאחר אישור קרנות הסל על ידי ה-SEC.',
    source: 'CoinDesk',
    url: '#',
    publishDate: Date.now() - 3600000,
    sentiment: 'positive',
    assetTags: ['bitcoin', 'crypto'],
    imageUrl: 'https://placehold.co/300x200/4b6bfb/fff?text=Bitcoin+News'
  },
  {
    id: '2',
    title: 'אתריום נסחר במגמה שלילית למרות עדכוני הרשת',
    summary: 'מחיר האתריום יורד למרות עדכוני רשת חיוביים בשבוע האחרון.',
    source: 'CryptoNews',
    url: '#',
    publishDate: Date.now() - 7200000,
    sentiment: 'negative',
    assetTags: ['ethereum', 'crypto'],
    imageUrl: 'https://placehold.co/300x200/f1a9a0/fff?text=Ethereum+News'
  },
  // Add more mock news items as needed
];

const mockSocialPosts: SocialPost[] = [
  {
    id: '1',
    username: 'crypto_expert',
    userAvatar: 'https://placehold.co/100/4b6bfb/fff?text=CE',
    platform: 'twitter',
    content: 'הביטקוין בדרך חזרה לשיא. אני צופה מחיר של 100K$ עד סוף השנה! #Bitcoin #BullMarket',
    timestamp: Date.now() - 1800000,
    likes: 1202,
    shares: 324,
    sentiment: 'positive',
    assetTags: ['bitcoin'],
    verified: true
  },
  {
    id: '2',
    username: 'blockchain_dev',
    userAvatar: 'https://placehold.co/100/6bfb4b/fff?text=BD',
    platform: 'reddit',
    content: 'עדכון חשוב לגבי הרשת של אתריום הולך להיות משמעותי מאוד לסקלביליות. אל תתעלמו מזה.',
    timestamp: Date.now() - 5400000,
    likes: 543,
    shares: 102,
    sentiment: 'neutral',
    assetTags: ['ethereum'],
    verified: false
  },
  // Add more mock social posts as needed
];

export default function useMarketNews() {
  const [selectedTab, setSelectedTab] = useState<'news' | 'social'>('news');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [currentNewsPage, setCurrentNewsPage] = useState(1);
  const [currentSocialPage, setCurrentSocialPage] = useState(1);
  const [totalNewsPages, setTotalNewsPages] = useState(1);
  const [totalSocialPages, setTotalSocialPages] = useState(1);
  const [selectedAsset, setSelectedAsset] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const fetchNews = useCallback(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Filter by asset if needed
      let filteredNews = [...mockNews];
      
      if (selectedAsset !== 'all') {
        filteredNews = filteredNews.filter(item => 
          item.assetTags.includes(selectedAsset)
        );
      }
      
      // Filter by sentiment if needed
      if (selectedSentiment !== 'all') {
        filteredNews = filteredNews.filter(item => 
          item.sentiment === selectedSentiment
        );
      }
      
      setNews(filteredNews);
      setTotalNewsPages(Math.max(1, Math.ceil(filteredNews.length / 6)));
      setIsLoading(false);
    }, 500);
  }, [selectedAsset, selectedSentiment]);

  const fetchSocialPosts = useCallback(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Filter by asset if needed
      let filteredPosts = [...mockSocialPosts];
      
      if (selectedAsset !== 'all') {
        filteredPosts = filteredPosts.filter(item => 
          item.assetTags.includes(selectedAsset)
        );
      }
      
      // Filter by sentiment if needed
      if (selectedSentiment !== 'all') {
        filteredPosts = filteredPosts.filter(item => 
          item.sentiment === selectedSentiment
        );
      }
      
      setSocialPosts(filteredPosts);
      setTotalSocialPages(Math.max(1, Math.ceil(filteredPosts.length / 10)));
      setIsLoading(false);
    }, 500);
  }, [selectedAsset, selectedSentiment]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews, selectedAsset, selectedSentiment]);

  useEffect(() => {
    fetchSocialPosts();
  }, [fetchSocialPosts, selectedAsset, selectedSentiment]);

  const nextNewsPage = () => {
    if (currentNewsPage < totalNewsPages) {
      setCurrentNewsPage(currentNewsPage + 1);
    }
  };

  const prevNewsPage = () => {
    if (currentNewsPage > 1) {
      setCurrentNewsPage(currentNewsPage - 1);
    }
  };

  const nextSocialPage = () => {
    if (currentSocialPage < totalSocialPages) {
      setCurrentSocialPage(currentSocialPage + 1);
    }
  };

  const prevSocialPage = () => {
    if (currentSocialPage > 1) {
      setCurrentSocialPage(currentSocialPage - 1);
    }
  };

  return {
    selectedTab,
    setSelectedTab,
    news,
    socialPosts,
    currentNewsPage,
    totalNewsPages,
    currentSocialPage,
    totalSocialPages,
    selectedAsset,
    setSelectedAsset,
    selectedSentiment,
    setSelectedSentiment,
    nextNewsPage,
    prevNewsPage,
    nextSocialPage,
    prevSocialPage,
    isLoading
  };
}
