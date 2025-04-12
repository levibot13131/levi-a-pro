
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Clock, MapPin, Calendar, TrendingUp, Link } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const UpcomingEvents = () => {
  // Mock data for upcoming events
  const events = [
    {
      id: '1',
      title: 'כנס בלוקצ׳יין ישראל 2025',
      description: 'הכנס השנתי הגדול של תעשיית הבלוקצ׳יין בישראל',
      date: '2025-05-15',
      time: '09:00-18:00',
      location: 'אקספו תל אביב',
      type: 'conference',
      url: '#',
      tags: ['בלוקצ׳יין', 'כנס', 'ישראל']
    },
    {
      id: '2',
      title: 'עדכון רשת אתריום - Shanghai',
      description: 'שדרוג משמעותי לרשת אתריום שיכלול שיפורים בביצועים ופיצ׳רים חדשים',
      date: '2025-05-22',
      time: 'כל היום',
      location: 'מקוון',
      type: 'network',
      url: '#',
      tags: ['אתריום', 'עדכון רשת', 'Shanghai']
    },
    {
      id: '3',
      title: 'הנפקת Token חדש - DeFi Protocol',
      description: 'השקת טוקן חדש של פרוטוקול DeFi מוביל',
      date: '2025-05-25',
      time: '20:00',
      location: 'מקוון',
      type: 'launch',
      url: '#',
      tags: ['DeFi', 'Token', 'השקה']
    },
    {
      id: '4',
      title: 'מיטאפ קריפטו תל אביב',
      description: 'מפגש חודשי של קהילת הקריפטו בתל אביב',
      date: '2025-06-05',
      time: '18:30-21:00',
      location: 'WeWork שרונה, תל אביב',
      type: 'meetup',
      url: '#',
      tags: ['מיטאפ', 'נטוורקינג', 'תל אביב']
    },
    {
      id: '5',
      title: 'האקאתון Web3 ישראל',
      description: 'אירוע פיתוח של 48 שעות לבניית אפליקציות על גבי טכנולוגיות Web3',
      date: '2025-06-10',
      time: 'יומיים',
      location: 'מתחם Startau, אוניברסיטת תל אביב',
      type: 'hackathon',
      url: '#',
      tags: ['האקאתון', 'פיתוח', 'Web3']
    }
  ];
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  const getEventTypeStyles = (type: string) => {
    switch (type) {
      case 'conference':
        return { icon: <Calendar className="h-5 w-5 text-purple-500" />, color: 'bg-purple-100 text-purple-800' };
      case 'network':
        return { icon: <TrendingUp className="h-5 w-5 text-blue-500" />, color: 'bg-blue-100 text-blue-800' };
      case 'launch':
        return { icon: <Link className="h-5 w-5 text-green-500" />, color: 'bg-green-100 text-green-800' };
      case 'meetup':
        return { icon: <CalendarDays className="h-5 w-5 text-orange-500" />, color: 'bg-orange-100 text-orange-800' };
      case 'hackathon':
        return { icon: <Calendar className="h-5 w-5 text-red-500" />, color: 'bg-red-100 text-red-800' };
      default:
        return { icon: <Calendar className="h-5 w-5 text-gray-500" />, color: 'bg-gray-100 text-gray-800' };
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">כל האירועים</TabsTrigger>
          <TabsTrigger value="conferences">כנסים</TabsTrigger>
          <TabsTrigger value="launches">השקות</TabsTrigger>
          <TabsTrigger value="meetups">מיטאפים</TabsTrigger>
          <TabsTrigger value="network">עדכוני רשת</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event) => {
              const { icon, color } = getEventTypeStyles(event.type);
              
              return (
                <Card key={event.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="h-10 w-10 flex items-center justify-center bg-primary/10 rounded-full">
                        {icon}
                      </div>
                      <div className="text-right">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="text-sm">{formatDate(event.date)}</div>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <div className="text-sm">{event.time}</div>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <div className="text-sm">{event.location}</div>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-2 justify-end">
                        <Badge className={color}>{event.type}</Badge>
                        {event.tags.map((tag, i) => (
                          <Badge key={i} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        {/* Additional tab content for filtered views */}
        <TabsContent value="conferences" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.filter(e => e.type === 'conference').map((event) => {
              const { icon, color } = getEventTypeStyles(event.type);
              
              return (
                <Card key={event.id}>
                  {/* Same card layout as above */}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="h-10 w-10 flex items-center justify-center bg-primary/10 rounded-full">
                        {icon}
                      </div>
                      <div className="text-right">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="text-sm">{formatDate(event.date)}</div>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <div className="text-sm">{event.time}</div>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <div className="text-sm">{event.location}</div>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-2 justify-end">
                        <Badge className={color}>{event.type}</Badge>
                        {event.tags.map((tag, i) => (
                          <Badge key={i} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        {/* Similar tab content for other categories */}
        <TabsContent value="launches" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.filter(e => e.type === 'launch').map((event) => {
              const { icon, color } = getEventTypeStyles(event.type);
              
              return (
                <Card key={event.id}>
                  {/* Similar card layout */}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="h-10 w-10 flex items-center justify-center bg-primary/10 rounded-full">
                        {icon}
                      </div>
                      <div className="text-right">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="text-sm">{formatDate(event.date)}</div>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <div className="text-sm">{event.time}</div>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <div className="text-sm">{event.location}</div>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-2 justify-end">
                        <Badge className={color}>{event.type}</Badge>
                        {event.tags.map((tag, i) => (
                          <Badge key={i} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UpcomingEvents;
