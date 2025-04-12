import { TradingBot, TradeSignal, MarketAnalysis, TradeJournalEntry } from "@/types/asset";

// נתונים סטטיים לדוגמה עבור בוטים מסחר
const MOCK_TRADING_BOTS: TradingBot[] = [
  {
    id: "bot1",
    name: "הלוויתן החכם",
    description: "בוט המתמחה בזיהוי תנועות ארביטראז' מהירות בשוק הקריפטו",
    strategy: "ארביטראז' בין בורסות + מומנטום",
    performance: {
      totalReturn: 87.5,
      winRate: 72.3,
      averageProfit: 2.8,
      averageLoss: -1.2,
      sharpeRatio: 2.4,
      maxDrawdown: -18.5,
      totalTrades: 450,
      profitLoss: 8750
    },
    supportedAssets: ["crypto"],
    monthlyReturns: [
      { month: "ינואר 2025", return: 7.2 },
      { month: "פברואר 2025", return: 9.1 },
      { month: "מרץ 2025", return: 5.6 },
      { month: "אפריל 2025", return: 8.3 }
    ],
    riskLevel: "medium",
    creatorInfo: "נוצר ע\"י AlphaTeam, פעיל משנת 2023",
    imageUrl: "https://cryptologos.cc/logos/bitcoin-btc-logo.png"
  },
  {
    id: "bot2",
    name: "טרנד פולואר פרו",
    description: "בוט הנצמד למגמות ארוכות טווח בשוק המניות",
    strategy: "מעקב מגמות + אינדיקטורים טכניים",
    performance: {
      totalReturn: 65.2,
      winRate: 58.7,
      averageProfit: 5.2,
      averageLoss: -2.3,
      sharpeRatio: 1.8,
      maxDrawdown: -22.1,
      totalTrades: 320,
      profitLoss: 6520
    },
    supportedAssets: ["stock"],
    monthlyReturns: [
      { month: "ינואר 2025", return: 3.8 },
      { month: "פברואר 2025", return: 5.2 },
      { month: "מרץ 2025", return: 4.5 },
      { month: "אפריל 2025", return: 4.1 }
    ],
    riskLevel: "medium",
    creatorInfo: "נוצר ע\"י TradeMaster, פעיל משנת 2022",
    imageUrl: "https://companieslogo.com/img/orig/AAPL-bf1a4314.png"
  },
  {
    id: "bot3",
    name: "ברייקאאוט האנטר",
    description: "בוט המזהה פריצות משמעותיות של מחירים בשוק הפורקס",
    strategy: "זיהוי פריצות + היפוכי מגמה",
    performance: {
      totalReturn: 42.3,
      winRate: 61.5,
      averageProfit: 3.6,
      averageLoss: -1.8,
      sharpeRatio: 1.6,
      maxDrawdown: -15.8,
      totalTrades: 280,
      profitLoss: 4230
    },
    supportedAssets: ["forex"],
    monthlyReturns: [
      { month: "ינואר 2025", return: 2.5 },
      { month: "פברואר 2025", return: 3.8 },
      { month: "מרץ 2025", return: 2.9 },
      { month: "אפריל 2025", return: 3.2 }
    ],
    riskLevel: "low",
    creatorInfo: "נוצר ע\"י ForexPro, פעיל משנת 2024",
    imageUrl: "https://www.investopedia.com/thmb/cILSK5rWO3iqQbdNiMxKJOe7Zf4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/EUR-USD_2019-69b39ed9619646d5b08fd7a2ee1a1c91.jpg"
  },
  {
    id: "bot4",
    name: "וויקוף מאסטר",
    description: "בוט המתמחה בזיהוי תבניות וויקוף בשווקי קריפטו ומניות",
    strategy: "מתודולוגיית וויקוף + ניתוח נפחים",
    performance: {
      totalReturn: 112.6,
      winRate: 68.2,
      averageProfit: 4.8,
      averageLoss: -1.9,
      sharpeRatio: 2.6,
      maxDrawdown: -24.3,
      totalTrades: 520,
      profitLoss: 11260
    },
    supportedAssets: ["crypto", "stock"],
    monthlyReturns: [
      { month: "ינואר 2025", return: 9.5 },
      { month: "פברואר 2025", return: 12.2 },
      { month: "מרץ 2025", return: 8.7 },
      { month: "אפריל 2025", return: 10.1 }
    ],
    riskLevel: "high",
    creatorInfo: "נוצר ע\"י WyckoffAI, פעיל משנת 2023",
    imageUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png"
  },
  {
    id: "bot5",
    name: "SMC סטרטגיסט",
    description: "בוט המתמחה באסטרטגיית Smart Money Concept",
    strategy: "SMC + ניתוח התנגדויות ותמיכות",
    performance: {
      totalReturn: 95.7,
      winRate: 64.9,
      averageProfit: 4.2,
      averageLoss: -1.7,
      sharpeRatio: 2.2,
      maxDrawdown: -21.8,
      totalTrades: 480,
      profitLoss: 9570
    },
    supportedAssets: ["forex", "crypto"],
    monthlyReturns: [
      { month: "ינואר 2025", return: 6.8 },
      { month: "פברואר 2025", return: 8.3 },
      { month: "מרץ 2025", return: 7.5 },
      { month: "אפריל 2025", return: 7.9 }
    ],
    riskLevel: "medium",
    creatorInfo: "נוצר ע\"י ProTraders, פעיל משנת 2024",
    imageUrl: "https://companieslogo.com/img/orig/MSFT-a203b22d.png"
  }
];

