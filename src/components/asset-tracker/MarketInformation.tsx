
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Newspaper, Users, Calendar } from 'lucide-react';
import { Asset } from '@/types/asset';
import { useMarketEvents } from './market-information/useMarketEvents';
import MarketInformationHeader from './market-information/MarketInformationHeader';
import EventsTab from './market-information/EventsTab';
import PlaceholderTab from './market-information/PlaceholderTab';

interface MarketInformationProps {
  selectedAsset?: Asset | null;
}

const MarketInformation: React.FC<MarketInformationProps> = ({ selectedAsset }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('30');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  
  const {
    events,
    eventsLoading,
    handleSetReminder,
    handleRefresh
  } = useMarketEvents(selectedTimeRange, autoRefresh);

  return (
    <Card>
      <CardHeader>
        <MarketInformationHeader 
          selectedTimeRange={selectedTimeRange}
          setSelectedTimeRange={setSelectedTimeRange}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
          handleRefresh={handleRefresh}
        />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="events">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 ml-2" />
              אירועים
            </TabsTrigger>
            <TabsTrigger value="influencers">
              <Users className="h-4 w-4 ml-2" />
              משפיענים
            </TabsTrigger>
            <TabsTrigger value="news">
              <Newspaper className="h-4 w-4 ml-2" />
              חדשות
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="text-right">
            <EventsTab 
              events={events}
              eventsLoading={eventsLoading}
              handleSetReminder={handleSetReminder}
              handleRefresh={handleRefresh}
            />
          </TabsContent>
          
          <TabsContent value="influencers">
            <PlaceholderTab 
              icon={Users}
              text="עקוב אחרי משפיענים מובילים בשוק"
              buttonText="הצג משפיענים"
            />
          </TabsContent>
          
          <TabsContent value="news">
            <PlaceholderTab 
              icon={Newspaper}
              text="עקוב אחרי חדשות שוק בזמן אמת"
              buttonText="הצג חדשות"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketInformation;
