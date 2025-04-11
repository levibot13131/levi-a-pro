
import { toast } from 'sonner';

export interface FinancialDataSource {
  id: string;
  name: string;
  url: string;
  category: string;
  dataPoints: string[];
  description: string;
  reliabilityRating: number;
}

export interface MarketInfluencer {
  id: string;
  name: string;
  position: string;
  company: string;
  influence: number;
  recentStatements: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export interface MarketEvent {
  id: string;
  title: string;
  date: string;
  category: string;
  impact: string;
  description: string;
  expectedVolatility: string;
  assetImpact: {
    [key: string]: string;
  };
}

// Financial Data Sources
export const getFinancialDataSources = (): FinancialDataSource[] => {
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

// Market Influencers
export const getMarketInfluencers = (): MarketInfluencer[] => {
  return [
    {
      id: 'influencer1',
      name: 'ג׳רום פאוול',
      position: 'יו״ר',
      company: 'הפדרל ריזרב',
      influence: 95,
      recentStatements: [
        'לא צפוי שינוי בריבית בקרוב',
        'האינפלציה עדיין גבוהה מהיעד',
        'שוק העבודה עדיין חזק'
      ],
      sentiment: 'neutral'
    },
    {
      id: 'influencer2',
      name: 'גארי גנסלר',
      position: 'יו״ר',
      company: 'רשות ניירות ערך האמריקאית (SEC)',
      influence: 85,
      recentStatements: [
        'הרגולציה על מטבעות קריפטוגרפיים תתהדק',
        'מטבעות קריפטוגרפיים רבים הם ניירות ערך',
        'יש צורך בהגנה על משקיעים בשוק הקריפטו'
      ],
      sentiment: 'bearish'
    },
    {
      id: 'influencer3',
      name: 'קתי ווד',
      position: 'מנכ״לית',
      company: 'ARK Invest',
      influence: 80,
      recentStatements: [
        'ביטקוין יגיע ל-$1.5 מיליון תוך עשור',
        'האינפלציה תיחלש בקרוב',
        'חברות חדשנות יובילו את השוק'
      ],
      sentiment: 'bullish'
    },
    {
      id: 'influencer4',
      name: 'מייקל סיילור',
      position: 'יו״ר',
      company: 'MicroStrategy',
      influence: 75,
      recentStatements: [
        'ביטקוין הוא נכס הבסיס של המאה ה-21',
        'החברה תמשיך לרכוש ביטקוין',
        'האסטרטגיה ארוכת טווח לא השתנתה'
      ],
      sentiment: 'bullish'
    }
  ];
};

// Market Events
export const getMarketEvents = (): MarketEvent[] => {
  return [
    {
      id: 'event1',
      title: 'ישיבת הפד',
      date: '2024-05-01',
      category: 'מאקרו',
      impact: 'high',
      description: 'החלטת ריבית של הבנק המרכזי האמריקאי (פד)',
      expectedVolatility: 'high',
      assetImpact: {
        stocks: 'high',
        crypto: 'medium',
        bonds: 'high'
      }
    },
    {
      id: 'event2',
      title: 'הנפקת ETF ביטקוין',
      date: '2024-04-15',
      category: 'קריפטו',
      impact: 'high',
      description: 'אישור והנפקת קרנות סל (ETF) לביטקוין',
      expectedVolatility: 'high',
      assetImpact: {
        stocks: 'low',
        crypto: 'very high',
        bonds: 'low'
      }
    },
    {
      id: 'event3',
      title: 'פרסום נתוני אינפלציה',
      date: '2024-04-10',
      category: 'מאקרו',
      impact: 'medium',
      description: 'פרסום מדד המחירים לצרכן בארה״ב',
      expectedVolatility: 'medium',
      assetImpact: {
        stocks: 'medium',
        crypto: 'medium',
        bonds: 'high'
      }
    },
    {
      id: 'event4',
      title: 'עדכון רשת אתריום',
      date: '2024-06-01',
      category: 'קריפטו',
      impact: 'medium',
      description: 'שדרוג משמעותי לרשת האתריום',
      expectedVolatility: 'medium',
      assetImpact: {
        stocks: 'low',
        crypto: 'high',
        bonds: 'low'
      }
    }
  ];
};

// Connect to External Data Source
export const connectToExternalDataSource = (sourceId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful connection
      toast.success(`התחברות למקור המידע הושלמה בהצלחה`, {
        description: `החיבור ל-${sourceId} פעיל כעת ונתונים יתעדכנו אוטומטית`
      });
      resolve(true);
    }, 1500);
  });
};

// Simulate updating market data
export const refreshMarketData = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      toast.success("נתוני השוק התעדכנו בהצלחה", {
        description: "כל האינדיקטורים הפונדמנטליים מעודכנים לרגע זה"
      });
      resolve();
    }, 1000);
  });
};
