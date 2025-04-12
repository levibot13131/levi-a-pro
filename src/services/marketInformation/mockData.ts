import { MarketEvent, MarketInfluencer, FinancialDataSource } from '@/types/asset';

// Market Events
export const MARKET_EVENTS: MarketEvent[] = [
  {
    id: "1",
    title: "כנס בלוקצ'יין הגדול",
    date: "2025-05-15",
    importance: "high",
    category: "כנסים",
    description: "כנס הבלוקצ'יין השנתי הגדול בתל אביב",
    reminder: false,
    relatedAssets: ["bitcoin", "ethereum"],
    expectedImpact: "התעניינות מוגברת בשוק",
    source: "coindesk",
    type: "conference"
  },
  {
    id: "2",
    title: "השקת מטבע דיגיטלי חדש",
    date: "2025-06-01",
    importance: "medium",
    category: "השקות",
    description: "השקת מטבע דיגיטלי חדשני מבית היוצר של חברת סטארטאפ ישראלית",
    reminder: true,
    relatedAssets: ["ethereum", "ripple"],
    expectedImpact: "תנודתיות בשוק",
    source: "themarker",
    type: "launch"
  },
  {
    id: "3",
    title: "עדכון רגולטורי חדש",
    date: "2025-07-20",
    importance: "high",
    category: "רגולציה",
    description: "פרסום טיוטת חוק להסדרת שוק הקריפטו בישראל",
    reminder: false,
    relatedAssets: ["bitcoin", "ethereum", "ripple"],
    expectedImpact: "אי ודאות רגולטורית",
    source: "globes",
    type: "regulation"
  },
  {
    id: "4",
    title: "פריצת דרך טכנולוגית",
    date: "2025-08-10",
    importance: "medium",
    category: "טכנולוגיה",
    description: "פיתוח טכנולוגיה חדשה לשיפור מהירות העסקאות בבלוקצ'יין",
    reminder: true,
    relatedAssets: ["bitcoin", "solana"],
    expectedImpact: "שיפור ביצועים",
    source: "techcrunch",
    type: "technology"
  },
  {
    id: "5",
    title: "שיתוף פעולה בין חברות",
    date: "2025-09-05",
    importance: "low",
    category: "שיתופי פעולה",
    description: "שיתוף פעולה בין חברת קריפטו ישראלית לחברה בינלאומית",
    reminder: false,
    relatedAssets: ["cardano", "polkadot"],
    expectedImpact: "התרחבות שוק",
    source: "calcalist",
    type: "partnership"
  }
];

// Market Influencers
export const MARKET_INFLUENCERS: MarketInfluencer[] = [
  {
    id: "1",
    name: "אלון טסלר",
    username: "@cryptoking",
    platform: "twitter",
    profileUrl: "https://twitter.com/cryptoking",
    avatarUrl: "/assets/influencers/influencer1.jpg",
    followers: 2500000,
    assetsDiscussed: ["bitcoin", "dogecoin"],
    influence: 95,
    verified: true,
    description: "יזם טכנולוגי, משקיע קריפטו",
    bio: "יזם וסדרתי ומנהל קרן השקעות הממוקדת במטבעות דיגיטליים",
    expertise: ["bitcoin", "market trends"]
  },
  {
    id: "2",
    name: "דנה כהן",
    username: "@cryptoqueen",
    platform: "youtube",
    profileUrl: "https://youtube.com/cryptoqueen",
    avatarUrl: "/assets/influencers/influencer2.jpg",
    followers: 1800000,
    assetsDiscussed: ["ethereum", "cardano"],
    influence: 88,
    verified: true,
    description: "יוצרת תוכן, אנליסטית שוק",
    bio: "אנליסטית שוק בעלת ניסיון רב שנים בתחום הקריפטו",
    expertise: ["ethereum", "technical analysis"]
  },
  {
    id: "3",
    name: "אבי לוי",
    username: "@levicrypto",
    platform: "telegram",
    profileUrl: "https://t.me/levicrypto",
    avatarUrl: "/assets/influencers/influencer3.jpg",
    followers: 1200000,
    assetsDiscussed: ["ripple", "polkadot"],
    influence: 75,
    verified: false,
    description: "מנהל קהילה, חובב קריפטו",
    bio: "מנהל קהילת קריפטו פעילה עם אלפי חברים",
    expertise: ["community", "altcoins"]
  },
  {
    id: "4",
    name: "שירן מזרחי",
    username: "@shirancrypto",
    platform: "instagram",
    profileUrl: "https://instagram.com/shirancrypto",
    avatarUrl: "/assets/influencers/influencer4.jpg",
    followers: 900000,
    assetsDiscussed: ["solana", "avalanche"],
    influence: 62,
    verified: false,
    description: "משפיענית רשת, בלוגרית קריפטו",
    bio: "בלוגרית לייף סטייל המתמחה בתחום הקריפטו",
    expertise: ["social media", "lifestyle"]
  },
  {
    id: "5",
    name: "יוסי כהן",
    username: "@yossicrypto",
    platform: "linkedin",
    profileUrl: "https://linkedin.com/yossicrypto",
    avatarUrl: "/assets/influencers/influencer5.jpg",
    followers: 600000,
    assetsDiscussed: ["binancecoin", "chainlink"],
    influence: 50,
    verified: false,
    description: "יועץ פיננסי, מומחה קריפטו",
    bio: "יועץ פיננסי לחברות סטארטאפ בתחום הקריפטו",
    expertise: ["finance", "blockchain"]
  }
];

