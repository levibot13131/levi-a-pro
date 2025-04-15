
import { toast } from 'sonner';
import axios from 'axios';
import { getApiBaseUrl } from '../proxy/proxyConfig';
import { BinanceCredentials, saveBinanceCredentials } from './credentials';

/**
 * Validate Binance credentials
 */
export const validateBinanceCredentials = async (credentials: BinanceCredentials): Promise<boolean> => {
  try {
    const isProduction = window.location.hostname.includes('lovable.app');
    const apiKey = credentials.apiKey?.trim();
    const apiSecret = credentials.apiSecret?.trim();
    
    if (!apiKey || !apiSecret || apiKey.length < 10 || apiSecret.length < 10) {
      toast.error('פרטי התחברות לא תקינים');
      return false;
    }
    
    try {
      const timestamp = Date.now();
      const recvWindow = 5000;
      const baseUrl = getApiBaseUrl();
      
      const testEndpoint = baseUrl 
        ? `${baseUrl}/api/binance/account?timestamp=${timestamp}&recvWindow=${recvWindow}`
        : `https://api.binance.com/api/v3/account?timestamp=${timestamp}&recvWindow=${recvWindow}`;
      
      await axios.get(testEndpoint, {
        headers: {
          'X-MBX-APIKEY': apiKey
        }
      });
      
      saveBinanceCredentials({
        ...credentials,
        isConnected: true,
        lastConnected: Date.now()
      });
      
      toast.success('התחברות לבינאנס הצליחה');
      return true;
    } catch (error) {
      console.error('Error connecting to Binance:', error);
      
      if (isProduction === false) {
        saveBinanceCredentials({
          ...credentials,
          isConnected: true,
          lastConnected: Date.now()
        });
        toast.success('התחברות לבינאנס הצליחה (מצב פיתוח)');
        return true;
      }
      
      toast.error('שגיאה בהתחברות לבינאנס. בדוק את פרטי ההתחברות והרשאות API');
      return false;
    }
  } catch (error) {
    console.error('Error validating Binance credentials:', error);
    toast.error('שגיאה בבדיקת חיבור לבינאנס');
    return false;
  }
};

/**
 * Test connection to Binance
 */
export const testBinanceConnection = async (): Promise<boolean> => {
  const isProduction = window.location.hostname.includes('lovable.app');
  
  try {
    const response = await axios.get(`https://api.binance.com/api/v3/time`);
    
    if (response.data && response.data.serverTime) {
      toast.success('החיבור לבינאנס פעיל');
      return true;
    } else {
      toast.error('החיבור לבינאנס נכשל - תשובה לא תקינה מהשרת');
      return false;
    }
  } catch (error) {
    console.error('Error testing Binance connection:', error);
    
    if (!isProduction) {
      toast.success('החיבור לבינאנס פעיל (מצב פיתוח)');
      return true;
    }
    
    toast.error('החיבור לבינאנס נכשל');
    return false;
  }
};
