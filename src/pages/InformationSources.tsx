
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Info } from 'lucide-react';
import SourcesTab from '@/components/information-sources/SourcesTab';
import InfluencersTab from '@/components/information-sources/InfluencersTab';
import EventsTab from '@/components/information-sources/EventsTab';

const InformationSources: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sources');

  return (
    <Container className="py-6">
      <div className="flex items-center gap-2 mb-6">
        <Info className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">מקורות מידע</h1>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="sources">מקורות מידע</TabsTrigger>
          <TabsTrigger value="influencers">משפיענים</TabsTrigger>
          <TabsTrigger value="events">אירועים קרובים</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sources" className="space-y-6">
          <SourcesTab />
        </TabsContent>
        
        <TabsContent value="influencers" className="space-y-6">
          <InfluencersTab />
        </TabsContent>
        
        <TabsContent value="events" className="space-y-6">
          <EventsTab />
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default InformationSources;
