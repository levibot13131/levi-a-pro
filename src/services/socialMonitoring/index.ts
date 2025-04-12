
import { toast } from 'sonner';

// Social platforms to monitor
export type SocialPlatform = 'twitter' | 'reddit' | 'telegram' | 'discord';

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  name: string;
  handle: string;
  isActive: boolean;
}

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  accountId: string;
  content: string;
  timestamp: number;
  likes: number;
  shares: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  relevance: number; // 0-100
  keywords: string[];
}

// Storage keys
const SOCIAL_ACCOUNTS_KEY = 'monitored_social_accounts';
const SOCIAL_MONITORING_ACTIVE_KEY = 'social_monitoring_active';

// Global monitoring state
let isMonitoringActive = false;
let monitoringInterval: number | null = null;
let socialListeners: Array<() => void> = [];

/**
 * Get stored social accounts
 */
export const getSocialAccounts = (): SocialAccount[] => {
  try {
    const stored = localStorage.getItem(SOCIAL_ACCOUNTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting social accounts:', error);
    return [];
  }
};

/**
 * Save social accounts
 */
export const saveSocialAccounts = (accounts: SocialAccount[]): void => {
  localStorage.setItem(SOCIAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  notifySocialListeners();
};

/**
 * Add a social account to monitor
 */
export const addSocialAccount = (account: Omit<SocialAccount, 'id'>): SocialAccount => {
  const accounts = getSocialAccounts();
  const newAccount: SocialAccount = {
    ...account,
    id: `${account.platform}-${Date.now()}`
  };
  
  saveSocialAccounts([...accounts, newAccount]);
  toast.success('חשבון נוסף למעקב', {
    description: `${newAccount.name} (${newAccount.platform}) התווסף לרשימת המעקב`
  });
  
  return newAccount;
};

/**
 * Remove a social account from monitoring
 */
export const removeSocialAccount = (accountId: string): void => {
  const accounts = getSocialAccounts();
  const updatedAccounts = accounts.filter(account => account.id !== accountId);
  
  saveSocialAccounts(updatedAccounts);
  toast.info('חשבון הוסר מהמעקב');
};

/**
 * Toggle account active state
 */
export const toggleSocialAccountActive = (accountId: string): void => {
  const accounts = getSocialAccounts();
  const updatedAccounts = accounts.map(account => 
    account.id === accountId 
      ? { ...account, isActive: !account.isActive } 
      : account
  );
  
  saveSocialAccounts(updatedAccounts);
};

/**
 * Start social monitoring
 */
export const startSocialMonitoring = (): void => {
  if (isMonitoringActive) return;
  
  isMonitoringActive = true;
  localStorage.setItem(SOCIAL_MONITORING_ACTIVE_KEY, 'true');
  
  // Start interval for monitoring
  monitoringInterval = window.setInterval(() => {
    const activeAccounts = getSocialAccounts().filter(account => account.isActive);
    
    if (activeAccounts.length === 0) {
      console.log('No active social accounts to monitor');
      return;
    }
    
    console.log(`Monitoring ${activeAccounts.length} social accounts...`);
    // In a real application, this would make API calls to fetch updates
    
    // Mock generating a new post occasionally
    if (Math.random() > 0.7) {
      generateMockSocialPost(activeAccounts);
    }
  }, 30000); // Check every 30 seconds
  
  toast.success('ניטור רשתות חברתיות הופעל', {
    description: 'המערכת תנטר ותעדכן בזמן אמת'
  });
  
  notifySocialListeners();
};

/**
 * Stop social monitoring
 */
export const stopSocialMonitoring = (): void => {
  if (!isMonitoringActive) return;
  
  isMonitoringActive = false;
  localStorage.setItem(SOCIAL_MONITORING_ACTIVE_KEY, 'false');
  
  if (monitoringInterval !== null) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
  }
  
  toast.info('ניטור רשתות חברתיות הופסק');
  notifySocialListeners();
};

/**
 * Check if social monitoring is active
 */
export const isSocialMonitoringActive = (): boolean => {
  if (isMonitoringActive) return true;
  
  try {
    const stored = localStorage.getItem(SOCIAL_MONITORING_ACTIVE_KEY);
    isMonitoringActive = stored === 'true';
    return isMonitoringActive;
  } catch (error) {
    console.error('Error checking monitoring status:', error);
    return false;
  }
};

/**
 * Initialize social monitoring
 */
export const initializeSocialMonitoring = (): void => {
  const isActive = isSocialMonitoringActive();
  
  if (isActive && !isMonitoringActive) {
    startSocialMonitoring();
  }
};

/**
 * Subscribe to social monitoring updates
 */
export const subscribeSocialMonitoring = (callback: () => void): () => void => {
  socialListeners.push(callback);
  return () => {
    socialListeners = socialListeners.filter(listener => listener !== callback);
  };
};

/**
 * Notify listeners of updates
 */
const notifySocialListeners = (): void => {
  socialListeners.forEach(callback => callback());
};

/**
 * Mock: Generate a random social post
 */
const generateMockSocialPost = (accounts: SocialAccount[]): void => {
  if (accounts.length === 0) return;
  
  const randomIndex = Math.floor(Math.random() * accounts.length);
  const account = accounts[randomIndex];
  
  const sentiments = ['positive', 'neutral', 'negative'];
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)] as 'positive' | 'neutral' | 'negative';
  
  const cryptoKeywords = ['Bitcoin', 'ETH', 'crypto', 'blockchain', 'DeFi', 'NFT', 'altcoin', 'trading'];
  const selectedKeywords = [];
  const keywordCount = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < keywordCount; i++) {
    const randomKeywordIndex = Math.floor(Math.random() * cryptoKeywords.length);
    selectedKeywords.push(cryptoKeywords[randomKeywordIndex]);
  }
  
  const post: SocialPost = {
    id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
    platform: account.platform,
    accountId: account.id,
    content: generateMockContent(account.platform, sentiment, selectedKeywords),
    timestamp: Date.now(),
    likes: Math.floor(Math.random() * 1000),
    shares: Math.floor(Math.random() * 300),
    sentiment,
    relevance: Math.floor(Math.random() * 60) + 40, // 40-100
    keywords: selectedKeywords
  };
  
  // Store the post and notify about new post
  storeSocialPost(post);
  
  // Only show toast for highly relevant posts
  if (post.relevance > 70) {
    toast.info(`פוסט חדש מ-${account.name}`, {
      description: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '')
    });
  }
};

