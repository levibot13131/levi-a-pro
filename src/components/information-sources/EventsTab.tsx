
import React from 'react';
import { MarketEvent } from '@/pages/InformationSources';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Bell, ExternalLink, TrendingUp, TrendingDown, LineChart } from 'lucide-react';

interface EventsTabProps {
  events: MarketEvent[];
  setReminders: Set<string>;
  onSetReminder: (id: string) => void;
}

const EventsTab: React.FC<EventsTabProps> = ({
  events,
  setReminders,
  onSetReminder
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map(event => (
        <Card key={event.id}>
          <CardContent className="pt-6">
            <div className="flex items-start mb-4">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                {event.expectedImpact === 'positive' ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : event.expectedImpact === 'negative' ? (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                ) : (
                  <LineChart className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="text-right flex-1">
                <h3 className="font-bold text-lg">{event.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {event.date} {event.time && `בשעה ${event.time}`}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
            
            <div className="flex justify-between items-center mb-4">
              <Badge variant={
                event.expectedImpact === 'positive' 
                  ? 'outline' 
                  : event.expectedImpact === 'negative'
                  ? 'destructive'
                  : 'secondary'
              }>
                {event.expectedImpact === 'positive' 
                  ? 'השפעה חיובית' 
                  : event.expectedImpact === 'negative'
                  ? 'השפעה שלילית'
                  : 'השפעה ניטרלית'}
              </Badge>
              
              <div className="text-right">
                <span className="text-xs text-muted-foreground">נכסים קשורים:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {event.relatedAssets.map(asset => (
                    <span key={asset} className="text-xs bg-muted px-2 py-0.5 rounded">
                      {asset}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between gap-2">
              <Button
                variant={setReminders.has(event.id) ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => onSetReminder(event.id)}
              >
                <Bell className="h-4 w-4 mr-2" />
                {setReminders.has(event.id) ? 'תזכורת פעילה' : 'הגדר תזכורת'}
              </Button>
              
              {event.link && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(event.link, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  קישור לאירוע
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {events.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">לא נמצאו אירועים קרובים התואמים את החיפוש</p>
        </div>
      )}
    </div>
  );
};

export default EventsTab;
