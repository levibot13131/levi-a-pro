
import { toast } from 'sonner';

export interface SocialMention {
  source: 'twitter' | 'reddit' | 'telegram' | 'discord' | 'news';
  assetSymbol: string;
  content: string;
  sentimentScore: number; // -100 to 100
  url?: string;
  timestamp: number;
  influential: boolean;
  engagement: number;
}

export interface MarketSentiment {
  overall: number; // -100 to 100
  bitcoin: number;
  ethereum: number;
  altcoins: number;
  defi: number;
  nfts: number;
  lastUpdated: number;
}

// מטמון להתרעות סוציאליות
let cachedSocialMentions: SocialMention[] = [];
let cachedMarketSentiment: MarketSentiment | null = null;
let lastSentimentUpdate = 0;

/**
 * קבלת ניתוח סנטימנט כללי של שוק הקריפטו
 */
export const getMarketSentiment = async (): Promise<MarketSentiment> => {
  try {
    const now = Date.now();
    const isCacheValid = lastSentimentUpdate > 0 && (now - lastSentimentUpdate < 15 * 60 * 1000);
    
    if (isCacheValid && cachedMarketSentiment) {
      return cachedMarketSentiment;
    }
    
    // במימוש אמיתי, היינו מבצעים בקשת API כאן
    // עבור הדמו, ניצור נתונים אקראיים
    
    const randomSentiment = () => Math.floor(Math.random() * 201) - 100; // -100 to 100
    
    const sentiment: MarketSentiment = {
      overall: randomSentiment(),
      bitcoin: randomSentiment(),
      ethereum: randomSentiment(),
      altcoins: randomSentiment(),
      defi: randomSentiment(),
      nfts: randomSentiment(),
      lastUpdated: now
    };
    
    // שמירה במטמון
    cachedMarketSentiment = sentiment;
    lastSentimentUpdate = now;
    
    return sentiment;
  } catch (error) {
    console.error('Error fetching market sentiment:', error);
    toast.error('שגיאה בטעינת נתוני סנטימנט שוק');
    
    // במקרה של שגיאה, נחזיר נתונים ריקים
    return {
      overall: 0,
      bitcoin: 0,
      ethereum: 0,
      altcoins: 0,
      defi: 0,
      nfts: 0,
      lastUpdated: Date.now()
    };
  }
};

/**
 * קבלת אזכורים סוציאליים למטבע ספציפי
 */
export const getSocialMentions = async (assetSymbol?: string, limit: number = 10): Promise<SocialMention[]> => {
  try {
    // במימוש אמיתי, היינו מבצעים בקשת API כאן
    // עבור הדמו, ניצור נתונים אקראיים אם אין מטמון
    
    if (cachedSocialMentions.length === 0) {
      generateMockSocialMentions();
    }
    
    // סינון לפי מטבע אם צוין
    let filteredMentions = cachedSocialMentions;
    if (assetSymbol) {
      filteredMentions = cachedSocialMentions.filter(m => 
        m.assetSymbol.toLowerCase() === assetSymbol.toLowerCase()
      );
    }
    
    // מיון לפי תאריך ולפי השפעה
    filteredMentions.sort((a, b) => {
      if (a.influential && !b.influential) return -1;
      if (!a.influential && b.influential) return 1;
      return b.timestamp - a.timestamp;
    });
    
    return filteredMentions.slice(0, limit);
  } catch (error) {
    console.error('Error fetching social mentions:', error);
    toast.error('שגיאה בטעינת אזכורים מרשתות חברתיות');
    return [];
  }
};

/**
 * קבלת אזכורים משפיעים במיוחד
 */
export const getInfluentialMentions = async (limit: number = 5): Promise<SocialMention[]> => {
  const allMentions = await getSocialMentions(undefined, 100);
  return allMentions
    .filter(mention => mention.influential)
    .slice(0, limit);
};

/**
 * רענון נתוני סנטימנט
 */
export const refreshSentimentData = async (): Promise<void> => {
  lastSentimentUpdate = 0;
  await getMarketSentiment();
  
  // כדי ליצור תחושה טובה של רענון, ניצור גם אזכורים סוציאליים חדשים
  generateMockSocialMentions();
  
  toast.success('נתוני סנטימנט שוק התעדכנו בהצלחה');
};

/**
 * יצירת נתוני אזכורים מדומים
 */
