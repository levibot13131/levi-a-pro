
import { useState } from 'react';
import { NewsItem, SocialPost } from '@/types/asset';
import React from 'react';
import { Badge } from '@/components/ui/badge';

export const useMarketNews = () => {
  // State declarations for pagination, filtering, and data
  const [selectedTab, setSelectedTab] = useState<'news' | 'social'>('news');
  const [currentNewsPage, setCurrentNewsPage] = useState<number>(1);
  const [totalNewsPages, setTotalNewsPages] = useState<number>(1);
  const [currentSocialPage, setCurrentSocialPage] = useState<number>(1);
  const [totalSocialPages, setTotalSocialPages] = useState<number>(1);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  
  // Function to filter data by asset
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
  
  // Sentiment badge styling
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
  
  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
  };
  
  // Format dates
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

  // Pagination functions
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
    news: newsItems,
    socialPosts,
    selectedAsset,
    setSelectedAsset,
    selectedSentiment,
    setSelectedSentiment,
    isLoading: loading,
    nextNewsPage,
    prevNewsPage,
    nextSocialPage,
    prevSocialPage,
    filterItems,
    getSentimentBadge,
    formatNumber,
    formatDate
  };
};

export default useMarketNews;
