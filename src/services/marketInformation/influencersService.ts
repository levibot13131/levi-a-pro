
import { MarketInfluencer } from '@/types/marketInformation';

// מערך של משפיענים פיננסיים לדוגמה
const influencers: MarketInfluencer[] = [
  {
    id: '1',
    name: 'סת׳ מרקסון',
    platform: 'twitter.com',
    followers: 1200000,
    description: 'יזם ומשקיע בתחום הקריפטו, מייסד משותף של מספר פרויקטים בולטים',
    topics: ['קריפטו', 'בלוקצ׳יין', 'השקעות'],
    isFollowed: false,
    influence: 85,
    avatarUrl: 'https://example.com/avatars/seth.jpg',
    username: 'sethmarcus',
    reliability: 90,
    expertise: ['קריפטו', 'השקעות'],
    bio: 'יזם ומשקיע בתחום הקריפטו',
    profileUrl: 'https://twitter.com/sethmarcus',
    isVerified: true,
    assetsDiscussed: ['Bitcoin', 'Ethereum']
  },
  {
    id: '2',
    name: 'שרה טרייד',
    platform: 'youtube.com',
    followers: 850000,
    description: 'מנתחת טכנית וותיקה עם יותר מ-10 שנות ניסיון בשוק ההון',
    topics: ['אנליזה טכנית', 'מט״ח', 'מניות'],
    isFollowed: true,
    influence: 75,
    avatarUrl: 'https://example.com/avatars/sarah.jpg',
    username: 'sarahtrade',
    reliability: 85,
    expertise: ['אנליזה טכנית', 'מט״ח'],
    bio: 'מנתחת טכנית וותיקה',
    profileUrl: 'https://youtube.com/sarahtrade',
    isVerified: true,
    assetsDiscussed: ['EURUSD', 'USDJPY']
  },
  {
    id: '3',
    name: 'דניאל אלפא',
    platform: 'substack.com',
    followers: 320000,
    description: 'כותב ניוזלטר פופולרי על השקעות ארוכות טווח ואסטרטגיות שוק',
    topics: ['השקעות', 'קרנות מדד', 'תיק השקעות'],
    isFollowed: false,
    influence: 65,
    avatarUrl: 'https://example.com/avatars/daniel.jpg',
    username: 'danielalpha',
    reliability: 80,
    expertise: ['השקעות', 'ניתוח פונדמנטלי'],
    bio: 'כותב ניוזלטר פופולרי',
    profileUrl: 'https://substack.com/danielalpha',
    isVerified: false,
    assetsDiscussed: ['SPY', 'QQQ']
  },
  {
    id: '4',
    name: 'טל כהן',
    platform: 'twitter.com',
    followers: 560000,
    description: 'סוחר מט״ח מקצועי ומנהל קרן גידור בעל ניסיון עשיר',
    topics: ['מט״ח', 'סחר יומי', 'ניהול סיכונים'],
    isFollowed: false,
    influence: 70,
    avatarUrl: 'https://example.com/avatars/tal.jpg',
    username: 'talcohen',
    reliability: 75,
    expertise: ['מט״ח', 'ניהול סיכונים'],
    bio: 'סוחר מט״ח מקצועי',
    profileUrl: 'https://twitter.com/talcohen',
    isVerified: true,
    assetsDiscussed: ['GBPUSD', 'USDCAD']
  },
  {
    id: '5',
    name: 'מאיה סקאל',
    platform: 'instagram.com',
    followers: 970000,
    description: 'יוצרת תוכן פיננסי נגיש ומרצה על חינוך פיננסי וצמיחה אישית',
    topics: ['חינוך פיננסי', 'FIRE', 'השקעות פסיביות'],
    isFollowed: true,
    influence: 80,
    avatarUrl: 'https://example.com/avatars/maya.jpg',
    username: 'mayascale',
    reliability: 88,
    expertise: ['חינוך פיננסי', 'השקעות פסיביות'],
    bio: 'יוצרת תוכן פיננסי',
    profileUrl: 'https://instagram.com/mayascale',
    isVerified: true,
    assetsDiscussed: ['VOO', 'VTI']
  }
];

// קבלת כל המשפיענים
export const getInfluencers = (): MarketInfluencer[] => {
  return [...influencers];
};

// קבלת משפיענים לפי פלטפורמה
export const getInfluencersByPlatform = (platform: string): MarketInfluencer[] => {
  return influencers.filter(influencer => influencer.platform === platform);
};

// שינוי מצב מעקב אחרי משפיען
export const toggleInfluencerFollow = (id: string): boolean => {
  const influencerIndex = influencers.findIndex(influencer => influencer.id === id);
  if (influencerIndex === -1) return false;
  
  influencers[influencerIndex].isFollowed = !influencers[influencerIndex].isFollowed;
  return true;
};
