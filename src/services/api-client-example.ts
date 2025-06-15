
// API Client for cloud-native connections - NO PROXY NEEDED

import { toast } from 'sonner';

class CloudApiClient {
  private baseUrls = {
    binance: 'https://api.binance.com',
    coingecko: 'https://api.coingecko.com/api/v3',
    telegram: 'https://api.telegram.org'
  };

  /**
   * Test direct cloud connection to Binance
   */
  async testBinanceConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrls.binance}/api/v3/ping`);
      return response.ok;
    } catch (error) {
      console.error('Binance connection test failed:', error);
      return false;
    }
  }

  /**
   * Test direct cloud connection to CoinGecko
   */
  async testCoinGeckoConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrls.coingecko}/ping`);
      return response.ok;
    } catch (error) {
      console.error('CoinGecko connection test failed:', error);
      return false;
    }
  }

  /**
   * Test overall API connectivity
   */
  async testProxyConnection(): Promise<boolean> {
    console.log('Testing direct cloud API connections...');
    
    const binanceOk = await this.testBinanceConnection();
    const coingeckoOk = await this.testCoinGeckoConnection();
    
    const allConnected = binanceOk && coingeckoOk;
    
    if (allConnected) {
      toast.success('All cloud APIs connected successfully');
    } else {
      toast.warning('Some API connections failed');
    }
    
    return allConnected;
  }

  /**
   * Fetch data from any API endpoint
   */
  async fetchData(service: 'binance' | 'coingecko' | 'telegram', endpoint: string, options?: RequestInit): Promise<any> {
    try {
      const baseUrl = this.baseUrls[service];
      const url = `${baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        }
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching from ${service}:`, error);
      throw error;
    }
  }
}

export const apiClient = new CloudApiClient();
