
import { useState, useEffect, useCallback } from 'react';
import { 
  isTradingViewConnected, 
  getTradingViewCredentials,
  validateTradingViewCredentials,
  disconnectTradingView,
  TradingViewCredentials
} from '../services/tradingView/tradingViewAuthService';
import { toast } from 'sonner';

/**
 * Hook for managing TradingView authentication state
 * @returns Object containing authentication state and methods
 */
export function useTradingViewAuth() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<TradingViewCredentials | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize authentication state
  useEffect(() => {
    const checkConnection = () => {
      const connected = isTradingViewConnected();
      setIsConnected(connected);
      
      if (connected) {
        setCredentials(getTradingViewCredentials());
      } else {
        setCredentials(null);
      }
      
      setIsLoading(false);
    };
    
    checkConnection();
    
    // Listen for storage changes (for when credentials are updated in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tradingview_auth_credentials') {
        checkConnection();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  /**
   * Connect to TradingView with provided credentials
   * @param username - TradingView username
   * @param password - TradingView password (optional)
   * @param apiKey - TradingView API key (optional)
   * @returns Promise resolving to boolean indicating success
   */
  const connect = useCallback(async (
    username: string, 
    password?: string, 
    apiKey?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const success = await validateTradingViewCredentials({ 
        username, 
        password, 
        apiKey 
      });
      
      if (success) {
        setIsConnected(true);
        setCredentials(getTradingViewCredentials());
        return true;
      } else {
        toast.error('אימות פרטי TradingView נכשל');
        return false;
      }
    } catch (error) {
      console.error('Error connecting to TradingView:', error);
      toast.error('שגיאה בהתחברות ל-TradingView');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Disconnect from TradingView
   */
  const disconnect = useCallback(() => {
    disconnectTradingView();
    setIsConnected(false);
    setCredentials(null);
    toast.success('התנתקת בהצלחה מ-TradingView');
  }, []);

  return {
    isConnected,
    credentials,
    isLoading,
    connect,
    disconnect
  };
}
