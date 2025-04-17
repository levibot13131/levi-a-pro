
import { useTradingViewAuth } from './use-tradingview-auth';

/**
 * Hook for checking TradingView connection status
 * @returns Object containing connection state
 */
export function useTradingViewConnection() {
  const { isConnected, credentials, isLoading } = useTradingViewAuth();

  return {
    isConnected,
    credentials,
    loading: isLoading
  };
}
