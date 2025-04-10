
import { useState } from 'react';
import { NewsItem, SocialPost } from '@/types/asset';
import { Badge } from '@/components/ui/badge';

export const useMarketNews = () => {
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

  return {
    filterItems,
    getSentimentBadge,
    formatNumber,
    formatDate
  };
};
