
import { FinancialDataSource, MarketInfluencer, MarketEvent, PlatformInfo } from '@/types/marketInformation';

// Mock data for information sources
export const INFORMATION_SOURCES: FinancialDataSource[] = [
  {
    id: "source-1",
    name: "CoinDesk",
    description: "Leading cryptocurrency news site covering Bitcoin, Ethereum, and blockchain tech",
    url: "https://www.coindesk.com/",
    type: "news",
    category: "news",
    rating: 8,
    platform: "web",
    reliability: 8,
    accessType: "free",
    languages: ["English"],
    updateFrequency: "Hourly",
    focused: true
  },
  {
    id: "source-2",
    name: "CoinMarketCap",
    description: "Cryptocurrency market capitalization rankings and data",
    url: "https://coinmarketcap.com/",
    type: "data",
    category: "data",
    rating: 9,
    platform: "web",
    reliability: 9,
    accessType: "freemium",
    languages: ["English", "Chinese", "Russian"],
    updateFrequency: "Real-time",
    focused: true
  },
  {
    id: "source-3",
    name: "Glassnode",
    description: "On-chain market intelligence platform for blockchain data",
    url: "https://glassnode.com/",
    type: "analytics",
    category: "analysis",
    rating: 9,
    platform: "web",
    reliability: 9,
    accessType: "premium",
    languages: ["English"],
    updateFrequency: "Daily",
    focused: false
  },
  {
    id: "source-4",
    name: "Crypto Twitter",
    description: "Twitter discussions about cryptocurrency",
    url: "https://twitter.com/explore",
    type: "social",
    category: "social",
    rating: 5,
    platform: "twitter",
    reliability: 5,
    accessType: "free",
    languages: ["Multiple"],
    updateFrequency: "Real-time",
    focused: true
  },
  {
    id: "source-5",
    name: "TradingView",
    description: "Charting platform with social features and trading ideas",
    url: "https://www.tradingview.com/",
    type: "charts",
    category: "analysis",
    rating: 8,
    platform: "web",
    reliability: 8,
    accessType: "freemium",
    languages: ["English", "Spanish", "Russian"],
    updateFrequency: "Real-time",
    focused: false
  }
];

// Mock data for market influencers
export const MARKET_INFLUENCERS: MarketInfluencer[] = [
  {
    id: "influencer-1",
    name: "Vitalik Buterin",
    description: "Co-founder of Ethereum and blockchain thought leader",
    platform: "Twitter",
    followers: 4200000,
    bio: "Ethereum co-founder and blockchain visionary",
    profileUrl: "https://twitter.com/VitalikButerin",
    expertise: ["Ethereum", "Blockchain"],
    platforms: [
      {
        type: "twitter",
        url: "https://twitter.com/VitalikButerin",
        followers: 4200000
      },
      {
        type: "blog",
        url: "https://vitalik.ca/",
        followers: 0
      }
    ],
    specialty: ["Ethereum", "Blockchain Technology", "Scaling Solutions"],
    reliability: 9,
    sentiment: "neutral",
    followStatus: true
  },
  {
    id: "influencer-2",
    name: "Michael Saylor",
    description: "MicroStrategy CEO and Bitcoin advocate",
    platform: "Twitter",
    followers: 2800000,
    bio: "CEO of MicroStrategy, Bitcoin maximalist",
    profileUrl: "https://twitter.com/saylor",
    expertise: ["Bitcoin", "Corporate Treasury"],
    platforms: [
      {
        type: "twitter",
        url: "https://twitter.com/saylor",
        followers: 2800000
      },
      {
        type: "youtube",
        url: "https://www.youtube.com/c/MichaelSaylor",
        followers: 200000
      }
    ],
    specialty: ["Bitcoin", "Corporate Treasury", "Macro Economics"],
    reliability: 7,
    sentiment: "positive",
    followStatus: true
  },
  {
    id: "influencer-3",
    name: "Cathie Wood",
    description: "CEO of Ark Invest and tech investment strategist",
    platform: "LinkedIn",
    followers: 1500000,
    bio: "Founder and CEO of ARK Investment Management",
    profileUrl: "https://www.linkedin.com/in/cathie-wood/",
    expertise: ["Investment", "Innovation"],
    platforms: [
      {
        type: "twitter",
        url: "https://twitter.com/CathieDWood",
        followers: 1500000
      },
      {
        type: "linkedin",
        url: "https://www.linkedin.com/in/cathie-wood/",
        followers: 500000
      }
    ],
    specialty: ["Tech Stocks", "Bitcoin", "Disruptive Innovation"],
    reliability: 8,
    sentiment: "neutral",
    followStatus: false
  }
];

// Mock data for market events
export const MARKET_EVENTS: MarketEvent[] = [
  {
    id: "event-1",
    title: "Federal Reserve Interest Rate Decision",
    description: "The Federal Reserve announces its latest interest rate decision and monetary policy outlook",
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    category: "economic",
    importance: "critical",
    relatedAssets: ["USD", "BTC", "Gold"],
    expectedImpact: "variable",
    source: "Federal Reserve",
    reminder: true,
    type: "economic"
  },
  {
    id: "event-2",
    title: "Bitcoin Halving",
    description: "Bitcoin's fourth mining reward halving event, reducing block rewards from 6.25 to 3.125 BTC",
    date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
    category: "other",
    importance: "high",
    relatedAssets: ["BTC", "Mining Stocks"],
    expectedImpact: "positive",
    source: "Bitcoin Network",
    reminder: true,
    type: "network"
  },
  {
    id: "event-3",
    title: "U.S. CPI Data Release",
    description: "Monthly Consumer Price Index data release showing inflation trends",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    category: "economic",
    importance: "high",
    relatedAssets: ["USD", "BTC", "ETH", "Gold"],
    expectedImpact: "variable",
    source: "Bureau of Labor Statistics",
    reminder: false,
    type: "economic-data"
  },
  {
    id: "event-4",
    title: "Ethereum DevCon",
    description: "Annual Ethereum developer conference showcasing new developments and roadmap",
    date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    category: "other",
    importance: "medium",
    relatedAssets: ["ETH"],
    expectedImpact: "positive",
    source: "Ethereum Foundation",
    reminder: false,
    type: "conference"
  },
  {
    id: "event-5",
    title: "SEC Bitcoin ETF Decision",
    description: "SEC ruling on pending spot Bitcoin ETF applications",
    date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days from now
    category: "regulatory",
    importance: "critical",
    relatedAssets: ["BTC", "ETH", "Exchange Tokens"],
    expectedImpact: "positive",
    source: "SEC",
    reminder: true,
    type: "regulatory"
  }
];
