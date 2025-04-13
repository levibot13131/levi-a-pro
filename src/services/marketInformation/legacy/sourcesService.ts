
import { LegacyFinancialDataSource } from './types';

// Mock data for financial data sources
const financialSources: LegacyFinancialDataSource[] = [
  {
    id: "1",
    name: "Bloomberg",
    url: "https://www.bloomberg.com",
    category: "finance",
    dataPoints: ["stocks", "commodities", "forex"],
    description: "Leading financial news provider",
    reliabilityRating: 95,
    accessType: "paid",
    languages: ["en", "he"],
    updateFrequency: "realtime"
  },
  {
    id: "2",
    name: "Yahoo Finance",
    url: "https://finance.yahoo.com",
    category: "finance",
    dataPoints: ["stocks", "etfs", "indices"],
    description: "Free financial data provider",
    reliabilityRating: 85,
    accessType: "free",
    languages: ["en"],
    updateFrequency: "delayed"
  }
];

// Get all financial data sources
export const getFinancialDataSources = (): LegacyFinancialDataSource[] => {
  return [...financialSources];
};

// Connect to external data source
export const connectToExternalDataSource = async (sourceId: string): Promise<boolean> => {
  // Mock implementation - would connect to real API
  return true;
};

// Refresh market data
export const refreshMarketData = async (): Promise<boolean> => {
  // Mock implementation - would refresh data from sources
  return true;
};
