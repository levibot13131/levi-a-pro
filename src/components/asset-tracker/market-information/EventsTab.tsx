
import React from 'react';
import { MarketEvent } from '@/types/marketInformation';
import { Badge } from '@/components/ui/badge';
import EventsList from './EventsList';

interface EventsTabProps {
  events: MarketEvent[] | undefined;
  eventsLoading: boolean;
  handleSetReminder: (eventId: string, reminder: boolean) => void;
  handleRefresh: () => void;
}

const EventsTab: React.FC<EventsTabProps> = ({
  events,
  eventsLoading,
  handleSetReminder,
  handleRefresh
}) => {
  const renderEventImportance = (importance: string) => {
    switch(importance) {
      case 'critical':
      case 'high':
        return <Badge className="bg-red-500">חשיבות גבוהה</Badge>;
      case 'medium':
        return <Badge className="bg-orange-500">חשיבות בינונית</Badge>;
      default:
        return <Badge variant="outline">חשיבות נמוכה</Badge>;
    }
  };

  const formatEventDate = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(eventDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'היום';
    } else if (diffDays === 1) {
      return 'מחר';
    } else {
      return `בעוד ${diffDays} ימים`;
    }
  };

  return (
    <EventsList 
      events={events}
      eventsLoading={eventsLoading}
      handleSetReminder={handleSetReminder}
      handleRefresh={handleRefresh}
      formatEventDate={formatEventDate}
      renderEventImportance={renderEventImportance}
    />
  );
};

export default EventsTab;
