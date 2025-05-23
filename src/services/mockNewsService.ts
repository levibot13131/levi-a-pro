
import { NewsItem, SocialPost } from "@/types/asset";

// Mock news data
const mockNews: NewsItem[] = [
  {
    id: "news-1",
    assetId: "bitcoin", // Add required assetId
    title: "Bitcoin Breaks New All-Time High as Institutional Adoption Increases",
    summary: "Bitcoin reached a new all-time high today as more financial institutions announce investments in the cryptocurrency.",
    content: "Bitcoin has surged to unprecedented heights, breaking its previous all-time high as major financial institutions continue to announce significant investments in the cryptocurrency. This milestone comes amid growing institutional adoption and increased mainstream acceptance of digital assets as a legitimate investment class.",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: "CryptoNews",
    url: "https://example.com/news/1",
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d",
    sentiment: "positive",
    relatedAssets: ["bitcoin"]
  },
  {
    id: "news-2",
    assetId: "ethereum", // Add required assetId
    title: "Ethereum 2.0 Upgrade on Track for Q3 Completion",
    summary: "The Ethereum Foundation announced that the Ethereum 2.0 upgrade is proceeding as planned with an expected completion in Q3.",
    content: "The Ethereum Foundation has confirmed that the highly anticipated Ethereum 2.0 upgrade is on schedule to be completed in Q3 of this year. This significant update to the Ethereum network will bring improved scalability, reduced energy consumption through Proof of Stake, and enhanced security measures that will support the growing DeFi ecosystem.",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    source: "BlockchainTimes",
    url: "https://example.com/news/2",
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040",
    sentiment: "positive",
    relatedAssets: ["ethereum"]
  },
  {
    id: "news-3",
    assetId: "bitcoin", // Add required assetId
    title: "SEC Postpones Decision on Bitcoin ETF Applications",
    summary: "The U.S. Securities and Exchange Commission has postponed decisions on several Bitcoin ETF applications, citing the need for more time to review.",
    content: "The U.S. Securities and Exchange Commission (SEC) has announced a delay in its decisions regarding several pending Bitcoin ETF applications. The regulatory body stated that it requires additional time to thoroughly review these applications and assess their potential impact on the market. This postponement affects applications from multiple major financial institutions seeking to launch Bitcoin exchange-traded funds.",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    source: "FinanceWatch",
    url: "https://example.com/news/3",
    imageUrl: "https://images.unsplash.com/photo-1551135049-8a33b5883817",
    sentiment: "neutral",
    relatedAssets: ["bitcoin"]
  },
  {
    id: "news-4",
    assetId: "bitcoin", // Add required assetId
    title: "Market Correction Hits Crypto as Bitcoin Falls 8%",
    summary: "The cryptocurrency market experienced a broad correction today with Bitcoin falling 8% and other altcoins following suit.",
    content: "A significant market correction has impacted the cryptocurrency sector, with Bitcoin experiencing an 8% decline in value over the past 24 hours. This downward movement has rippled through the broader market, with many altcoins seeing similar or more severe drops. Trading volumes have increased substantially as some investors capitalize on lower prices while others secure profits from previous gains.",
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    source: "CryptoDaily",
    url: "https://example.com/news/4",
    imageUrl: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c",
    sentiment: "negative",
    relatedAssets: ["bitcoin", "ethereum", "ripple"]
  },
  {
    id: "news-5",
    assetId: "apple", // Add required assetId
    title: "Apple considering cryptocurrency payment options",
    summary: "Apple is reportedly exploring the possibility of integrating cryptocurrency payment options into Apple Pay.",
    content: "According to industry insiders, Apple is actively exploring the integration of cryptocurrency payment options within its Apple Pay service. This potential move would represent a significant endorsement of digital currencies by one of the world's largest technology companies. The company is reportedly examining various blockchain technologies and considering partnerships with established cryptocurrency payment processors to facilitate this integration.",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    source: "TechCrunch",
    url: "https://example.com/news/5",
    imageUrl: "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f",
    sentiment: "positive",
    relatedAssets: ["apple", "bitcoin"]
  }
];

// Mock social posts data
const mockSocialPosts: SocialPost[] = [
  {
    id: "social-1",
    assetId: "bitcoin", // Add required assetId
    source: "twitter", // Add required source
    author: "CryptoExpert",
    authorUsername: "@crypto_expert",
    authorImageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    content: "Bitcoin looking extremely bullish on the 4h chart. Key resistance at $52k about to break. Target: $58k by end of week. #BTC #Crypto",
    publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    likes: 532,
    comments: 47,
    platform: "twitter",
    shares: 128,
    postUrl: "https://twitter.com/example/1",
    sentiment: "positive"
  },
  {
    id: "social-2",
    assetId: "ethereum", // Add required assetId
    source: "twitter", // Add required source
    author: "Blockchain Maven",
    authorUsername: "@blockchain_maven",
    authorImageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    content: "Ethereum gas fees are way too high again. This is why we need ETH 2.0 ASAP. Layer 2 solutions aren't enough. $ETH",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 215,
    comments: 89,
    platform: "twitter",
    shares: 54,
    postUrl: "https://twitter.com/example/2",
    sentiment: "negative"
  },
  {
    id: "social-3",
    assetId: "defi", // Add required assetId
    source: "twitter", // Add required source
    author: "DeFi Protocol",
    authorUsername: "@defi_protocol",
    authorImageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    content: "We're excited to announce our new staking program with up to 15% APY on native tokens! Check out our platform to learn more.",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    likes: 892,
    comments: 134,
    platform: "twitter",
    shares: 267,
    postUrl: "https://twitter.com/example/3",
    sentiment: "positive"
  },
  {
    id: "social-4",
    assetId: "bitcoin", // Add required assetId
    source: "twitter", // Add required source
    author: "Crypto Analyst",
    authorUsername: "@crypto_analyst",
    authorImageUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    content: "BTC and ETH are showing clear divergence. While BTC continues its uptrend, ETH has been underperforming. Keep an eye on this ratio.",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes: 423,
    comments: 56,
    platform: "twitter",
    shares: 87,
    postUrl: "https://twitter.com/example/4",
    sentiment: "neutral"
  },
  {
    id: "social-5",
    assetId: "nft", // Add required assetId
    source: "twitter", // Add required source
    author: "NFT Enthusiast",
    authorUsername: "@nft_fan",
    authorImageUrl: "https://randomuser.me/api/portraits/men/5.jpg",
    content: "Just bought this amazing NFT for 2 ETH! The digital art space is absolutely exploding right now. #NFT #DigitalArt",
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 678,
    comments: 92,
    platform: "twitter",
    shares: 143,
    postUrl: "https://twitter.com/example/5",
    sentiment: "positive"
  }
];

// Get all news
export const getLatestNews = async (limit: number = 20): Promise<NewsItem[]> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  return mockNews.slice(0, limit);
};

// Get news for specific asset
export const getNewsByAssetId = async (assetId: string): Promise<NewsItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  return mockNews.filter(news => 
    news.relatedAssets?.some(asset => asset.toLowerCase() === assetId.toLowerCase())
  );
};

// Get all social posts
export const getSocialPosts = async (limit: number = 20): Promise<SocialPost[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  return mockSocialPosts.slice(0, limit);
};

// Get social posts for specific asset
export const getSocialPostsByAssetId = async (assetId: string): Promise<SocialPost[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  // Filter posts that mention the asset (simplified logic for demo)
  return mockSocialPosts.filter(post => 
    post.content.toLowerCase().includes(assetId.toLowerCase()) ||
    Math.random() > 0.5 // Randomly include some posts for demonstration
  );
};
