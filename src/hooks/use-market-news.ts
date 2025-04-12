
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLatestNews, getSocialPosts } from '@/services/mockNewsService';
import { NewsItem, SocialPost } from '@/types/asset';
import { formatTimeAgo } from '@/lib/utils';

export function useMarketNews() {
  const [selectedTab, setSelectedTab] = useState<'news' | 'social'>('news');
  const [currentNewsPage, setCurrentNewsPage] = useState(1);
  const [currentSocialPage, setCurrentSocialPage] = useState(1);
  const itemsPerPage = 5;

  const { data: news = [], isLoading: newsLoading, refetch: refetchNews } = useQuery({
    queryKey: ['marketNews'],
    queryFn: () => getLatestNews(50),
  });

  const { data: socialPosts = [], isLoading: socialLoading, refetch: refetchSocial } = useQuery({
    queryKey: ['socialPosts'],
    queryFn: () => getSocialPosts(50),
  });

  const totalNewsPages = Math.ceil(news.length / itemsPerPage);
  const totalSocialPages = Math.ceil(socialPosts.length / itemsPerPage);

  const currentNewsItems = news.slice(
    (currentNewsPage - 1) * itemsPerPage,
    currentNewsPage * itemsPerPage
  );

  const currentSocialItems = socialPosts.slice(
    (currentSocialPage - 1) * itemsPerPage,
    currentSocialPage * itemsPerPage
  );

  const refreshData = async () => {
    await Promise.all([refetchNews(), refetchSocial()]);
  };

  const goToNextNewsPage = () => {
    if (currentNewsPage < totalNewsPages) {
      setCurrentNewsPage(prev => prev + 1);
    }
  };

  const goToPrevNewsPage = () => {
    if (currentNewsPage > 1) {
      setCurrentNewsPage(prev => prev - 1);
    }
  };

  const goToNextSocialPage = () => {
    if (currentSocialPage < totalSocialPages) {
      setCurrentSocialPage(prev => prev + 1);
    }
  };

  const goToPrevSocialPage = () => {
    if (currentSocialPage > 1) {
      setCurrentSocialPage(prev => prev - 1);
    }
  };

  // Refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(refreshData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    selectedTab,
    setSelectedTab,
    currentNewsPage,
    totalNewsPages,
    currentSocialPage,
    totalSocialPages,
    news: currentNewsItems,
    socialPosts: currentSocialItems,
    newsLoading,
    socialLoading,
    refreshData,
    goToNextNewsPage,
    goToPrevNewsPage,
    goToNextSocialPage,
    goToPrevSocialPage,
    formatDate,
    formatTimeAgo
  };
}

export default useMarketNews;
