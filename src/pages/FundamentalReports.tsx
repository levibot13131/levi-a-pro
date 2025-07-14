import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  AlertTriangle, 
  Globe, 
  Filter,
  ExternalLink,
  Clock,
  Star,
  DollarSign,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

interface FundamentalEvent {
  id: string;
  title: string;
  description: string;
  source: 'Twitter' | 'CoinMarketCap' | 'TradingView' | 'WhaleAlert' | 'CoinGecko' | 'Telegram';
  timestamp: number;
  impact: 'High' | 'Medium' | 'Low';
  category: 'SEC' | 'Protocol' | 'Whale' | 'Market' | 'News' | 'Dev';
  symbols: string[];
  url?: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  score: number;
}

// Mock data for demonstration - in production this would come from real feeds
const mockEvents: FundamentalEvent[] = [
  {
    id: '1',
    title: 'Major Whale Transaction: $50M BTC Movement',
    description: 'Large BTC wallet moved 1,250 BTC to unknown address, potential market impact expected',
    source: 'WhaleAlert',
    timestamp: Date.now() - 300000, // 5 minutes ago
    impact: 'High',
    category: 'Whale',
    symbols: ['BTCUSDT'],
    sentiment: 'Bearish',
    score: 85
  },
  {
    id: '2',
    title: 'Ethereum Protocol Upgrade Announced',
    description: 'Ethereum Foundation announces new EIP proposal for improved scalability',
    source: 'Twitter',
    timestamp: Date.now() - 900000, // 15 minutes ago
    impact: 'High',
    category: 'Protocol',
    symbols: ['ETHUSDT', 'ETCUSDT'],
    sentiment: 'Bullish',
    score: 92
  },
  {
    id: '3',
    title: 'SEC Hints at Crypto Regulation Framework',
    description: 'SEC Chairman discusses potential regulatory framework in senate hearing',
    source: 'TradingView',
    timestamp: Date.now() - 1800000, // 30 minutes ago
    impact: 'High',
    category: 'SEC',
    symbols: ['BTCUSDT', 'ETHUSDT', 'ADAUSDT'],
    sentiment: 'Neutral',
    score: 78
  },
  {
    id: '4',
    title: 'Cardano Partnership with Major Bank',
    description: 'Cardano announces strategic partnership for DeFi solutions',
    source: 'CoinMarketCap',
    timestamp: Date.now() - 3600000, // 1 hour ago
    impact: 'Medium',
    category: 'News',
    symbols: ['ADAUSDT'],
    sentiment: 'Bullish',
    score: 73
  },
  {
    id: '5',
    title: 'BNB Chain Developer Update',
    description: 'BNB Chain announces new developer tools and incentive program',
    source: 'CoinGecko',
    timestamp: Date.now() - 7200000, // 2 hours ago
    impact: 'Medium',
    category: 'Dev',
    symbols: ['BNBUSDT'],
    sentiment: 'Bullish',
    score: 68
  }
];

const FundamentalReports: React.FC = () => {
  const [events, setEvents] = useState<FundamentalEvent[]>(mockEvents);
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterImpact, setFilterImpact] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredEvents = events.filter(event => {
    const matchesSource = filterSource === 'all' || event.source === filterSource;
    const matchesImpact = filterImpact === 'all' || event.impact === filterImpact;
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    const matchesSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.symbols.some(symbol => symbol.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSource && matchesImpact && matchesCategory && matchesSearch;
  });

  const getTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'default';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish': return 'text-green-600';
      case 'Bearish': return 'text-red-600';
      case 'Neutral': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SEC': return <AlertTriangle className="h-4 w-4" />;
      case 'Protocol': return <BarChart3 className="h-4 w-4" />;
      case 'Whale': return <DollarSign className="h-4 w-4" />;
      case 'Market': return <TrendingUp className="h-4 w-4" />;
      case 'News': return <MessageSquare className="h-4 w-4" />;
      case 'Dev': return <Star className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-blue-600" />
              דוחות פונדמנטליים ובינה מלאכותית
              <Badge variant="outline" className="bg-blue-50">
                Live Intelligence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{events.filter(e => e.sentiment === 'Bullish').length}</div>
                <div className="text-sm text-muted-foreground">אירועים חיוביים</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{events.filter(e => e.sentiment === 'Bearish').length}</div>
                <div className="text-sm text-muted-foreground">אירועים שליליים</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{events.filter(e => e.impact === 'High').length}</div>
                <div className="text-sm text-muted-foreground">השפעה גבוהה</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(events.reduce((acc, e) => acc + e.score, 0) / events.length)}</div>
                <div className="text-sm text-muted-foreground">ציון ממוצע</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              פילטרים מתקדמים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">חיפוש</label>
                <Input
                  placeholder="חפש אירוע או סמל..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">מקור</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                >
                  <option value="all">כל המקורות</option>
                  <option value="Twitter">Twitter</option>
                  <option value="WhaleAlert">WhaleAlert</option>
                  <option value="CoinMarketCap">CoinMarketCap</option>
                  <option value="TradingView">TradingView</option>
                  <option value="CoinGecko">CoinGecko</option>
                  <option value="Telegram">Telegram</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">השפעה</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={filterImpact}
                  onChange={(e) => setFilterImpact(e.target.value)}
                >
                  <option value="all">כל הרמות</option>
                  <option value="High">גבוהה</option>
                  <option value="Medium">בינונית</option>
                  <option value="Low">נמוכה</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">קטגוריה</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">כל הקטגוריות</option>
                  <option value="SEC">SEC</option>
                  <option value="Protocol">פרוטוקול</option>
                  <option value="Whale">לווייתן</option>
                  <option value="Market">שוק</option>
                  <option value="News">חדשות</option>
                  <option value="Dev">פיתוח</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              פיד אירועים בזמן אמת
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {filteredEvents.length} אירועים
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(event.category)}
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <Badge variant={getImpactColor(event.impact)}>
                          {event.impact}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50">
                          {event.source}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{event.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {getTimeAgo(event.timestamp)}
                        </div>
                        
                        <div className={`flex items-center gap-1 font-medium ${getSentimentColor(event.sentiment)}`}>
                          <TrendingUp className="h-4 w-4" />
                          {event.sentiment}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          Score: {event.score}
                        </div>
                        
                        <div className="flex gap-1">
                          {event.symbols.map((symbol) => (
                            <Badge key={symbol} variant="secondary" className="text-xs">
                              {symbol}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {event.url && (
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FundamentalReports;