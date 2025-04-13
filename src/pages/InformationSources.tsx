
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getSources, 
  getInfluencers, 
  getUpcomingMarketEvents,
  toggleSourceFavorite,
  toggleInfluencerFollow,
  setEventReminder
} from '@/services/marketInformationService';
import { 
  MarketInfluencer,
  MarketEvent,
  FinancialDataSource
} from '@/types/marketInformation';
import InfluencersTab from '@/components/information-sources/InfluencersTab';
import SourcesTab from '@/components/information-sources/SourcesTab';
import EventsTab from '@/components/information-sources/EventsTab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useCoinGeckoData } from '@/hooks/use-coingecko-data';
import { getKeyFigureTweets } from '@/services/twitter/twitterService';

const InformationSources = () => {
  const [activeTab, setActiveTab] = useState('influencers');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sources state
  const [sources, setSources] = useState<FinancialDataSource[]>([]);
  const [focusedSourceIds, setFocusedSourceIds] = useState<Set<string>>(new Set());
  
  // Influencers state
  const [influencers, setInfluencers] = useState<MarketInfluencer[]>([]);
  const [focusedInfluencerIds, setFocusedInfluencerIds] = useState<Set<string>>(new Set());
  
  // Events state
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [focusedEventIds, setFocusedEventIds] = useState<Set<string>>(new Set());

  // Twitter state
  const [tweets, setTweets] = useState<any[]>([]);
  const [loadingTweets, setLoadingTweets] = useState<boolean>(false);
  
  // Fetch CoinGecko data
  const { 
    simplePrices, 
    marketData, 
    isLoading: loadingCoinGecko,
    error: coinGeckoError,
    refreshData: refreshCoinGeckoData
  } = useCoinGeckoData({
    coins: ['bitcoin', 'ethereum', 'solana', 'cardano', 'binancecoin', 'ripple'],
    refreshInterval: 30000 // 30 seconds
  });
  
  // Fetch initial data
  useEffect(() => {
    // Adapt the returned influencers to include required properties
    const fetchedInfluencers = getInfluencers();
    
    // Adapt the returned sources to include required properties
    const fetchedSources = getSources();
    
    // Complete the market events with required fields
    const rawEvents = getUpcomingMarketEvents();
    
    setInfluencers(fetchedInfluencers);
    setSources(fetchedSources);
    setEvents(rawEvents);
    
    // Fetch Twitter data
    fetchTwitterData();
  }, []);
  
  // Fetch Twitter data
  const fetchTwitterData = async () => {
    setLoadingTweets(true);
    try {
      const tweetData = await getKeyFigureTweets();
      setTweets(tweetData);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    } finally {
      setLoadingTweets(false);
    }
  };
  
  // Handle focus source
  const handleSourceFocus = (sourceId: string) => {
    const newFocusedSources = new Set(focusedSourceIds);
    if (newFocusedSources.has(sourceId)) {
      newFocusedSources.delete(sourceId);
    } else {
      newFocusedSources.add(sourceId);
    }
    setFocusedSourceIds(newFocusedSources);
    toggleSourceFavorite(sourceId);
  };
  
  // Handle follow influencer
  const handleFollowInfluencer = (influencerId: string) => {
    const newFollowedInfluencers = new Set(focusedInfluencerIds);
    if (newFollowedInfluencers.has(influencerId)) {
      newFollowedInfluencers.delete(influencerId);
    } else {
      newFollowedInfluencers.add(influencerId);
    }
    setFocusedInfluencerIds(newFollowedInfluencers);
    toggleInfluencerFollow(influencerId);
  };
  
  // Handle event reminder
  const handleEventReminder = (eventId: string) => {
    const newRemindEvents = new Set(focusedEventIds);
    if (newRemindEvents.has(eventId)) {
      newRemindEvents.delete(eventId);
    } else {
      newRemindEvents.add(eventId);
    }
    setFocusedEventIds(newRemindEvents);
    setEventReminder(eventId, true);
  };
  
  // Filter data based on search term
  const filteredInfluencers = influencers.filter(
    inf => 
      inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inf.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredSources = sources.filter(
    source => 
      source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      source.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredEvents = events.filter(
    event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTweets = tweets.filter(
    tweet =>
      tweet.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tweet.author.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Helper function to format price data
  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(price);
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-right">מקורות מידע</h1>
      
      <div className="flex flex-col-reverse md:flex-row gap-4 mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="w-full">
            <TabsTrigger value="influencers" className="flex-1">משפיענים</TabsTrigger>
            <TabsTrigger value="sources" className="flex-1">מקורות</TabsTrigger>
            <TabsTrigger value="events" className="flex-1">אירועים</TabsTrigger>
            <TabsTrigger value="market-data" className="flex-1">נתוני שוק</TabsTrigger>
            <TabsTrigger value="tweets" className="flex-1">ציוצים</TabsTrigger>
          </TabsList>
          
          <TabsContent value="influencers">
            <InfluencersTab
              influencers={filteredInfluencers}
              focusedInfluencerIds={focusedInfluencerIds}
              onFocus={handleFollowInfluencer}
            />
          </TabsContent>
          
          <TabsContent value="sources">
            <SourcesTab
              sources={filteredSources}
              focusedSourceIds={focusedSourceIds}
              onFocus={handleSourceFocus}
            />
          </TabsContent>
          
          <TabsContent value="events">
            <EventsTab
              events={filteredEvents}
              focusedEventIds={focusedEventIds}
              onFocus={handleEventReminder}
            />
          </TabsContent>

          <TabsContent value="market-data">
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex justify-between items-center">
                  <button 
                    onClick={refreshCoinGeckoData} 
                    className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                  >
                    רענן נתונים
                  </button>
                  <span>מחירי קריפטו בזמן אמת</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingCoinGecko ? (
                  <div className="text-center p-4">טוען נתונים...</div>
                ) : coinGeckoError ? (
                  <div className="text-center p-4 text-red-500 flex items-center justify-center">
                    <AlertCircle className="mr-2" />
                    שגיאה בטעינת נתונים מ-CoinGecko
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {simplePrices && Object.entries(simplePrices).map(([coin, data]) => (
                      <div key={coin} className="border rounded-lg p-4 text-right">
                        <h3 className="font-bold text-lg capitalize">{coin}</h3>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between">
                            <span>{data.usd ? formatPrice(data.usd) : 'N/A'}</span>
                            <span>מחיר (USD):</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{data.ils ? formatPrice(data.ils / 3.7) : 'N/A'}</span>
                            <span>מחיר (ILS):</span>
                          </div>
                          {data.usd_24h_change && (
                            <div className="flex justify-between">
                              <span 
                                className={data.usd_24h_change > 0 ? 'text-green-500' : 'text-red-500'}
                              >
                                {data.usd_24h_change.toFixed(2)}%
                              </span>
                              <span>שינוי (24 שעות):</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tweets">
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex justify-between items-center">
                  <button 
                    onClick={fetchTwitterData} 
                    className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                    disabled={loadingTweets}
                  >
                    רענן ציוצים
                  </button>
                  <span>ציוצים מדמויות מפתח</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingTweets ? (
                  <div className="text-center p-4">טוען ציוצים...</div>
                ) : tweets.length === 0 ? (
                  <div className="text-center p-4">לא נמצאו ציוצים</div>
                ) : (
                  <div className="space-y-4">
                    {filteredTweets.map(tweet => (
                      <div key={tweet.id} className="border rounded-lg p-4 text-right">
                        <div className="flex justify-between items-start">
                          <span className="text-gray-500 text-sm">
                            {new Date(tweet.timestamp).toLocaleString('he-IL')}
                          </span>
                          <div>
                            <span className="font-bold">{tweet.author}</span>
                            <span className="text-gray-500 text-sm mr-1">@{tweet.username}</span>
                          </div>
                        </div>
                        <p className="my-2">{tweet.content}</p>
                        <div className="flex text-sm text-gray-500 space-x-4 space-x-reverse justify-end">
                          <span>{tweet.likes} לייקים</span>
                          <span>{tweet.retweets} ריטוויטים</span>
                          <span 
                            className={
                              tweet.sentiment === 'positive' ? 'text-green-500' : 
                              tweet.sentiment === 'negative' ? 'text-red-500' : 
                              'text-blue-500'
                            }
                          >
                            {tweet.sentiment === 'positive' ? 'חיובי' : 
                             tweet.sentiment === 'negative' ? 'שלילי' : 
                             'ניטרלי'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="חיפוש..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-md"
            dir="rtl"
          />
        </div>
      </div>
    </div>
  );
};

export default InformationSources;
