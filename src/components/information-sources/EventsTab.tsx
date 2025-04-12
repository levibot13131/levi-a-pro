
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MarketEvent } from '@/types/marketInformation';  // שינוי הייבוא למיקום הנכון
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ExternalLink, Bell, BellOff } from 'lucide-react';
import { setEventReminder } from '@/services/marketInformation';

interface EventsTabProps {
  events: MarketEvent[];
  focusedEventIds: Set<string>;
  onFocus: (id: string) => void;
}

const EventsTab: React.FC<EventsTabProps> = ({
  events,
  focusedEventIds,
  onFocus
}) => {
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });
  
  const formatImpact = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return 'השפעה גבוהה';
      case 'medium':
        return 'השפעה בינונית';
      case 'low':
        return 'השפעה נמוכה';
      default:
        return '';
    }
  };
  
  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500';
      default:
        return '';
    }
  };
  
  const handleToggleReminder = (id: string, hasReminder: boolean) => {
    setEventReminder(id, !hasReminder);
    onFocus(id);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedEvents.map(event => (
        <Card key={event.id}>
          <CardContent className="pt-6">
            <h3 className="font-bold text-lg mb-2">{event.title}</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`text-xs px-2 py-0.5 rounded ${getImpactColor(event.impact)}`}>
                {formatImpact(event.impact)}
              </span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded">
                {event.category}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
            
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{event.date}</span>
              <Clock className="h-4 w-4 text-primary ml-2" />
              <span>{event.time}</span>
            </div>
            
            <div className="flex justify-between gap-2">
              <Button
                variant={focusedEventIds.has(event.id) ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => handleToggleReminder(event.id, event.hasReminder)}
              >
                {event.hasReminder ? (
                  <><BellOff className="h-4 w-4 mr-2" />הסר תזכורת</>
                ) : (
                  <><Bell className="h-4 w-4 mr-2" />הגדר תזכורת</>
                )}
              </Button>
              
              {event.link && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(event.link, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  פרטים נוספים
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {events.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">לא נמצאו אירועים התואמים את החיפוש</p>
        </div>
      )}
    </div>
  );
};

export default EventsTab;
