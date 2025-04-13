
import { LegacyMarketEvent } from './types';

// Mock data for market events
const events: LegacyMarketEvent[] = [
  {
    id: "1",
    title: "Fed Interest Rate Decision",
    date: "2023-12-15",
    category: "economic",
    impact: "high",
    description: "Federal Reserve decision on interest rates",
    expectedVolatility: "high",
    assetImpact: {
      "USD": "strong",
      "Treasuries": "strong",
      "Equities": "medium"
    },
    importance: "high",
    source: "Federal Reserve",
    reminder: true
  },
  {
    id: "2",
    title: "Apple Earnings",
    date: "2023-11-02",
    category: "earnings",
    impact: "medium",
    description: "Apple Q4 earnings report",
    expectedVolatility: "medium",
    assetImpact: {
      "AAPL": "strong",
      "NASDAQ": "medium",
      "Tech Sector": "medium"
    },
    importance: "medium",
    source: "Apple Inc",
    reminder: false
  }
];

// Get all market events
export const getMarketEvents = (): LegacyMarketEvent[] => {
  return [...events];
};
