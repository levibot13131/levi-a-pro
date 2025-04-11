
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";

export const getSignalTypeStyles = (type: 'buy' | 'sell') => {
  if (type === 'buy') {
    return {
      icon: <ArrowUpCircle className="h-10 w-10 text-green-600" />,
      badge: <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">קנייה</Badge>,
      bgColor: 'bg-green-50 dark:bg-green-950',
      textColor: 'text-green-600'
    };
  } else {
    return {
      icon: <ArrowDownCircle className="h-10 w-10 text-red-600" />,
      badge: <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">מכירה</Badge>,
      bgColor: 'bg-red-50 dark:bg-red-950',
      textColor: 'text-red-600'
    };
  }
};

export const getSignalStrengthBadge = (strength: 'weak' | 'medium' | 'strong') => {
  switch (strength) {
    case 'strong':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">חזק</Badge>;
    case 'medium':
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">בינוני</Badge>;
    case 'weak':
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">חלש</Badge>;
  }
};

export const getAnalysisSentimentStyles = (sentiment: 'bullish' | 'bearish' | 'neutral') => {
  switch (sentiment) {
    case 'bullish':
      return {
        icon: <TrendingUp className="h-10 w-10 text-green-600" />,
        badge: <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">חיובי</Badge>,
        textColor: 'text-green-600'
      };
    case 'bearish':
      return {
        icon: <TrendingDown className="h-10 w-10 text-red-600" />,
        badge: <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">שלילי</Badge>,
        textColor: 'text-red-600'
      };
    case 'neutral':
      return {
        icon: <BarChartHorizontal className="h-10 w-10 text-blue-600" />,
        badge: <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">ניטרלי</Badge>,
        textColor: 'text-blue-600'
      };
    }
};

export const getAnalysisTypeBadge = (type: MarketAnalysis['type']) => {
  switch (type) {
    case 'technical':
      return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">טכני</Badge>;
    case 'fundamental':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">פונדמנטלי</Badge>;
    case 'sentiment':
      return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">סנטימנט</Badge>;
  }
};
