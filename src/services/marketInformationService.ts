
import { toast } from "sonner";

// Types for financial news and market sources
export interface FinancialDataSource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: 'news' | 'data' | 'analysis' | 'social';
  reliability: number; // 1-10 scale
  accessType: 'free' | 'paid' | 'api';
  languages: string[];
  updateFrequency: string;
  focused: boolean; // Is this source in user's focused list
}

export interface MarketInfluencer {
  id: string;
  name: string;
  description: string;
  platforms: {
    type: 'twitter' | 'linkedin' | 'youtube' | 'blog' | 'other';
    url: string;
    followers: number;
  }[];
  specialty: string[];
  reliability: number; // 1-10 scale
  sentiment: 'bullish' | 'bearish' | 'neutral' | 'variable';
  followStatus: 'following' | 'not-following';
}

export interface MarketEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'economic' | 'earnings' | 'political' | 'regulatory' | 'other';
  importance: 'low' | 'medium' | 'high' | 'critical';
  relatedAssets?: string[];
  expectedImpact?: 'positive' | 'negative' | 'neutral' | 'variable';
  source: string;
  reminder: boolean; // Has user set a reminder
}

// Mock data for information sources
const FINANCIAL_SOURCES: FinancialDataSource[] = [
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
const MARKET_INFLUENCERS: MarketInfluencer[] = [
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
const MARKET_EVENTS: MarketEvent[] = [
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

// Functions to access and manage information sources
export const getInformationSources = async (): Promise<FinancialDataSource[]> => {
  // In a real implementation, this would fetch from an API or database
  return new Promise(resolve => {
    setTimeout(() => resolve(FINANCIAL_SOURCES), 800);
  });
};

export const getMarketInfluencers = async (): Promise<MarketInfluencer[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(MARKET_INFLUENCERS), 600);
  });
};

export const getUpcomingMarketEvents = async (days: number = 30): Promise<MarketEvent[]> => {
  return new Promise(resolve => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);
    
    const filteredEvents = MARKET_EVENTS.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= now && eventDate <= futureDate;
    });
    
    setTimeout(() => resolve(filteredEvents), 700);
  });
};

export const toggleSourceFocus = async (sourceId: string, focused: boolean): Promise<void> => {
  // In a real implementation, this would update a database
  await new Promise(resolve => setTimeout(resolve, 300));
  const source = FINANCIAL_SOURCES.find(s => s.id === sourceId);
  if (source) {
    source.focused = focused;
    toast.success(`${source.name} ${focused ? 'added to' : 'removed from'} focused sources`);
  }
};

export const toggleInfluencerFollow = async (influencerId: string, following: boolean): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const influencer = MARKET_INFLUENCERS.find(i => i.id === influencerId);
  if (influencer) {
    influencer.followStatus = following ? 'following' : 'not-following';
    toast.success(`${influencer.name} ${following ? 'added to' : 'removed from'} followed influencers`);
  }
};

export const setEventReminder = async (eventId: string, reminder: boolean): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const event = MARKET_EVENTS.find(e => e.id === eventId);
  if (event) {
    event.reminder = reminder;
    toast.success(`Reminder ${reminder ? 'set' : 'removed'} for "${event.title}"`);
  }
};

// Function to add custom information source
export const addCustomSource = async (source: Omit<FinancialDataSource, 'id'>): Promise<FinancialDataSource> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newSource: FinancialDataSource = {
    ...source,
    id: `source-custom-${Date.now()}`
  };
  FINANCIAL_SOURCES.push(newSource);
  toast.success(`Added new source: ${newSource.name}`);
  return newSource;
};

// Function to add custom market event
export const addCustomEvent = async (event: Omit<MarketEvent, 'id'>): Promise<MarketEvent> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newEvent: MarketEvent = {
    ...event,
    id: `event-custom-${Date.now()}`
  };
  MARKET_EVENTS.push(newEvent);
  toast.success(`Added new event: ${newEvent.title}`);
  return newEvent;
};