// Financial Data Sources
export const FINANCIAL_DATA_SOURCES: FinancialDataSource[] = [
  {
    id: "1",
    name: "Crypto Markets Pro",
    type: "data platform",
    url: "https://cryptomarketspro.com",
    description: "פלטפורמת מידע מקיפה על שווקי הקריפטו",
    reliability: 92,
    isPremium: true,
    imageUrl: "/assets/sources/source1.png",
    apiAvailable: true,
    languages: ["en", "he"],
    categories: ["prices", "analysis"],
    category: "שווקים",
    rating: 4.8,
    platform: "web"
  },
  {
    id: "2",
    name: "Blockchain Insights",
    type: "research firm",
    url: "https://blockchaininsights.com",
    description: "חברת מחקר המתמחה בניתוח שוק הבלוקצ'יין",
    reliability: 85,
    isPremium: false,
    imageUrl: "/assets/sources/source2.png",
    apiAvailable: false,
    languages: ["en"],
    categories: ["research", "reports"],
    category: "מחקר",
    rating: 4.5,
    platform: "web"
  },
  {
    id: "3",
    name: "Coin News Daily",
    type: "news outlet",
    url: "https://coinnewsdaily.com",
    description: "אתר חדשות יומי המסקר את שוק הקריפטו",
    reliability: 78,
    isPremium: false,
    imageUrl: "/assets/sources/source3.png",
    apiAvailable: false,
    languages: ["en", "es"],
    categories: ["news", "articles"],
    category: "חדשות",
    rating: 4.2,
    platform: "web"
  },
  {
    id: "4",
    name: "DeFi Analytics",
    type: "analytics tool",
    url: "https://defianalytics.io",
    description: "כלי אנליטיקה למעקב אחר ביצועי שוק ה-DeFi",
    reliability: 90,
    isPremium: true,
    imageUrl: "/assets/sources/source4.png",
    apiAvailable: true,
    languages: ["en"],
    categories: ["defi", "analytics"],
    category: "דיאגרמות",
    rating: 4.7,
    platform: "web"
  },
  {
    id: "5",
    name: "Global Crypto Index",
    type: "index provider",
    url: "https://globalcryptoindex.com",
    description: "ספק מדדים גלובליים לשוק הקריפטו",
    reliability: 82,
    isPremium: false,
    imageUrl: "/assets/sources/source5.png",
    apiAvailable: false,
    languages: ["en", "fr"],
    categories: ["indices", "data"],
    category: "אינדקסים",
    rating: 4.0,
    platform: "web"
  }
];
