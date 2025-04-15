
// Define the type of credentials stored for Binance
export interface BinanceCredentials {
  apiKey: string;
  apiSecret: string;
  isConnected: boolean;
  lastConnected?: number;
}

const BINANCE_CREDENTIALS_KEY = 'binance_credentials';

/**
 * Saves Binance API credentials to localStorage
 */
export const saveBinanceCredentials = (credentials: BinanceCredentials): void => {
  if (!credentials.apiKey || !credentials.apiSecret) {
    console.error('Missing required Binance credentials');
    return;
  }
  
  // Add lastConnected timestamp if not provided
  if (!credentials.lastConnected) {
    credentials.lastConnected = Date.now();
  }
  
  // Ensure isConnected is set
  credentials.isConnected = true;
  
  // Store credentials in localStorage
  localStorage.setItem(BINANCE_CREDENTIALS_KEY, JSON.stringify(credentials));
  console.log('Binance credentials saved successfully');
};

/**
 * Retrieves stored Binance API credentials from localStorage
 */
export const getBinanceCredentials = (): BinanceCredentials | null => {
  const credentials = localStorage.getItem(BINANCE_CREDENTIALS_KEY);
  if (!credentials) return null;
  
  try {
    return JSON.parse(credentials) as BinanceCredentials;
  } catch (error) {
    console.error('Error parsing Binance credentials:', error);
    return null;
  }
};

/**
 * Clears stored Binance API credentials from localStorage
 */
export const disconnectBinance = (): void => {
  localStorage.removeItem(BINANCE_CREDENTIALS_KEY);
  console.log('Binance credentials removed');
};
