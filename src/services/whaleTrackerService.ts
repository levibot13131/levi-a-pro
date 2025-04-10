
import { toast } from "sonner";

export interface WhaleMovement {
  id: string;
  timestamp: number;
  walletAddress: string;
  walletLabel?: string; // כינוי לארנק (למשל "ארנק בינאנס קולד" או "קרן השקעות X")
  assetId: string;
  amount: number;
  transactionType: 'buy' | 'sell' | 'transfer';
  source?: string;
  destination?: string;
  impact: {
    priceImpact: number; // ההשפעה המשוערת על המחיר באחוזים
    marketCapPercentage: number; // אחוז מסך שווי השוק
    significance: 'low' | 'medium' | 'high' | 'very-high'; // חשיבות התנועה
  };
  relatedTransactions?: string[]; // עסקאות קשורות
}

export interface WhaleWallet {
  address: string;
  label?: string;
  category: 'exchange' | 'institution' | 'whale' | 'smart-money' | 'unknown';
  holdingValue: number; // הערך המוחזק בדולרים
  watchlist: boolean; // האם לעקוב אחרי ארנק זה
  tags?: string[];
  lastActivity?: number; // unix timestamp
}

// מקבל מזהה של נכס ומחזיר תנועות ארנקים גדולים
export const getWhaleMovements = async (assetId: string, days = 7): Promise<WhaleMovement[]> => {
  // בפועל, כאן יהיה חיבור ל-API מתאים כמו Whale Alert, Nansen, או שירות דומה
  // לצורך הדוגמה, נחזיר נתונים מדומים
  await new Promise(resolve => setTimeout(resolve, 1000)); // דימוי זמן טעינה
  
  // יצירת נתונים מדומים
  const mockMovements: WhaleMovement[] = [];
  const now = Date.now();
  const dayInMs = 86400000;
  
  // מספר התנועות שייווצרו
  const numberOfMovements = 10 + Math.floor(Math.random() * 15);
  
  for (let i = 0; i < numberOfMovements; i++) {
    const isRecent = Math.random() > 0.7;
    const timestamp = isRecent 
      ? now - Math.floor(Math.random() * dayInMs) // ב-24 שעות האחרונות
      : now - Math.floor(Math.random() * (days * dayInMs)); // בטווח הימים שנבחר
    
    // סוג התנועה
    const transactionType = Math.random() > 0.6 
      ? 'buy' 
      : Math.random() > 0.5 
        ? 'sell' 
        : 'transfer';
    
    // גודל התנועה
    const amount = Math.random() * 1000000 + 100000; // בין 100K ל-1.1M
    
    // חשיבות התנועה
    let significance: 'low' | 'medium' | 'high' | 'very-high';
    if (amount > 1000000) {
      significance = 'very-high';
    } else if (amount > 500000) {
      significance = 'high';
    } else if (amount > 250000) {
      significance = 'medium';
    } else {
      significance = 'low';
    }
    
    // מקור/יעד לפי סוג העסקה
    let source, destination;
    if (transactionType === 'buy') {
      source = 'Exchange';
      destination = `Wallet-${Math.floor(Math.random() * 1000)}`;
    } else if (transactionType === 'sell') {
      source = `Wallet-${Math.floor(Math.random() * 1000)}`;
      destination = 'Exchange';
    } else {
      source = `Wallet-${Math.floor(Math.random() * 1000)}`;
      destination = `Wallet-${Math.floor(Math.random() * 1000)}`;
    }
    
    mockMovements.push({
      id: `mov-${i}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp,
      walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      walletLabel: Math.random() > 0.3 
        ? ['Binance Cold Wallet', 'Grayscale Fund', 'Alameda Research', 'Jump Trading', 'Three Arrows Capital'][
            Math.floor(Math.random() * 5)
          ] 
        : undefined,
      assetId,
      amount,
      transactionType,
      source,
      destination,
      impact: {
        priceImpact: Math.random() * 5,
        marketCapPercentage: (amount / 1000000000) * 100, // מניח שווי שוק של 1B$
        significance
      }
    });
  }
  
  // מיון לפי זמן (מהחדש לישן)
  return mockMovements.sort((a, b) => b.timestamp - a.timestamp);
};

// טווחי זמן אפשריים לחיפוש תנועות
export const timeRangeOptions = [
  { value: '1', label: 'יום אחרון' },
  { value: '7', label: 'שבוע אחרון' },
  { value: '30', label: 'חודש אחרון' },
  { value: '90', label: 'שלושה חודשים' },
];

// הגדרת מעקב אחרי ארנק
export const addWalletToWatchlist = async (address: string, label?: string): Promise<void> => {
  // בפועל, כאן תהיה שמירה במסד נתונים
  await new Promise(resolve => setTimeout(resolve, 500));
  toast.success(`הארנק ${address.substring(0, 8)}... נוסף למעקב`);
};

// יצירת התראה על תנועת ארנק
export const createWhaleAlert = async (
  assetId: string, 
  minAmount: number, 
  alertType: 'buy' | 'sell' | 'any' = 'any'
): Promise<void> => {
  // בפועל, כאן תהיה שמירה במסד נתונים
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const assetName = {
    'bitcoin': 'ביטקוין',
    'ethereum': 'אתריום',
    'solana': 'סולנה'
  }[assetId] || assetId;
  
  const alertTypeText = {
    'buy': 'קניות',
    'sell': 'מכירות',
    'any': 'כל התנועות'
  }[alertType];
  
  toast.success(`התראה חדשה נוצרה בהצלחה`, {
    description: `תקבל התראות על ${alertTypeText} של לפחות $${minAmount.toLocaleString()} ב${assetName}`
  });
};

// חיפוש דפוסי התנהגות קודמים
export const getWhaleBehaviorPatterns = async (assetId: string): Promise<{
  pattern: string;
  description: string;
  confidence: number;
  lastOccurrence: number;
  priceImpact: string;
  recommendation: string;
}[]> => {
  // בפועל, ניתוח דפוסי התנהגות של ארנקים גדולים מבוסס על נתונים היסטוריים
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // דוגמאות לדפוסי התנהגות
  return [
    {
      pattern: "צבירה לפני עלייה",
      description: "ארנקים גדולים צוברים כמויות משמעותיות טרם תנועת מחיר חיובית",
      confidence: 78,
      lastOccurrence: Date.now() - 45 * 86400000, // לפני 45 ימים
      priceImpact: "+15-25%",
      recommendation: "שקול פוזיציית קנייה עם סטופ מוגדר היטב"
    },
    {
      pattern: "חלוקה מתואמת",
      description: "מספר ארנקים גדולים מוכרים בו-זמנית, סימן אפשרי להפצה מתואמת",
      confidence: 65,
      lastOccurrence: Date.now() - 120 * 86400000, // לפני 120 ימים
      priceImpact: "-10-20%",
      recommendation: "שקול הקטנת פוזיציות או יציאה זמנית מהשוק"
    },
    {
      pattern: "העברות בין ארנקים",
      description: "תנועות רבות בין ארנקים ללא הגעה לבורסות, סימן להערכות אפשרית",
      confidence: 55,
      lastOccurrence: Date.now() - 12 * 86400000, // לפני 12 ימים
      priceImpact: "אינדיקציה לא ברורה",
      recommendation: "המשך מעקב והמתנה לסימנים נוספים"
    }
  ];
};