// נתונים סטטיים לדוגמה עבור סיגנלים
const MOCK_TRADE_SIGNALS: TradeSignal[] = [
  {
    id: "signal1",
    assetId: "bitcoin",
    type: "buy",
    price: 67250.42,
    timestamp: Date.now() - 3600000, // לפני שעה
    strength: "strong",
    strategy: "וויקוף אקומולציה",
    timeframe: "4h",
    targetPrice: 71500.00,
    stopLoss: 65200.00,
    riskRewardRatio: 2.5,
    notes: "נצפית תבנית אקומולציה וויקוף ברורה עם הצטברות נפח משמעותית באזור התמיכה.",
    createdAt: Date.now() - 3600000 // חובה להוסיף
  },
  {
    id: "signal2",
    assetId: "ethereum",
    type: "buy",
    price: 3325.18,
    timestamp: Date.now() - 7200000, // לפני שעתיים
    strength: "medium",
    strategy: "פריצת התנגדות",
    timeframe: "1d",
    targetPrice: 3600.00,
    stopLoss: 3200.00,
    riskRewardRatio: 1.8,
    notes: "פריצה של רמת התנגדות מרכזית עם עלייה בנפח המסחר.",
    createdAt: Date.now() - 7200000 // חובה להוסיף
  },
  {
    id: "signal3",
    assetId: "apple",
    type: "sell",
    price: 175.52,
    timestamp: Date.now() - 10800000, // לפני 3 שעות
    strength: "weak",
    strategy: "דחייה מהתנגדות",
    timeframe: "1d",
    targetPrice: 168.00,
    stopLoss: 178.50,
    riskRewardRatio: 2.1,
    notes: "דחייה חזקה מרמת התנגדות היסטורית, בשילוב דיברגנס שלילי ב-RSI.",
    createdAt: Date.now() - 10800000 // חובה להוסיף
  },
  {
    id: "signal4",
    assetId: "eurusd",
    type: "buy",
    price: 1.0762,
    timestamp: Date.now() - 14400000, // לפני 4 שעות
    strength: "strong",
    strategy: "SMC מהלך חוזר",
    timeframe: "4h",
    targetPrice: 1.0820,
    stopLoss: 1.0730,
    riskRewardRatio: 1.9,
    notes: "מחיר חוזר לאזור הנזילות (liquidity) לאחר הפעלת אסטרטגיית SMC.",
    createdAt: Date.now() - 14400000 // חובה להוסיף
  }
];

