
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  getInformationSources, 
  getMarketInfluencers, 
  getUpcomingMarketEvents,
  toggleSourceFocus,
  toggleInfluencerFollow,
  setEventReminder,
  FinancialDataSource,
  MarketInfluencer,
  MarketEvent
} from '@/services/marketInformationService';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Newspaper, Users } from 'lucide-react';

// Import our new components
import SearchBar from '@/components/information-sources/SearchBar';
import SourcesTab from '@/components/information-sources/SourcesTab';
import InfluencersTab from '@/components/information-sources/InfluencersTab';
import EventsTab from '@/components/information-sources/EventsTab';

const InformationSources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceCategory, setSourceCategory] = useState<string>('all');
  const [influencerFilter, setInfluencerFilter] = useState<string>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');
  
  // Fetch data with proper type annotations
  const { data: sources, isLoading: sourcesLoading, refetch: refetchSources } = useQuery<FinancialDataSource[]>({
    queryKey: ['informationSources'],
    queryFn: getInformationSources,
  });
  
  const { data: influencers, isLoading: influencersLoading, refetch: refetchInfluencers } = useQuery<MarketInfluencer[]>({
    queryKey: ['marketInfluencers'],
    queryFn: getMarketInfluencers,
  });
  
  const { data: events, isLoading: eventsLoading, refetch: refetchEvents } = useQuery<MarketEvent[]>({
    queryKey: ['marketEvents'],
    queryFn: () => getUpcomingMarketEvents(90),
  });
  
  // Filter functions with proper type checks
  const filteredSources = sources ? sources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        source.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = sourceCategory === 'all' || source.category === sourceCategory;
    return matchesSearch && matchesCategory;
  }) : [];
  
  const filteredInfluencers = influencers ? influencers.filter(influencer => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        influencer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = influencerFilter === 'all' || 
                        (influencerFilter === 'following' && influencer.followStatus === 'following') ||
                        (influencerFilter === 'specialty' && influencer.specialty.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesSearch && matchesFilter;
  }) : [];
  
  const filteredEvents = events ? events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = eventFilter === 'all' || 
                        (eventFilter === 'reminder' && event.reminder) ||
                        (eventFilter === 'critical' && event.importance === 'critical');
    return matchesSearch && matchesFilter;
  }) : [];
  
  // Helper functions
  const handleToggleSource = async (sourceId: string, focused: boolean) => {
    await toggleSourceFocus(sourceId, focused);
    refetchSources();
  };
  
  const handleToggleInfluencer = async (influencerId: string, following: boolean) => {
    await toggleInfluencerFollow(influencerId, following);
    refetchInfluencers();
  };
  
  const handleToggleEventReminder = async (eventId: string, reminder: boolean) => {
    await setEventReminder(eventId, reminder);
    refetchEvents();
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('he-IL', options);
  };
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-right">מקורות מידע וניטור שוק</h1>
      
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <Tabs defaultValue="sources" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 md:w-[600px] mx-auto">
          <TabsTrigger value="sources" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            מקורות מידע
          </TabsTrigger>
          <TabsTrigger value="influencers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            דמויות מפתח
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            אירועי שוק
          </TabsTrigger>
        </TabsList>
        
        {/* Sources Tab */}
        <TabsContent value="sources">
          <SourcesTab 
            sources={filteredSources}
            sourceCategory={sourceCategory}
            setSourceCategory={setSourceCategory}
            handleToggleSource={handleToggleSource}
            isLoading={sourcesLoading}
          />
        </TabsContent>
        
        {/* Influencers Tab */}
        <TabsContent value="influencers">
          <InfluencersTab 
            influencers={filteredInfluencers}
            influencerFilter={influencerFilter}
            setInfluencerFilter={setInfluencerFilter}
            handleToggleInfluencer={handleToggleInfluencer}
            isLoading={influencersLoading}
          />
        </TabsContent>
        
        {/* Events Tab */}
        <TabsContent value="events">
          <EventsTab 
            events={filteredEvents}
            eventFilter={eventFilter}
            setEventFilter={setEventFilter}
            handleToggleEventReminder={handleToggleEventReminder}
            formatDate={formatDate}
            isLoading={eventsLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InformationSources;
