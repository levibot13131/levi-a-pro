
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUpcomingEvents } from '@/services/marketInformation/eventsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Newspaper, Users, Calendar, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { MarketEvent } from '@/types/marketData';
import { Asset } from '@/types/asset';

interface MarketInformationProps {
  selectedAsset?: Asset | null;
}

const MarketInformation: React.FC<MarketInformationProps> = ({ selectedAsset }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('30');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Fetch upcoming market events
  const { data: events, isLoading: eventsLoading, refetch } = useQuery({
    queryKey: ['marketEvents', selectedTimeRange, selectedAsset?.id],
    queryFn: async () => {
      const result = await getUpcomingEvents(parseInt(selectedTimeRange));
      return result as MarketEvent[];
    },
    refetchInterval: autoRefresh ? 60000 : false, // Auto refresh every minute if enabled
  });

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;
    
    const refreshInterval = setInterval(() => {
      refetch();
    }, 60000); // Refresh every minute
    
    return () => clearInterval(refreshInterval);
  }, [autoRefresh, refetch]);

  const handleSetReminder = (eventId: string, reminder: boolean) => {
    // In a real app, we would call the setEventReminder service
    toast.success(`${reminder ? 'הגדרת' : 'ביטלת'} תזכורת לאירוע`);
    
    // Update the local state to reflect the change
    if (events) {
      const updatedEvents = events.map(event => 
        event.id === eventId ? { ...event, reminder } : event
      );
      // In a real implementation, this would update the server and then the query cache
    }
  };

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

  const handleRefresh = () => {
    refetch();
    toast.success('נתונים התעדכנו בהצלחה');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh}
              className="h-8 w-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <select 
              className="bg-transparent text-sm font-normal border border-gray-300 rounded px-2 py-1 ml-2"
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
            >
              <option value="7">7 ימים</option>
              <option value="30">30 ימים</option>
              <option value="90">90 ימים</option>
            </select>
            <div className="flex items-center">
              <label htmlFor="auto-refresh" className="mr-2 text-sm">
                עדכון אוטומטי
              </label>
              <input
                type="checkbox"
                id="auto-refresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
            </div>
          </div>
          <div>מידע פונדמנטלי</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="events">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 ml-2" />
              אירועים
            </TabsTrigger>
            <TabsTrigger value="influencers">
              <Users className="h-4 w-4 ml-2" />
              משפיענים
            </TabsTrigger>
            <TabsTrigger value="news">
              <Newspaper className="h-4 w-4 ml-2" />
              חדשות
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="text-right">
            {eventsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : events && events.length > 0 ? (
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
            ) : (
              <div className="text-center py-6">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p>אין אירועים צפויים בטווח הזמן שנבחר</p>
                <Button onClick={handleRefresh} variant="outline" className="mt-4">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  רענן נתונים
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="influencers">
            <div className="text-center py-6">
              <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p>עקוב אחרי משפיענים מובילים בשוק</p>
              <Button className="mt-2" variant="outline">
                הצג משפיענים
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="news">
            <div className="text-center py-6">
              <Newspaper className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p>עקוב אחרי חדשות שוק בזמן אמת</p>
              <Button className="mt-2" variant="outline">
                הצג חדשות
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketInformation;
