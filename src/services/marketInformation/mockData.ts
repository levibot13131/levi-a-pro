import { MarketInfluencer, FinancialDataSource, MarketEvent } from '@/types/marketInformation';

export const mockInfluencers: MarketInfluencer[] = [
  {
    id: "1",
    name: "משה כהן",
    username: "moshe_crypto",
    platform: "Twitter",
    followers: 125000,
    bio: "אנליסט קריפטו, מייסד CryptoIL, מרצה באוניברסיטת תל אביב",
    profileUrl: "https://twitter.com/moshe_crypto",
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    expertise: ["Bitcoin", "Technical Analysis", "DeFi"],
    assetsDiscussed: ["BTC", "ETH", "SOL"],
    influence: 85,
    verified: true,
    description: "אנליסט מוביל בשוק הקריפטו הישראלי עם רקורד מוכח של תחזיות מדויקות",
    isFollowing: true
  },
  {
    id: "2",
    name: "שירה לוי",
    username: "shira_defi",
    platform: "YouTube",
    followers: 75000,
    bio: "מומחית DeFi, מייסדת קהילת BlockchainIL",
    profileUrl: "https://youtube.com/shiralevi",
    avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    expertise: ["DeFi", "Ethereum", "Yield Farming"],
    assetsDiscussed: ["ETH", "UNI", "AAVE"],
    influence: 75,
    verified: true,
    description: "יוצרת תוכן מוביל בתחום ה-DeFi עם דגש על הסברה והנגשת העולם לקהל הישראלי",
    isFollowing: false
  },
  {
    id: "3",
    name: "דוד ישראלי",
    username: "david_israeli",
    platform: "Telegram",
    followers: 45000,
    bio: "אנליסט מאקרו, יועץ השקעות בשוק הקריפטו",
    profileUrl: "https://t.me/davidisraeli",
    avatarUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    expertise: ["Macro Analysis", "Bitcoin", "Market Cycles"],
    assetsDiscussed: ["BTC", "ETH", "GOLD"],
    influence: 65,
    verified: false,
    description: "מנתח מגמות מאקרו ומשלב ניתוח שוק הקריפטו עם שווקים מסורתיים",
    isFollowing: true
  }
];

export const mockFinancialDataSources: FinancialDataSource[] = [
  {
    id: "1",
    name: "TradingView",
    type: "Charting & Analysis",
    url: "https://www.tradingview.com/",
    description: "פלטפורמת גרפים וניתוח טכני מובילה",
    reliability: 95,
    isPremium: true,
    imageUrl: "https://example.com/tradingview.png",
    apiAvailable: true,
    languages: ["en", "he"],
    categories: ["charts", "analysis"],
    category: "Trading Tools",
    rating: 4.8,
    platform: "Web"
  },
  {
    id: "2",
    name: "CoinMarketCap",
    type: "Data Aggregation",
    url: "https://coinmarketcap.com/",
    description: "מקור מידע מקיף על נתוני שוק הקריפטו",
    reliability: 90,
    isPremium: false,
    imageUrl: "https://example.com/coinmarketcap.png",
    apiAvailable: true,
    languages: ["en", "he"],
    categories: ["data", "market"],
    category: "Market Data",
    rating: 4.5,
    platform: "Web"
  },
  {
    id: "3",
    name: "Glassnode",
    type: "On-Chain Analytics",
    url: "https://glassnode.com/",
    description: "ניתוח נתונים משרשרת הבלוקצ'יין",
    reliability: 85,
    isPremium: true,
    imageUrl: "https://example.com/glassnode.png",
    apiAvailable: true,
    languages: ["en"],
    categories: ["on-chain", "analytics"],
    category: "Analytics",
    rating: 4.2,
    platform: "Web"
  }
];

export const mockMarketEvents: MarketEvent[] = [
  {
    id: "1",
    title: "השקת Ethereum 2.0",
    date: "2023-03-15",
    importance: "high",
    category: "Upgrade",
    description: "שדרוג משמעותי לרשת Ethereum",
    reminder: true,
    relatedAssets: ["ETH"],
    expectedImpact: "positive",
    source: "Ethereum Foundation",
    type: "Blockchain"
  },
  {
    id: "2",
    title: "החלטת ריבית של הפד",
    date: "2023-04-05",
    importance: "medium",
    category: "Economy",
    description: "הודעה על שינוי ריבית על ידי הפדרל ריזרב",
    reminder: false,
    relatedAssets: ["BTC", "ETH"],
    expectedImpact: "variable",
    source: "Federal Reserve",
    type: "Economy"
  },
  {
    id: "3",
    title: "כנס Bitcoin השנתי",
    date: "2023-05-20",
    importance: "low",
    category: "Conference",
    description: "כנס מרכזי בתעשיית הביטקוין",
    reminder: true,
    relatedAssets: ["BTC"],
    expectedImpact: "neutral",
    source: "Bitcoin Magazine",
    type: "Community"
  }
];
