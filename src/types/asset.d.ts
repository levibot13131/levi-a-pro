export interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  image?: string;
  details?: AssetDetails;
  supply?: {
    circulating: number;
    total: number;
    max?: number;
  };
}

export interface AssetDetails {
  description?: string;
  website?: string;
  github?: string;
  twitter?: string;
  reddit?: string;
  whitepaper?: string;
  launchDate?: string;
  consensusMechanism?: string;
  hashingAlgorithm?: string;
}

export interface MarketData {
  priceUsd: number;
  priceBtc?: number;
  priceEth?: number;
  volume24h: number;
  volume7d?: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  priceChangePercentage7d?: number;
  marketCap: number;
  marketCapRank?: number;
  fullyDilutedValuation?: number;
  allTimeHigh?: {
    price: number;
    date: string;
    percentFromATH: number;
  };
  allTimeLow?: {
    price: number;
    date: string;
    percentFromATL: number;
  };
}

export interface PricePoint {
  timestamp: number;
  price: number;
  volume?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
}

export interface TradeSignal {
  id: string;
  assetId: string;
  type: 'buy' | 'sell';
  price: number;
  timestamp: number;
  strength: 'strong' | 'medium' | 'weak';
  strategy: string;
  timeframe: string;
  targetPrice?: number;
  stopLoss?: number;
  riskRewardRatio?: number;
  createdAt: number;
  symbolName?: string;
  confidence?: number;
  indicator?: string;
  description?: string;
}

export interface TradeJournalEntry {
  id: string;
  date: string;
  assetId: string;
  assetName: string;
  direction: 'long' | 'short';
  entryPrice: number;
  stopLoss: number;
  targetPrice?: number;
  positionSize: number;
  risk: number;
  notes?: string;
  strategy: string;
  tags?: string[];
  outcome: 'open' | 'win' | 'loss' | 'breakeven';
}

export interface SocialPost {
  id: string;
  author: {
    name: string;
    username: string;
    profileUrl: string;
    avatarUrl: string;
    verified: boolean;
    followers?: number;
  };
  content: string;
  timestamp: string;
  url: string;
  platform: 'twitter' | 'reddit' | 'telegram' | 'discord';
  sentiment?: 'positive' | 'negative' | 'neutral';
  likes?: number;
  comments?: number;
  reposts?: number;
  mentions?: string[];
  hashtags?: string[];
  assetIds?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  url: string;
  source: string;
  publishedAt: string;
  author?: string;
  categories?: string[];
  tags?: string[];
  assetIds?: string[];
  imageUrl?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  relevance?: number;
  featured?: boolean;
}

export interface MarketEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  assetIds?: string[];
  type: 'conference' | 'release' | 'fork' | 'listing' | 'regulatory' | 'partnership' | 'other';
  url?: string;
  source?: string;
  impact?: 'high' | 'medium' | 'low';
  confirmed: boolean;
  addedAt: string;
}

export interface MarketAlert {
  id: string;
  assetId: string;
  type: 'price' | 'volume' | 'trend' | 'news' | 'social' | 'whale' | 'other';
  message: string;
  timestamp: number;
  priority: 'high' | 'medium' | 'low';
  url?: string;
  read: boolean;
  dismissed: boolean;
}

export interface WhaleTransaction {
  id: string;
  assetId: string;
  amount: number;
  amountUsd?: number;
  fromAddress: string;
  toAddress: string;
  txHash: string;
  timestamp: number;
  blockNumber?: number;
  fee?: number;
  transactionType?: 'exchange_deposit' | 'exchange_withdrawal' | 'transfer' | 'contract_interaction' | 'unknown';
  exchangeFrom?: string;
  exchangeTo?: string;
  notes?: string;
}
