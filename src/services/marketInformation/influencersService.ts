
import { Influencer } from '@/types/market';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const STORAGE_KEY = 'followed_influencers';

export const getInfluencers = (): Influencer[] => {
  return mockInfluencers;
};

export const toggleInfluencerFollow = (influencerId: string): boolean => {
  try {
    const followedIds = getFollowedInfluencerIds();
    
    if (followedIds.includes(influencerId)) {
      // Unfollow
      const updated = followedIds.filter(id => id !== influencerId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return false; // Return boolean to indicate no longer following
    } else {
      // Follow
      followedIds.push(influencerId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(followedIds));
      return true; // Return boolean to indicate now following
    }
  } catch (error) {
    console.error('Error toggling influencer follow:', error);
    toast.error('שגיאה בעדכון מעקב');
    return false;
  }
};

export const getFollowedInfluencerIds = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting followed influencers:', error);
    return [];
  }
};

export const isInfluencerFollowed = (influencerId: string): boolean => {
  return getFollowedInfluencerIds().includes(influencerId);
};

// Mock data
const mockInfluencers: Influencer[] = [
  {
    id: uuidv4(),
    name: 'CryptoScientist',
    handle: '@crypto_scientist',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoScientist',
    followers: 425000,
    influence: 9.2,
    sentiment: 'bullish',
    description: 'אנליסט טכני מומחה. סוחר מקצועי מאז 2013.',
    lastPosts: [
      { content: 'התיקון הנוכחי הוא הזדמנות קנייה מצוינת לטווח הארוך. #Bitcoin', date: '2023-04-01T09:15:00Z', likes: 1250 },
      { content: 'הולדינג בביטקוין זו אסטרטגיה מנצחת לטווח הארוך, למרות התנודתיות.', date: '2023-03-29T14:22:00Z', likes: 875 }
    ]
  },
  {
    id: uuidv4(),
    name: 'WhaleAlert',
    handle: '@whale_alert',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WhaleAlert',
    followers: 2100000,
    influence: 8.7,
    sentiment: 'neutral',
    description: 'מעקב אחר תנועות של ארנקים גדולים בבלוקצ\'יין.',
    lastPosts: [
      { content: 'העברה של 5,000 BTC מבינאנס לארנק לא מזוהה. ערך: $240,000,000', date: '2023-04-02T16:45:00Z', likes: 3200 },
      { content: 'העברה של 45,000 ETH מארנק לא מזוהה לקוינבייס. ערך: $80,000,000', date: '2023-04-01T12:30:00Z', likes: 2850 }
    ]
  },
  {
    id: uuidv4(),
    name: 'DeFiQueen',
    handle: '@defi_queen',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DeFiQueen',
    followers: 780000,
    influence: 8.5,
    sentiment: 'bullish',
    description: 'יזמת DeFi ומומחית למטבעות אלטרנטיביים.',
    lastPosts: [
      { content: 'סולנה ממשיכה להיות פלטפורמה מבטיחה למרות הירידות האחרונות. בונים בשקט.', date: '2023-03-31T20:10:00Z', likes: 1680 },
      { content: 'אתריום עומד לפני עדכון חשוב. מצפה לראות זינוק במחיר בקרוב.', date: '2023-03-27T11:05:00Z', likes: 2450 }
    ]
  },
  {
    id: uuidv4(),
    name: 'MacroEconomist',
    handle: '@macro_econ',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MacroEconomist',
    followers: 1200000,
    influence: 9.0,
    sentiment: 'bearish',
    description: 'כלכלן מאקרו המנתח את השפעת הכלכלה העולמית על קריפטו.',
    lastPosts: [
      { content: 'האינפלציה ממשיכה להיות גבוהה. הפד ימשיך להעלות ריבית, ולא טוב לנכסי סיכון כולל קריפטו.', date: '2023-04-02T10:20:00Z', likes: 3100 },
      { content: 'מגמת הירידה בשוק צפויה להימשך עם ההאטה הכלכלית. היזהרו מהובלה שגויה.', date: '2023-03-30T15:15:00Z', likes: 2850 }
    ]
  },
  {
    id: uuidv4(),
    name: 'TokenAnalyst',
    handle: '@token_analyst',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TokenAnalyst',
    followers: 560000,
    influence: 7.9,
    sentiment: 'neutral',
    description: 'ניתוח מעמיק של טוקנים ופרויקטים בבלוקצ\'יין.',
    lastPosts: [
      { content: 'בדקתי לעומק את המאזן של USDT. יש עדיין סימני שאלה לגבי הגיבוי המלא.', date: '2023-04-01T18:30:00Z', likes: 1950 },
      { content: 'פרויקטים עם תועלת אמיתית ומודלים כלכליים יציבים ישרדו את החורף הקריפטוגרפי.', date: '2023-03-29T09:45:00Z', likes: 2100 }
    ]
  }
];
