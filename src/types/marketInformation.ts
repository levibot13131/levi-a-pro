
export interface FinancialDataSource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: 'news' | 'data' | 'analysis' | 'social';
  reliability: number;
  accessType?: 'free' | 'paid' | 'freemium' | 'api'; // עשיתי אופציונלי + הוספתי אפשרויות חדשות
  languages?: string[]; // אופציונלי
  updateFrequency?: string;
  focused?: boolean; // אופציונלי
}

export interface MarketInfluencer {
  id: string;
  name: string;
  description: string;
  platform?: string; // שימו לב שזה השדה המקורי
  platforms?: { // הוספתי כאפשרות חדשה
    type: string;
    url: string;
    followers: number;
  }[];
  specialty?: string[]; // אופציונלי
  reliability: number;
  sentiment?: 'bullish' | 'bearish' | 'neutral' | 'variable'; // אופציונלי עם משתנה נוסף
  followStatus?: 'following' | 'not-following'; // אופציונלי
}

export interface MarketEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  relatedAssets: string[];
  expectedImpact: 'positive' | 'negative' | 'neutral' | 'variable'; // הוספתי 'variable'
  source: string;
  reminder: boolean;
  type?: string; // אופציונלי - נדרש לפי השגיאות
}

// יתכן שיש לנו טיפוסים נוספים כאן...
