
import { LegacyFinancialDataSource } from './types';

// Financial Data Sources
export const getFinancialDataSources = (): LegacyFinancialDataSource[] => {
  return [
    {
      id: 'source1',
      name: 'Bloomberg Terminal',
      url: 'https://www.bloomberg.com/professional/solution/bloomberg-terminal/',
      category: 'financial',
      dataPoints: ['מחירי שוק', 'חדשות פיננסיות', 'נתוני מאקרו'],
      description: 'פלטפורמה מקצועית למידע פיננסי בזמן אמת, אנליזות ומחקרי שוק',
      reliabilityRating: 98
    },
    {
      id: 'source2',
      name: 'CoinMetrics',
      url: 'https://coinmetrics.io',
      category: 'crypto',
      dataPoints: ['נתוני מטבעות', 'אינדיקטורים קריפטוגרפיים', 'נתוני רשת'],
      description: 'פלטפורמת נתונים למטבעות קריפטוגרפיים עם דגש על נתוני בלוקצ׳יין',
      reliabilityRating: 92
    },
    {
      id: 'source3',
      name: 'TradingView',
      url: 'https://www.tradingview.com',
      category: 'charts',
      dataPoints: ['מחירי שוק', 'אינדיקטורים טכניים', 'כלי ניתוח גרפי'],
      description: 'פלטפורמה פופולרית לניתוח טכני וגרפים של שווקים פיננסיים',
      reliabilityRating: 90
    },
    {
      id: 'source4',
      name: 'Glassnode',
      url: 'https://glassnode.com',
      category: 'crypto',
      dataPoints: ['נתוני בלוקצ׳יין', 'אינדיקטורים פונדמנטליים', 'ניתוח התנהגות משקיעים'],
      description: 'ניתוח מעמיק של נתוני בלוקצ׳יין עם דגש על אינדיקטורים פונדמנטליים',
      reliabilityRating: 94
    }
  ];
};
