
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { SourcesTab } from '@/components/information-sources/SourcesTab';
import { InfluencersTab } from '@/components/information-sources/InfluencersTab';
import { EventsTab } from '@/components/information-sources/EventsTab';
import { getKeyFigureTweets } from '@/services/twitter/twitterService';

const InformationSources: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('sources');
  const [keyFigureTweets, setKeyFigureTweets] = useState([]);
  
  useEffect(() => {
    const fetchTweets = async () => {
      const tweets = await getKeyFigureTweets();
      setKeyFigureTweets(tweets);
    };
    
    fetchTweets();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Here you would actually perform the search
  };

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">מקורות מידע</h1>
          <p className="text-muted-foreground">
            סקירת מקורות מידע, משפיענים ואירועים מתוכננים בשוק הקריפטו
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <Input
            type="text"
            placeholder="חיפוש מקורות מידע..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-2"
          />
          <Button type="submit">
            <Search className="h-4 w-4 ml-2" />
            חפש
          </Button>
        </form>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="sources">מקורות מידע</TabsTrigger>
          <TabsTrigger value="influencers">משפיענים</TabsTrigger>
          <TabsTrigger value="events">אירועים מתוכננים</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">מקורות מידע מובילים</CardTitle>
            </CardHeader>
            <CardContent>
              <SourcesTab searchQuery={searchQuery} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="influencers">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">משפיענים מובילים</CardTitle>
            </CardHeader>
            <CardContent>
              <InfluencersTab searchQuery={searchQuery} tweets={keyFigureTweets} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">אירועים מתוכננים</CardTitle>
            </CardHeader>
            <CardContent>
              <EventsTab searchQuery={searchQuery} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InformationSources;
