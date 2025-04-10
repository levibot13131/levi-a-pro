
import { NewsItem, SocialPost } from "@/types/asset";

// נתונים סטטיים לדוגמה עבור חדשות
const MOCK_NEWS: NewsItem[] = [
  {
    id: "news1",
    title: "ביטקוין שובר את רף ה-70,000$ בפעם הראשונה",
    summary: "המטבע הדיגיטלי המוביל בעולם ממשיך במגמת העלייה ההיסטורית שלו.",
    source: "CoinDesk",
    url: "https://www.coindesk.com/bitcoin-breaks-70k",
    publishedAt: "2025-04-08T08:30:00Z",
    sentiment: "positive",
    relatedAssets: ["bitcoin"],
    imageUrl: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    category: "crypto"
  },
  {
    id: "news2",
    title: "אפל מכריזה על תוצאות רבעון מעל לציפיות האנליסטים",
    summary: "ענקית הטכנולוגיה מדווחת על צמיחה של 12% בהכנסות ממכירות האייפון.",
    source: "CNBC",
    url: "https://www.cnbc.com/apple-earnings",
    publishedAt: "2025-04-07T21:15:00Z",
    sentiment: "positive",
    relatedAssets: ["apple"],
    imageUrl: "https://companieslogo.com/img/orig/AAPL-bf1a4314.png",
    category: "stocks"
  },
  {
    id: "news3",
    title: "הפד משאיר את הריבית ללא שינוי, רומז על הפחתה אפשרית ברבעון הבא",
    summary: "הבנק המרכזי של ארה\"ב שומר על מדיניות זהירה למרות סימני התמתנות באינפלציה.",
    source: "Bloomberg",
    url: "https://www.bloomberg.com/fed-rates",
    publishedAt: "2025-04-06T16:45:00Z",
    sentiment: "neutral",
    imageUrl: "https://companieslogo.com/img/orig/BLK-bb9c0c67.png",
    category: "economy"
  },
  {
    id: "news4",
    title: "אתריום מתקרב לעדכון רשת משמעותי, מחיר ה-ETH עולה ב-5%",
    summary: "העדכון החדש צפוי לשפר את קנה המידה של הרשת ולהפחית עמלות גז.",
    source: "Cointelegraph",
    url: "https://www.cointelegraph.com/ethereum-upgrade",
    publishedAt: "2025-04-05T12:20:00Z",
    sentiment: "positive",
    relatedAssets: ["ethereum"],
    imageUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    category: "crypto"
  },
  {
    id: "news5",
    title: "מיקרוסופט משקיעה 5 מיליארד דולר בהרחבת תשתיות הענן באירופה",
    summary: "ההשקעה מסמנת את המחויבות של החברה לצמיחה בשוק האירופי.",
    source: "Reuters",
    url: "https://www.reuters.com/microsoft-cloud-investment",
    publishedAt: "2025-04-04T09:10:00Z",
    sentiment: "positive",
    relatedAssets: ["microsoft"],
    imageUrl: "https://companieslogo.com/img/orig/MSFT-a203b22d.png",
    category: "stocks"
  }
];

// נתונים סטטיים לדוגמה עבור פוסטים מרשתות חברתיות
const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: "post1",
    platform: "twitter",
    author: "אילון מאסק",
    authorUsername: "@elonmusk",
    authorImageUrl: "https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg",
    content: "Dogecoin to the mooooon!! 🚀🌕",
    postUrl: "https://twitter.com/elonmusk/status/12345",
    publishedAt: "2025-04-09T18:45:00Z",
    likes: 152000,
    comments: 24500,
    shares: 36700,
    sentiment: "positive",
    relatedAssets: ["dogecoin"]
  },
  {
    id: "post2",
    platform: "twitter",
    author: "מייקל סיילור",
    authorUsername: "@michael_saylor",
    authorImageUrl: "https://pbs.twimg.com/profile_images/1485632175932383235/8t0DGo6V_400x400.jpg",
    content: "Just bought another 500 Bitcoin. The path forward is clear - institutional adoption continues to accelerate.",
    postUrl: "https://twitter.com/michael_saylor/status/67890",
    publishedAt: "2025-04-08T14:20:00Z",
    likes: 98700,
    comments: 12300,
    shares: 15600,
    sentiment: "positive",
    relatedAssets: ["bitcoin"]
  },
  {
    id: "post3",
    platform: "reddit",
    author: "CryptoAnalyst",
    content: "Here's my technical analysis for Ethereum for the next month. I'm seeing a clear bullish pattern forming with strong support at $3,200.",
    postUrl: "https://reddit.com/r/cryptocurrency/posts/abcdef",
    publishedAt: "2025-04-07T09:15:00Z",
    likes: 1450,
    comments: 342,
    sentiment: "positive",
    relatedAssets: ["ethereum"]
  },
  {
    id: "post4",
    platform: "twitter",
    author: "וורן באפט",
    authorUsername: "@warrenbuffett",
    authorImageUrl: "https://companieslogo.com/img/orig/BRK.A-a28c53e0.png?t=1684126872",
    content: "The stock market is designed to transfer money from the active to the patient.",
    postUrl: "https://twitter.com/warrenbuffett/status/13579",
    publishedAt: "2025-04-06T16:30:00Z",
    likes: 125000,
    comments: 15600,
    shares: 28900,
    sentiment: "neutral"
  },
  {
    id: "post5",
    platform: "telegram",
    author: "CryptoWhale",
    content: "בשבוע האחרון ראינו התבססות מחודשת של ביטקוין מעל רמת ה-$65,000. הנתונים מהבלוקצ'יין מצביעים על אגירה משמעותית מצד ארנקים גדולים.",
    postUrl: "https://t.me/cryptowhale/message123",
    publishedAt: "2025-04-05T11:45:00Z",
    likes: 8700,
    comments: 1230,
    sentiment: "positive",
    relatedAssets: ["bitcoin"]
  }
];

// פונקציות שירות לקבלת נתונים
export const getLatestNews = async (): Promise<NewsItem[]> => {
  // מדמה תקשורת עם שרת
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_NEWS), 600);
  });
};

export const getNewsByAssetId = async (assetId: string): Promise<NewsItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredNews = MOCK_NEWS.filter(news => 
        news.relatedAssets?.includes(assetId)
      );
      resolve(filteredNews);
    }, 400);
  });
};

export const getSocialPosts = async (): Promise<SocialPost[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_SOCIAL_POSTS), 700);
  });
};

export const getSocialPostsByAssetId = async (assetId: string): Promise<SocialPost[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredPosts = MOCK_SOCIAL_POSTS.filter(post => 
        post.relatedAssets?.includes(assetId)
      );
      resolve(filteredPosts);
    }, 500);
  });
};
