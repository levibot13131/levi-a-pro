
import { FinancialDataSource, MarketInfluencer, MarketEvent } from '@/types/marketInformation';

// Mock data for information sources
export const FINANCIAL_SOURCES: FinancialDataSource[] = [
  {
    id: "source-1",
    name: "Bloomberg",
    description: "Global financial news and market data provider",
    url: "https://www.bloomberg.com/",
    category: "news",
    reliability: 9,
    accessType: "paid",
    languages: ["English", "Japanese", "Chinese"],
    updateFrequency: "Real-time",
    focused: true
  },
  {
    id: "source-2",
    name: "Yahoo Finance",
    description: "Market data, news and analysis for stocks, cryptocurrencies and more",
    url: "https://finance.yahoo.com/",
    category: "data",
    reliability: 7,
    accessType: "free",
    languages: ["English", "Spanish"],
    updateFrequency: "15 min delay",
    focused: true
  },
  {
    id: "source-3",
    name: "CoinDesk",
    description: "News and insights on cryptocurrencies and blockchain technology",
    url: "https://www.coindesk.com/",
    category: "news",
    reliability: 8,
    accessType: "free",
    languages: ["English"],
    updateFrequency: "Hourly",
    focused: false
  },
  {
    id: "source-4",
    name: "Financial Times",
    description: "Global business, financial and political news",
    url: "https://www.ft.com/",
    category: "news",
    reliability: 9,
    accessType: "paid",
    languages: ["English"],
    updateFrequency: "Daily",
    focused: false
  },
  {
    id: "source-5",
    name: "TradingView",
    description: "Advanced financial visualization platform and social network",
    url: "https://www.tradingview.com/",
    category: "analysis",
    reliability: 8,
    accessType: "freemium",
    languages: ["English", "Russian", "Spanish", "Portuguese"],
    updateFrequency: "Real-time",
    focused: true
  }
];

// Mock data for influential market figures
export const MARKET_INFLUENCERS: MarketInfluencer[] = [
  {
    id: "influencer-1",
    name: "Warren Buffett",
    description: "CEO of Berkshire Hathaway and legendary value investor",
    platforms: [
      {
        type: "other",
        url: "https://www.berkshirehathaway.com/",
        followers: 0
      }
    ],
    specialty: ["Value Investing", "Long-term Strategy"],
    reliability: 10,
    sentiment: "variable",
    followStatus: "following"
  },
  {
    id: "influencer-2",
    name: "Cathie Wood",
    description: "Founder and CEO of ARK Invest, focused on disruptive innovation",
    platforms: [
      {
        type: "twitter",
        url: "https://twitter.com/CathieDWood",
        followers: 1500000
      },
      {
        type: "youtube",
        url: "https://www.youtube.com/c/ARKInvestChannel",
        followers: 200000
      }
    ],
    specialty: ["Innovation", "Growth Investing", "Technology"],
    reliability: 7,
    sentiment: "bullish",
    followStatus: "following"
  },
  {
    id: "influencer-3",
    name: "Michael Burry",
    description: "Founder of Scion Asset Management, known for predicting the 2008 crisis",
    platforms: [
      {
        type: "twitter",
        url: "https://twitter.com/michaeljburry",
        followers: 800000
      }
    ],
    specialty: ["Contrarian Investing", "Market Bubbles", "Short Selling"],
    reliability: 8,
    sentiment: "bearish",
    followStatus: "not-following"
  }
];

// Mock data for upcoming market events
export const MARKET_EVENTS: MarketEvent[] = [
  {
    id: "event-1",
    title: "Federal Reserve Interest Rate Decision",
    description: "The Federal Reserve announces its decision on interest rates following the FOMC meeting",
    date: "2025-05-01T18:00:00Z",
    category: "economic",
    importance: "critical",
    relatedAssets: ["sp500", "nasdaq", "usd"],
    expectedImpact: "variable",
    source: "Federal Reserve",
    reminder: true
  },
  {
    id: "event-2",
    title: "Apple Q2 2025 Earnings",
    description: "Apple Inc. releases its second quarter earnings report for fiscal year 2025",
    date: "2025-04-30T20:30:00Z",
    category: "earnings",
    importance: "high",
    relatedAssets: ["apple", "nasdaq", "tech-etf"],
    expectedImpact: "positive",
    source: "Apple Investor Relations",
    reminder: false
  },
  {
    id: "event-3",
    title: "EU Crypto Regulation Framework",
    description: "European Union votes on comprehensive cryptocurrency regulation framework",
    date: "2025-05-15T09:00:00Z",
    category: "regulatory",
    importance: "high",
    relatedAssets: ["bitcoin", "ethereum", "binance"],
    expectedImpact: "variable",
    source: "European Commission",
    reminder: true
  }
];