const generateMockSocialMentions = (): void => {
  const cryptoAssets = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'SOL', name: 'Solana' },
    { symbol: 'BNB', name: 'Binance Coin' },
    { symbol: 'XRP', name: 'Ripple' },
    { symbol: 'ADA', name: 'Cardano' },
    { symbol: 'DOGE', name: 'Dogecoin' },
    { symbol: 'DOT', name: 'Polkadot' },
    { symbol: 'AVAX', name: 'Avalanche' }
  ];
  
  const positivePhrases = [
    "עולה ל-%asset% והולך להרוויח המון 🚀",
    "הפוטנציאל של %asset% עצום, מדהים ששום אחד לא רואה את זה 💎",
    "הולך חזק על %asset%, הגרף נראה פשוט מושלם 📈",
    "ההודעה האחרונה מהצוות של %asset% היא בולישית מאוד",
    "שמרתי את %asset% והרווחתי כבר 20% השבוע",
    "%asset% תכפיל את עצמה בקרוב, תראו את הדוחות הפיננסיים 💰",
    "ה-DeFi של %asset% הוא העתיד בתחום, מחזיק ארוך טווח ✅"
  ];
  
  const neutralPhrases = [
    "מה דעתכם על %asset% במחיר הנוכחי?",
    "האם כדאי להחזיק %asset% בתיק?",
    "מישהו יודע מתי %asset% משחררת את העדכון הבא?",
    "מה חדש בפרויקט של %asset%?",
    "אני שוקל השקעה ב-%asset%, יש המלצות?",
    "איך %asset% מתמודדת עם התחרות בתחום?",
    "%asset% נסחרת באזור תמיכה, מעניין לראות איך יתפתח"
  ];
  
  const negativePhrases = [
    "מוכר את כל ה-%asset% שלי, הפרויקט בבעיות 📉",
    "התרחקו מ-%asset%, הרבה דגלים אדומים בדו\"ח האחרון ⚠️",
    "ה-TVL ב-%asset% יורד בצורה מדאיגה, סימן לבעיה",
    "שורט על %asset%, לא אוהב את הכיוון של הצוות 🔻",
    "פאמפ ודאמפ קלאסי של %asset%, היזהרו",
    "האם רק אני חושב ש-%asset% מנופחת מדי? יפיצו בקרוב",
    "%asset% מאבדת נתח שוק לטובת מתחרים, לא נראה טוב 📉"
  ];
  
  const generateSocialMention = (influential: boolean = false): SocialMention => {
    const asset = cryptoAssets[Math.floor(Math.random() * cryptoAssets.length)];
    const sentimentScore = Math.floor(Math.random() * 201) - 100; // -100 to 100
    
    // בחירת תוכן בהתאם לסנטימנט
    let content = "";
    if (sentimentScore > 30) {
      content = positivePhrases[Math.floor(Math.random() * positivePhrases.length)];
    } else if (sentimentScore < -30) {
      content = negativePhrases[Math.floor(Math.random() * negativePhrases.length)];
    } else {
      content = neutralPhrases[Math.floor(Math.random() * neutralPhrases.length)];
    }
    
    // החלפת %asset% בשם המטבע האמיתי
    content = content.replace(/%asset%/g, asset.name);
    
    // חישוב של timestamp אקראי בטווח של 24 שעות אחרונות
    const now = Date.now();
    const timestamp = now - Math.floor(Math.random() * 24 * 60 * 60 * 1000);
    
    // יצירת אובייקט המנטיון
    return {
      source: ['twitter', 'reddit', 'telegram', 'discord', 'news'][Math.floor(Math.random() * 5)] as SocialMention['source'],
      assetSymbol: asset.symbol,
      content,
      sentimentScore,
      url: influential ? 'https://twitter.com/' : undefined,
      timestamp,
      influential,
      engagement: influential ? 100 + Math.floor(Math.random() * 9900) : Math.floor(Math.random() * 100)
    };
  };
  
  // יצירת רשימת מנטיונים מדומה
  cachedSocialMentions = [];
  
  // יצירת 5 מנטיונים משפיעים
  for (let i = 0; i < 5; i++) {
    cachedSocialMentions.push(generateSocialMention(true));
  }
  
  // יצירת 45 מנטיונים רגילים
  for (let i = 0; i < 45; i++) {
    cachedSocialMentions.push(generateSocialMention(false));
  }
  
  // מיון לפי תאריך
  cachedSocialMentions.sort((a, b) => b.timestamp - a.timestamp);
};
