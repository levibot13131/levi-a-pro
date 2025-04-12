
import { NewsItem } from '@/hooks/use-market-news';

// Mock news data with asset relations
const mockNewsItems: NewsItem[] = [
  {
    id: '1',
    title: 'ביטקוין חצה את רף ה-$50,000',
    summary: 'לאחר עליות משמעותיות, ביטקוין חצה את רף ה-$50,000 לראשונה מאז ינואר.',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    source: 'Crypto News',
    url: '#',
    imageUrl: 'https://picsum.photos/seed/crypto1/800/600',
    sentiment: 'positive',
    relatedAssets: ['bitcoin']
  },
  {
    id: '2',
    title: 'אתריום מתקרב לשיא חדש',
    summary: 'אתריום ממשיך במגמה חיובית ומתקרב לשיא היסטורי חדש, בעקבות התקדמות בעדכון הרשת.',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    source: 'DeFi Times',
    url: '#',
    imageUrl: 'https://picsum.photos/seed/crypto2/800/600',
    sentiment: 'positive',
    relatedAssets: ['ethereum']
  },
  {
    id: '3',
    title: 'רגולטורים מחמירים את הפיקוח על בורסות קריפטו',
    summary: 'רשויות רגולטוריות בארה"ב ובאירופה מודיעות על הידוק הפיקוח על בורסות קריפטו.',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    source: 'Regulation Today',
    url: '#',
    sentiment: 'negative',
    relatedAssets: ['bitcoin', 'ethereum', 'solana']
  },
  {
    id: '4',
    title: 'CBDC של ישראל: בנק ישראל בוחן אפשרות להנפיק שקל דיגיטלי',
    summary: 'בנק ישראל פרסם נייר עמדה על האפשרות להנפיק מטבע דיגיטלי של הבנק המרכזי (CBDC).',
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    source: 'Banking News IL',
    url: '#',
    imageUrl: 'https://picsum.photos/seed/crypto4/800/600',
    sentiment: 'neutral',
    relatedAssets: []
  },
  {
    id: '5',
    title: 'חברת סולנה משיקה קרן לפיתוח אפליקציות DeFi',
    summary: 'חברת סולנה הכריזה על הקמת קרן של 100 מיליון דולר לתמיכה בפיתוח אפליקציות DeFi על הפלטפורמה.',
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    source: 'DeFi Daily',
    url: '#',
    imageUrl: 'https://picsum.photos/seed/crypto5/800/600',
    sentiment: 'positive',
    relatedAssets: ['solana']
  },
  {
    id: '6',
    title: 'קרדנו משחררת עדכון משמעותי לרשת',
    summary: 'קרדנו השיקה עדכון חדש לרשת שלה, שמטרתו לשפר את הביצועים והתמיכה בחוזים חכמים.',
    publishedAt: new Date(Date.now() - 21600000).toISOString(),
    source: 'ADA News',
    url: '#',
    sentiment: 'positive',
    relatedAssets: ['cardano']
  },
];

/**
 * Get news related to a specific asset
 * @param assetId - The asset ID to get news for
 * @returns An array of news items
 */
export const getNewsByAssetId = async (assetId: string): Promise<NewsItem[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  if (!assetId) {
    return mockNewsItems;
  }
  
  // Filter news by asset ID
  const filteredNews = mockNewsItems.filter(
    item => !item.relatedAssets || item.relatedAssets.includes(assetId)
  );
  
  // Add some asset-specific news
  let assetNews: NewsItem[] = [];
  
  if (assetId === 'bitcoin') {
    assetNews = [
      {
        id: `btc-news-${Date.now()}`,
        title: 'מיינרים של ביטקוין מגדילים אחזקות',
        summary: 'נתונים חדשים מראים כי מיינרים של ביטקוין מגדילים את אחזקות הביטקוין שלהם במקום למכור אותן מיד.',
        publishedAt: new Date(Date.now() - 5400000).toISOString(),
        source: 'Mining Insights',
        url: '#',
        sentiment: 'positive',
        relatedAssets: ['bitcoin']
      }
    ];
  } else if (assetId === 'ethereum') {
    assetNews = [
      {
        id: `eth-news-${Date.now()}`,
        title: 'שדרוג חדש לאתריום צפוי החודש',
        summary: 'הקהילה מתכוננת לשדרוג משמעותי ברשת האתריום שצפוי לשפר את הביצועים והפחתת עמלות.',
        publishedAt: new Date(Date.now() - 8600000).toISOString(),
        source: 'ETH Updates',
        url: '#',
        sentiment: 'positive',
        relatedAssets: ['ethereum']
      }
    ];
  } else if (assetId === 'solana') {
    assetNews = [
      {
        id: `sol-news-${Date.now()}`,
        title: 'סולנה מדווחת על שיא חדש בעסקאות',
        summary: 'רשת סולנה עברה את רף ה-100 מיליון עסקאות יומיות לראשונה, מה שמדגיש את הביקוש הגובר לפלטפורמה.',
        publishedAt: new Date(Date.now() - 12400000).toISOString(),
        source: 'SOL Network News',
        url: '#',
        sentiment: 'positive',
        relatedAssets: ['solana']
      }
    ];
  }
  
  return [...filteredNews, ...assetNews];
};
