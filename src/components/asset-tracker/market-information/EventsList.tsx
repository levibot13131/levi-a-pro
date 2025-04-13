
import React from 'react';
import { MarketEvent } from '@/types/marketInformation';
import { Button } from '@/components/ui/button';
import { CalendarClock, Bell, BellOff, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CalendarClock className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">אין אירועי שוק קרובים</p>
          <p className="text-muted-foreground">נסה להחליף את הפילטרים או להגדיר טווח זמן ארוך יותר</p>
          <Button className="mt-4" variant="outline" onClick={handleRefresh}>
            רענן נתונים
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden border-l-4 hover:bg-accent/10 transition-colors">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSetReminder(event.id, !event.reminder)}
                  title={event.reminder ? "בטל תזכורת" : "הגדר תזכורת"}
                >
                  {event.reminder ? <Bell className="h-4 w-4 text-primary" /> : <BellOff className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(event.link, '_blank')}
                  title="פתח קישור חיצוני"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500">{event.category}</Badge>
                {renderEventImportance(event.importance)}
              </div>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <p className="text-muted-foreground text-sm mb-2">{event.description}</p>
              <div className="mt-3 flex justify-between items-center text-sm">
                <Badge variant="outline">
                  {event.source}
                </Badge>
                <div className="flex items-center">
                  <CalendarClock className="h-4 w-4 ml-1" />
                  <span className="mr-1">{formatEventDate(event.date)}</span>
                  <span className="text-muted-foreground">{event.time}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EventsList;
