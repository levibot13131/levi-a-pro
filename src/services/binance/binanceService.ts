
import { toast } from 'sonner';

// Types
export interface BinanceCredentials {
  apiKey: string;
  apiSecret: string;
  label?: string;
  permissions?: ('read' | 'trade' | 'withdraw')[];
  createdAt: number;
}

// Storage key
const STORAGE_KEY = 'binance_credentials';

// Get credentials from storage
export const getBinanceCredentials = (): BinanceCredentials | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to retrieve Binance credentials:', e);
    return null;
  }
};

// Save credentials to storage
export const saveBinanceCredentials = (credentials: BinanceCredentials): boolean => {
  try {
    const { apiKey, apiSecret } = credentials;
    
    // Basic validation
    if (!apiKey || !apiSecret) {
      return false;
    }
    
    // Add timestamp if not present
    if (!credentials.createdAt) {
      credentials.createdAt = Date.now();
    }
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
    return true;
  } catch (e) {
    console.error('Failed to save Binance credentials:', e);
    return false;
  }
};

// Check if connected to Binance
export const isBinanceConnected = (): boolean => {
  const credentials = getBinanceCredentials();
  return !!credentials;
};

// Disconnect from Binance
export const disconnectBinance = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  toast.info('התנתקת מחשבון Binance', {
    description: 'כל הנתונים המקומיים נמחקו מהמכשיר'
  });
};

// Validate Binance credentials
export const validateBinanceCredentials = async (apiKey: string, apiSecret: string): Promise<boolean> => {
  try {
    if (!apiKey || !apiSecret) return false;
    
    // Simulate API validation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, we would make an API call to Binance to validate the credentials
    // For demo purposes, we'll accept any credentials that are not empty
    
    // Store credentials locally
    const credentials: BinanceCredentials = {
      apiKey,
      apiSecret,
      permissions: ['read'],
      createdAt: Date.now()
    };
    
    return saveBinanceCredentials(credentials);
  } catch (error) {
    console.error('Error validating Binance credentials:', error);
    return false;
  }
};

// Get Binance account info
export const getBinanceAccountInfo = async (): Promise<any> => {
  try {
    const credentials = getBinanceCredentials();
    if (!credentials) throw new Error('Not connected to Binance');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data - in a real app we would call the Binance API
    return {
      balances: [
        { asset: 'BTC', free: 0.02, locked: 0 },
        { asset: 'ETH', free: 0.5, locked: 0 },
        { asset: 'USDT', free: 1000, locked: 0 }
      ],
      accountType: 'SPOT',
      canTrade: true,
      canDeposit: true,
      canWithdraw: true,
      lastUpdated: Date.now()
    };
  } catch (error) {
    console.error('Error getting Binance account info:', error);
    throw error;
  }
};
