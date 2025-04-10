
import React from 'react';
import { MarketEvent } from '@/types/marketInformation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Calendar, Database, Globe, TrendingUp, Users } from 'lucide-react';

interface EventsTabProps {
  events: MarketEvent[] | undefined;
  eventFilter: string;
  setEventFilter: (value: string) => void;
  handleToggleEventReminder: (eventId: string, reminder: boolean) => void;
  formatDate: (dateString: string) => string;
  isLoading: boolean;
}

const EventsTab: React.FC<EventsTabProps> = ({
  events,
  eventFilter,
  setEventFilter,
  handleToggleEventReminder,
  formatDate,
  isLoading
}) => {
  // Event importance badges
  const getImportanceBadge = (importance: MarketEvent['importance']) => {
    switch(importance) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">קריטי</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">גבוה</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">בינוני</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800">נמוך</Badge>;
      default:
        return null;
    }
  };
  
  // Event category icon
  const getEventCategoryIcon = (category: MarketEvent['category']) => {
    switch(category) {
      case 'economic':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'earnings':
        return <Database className="h-5 w-5 text-blue-600" />;
      case 'political':
        return <Users className="h-5 w-5 text-purple-600" />;
      case 'regulatory':
        return <Globe className="h-5 w-5 text-orange-600" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Select value={eventFilter} onValueChange={setEventFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="כל האירועים" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל האירועים</SelectItem>
            <SelectItem value="reminder">עם תזכורות בלבד</SelectItem>
            <SelectItem value="critical">קריטיים בלבד</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : events && events.length > 0 ? (
        <div className="space-y-4">
          {events.map(event => (
            <Card key={event.id} className={event.reminder ? "border-primary" : ""}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="text-right">
                  <div className="flex gap-2 mb-1 items-center justify-end">
                    {getImportanceBadge(event.importance)}
                    <Badge variant="outline">
                      {event.category === 'economic' ? 'כלכלי' : 
                       event.category === 'earnings' ? 'דוחות כספיים' :
                       event.category === 'political' ? 'פוליטי' :
                       event.category === 'regulatory' ? 'רגולציה' : 'אחר'}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl flex items-center gap-2 justify-end">
                    {event.title}
                    {getEventCategoryIcon(event.category)}
                  </CardTitle>
                  <CardDescription className="mt-1 text-right">
                    {formatDate(event.date)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {event.reminder && <Bell className="h-5 w-5 text-primary" />}
                </div>
              </CardHeader>
              <CardContent className="text-right">
                <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                
                {event.relatedAssets && event.relatedAssets.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">נכסים קשורים:</p>
                    <div className="flex flex-wrap gap-2">
                      {event.relatedAssets.map((asset, idx) => (
                        <Badge key={idx} variant="secondary">{asset}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {event.expectedImpact && (
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">השפעה צפויה:</p>
                    <Badge className={
                      event.expectedImpact === 'positive' ? "bg-green-100 text-green-800" :
                      event.expectedImpact === 'negative' ? "bg-red-100 text-red-800" :
                      event.expectedImpact === 'variable' ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                    }>
                      {event.expectedImpact === 'positive' ? 'חיובית' :
                       event.expectedImpact === 'negative' ? 'שלילית' :
                       event.expectedImpact === 'variable' ? 'משתנה' : 'ניטרלית'}
                    </Badge>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">מקור:</span>
                  <span className="text-sm">{event.source}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{event.reminder ? "תזכורת פעילה" : "הוסף תזכורת"}</span>
                  <Switch 
                    checked={event.reminder} 
                    onCheckedChange={(checked) => handleToggleEventReminder(event.id, checked)}
                  />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-1">לא נמצאו אירועי שוק</p>
            <p className="text-muted-foreground">נסה לשנות את החיפוש או הפילטר שלך</p>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default EventsTab;
