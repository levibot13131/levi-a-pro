
import { toast } from 'sonner';

// קבוע לשמירת מזהה חיבור בלוקל סטורג'
const TV_AUTH_KEY = 'tradingview_auth_credentials';

// פרטי חיבור TradingView
export interface TradingViewCredentials {
  username: string;
  password?: string; // הוספנו סיסמה
  apiKey?: string;  // עשינו אופציונלי
  isConnected: boolean;
  lastConnected?: number;
}

/**
 * שמירת פרטי חיבור TradingView
 */
export const saveTradingViewCredentials = (credentials: Omit<TradingViewCredentials, 'isConnected' | 'lastConnected'>) => {
  const savedCreds: TradingViewCredentials = {
    ...credentials,
    isConnected: true,
    lastConnected: Date.now()
  };
  
  localStorage.setItem(TV_AUTH_KEY, JSON.stringify(savedCreds));
  toast.success('החיבור ל-TradingView בוצע בהצלחה', {
    description: `המשתמש ${credentials.username} חובר בהצלחה`
  });
  
  return savedCreds;
};

/**
 * קבלת פרטי חיבור TradingView מהלוקל סטורג'
 */
export const getTradingViewCredentials = (): TradingViewCredentials | null => {
  const credentials = localStorage.getItem(TV_AUTH_KEY);
  
  if (!credentials) return null;
  
  try {
    return JSON.parse(credentials) as TradingViewCredentials;
  } catch (error) {
    console.error('Error parsing TradingView credentials:', error);
    return null;
  }
};

/**
 * בדיקת תקפות פרטי חיבור TradingView
 */
export const validateTradingViewCredentials = async (
  credentials: Omit<TradingViewCredentials, 'isConnected' | 'lastConnected'>
): Promise<boolean> => {
  try {
    // בסביבת פיתוח - נאפשר התחברות עם שם משתמש וסיסמה או שם משתמש ו-API Key
    
    // סימולציה של בדיקת API
    return new Promise(resolve => {
      setTimeout(() => {
        // בדיקה אם קיימים פרטי חיבור תקינים
        const valid = credentials.username?.trim().length > 3 && 
                     (credentials.password?.trim().length > 3 || 
                      credentials.apiKey?.trim().length > 3);
          
        if (valid) {
          saveTradingViewCredentials(credentials);
        }
        
        resolve(valid);
      }, 1500); // סימולציה של זמן תגובה מהשרת
    });
  } catch (error) {
    console.error('Error validating TradingView credentials:', error);
    return false;
  }
};

/**
 * ניתוק חיבור TradingView
 */
export const disconnectTradingView = () => {
  localStorage.removeItem(TV_AUTH_KEY);
  toast.info('החיבור ל-TradingView נותק');
};

/**
 * בדיקה האם המשתמש מחובר ל-TradingView
 */
export const isTradingViewConnected = (): boolean => {
  const credentials = getTradingViewCredentials();
  return credentials?.isConnected === true;
};