// נתונים סטטיים לדוגמה עבור ניתוחי שוק
const MOCK_MARKET_ANALYSES: MarketAnalysis[] = [
  {
    id: "analysis1",
    title: "ביטקוין - הערכה טכנית לטווח הבינוני",
    summary: "ניתוח טכני מקיף של ביטקוין לטווח של 3-6 חודשים הקרובים",
    type: "technical",
    assetId: "bitcoin",
    publishedAt: "2025-04-09T12:00:00Z",
    author: "ד\"ר סטיבן כהן, אנליסט קריפטו בכיר",
    content: "הניתוח הטכני מראה תבנית המשכית חיובית עם פוטנציאל לעלייה נוספת...",
    keyPoints: [
      "תמיכה חזקה באזור $63,000-$65,000",
      "התנגדות משמעותית ב-$72,000",
      "מתאם EMA200 עדיין תומך במגמה חיובית",
      "נפח מסחר הולך וגובר מצביע על המשך מומנטום חיובי"
    ],
    conclusion: "התחזית היא להמשך מגמה חיובית עם יעד מחיר של $80,000 עד סוף הרבעון",
    sentiment: "bullish",
    // הוספת שדות חסרים שנדרשים לפי הממשק
    timeframe: "1d",
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    source: "TradingView",
    confidence: 0.8
  },
  {
    id: "analysis2",
    title: "ניתוח פונדמנטלי של סקטור הטכנולוגיה",
    summary: "סקירה מקיפה של מצב חברות הטכנולוגיה המובילות ברבעון האחרון",
    type: "fundamental",
    marketSector: "technology stocks",
    publishedAt: "2025-04-08T14:30:00Z",
    author: "רונית לוי, אנליסטית שוק ההון",
    content: "הרבעון האחרון הראה צמיחה מרשימה בהכנסות חברות הטכנולוגיה הגדולות...",
    keyPoints: [
      "צמיחה ממוצעת של 18% בהכנסות חברות ה-FAANG",
      "השקעות מואצות בתחום ה-AI",
      "לחצי רגולציה גוברים עלולים להוות סיכון",
      "מכפילי רווח גבוהים מהממוצע ההיסטורי"
    ],
    conclusion: "למרות הערכה הגבוהה, סקטור הטכנולוגיה צפוי להמשיך לצמוח בקצב מהיר מהשוק הכללי",
    sentiment: "bullish",
    // הוספת שדות חסרים שנדרשים לפי הממשק
    timeframe: "1w",
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    source: "Bloomberg",
    confidence: 0.9
  },
  {
    id: "analysis3",
    title: "אתריום - השלכות העדכון הקרוב על מחיר הנכס",
    summary: "ניתוח ההשפעה הצפויה של עדכון הרשת על מחיר האתריום",
    type: "fundamental",
    assetId: "ethereum",
    publishedAt: "2025-04-07T16:45:00Z",
    author: "אלכס גרין, יועץ בלוקצ'יין",
    content: "העדכון הקרוב של רשת האתריום צפוי להביא לשיפור משמעותי בקנה המידה...",
    keyPoints: [
      "הגדלת קיבולת העסקאות פי 10",
      "הפחתה צפויה של עד 80% בעמלות הגז",
      "שיפור במנגנון ה-staking",
      "אימוץ צפוי ע\"י יותר פרויקטים בזכות העלויות הנמוכות"
    ],
    conclusion: "העדכון הקרוב צפוי לתמוך בעליית מחיר האתריום בטווח הבינוני-ארוך",
    sentiment: "bullish",
    // הוספת שדות חסרים שנדרשים לפי הממשק
    timeframe: "1M",
    timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
    source: "CoinDesk",
    confidence: 0.7
  }
];

// פונקציות שירות לקבלת נתונים
export const getTradingBots = async (): Promise<TradingBot[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_TRADING_BOTS), 800);
  });
};

export const getTradeSignals = async (assetId?: string): Promise<TradeSignal[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (assetId) {
        const filteredSignals = MOCK_TRADE_SIGNALS.filter(signal => 
          signal.assetId === assetId
        );
        resolve(filteredSignals);
      } else {
        resolve(MOCK_TRADE_SIGNALS);
      }
    }, 600);
  });
};

export const getMarketAnalyses = async (assetId?: string, type?: MarketAnalysis['type']): Promise<MarketAnalysis[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredAnalyses = [...MOCK_MARKET_ANALYSES];
      
      if (assetId) {
        filteredAnalyses = filteredAnalyses.filter(analysis => 
          analysis.assetId === assetId
        );
      }
      
      if (type) {
        filteredAnalyses = filteredAnalyses.filter(analysis => 
          analysis.type === type
        );
      }
      
      resolve(filteredAnalyses);
    }, 700);
  });
};

// פונקציה מדומה לקבלת יומן מסחר (ריק בשלב זה, נועד להרחבה בהמשך)
export const getTradeJournal = async (): Promise<TradeJournalEntry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([]), 500);
  });
};
