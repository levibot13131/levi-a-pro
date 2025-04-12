
import React from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartLine, TrendingUp, Clock, ArrowUpRightFromCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MarketData = () => {
  const marketStats = [
    { name: 'מדד מחיר ביטקוין', value: '$67,485.23', change: '+2.4%', isPositive: true },
    { name: 'נפח מסחר יומי', value: '$48.2B', change: '-5.1%', isPositive: false },
    { name: 'דומיננטיות BTC', value: '53.7%', change: '+0.5%', isPositive: true },
    { name: 'מדד הפחד והחמדנות', value: '72', change: '+6', isPositive: true }
  ];

  const upcomingEvents = [
    { date: '15 אפר׳', title: 'פגישת הפד', description: 'החלטת ריבית של הבנק המרכזי האמריקאי' },
    { date: '20 אפר׳', title: 'האלבינג ביטקוין', description: 'חצייה של תגמולי הכרייה' },
    { date: '1 מאי', title: 'שחרור נתוני תעסוקה', description: 'פרסום דו״ח התעסוקה החודשי בארה״ב' }
  ];

  return (
    <Container className="py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-right">נתוני שוק</h1>
          <p className="text-muted-foreground text-right">מידע על מחירים, מגמות ונתונים כלכליים</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 ml-2" />
            עדכון אחרון: לפני 5 דקות
          </Button>
          <Button variant="default" size="sm">
            <ArrowUpRightFromCircle className="h-4 w-4 ml-2" />
            רענן נתונים
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {marketStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className={`text-sm font-medium ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-right">
              <div className="flex items-center justify-end">
                <span>מגמות מחירים עיקריות</span>
                <ChartLine className="ml-2 h-5 w-5" />
              </div>
            </CardTitle>
            <CardDescription className="text-right">
              השינוי ב-24 השעות האחרונות עבור המטבעות המובילים
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <p className="text-muted-foreground">גרף נתוני מחירים יוצג כאן</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right">
              <div className="flex items-center justify-end">
                <span>אירועים קרובים</span>
                <Clock className="ml-2 h-5 w-5" />
              </div>
            </CardTitle>
            <CardDescription className="text-right">
              אירועים מהותיים שעשויים להשפיע על השוק
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="border-b last:border-0 pb-3 last:pb-0">
                  <div className="flex justify-between items-start">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                      {event.date}
                    </span>
                    <div className="text-right">
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right">
              <div className="flex items-center justify-end">
                <span>נכסים מובילים לפי נפח מסחר</span>
                <TrendingUp className="ml-2 h-5 w-5" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center border rounded-md">
              <p className="text-muted-foreground">טבלת נכסים תוצג כאן</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right">
              <div className="flex items-center justify-end">
                <span>מחקרי שוק ואנליזות</span>
                <ChartLine className="ml-2 h-5 w-5" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex flex-col gap-6 justify-center items-center">
              <p className="text-muted-foreground">ניתן לראות מחקרי שוק ואנליזות נוספות בדפים:</p>
              <div className="flex gap-3">
                <Button asChild>
                  <Link to="/technical-analysis">ניתוח טכני</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/information-sources">מקורות מידע</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default MarketData;
