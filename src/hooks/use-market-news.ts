
import { useState, useEffect } from 'react';
import { getNewsByAssetId, getSocialPostsByAssetId } from '@/services/mockNewsService';
import { NewsItem, SocialPost } from '@/types/asset';
import { formatTimeAgo } from '@/lib/utils';

export const useMarketNews = () => {
  const [selectedTab, setSelectedTab] = useState<'news' | 'social'>('news');
  const [currentNewsPage, setCurrentNewsPage] = useState(1);
  const [totalNewsPages, setTotalNewsPages] = useState(1);
  const [currentSocialPage, setCurrentSocialPage] = useState(1);
  const [totalSocialPages, setTotalSocialPages] = useState(1);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  
  const itemsPerPage = 9;

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Fetch news
        const allNews = await getNewsByAssetId(selectedAsset !== 'all' ? selectedAsset : undefined);
        setNewsItems(allNews);
        setTotalNewsPages(Math.ceil(allNews.length / itemsPerPage));
        
        // Fetch social posts  
        const allPosts = await getSocialPostsByAssetId(selectedAsset !== 'all' ? selectedAsset : undefined);
        setSocialPosts(allPosts);
        setTotalSocialPages(Math.ceil(allPosts.length / itemsPerPage));
      } catch (error) {
        console.error('Error loading news data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedAsset]);
  
  // Filter data by sentiment
  const filteredNews = newsItems.filter(item => 
    selectedSentiment === 'all' || item.sentiment === selectedSentiment
  );
  
  const filteredSocialPosts = socialPosts.filter(post => 
    selectedSentiment === 'all' || post.sentiment === selectedSentiment
  );
  
  // Pagination
  const paginatedNews = filteredNews.slice(
    (currentNewsPage - 1) * itemsPerPage, 
    currentNewsPage * itemsPerPage
  );
  
  const paginatedSocialPosts = filteredSocialPosts.slice(
    (currentSocialPage - 1) * itemsPerPage, 
    currentSocialPage * itemsPerPage
  );
  
  // Navigation
  const nextNewsPage = () => {
    if (currentNewsPage < totalNewsPages) {
      setCurrentNewsPage(prev => prev + 1);
    }
  };
  
  const prevNewsPage = () => {
    if (currentNewsPage > 1) {
      setCurrentNewsPage(prev => prev - 1);
    }
  };
  
  const nextSocialPage = () => {
    if (currentSocialPage < totalSocialPages) {
      setCurrentSocialPage(prev => prev + 1);
    }
  };
  
  const prevSocialPage = () => {
    if (currentSocialPage > 1) {
      setCurrentSocialPage(prev => prev - 1);
    }
  };
    
  return {
    selectedTab,
    setSelectedTab,
    currentNewsPage,
    totalNewsPages,
    currentSocialPage,
    totalSocialPages,
    news: paginatedNews,
    socialPosts: paginatedSocialPosts,
    selectedAsset,
    setSelectedAsset,
    selectedSentiment,
    setSelectedSentiment,
    isLoading: loading,
    nextNewsPage,
    prevNewsPage,
    nextSocialPage,
    prevSocialPage,
    formatTimeAgo
  };
};

export default useMarketNews;
