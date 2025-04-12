
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getSources, 
  getInfluencers, 
  toggleSourceFavorite,
  toggleInfluencerFollow,
  getUpcomingMarketEvents,
  setEventReminder
} from '@/services/marketInformation/index';
import { MarketInfluencer, FinancialDataSource, MarketEvent } from '@/types/marketInformation';
import InfluencersTab from '@/components/information-sources/InfluencersTab';
import SourcesTab from '@/components/information-sources/SourcesTab';
import EventsTab from '@/components/information-sources/EventsTab';

const InformationSources = () => {
  const [activeTab, setActiveTab] = useState('influencers');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sources state
  const [sources, setSources] = useState<FinancialDataSource[]>([]);
  const [focusedSourceIds, setFocusedSourceIds] = useState<Set<string>>(new Set());
  
  // Influencers state
  const [influencers, setInfluencers] = useState<MarketInfluencer[]>([]);
  const [followedInfluencerIds, setFollowedInfluencerIds] = useState<Set<string>>(new Set());
  
  // Events state
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [setReminders, setRemindEvents] = useState<Set<string>>(new Set());
  
  // Fetch initial data
  React.useEffect(() => {
    // Adapt the returned influencers to include required properties
    const fetchedInfluencers = getInfluencers().map(inf => ({
      ...inf, 
      bio: inf.description || 'No bio available',
      expertise: inf.assetsDiscussed || ['cryptocurrency'],
      username: inf.name.toLowerCase().replace(/\s/g, '') // Generate a username if missing
    }));
    
    // Adapt the returned sources to include required properties
    const fetchedSources = getSources().map(source => ({
      ...source,
      category: source.type,
      rating: source.reliability || 3,
      platform: source.type
    }));
    
    // Complete the market events with required fields
    const rawEvents = getUpcomingMarketEvents();
    const completedEvents = rawEvents.map(event => ({
      ...event,
      relatedAssets: event.relatedAssets || [],
      expectedImpact: event.expectedImpact || 'neutral',
      source: event.source || 'system',
      reminder: false,
      type: event.type || 'economic'
    }));
    
    setInfluencers(fetchedInfluencers as MarketInfluencer[]);
    setSources(fetchedSources as FinancialDataSource[]);
    setEvents(completedEvents as MarketEvent[]);
  }, []);
  
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
    const newFollowedInfluencers = new Set(followedInfluencerIds);
    if (newFollowedInfluencers.has(influencerId)) {
      newFollowedInfluencers.delete(influencerId);
    } else {
      newFollowedInfluencers.add(influencerId);
    }
    setFollowedInfluencerIds(newFollowedInfluencers);
    toggleInfluencerFollow(influencerId);
  };
  
  // Handle event reminder
  const handleEventReminder = (eventId: string) => {
    const newRemindEvents = new Set(setReminders);
    if (newRemindEvents.has(eventId)) {
      newRemindEvents.delete(eventId);
    } else {
      newRemindEvents.add(eventId);
    }
    setRemindEvents(newRemindEvents);
    setEventReminder(eventId);
  };
  
  // Filter data based on search term
  const filteredInfluencers = influencers.filter(
    inf => 
      inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inf.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredSources = sources.filter(
    source => 
      source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      source.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredEvents = events.filter(
    event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-right">מקורות מידע</h1>
      
      <div className="flex flex-col-reverse md:flex-row gap-4 mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="w-full">
            <TabsTrigger value="influencers" className="flex-1">משפיענים</TabsTrigger>
            <TabsTrigger value="sources" className="flex-1">מקורות</TabsTrigger>
            <TabsTrigger value="events" className="flex-1">אירועים</TabsTrigger>
          </TabsList>
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
      
      <TabsContent value="influencers" className={activeTab === 'influencers' ? 'block' : 'hidden'}>
        <InfluencersTab
          influencers={filteredInfluencers}
          followedInfluencerIds={followedInfluencerIds}
          onFollow={handleFollowInfluencer}
        />
      </TabsContent>
      
      <TabsContent value="sources" className={activeTab === 'sources' ? 'block' : 'hidden'}>
        <SourcesTab
          sources={filteredSources}
          focusedSourceIds={focusedSourceIds}
          onFocus={handleSourceFocus}
        />
      </TabsContent>
      
      <TabsContent value="events" className={activeTab === 'events' ? 'block' : 'hidden'}>
        <EventsTab
          events={filteredEvents}
          setReminders={setReminders}
          onSetReminder={handleEventReminder}
        />
      </TabsContent>
    </div>
  );
};

export default InformationSources;
