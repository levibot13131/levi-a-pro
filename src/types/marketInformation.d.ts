
export interface MarketInfluencer {
  id: string;
  name: string;
  platform: string;
  followers: number;
  description: string;
  topics: string[];
  isFollowed: boolean;
  influence: number;  // הוספת שדה שחסר
  avatarUrl: string;  // הוספת שדה שחסר
}

export interface FinancialDataSource {
  id: string;
  name: string;
  type: string;
  url: string;
  description: string;
  reliability: number;
  isPaid: boolean;
  frequencyUpdate: string;
  imageUrl: string;  // הוספת שדה שחסר
  languages: string[];
  categories: string[];
  isFeatured: boolean;
  rating: number;
  platform: string;
}

export interface MarketEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
  source: string;
  hasReminder: boolean;
  time: string;  // הוספת שדה שחסר
  link: string;  // הוספת שדה שחסר
}

export type MarketSource = FinancialDataSource;
