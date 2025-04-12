import { TradeSignal, MarketAnalysis } from "@/types/asset";

// Mock trade signals data
const mockSignals: TradeSignal[] = [
  {
    id: "signal-1",
    assetId: "bitcoin",
    type: "buy",
    price: 47000,
    timestamp: Date.now() - 1000000,
    strength: "strong",
    strategy: "Moving Average Crossover",
    timeframe: "1d",
    targetPrice: 50000,
    stopLoss: 45000,
    riskRewardRatio: 2,
    notes: "Bullish crossover detected on the daily chart.",
    createdAt: Date.now()
  },
  {
    id: "signal-2",
    assetId: "ethereum",
    type: "sell",
    price: 3400,
    timestamp: Date.now() - 2000000,
    strength: "medium",
    strategy: "RSI Overbought",
    timeframe: "4h",
    targetPrice: 3200,
    stopLoss: 3500,
    riskRewardRatio: 1.5,
    notes: "RSI indicates overbought conditions on the 4-hour chart.",
    createdAt: Date.now()
  },
  {
    id: "signal-3",
    assetId: "aapl",
    type: "buy",
    price: 170,
    timestamp: Date.now() - 3000000,
    strength: "weak",
    strategy: "Support Bounce",
    timeframe: "1w",
    targetPrice: 180,
    stopLoss: 165,
    riskRewardRatio: 2.5,
    notes: "Bouncing off long-term support level.",
    createdAt: Date.now()
  },
  {
    id: "signal-4",
    assetId: "amzn",
    type: "sell",
    price: 3300,
    timestamp: Date.now() - 4000000,
    strength: "strong",
    strategy: "Resistance Rejection",
    timeframe: "1d",
    targetPrice: 3100,
    stopLoss: 3400,
    riskRewardRatio: 2,
    notes: "Rejected at key resistance level.",
    createdAt: Date.now()
  },
  {
    id: "signal-5",
    assetId: "gold",
    type: "buy",
    price: 1800,
    timestamp: Date.now() - 5000000,
    strength: "medium",
    strategy: "Inflation Hedge",
    timeframe: "1M",
    targetPrice: 1900,
    stopLoss: 1750,
    riskRewardRatio: 2,
    notes: "Increasing inflation concerns driving demand for gold.",
    createdAt: Date.now()
  }
];

// For the mockAnalyses array, let's update each entry to include all required fields:
const mockAnalyses: MarketAnalysis[] = [
  {
    id: "analysis-1",
    title: "Bitcoin Technical Analysis: Potential Breakout Forming",
    summary: "Technical indicators suggest Bitcoin may be forming a breakout pattern after consolidation.",
    type: "technical",
    assetId: "bitcoin",
    timeframe: "1d",
    timestamp: Date.now() - 1000000,
    publishedAt: Date.now() - 1000000,
    author: "TechAnalyst",
    content: "Bitcoin has been consolidating in a tight range between $45,000 and $48,000 for the past two weeks. Volume has been decreasing during this consolidation, which typically precedes a significant move. The RSI is currently at 58, showing neutral momentum, but MACD is showing early signs of bullish crossover. The 200-day moving average is providing strong support at $42,800.",
    keyPoints: [
      "Price consolidation with decreasing volume",
      "Potential bullish MACD crossover forming",
      "Strong support at the 200-day moving average"
    ],
    conclusion: "Watch for a breakout above $48,000 with increased volume for confirmation of continued bullish trend.",
    sentiment: "bullish",
    source: "TradingView",
    confidence: 75,
    date: new Date(Date.now() - 1000000).toISOString()
  },
  
  {
    id: "analysis-2",
    title: "Global Cryptocurrency Market Outlook",
    summary: "Analysis of how recent regulatory developments may impact the cryptocurrency market.",
    type: "fundamental",
    assetId: "bitcoin",
    marketSector: "cryptocurrency",
    timeframe: "1M",
    timestamp: Date.now() - 2000000,
    publishedAt: Date.now() - 2000000,
    author: "CryptoEconomist",
    content: "Recent regulatory developments across major economies show a trend toward more structured oversight rather than restrictive policies. The United States SEC is working on clearer guidelines for token classifications, while the European Union's MiCA framework is progressing toward implementation. These developments suggest a maturing regulatory environment that could provide more certainty for institutional investors.",
    keyPoints: [
      "Regulatory clarity increasing globally",
      "Institutional investment continuing to grow",
      "Central banks exploring digital currencies"
    ],
    conclusion: "The regulatory environment is evolving toward acceptance with proper oversight, which is likely to be positive for the cryptocurrency ecosystem in the long term.",
    sentiment: "bullish",
    source: "Market Research",
    confidence: 80,
    date: new Date(Date.now() - 2000000).toISOString()
  },
  
  {
    id: "analysis-3",
    title: "Ethereum Fundamental Analysis",
    summary: "Examining Ethereum's fundamental value propositions and ecosystem development.",
    type: "fundamental",
    assetId: "ethereum",
    timeframe: "1M",
    timestamp: Date.now() - 3000000,
    publishedAt: Date.now() - 3000000,
    author: "BlockchainResearcher",
    content: "Ethereum continues to dominate the smart contract platform space with over $100B in Total Value Locked (TVL) across its DeFi protocols. Developer activity remains robust with approximately 4,000 monthly active developers. The transition to Proof of Stake has reduced energy consumption by over 99%, addressing a major criticism. Layer-2 scaling solutions are seeing increased adoption, with over $5B locked in these protocols.",
    keyPoints: [
      "Leading smart contract platform by TVL and developer activity",
      "Successful transition to Proof of Stake",
      "Growing adoption of Layer-2 scaling solutions"
    ],
    conclusion: "Ethereum maintains strong fundamentals and ecosystem growth, supporting a bullish long-term outlook despite short-term price fluctuations.",
    sentiment: "bullish",
    source: "Blockchain Analytics",
    confidence: 85,
    date: new Date(Date.now() - 3000000).toISOString()
  }
];

// Function to get trade signals
export const getTradeSignals = async (assetId?: string): Promise<TradeSignal[]> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  if (assetId) {
    return mockSignals.filter(signal => signal.assetId === assetId);
  }
  
  return mockSignals;
};

// Function to get market analyses
export const getMarketAnalyses = async (assetId?: string, type?: MarketAnalysis['type']): Promise<MarketAnalysis[]> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  let filteredAnalyses = [...mockAnalyses];
  
  if (assetId) {
    filteredAnalyses = filteredAnalyses.filter(analysis => analysis.assetId === assetId);
  }
  
  if (type) {
    filteredAnalyses = filteredAnalyses.filter(analysis => analysis.type === type);
  }
  
  return filteredAnalyses;
};
