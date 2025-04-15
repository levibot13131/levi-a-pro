
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink, MapPin, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EventsTabProps {
  searchQuery: string;
}

const EventsTab: React.FC<EventsTabProps> = ({ searchQuery }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const upcomingEvents = [
    {
      name: 'כנס בלוקצ׳יין תל אביב',
      date: '2025-05-20',
      endDate: '2025-05-21',
      location: 'תל אביב, ישראל',
      description: 'כנס הבלוקצ׳יין הגדול בישראל עם מרצים בינלאומיים ומקומיים',
      category: 'כנס',
      url: 'https://example.com/event1',
      projects: ['Ethereum', 'Binance'],
    },
    {
      name: 'Bitcoin Halving',
      date: '2025-05-01',
      endDate: '2025-05-01',
      location: 'אירוע גלובלי',
      description: 'הפחתת התגמול לכורים ברשת הביטקוין ב-50%, אירוע המתרחש כל 4 שנים',
      category: 'אירוע רשת',
      url: 'https://example.com/event2',
      projects: ['Bitcoin'],
    },
    {
      name: 'Token2049 Dubai',
      date: '2025-04-30',
      endDate: '2025-05-02',
      location: 'דובאי, איחוד האמירויות',
      description: 'כנס קריפטו וטוקנים בינלאומי עם מאות מציגים ואלפי משתתפים',
      category: 'כנס',
      url: 'https://example.com/event3',
      projects: ['Multiple'],
    },
    {
      name: 'Ethereum DevCon',
      date: '2025-07-15',
      endDate: '2025-07-18',
      location: 'ברלין, גרמניה',
      description: 'כנס המפתחים השנתי של קהילת אית׳ריום',
      category: 'כנס מפתחים',
      url: 'https://example.com/event4',
      projects: ['Ethereum'],
    },
    {
      name: 'Solana Breakpoint',
      date: '2025-06-10',
      endDate: '2025-06-12',
      location: 'סיאול, דרום קוריאה',
      description: 'כנס סולנה השנתי לחדשנות, פיתוח ומגמות עתידיות',
      category: 'כנס',
      url: 'https://example.com/event5',
      projects: ['Solana'],
    },
  ];

  const pastEvents = [
    {
      name: 'מיטאפ NFT ישראל',
      date: '2025-03-15',
      endDate: '2025-03-15',
      location: 'תל אביב, ישראל',
      description: 'מפגש קהילתי בנושא NFT, אמנות דיגיטלית וארנקים דיגיטליים',
      category: 'מיטאפ',
      url: 'https://example.com/past1',
      projects: ['NFTs'],
    },
    {
      name: 'Consensus 2024',
      date: '2024-12-10',
      endDate: '2024-12-12',
      location: 'ניו יורק, ארה״ב',
      description: 'כנס השנתי של CoinDesk עם אלפי משתתפים ומאות חברות',
      category: 'כנס',
      url: 'https://example.com/past2',
      projects: ['Multiple'],
    },
    {
      name: 'Cardano Summit',
      date: '2024-11-20',
      endDate: '2024-11-22',
      location: 'מיאמי, ארה״ב',
      description: 'הכנס השנתי של קהילת קרדנו',
      category: 'כנס',
      url: 'https://example.com/past3',
      projects: ['Cardano'],
    },
  ];

  const filterEvents = (events, query) => {
    if (!query) return events;
    return events.filter(event => 
      event.name.toLowerCase().includes(query.toLowerCase()) ||
      event.description.includes(query) ||
      event.location.includes(query) ||
      event.category.includes(query) ||
      event.projects.some(project => project.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const filteredUpcoming = filterEvents(upcomingEvents, searchQuery);
  const filteredPast = filterEvents(pastEvents, searchQuery);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const EventCard = ({ event }) => (
    <div className="p-4 border rounded-lg">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-lg">{event.name}</h3>
            <Badge>{event.category}</Badge>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <Calendar className="h-4 w-4 ml-1" />
            {formatDate(event.date)}
            {event.endDate !== event.date && ` - ${formatDate(event.endDate)}`}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 ml-1" />
            {event.location}
          </div>
          
          <p className="text-sm mb-3">{event.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {event.projects.map((project, idx) => (
              <Badge key={idx} variant="outline">{project}</Badge>
            ))}
          </div>
        </div>
        
        <Button variant="outline" size="sm" asChild className="mt-2 md:mt-0">
          <a href={event.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 ml-2" />
            פרטים נוספים
          </a>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            אירועים קרובים
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            אירועים קודמים
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {filteredUpcoming.length > 0 ? (
            filteredUpcoming.map((event, index) => (
              <EventCard key={index} event={event} />
            ))
          ) : (
            <div className="text-center py-8">
              <p>לא נמצאו אירועים עתידיים עבור "{searchQuery}"</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {filteredPast.length > 0 ? (
            filteredPast.map((event, index) => (
              <EventCard key={index} event={event} />
            ))
          ) : (
            <div className="text-center py-8">
              <p>לא נמצאו אירועים קודמים עבור "{searchQuery}"</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventsTab;
