
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MarketEvent } from '@/types/marketInformation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Bell, BellOff, ExternalLink } from 'lucide-react';

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
  const formatDate = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return `${formattedDate} ${timeStr}`;
  };
  
  const getImpactBadge = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">השפעה גבוהה</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">השפעה בינונית</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">השפעה נמוכה</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">השפעה לא ידועה</Badge>;
    }
  };
  
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'כלכלי':
        return <Badge variant="outline" className="border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300">כלכלי</Badge>;
      case 'קריפטו':
        return <Badge variant="outline" className="border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-300">קריפטו</Badge>;
      case 'מניות':
        return <Badge variant="outline" className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-300">מניות</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map(event => (
        <Card key={event.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                {getImpactBadge(event.impact)}
              </div>
              <div className="text-right">
                <h3 className="font-bold text-lg">{event.title}</h3>
                <div className="flex items-center justify-end gap-2 mt-1">
                  {getCategoryBadge(event.category)}
                  <span className="text-xs text-muted-foreground">
                    {event.source}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 text-right">{event.description}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <CalendarIcon className="h-4 w-4 ml-2" />
                <span>{formatDate(event.date, event.time)}</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={event.hasReminder ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => onFocus(event.id)}
                >
                  {event.hasReminder ? (
                    <>
                      <BellOff className="h-4 w-4 ml-2" />
                      בטל תזכורת
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4 ml-2" />
                      הוסף תזכורת
                    </>
                  )}
                </Button>
                
                {event.link && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(event.link, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 ml-2" />
                    פרטים
                  </Button>
                )}
              </div>
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
