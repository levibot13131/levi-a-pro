import { MarketEvent, MarketInfluencer, FinancialDataSource } from '@/types/marketInformation';

export const MARKET_EVENTS: MarketEvent[] = [
  {
    id: "event1",
    title: "Bitcoin Halving",
    date: "2024-04-20",
    importance: "high",
    category: "crypto",
    description: "Bitcoin's block reward will be reduced by 50%, potentially affecting its price.",
    relatedAssets: ["bitcoin", "ethereum"],
    expectedImpact: "bullish",
    source: "official",
    reminder: false,
    type: "technical"
  },
  // Add more events as needed
  {
    id: "event2",
    title: "Federal Reserve Meeting",
    date: "2024-05-01",
    importance: "high",
    category: "economy",
    description: "The Federal Reserve will decide on interest rates.",
    relatedAssets: ["bitcoin", "s&p500", "dow"],
    expectedImpact: "bearish",
    source: "official",
    reminder: false,
    type: "economic"
  }
];

export const MARKET_INFLUENCERS: MarketInfluencer[] = [
  {
    id: "inf1",
    name: "Crypto Expert",
    platform: "Twitter",
    followers: 500000,
    reliability: 80,
    expertise: ["Bitcoin", "Ethereum", "DeFi"],
    imageUrl: "https://example.com/expert1.jpg",
    description: "Leading crypto analyst with accurate price predictions"
  },
  // Add more influencers as needed
  {
    id: "inf2",
    name: "Market Guru",
    platform: "YouTube",
    followers: 1000000,
    reliability: 75,
    expertise: ["Technical Analysis", "Trend Analysis"],
    imageUrl: "https://example.com/expert2.jpg",
    description: "Technical analysis expert focusing on chart patterns"
  }
];

export const FINANCIAL_DATA_SOURCES: FinancialDataSource[] = [
  {
    id: "src1",
    name: "CryptoCompare",
    type: "API",
    reliability: 95,
    category: ["Crypto", "Market Data"],
    url: "https://cryptocompare.com",
    description: "Comprehensive crypto data source",
    isPaid: false,
    frequencyUpdate: "real-time"
  },
  // Add more sources as needed
  {
    id: "src2",
    name: "TradingView",
    type: "Platform",
    reliability: 90,
    category: ["Stocks", "Crypto", "Forex"],
    url: "https://tradingview.com",
    description: "Advanced charting and analysis platform",
    isPaid: true,
    frequencyUpdate: "real-time"
  }
];
