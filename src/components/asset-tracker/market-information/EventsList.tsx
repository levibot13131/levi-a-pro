
import React from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { MarketEvent } from '@/types/marketInformation';

interface EventsListProps {
  events: MarketEvent[] | undefined;
  eventsLoading: boolean;
  handleSetReminder: (eventId: string, reminder: boolean) => void;
  handleRefresh: () => void;
  formatEventDate: (dateString: string) => string;
  renderEventImportance: (importance: string) => React.ReactNode;
}

const EventsList: React.FC<EventsListProps> = ({
  events,
  eventsLoading,
  handleSetReminder,
  handleRefresh,
  formatEventDate,
  renderEventImportance
}) => {
  if (eventsLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-6">
        <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p>אין אירועים צפויים בטווח הזמן שנבחר</p>
        <Button onClick={handleRefresh} variant="outline" className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          רענן נתונים
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[300px] overflow-y-auto">
      {events.map((event: MarketEvent) => (
        <div key={event.id} className="border rounded-md p-3">
          <div className="flex justify-between items-start mb-2">
            <div>{renderEventImportance(event.importance)}</div>
            <h3 className="font-medium">{event.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
          <div className="flex justify-between items-center text-sm">
            <Button 
              variant={event.reminder ? "outline" : "default"} 
              size="sm"
              onClick={() => handleSetReminder(event.id, !event.reminder)}
            >
              {event.reminder ? 'בטל תזכורת' : 'הגדר תזכורת'}
            </Button>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 ml-1" />
              {formatEventDate(event.date)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsList;
