import React from 'react';
import { MarketEvent } from '@/types/marketInformation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, AlertCircle } from 'lucide-react';

export interface EventsTabProps {
  events: MarketEvent[];
  setReminders: Set<string>;
  onSetReminder: (eventId: string) => void;
}

const EventsTab: React.FC<EventsTabProps> = ({ 
  events, 
  setReminders, 
  onSetReminder 
}) => {
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

  const renderEventImportance = (importance: string) => {
    switch(importance) {
      case 'critical':
        return <Badge className="bg-red-500">חשיבות קריטית</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">חשיבות גבוהה</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">חשיבות בינונית</Badge>;
      default:
        return <Badge>חשיבות נמוכה</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {events.length > 0 ? (
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>{renderEventImportance(event.importance)}</div>
                  <h3 className="font-medium">{event.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <Button 
                    variant={setReminders.has(event.id) ? "outline" : "default"} 
                    size="sm"
                    onClick={() => onSetReminder(event.id)}
                  >
                    {setReminders.has(event.id) ? 'בטל תזכורת' : 'הגדר תזכורת'}
                  </Button>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 ml-1" />
                    {formatEventDate(event.date)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p>אין אירועים צפויים בטווח הזמן שנבחר</p>
        </div>
      )}
    </div>
  );
};

export default EventsTab;