/**
 * Store social post
 */
const storeSocialPost = (post: SocialPost): void => {
  try {
    // Get existing posts
    const storedPosts = localStorage.getItem('social_posts');
    const posts: SocialPost[] = storedPosts ? JSON.parse(storedPosts) : [];
    
    // Add new post at the beginning and limit to 100 posts
    const updatedPosts = [post, ...posts].slice(0, 100);
    
    // Save updated posts
    localStorage.setItem('social_posts', JSON.stringify(updatedPosts));
    
    notifySocialListeners();
  } catch (error) {
    console.error('Error storing social post:', error);
  }
};

/**
 * Get stored social posts
 */
export const getSocialPosts = (): SocialPost[] => {
  try {
    const stored = localStorage.getItem('social_posts');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting social posts:', error);
    return [];
  }
};

/**
 * Generate mock content based on platform and sentiment
 */
const generateMockContent = (platform: SocialPlatform, sentiment: string, keywords: string[]): string => {
  const positiveTemplates = [
    `חדשות מעולות ל-{keyword}! מחיר נמצא בעליה משמעותית. המומנטום חיובי מאוד.`,
    `{keyword} שובר שיאים חדשים! הטרנד ממשיך להיות חיובי. יש הרבה ביקוש בשוק.`,
    `התחזית ל-{keyword} מבטיחה. הניתוח הטכני מראה סימנים חיוביים לטווח הארוך.`,
    `אני מאוד אופטימי לגבי {keyword} בתקופה הקרובה. יש סימנים חיוביים בשוק.`
  ];
  
  const neutralTemplates = [
    `{keyword} נסחר ברמות יציבות היום. יש לעקוב אחר התמיכות וההתנגדויות.`,
    `עדכון שוק: {keyword} ללא שינוי משמעותי. ממתינים לאותות נוספים מהשוק.`,
    `ניתוח {keyword} מראה מגמה לא ברורה בטווח הקצר. יש לנקוט במשנה זהירות.`,
    `סקירת {keyword}: תנועות מחיר מעורבות. עדיין מוקדם לקבוע לאיזה כיוון השוק ינוע.`
  ];
  
  const negativeTemplates = [
    `זהירות עם {keyword} ברמות הנוכחיות. ישנם סימנים טכניים שליליים בגרף.`,
    `{keyword} מראה חולשה משמעותית. התיקון עלול להימשך בטווח הקרוב.`,
    `הירידה ב-{keyword} מדאיגה. נראה שיש מימושים משמעותיים בשוק.`,
    `אזהרת מסחר: {keyword} שבר תמיכות חשובות. המומנטום שלילי מאוד כרגע.`
  ];
  
  let templates;
  switch (sentiment) {
    case 'positive':
      templates = positiveTemplates;
      break;
    case 'negative':
      templates = negativeTemplates;
      break;
    default:
      templates = neutralTemplates;
  }
  
  const randomIndex = Math.floor(Math.random() * templates.length);
  let content = templates[randomIndex];
  
  // Insert random keyword
  if (keywords.length > 0) {
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    content = content.replace('{keyword}', keyword);
  } else {
    content = content.replace('{keyword}', 'הנכס');
  }
  
  // Add platform-specific formatting
  switch (platform) {
    case 'twitter':
      const hashtags = keywords.map(k => `#${k}`).join(' ');
      return `${content} ${hashtags}`;
    case 'reddit':
      return `${content}\n\nמה דעתכם? האם כדאי להיכנס בנקודה הזו?`;
    case 'telegram':
      return `📊 עדכון שוק 📊\n\n${content}\n\n📈 המשך מסחר מוצלח!`;
    case 'discord':
      return `**עדכון מסחר חשוב**\n${content}\n\nתודה על ההקשבה! 🚀`;
    default:
      return content;
  }
};

// Export default initialization
export default initializeSocialMonitoring;
