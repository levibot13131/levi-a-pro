
import { useState, useEffect } from 'react';
import { startRealTimeMarketData, getFundamentalData } from '@/services/binance/binanceService';
import { useBinanceConnection } from './use-binance-connection';
import { toast } from 'sonner';

export interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
  change24h: number;
}

export interface FundamentalData {
  symbol: string;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  maxSupply: number;
  fundamentalScore: number;
  sentiment: string;
  newsCount24h: number;
  socialMentions24h: number;
  timestamp: number;
}

export function useBinanceData(symbols: string[] = []) {
  const { isConnected } = useBinanceConnection();
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [fundamentalData, setFundamentalData] = useState<Record<string, FundamentalData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isStreamActive, setIsStreamActive] = useState(false);
  
  // Start real-time data stream when component mounts
  useEffect(() => {
    if (!isConnected || symbols.length === 0) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    let stopFunction: (() => void) | null = null;
    
    // Fetch initial fundamental data for each symbol
    const fetchFundamental = async () => {
      const fundamentalResults: Record<string, FundamentalData> = {};
      
      for (const symbol of symbols) {
        try {
          const data = await getFundamentalData(symbol);
          fundamentalResults[symbol] = data;
        } catch (error) {
          console.error(`Error fetching fundamental data for ${symbol}:`, error);
        }
      }
      
      setFundamentalData(fundamentalResults);
    };
    
    fetchFundamental();
    
    // Start real-time market data stream
    const startStream = async () => {
      try {
        const result = await startRealTimeMarketData(symbols, (data) => {
          setMarketData(prev => ({
            ...prev,
            [data.symbol]: data
          }));
          
          if (isLoading) {
            setIsLoading(false);
          }
        });
        
        stopFunction = result.stop;
        setIsStreamActive(true);
      } catch (error) {
        console.error("Error starting real-time market data:", error);
        setIsLoading(false);
      }
    };
    
    startStream();
    
    // Clean up on unmount
    return () => {
      if (stopFunction) {
        stopFunction();
      }
      setIsStreamActive(false);
    };
  }, [isConnected, symbols.join(',')]);
  
  // Periodically update fundamental data (every 5 minutes)
  useEffect(() => {
    if (!isConnected || symbols.length === 0) return;
    
    const updateInterval = setInterval(async () => {
      const fundamentalResults: Record<string, FundamentalData> = { ...fundamentalData };
      
      for (const symbol of symbols) {
        try {
          const data = await getFundamentalData(symbol);
          fundamentalResults[symbol] = data;
        } catch (error) {
          console.error(`Error updating fundamental data for ${symbol}:`, error);
        }
      }
      
      setFundamentalData(fundamentalResults);
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(updateInterval);
  }, [isConnected, symbols.join(','), fundamentalData]);
  
  return {
    marketData,
    fundamentalData,
    isLoading,
    isStreamActive,
    isConnected
  };
}
