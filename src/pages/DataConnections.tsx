
import React from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Globe, Server, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DataConnections = () => {
  return (
    <Container className="py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">חיבורי מידע</h1>
          <p className="text-muted-foreground">חיבור למקורות מידע חיצוניים</p>
        </div>
      </div>
      
      <Tabs defaultValue="apis" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="apis" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            API חיצוניים
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            חיבורי מסד נתונים
          </TabsTrigger>
          <TabsTrigger value="webhook" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="apis">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">חיבורים לממשקי API חיצוניים</CardTitle>
              <CardDescription className="text-right">
                הגדרת חיבורים למקורות מידע חיצוניים
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-right">
                      <h3 className="font-medium">CoinGecko API</h3>
                      <p className="text-sm text-muted-foreground">נתוני מטבעות קריפטו</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Card>
                
                <Card className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-right">
                      <h3 className="font-medium">TradingView API</h3>
                      <p className="text-sm text-muted-foreground">נתוני מסחר וגרפים</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">חיבורי מסדי נתונים</CardTitle>
              <CardDescription className="text-right">
                הגדרת חיבורים למסדי נתונים
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-6 rounded-md text-center">
                <p>אין חיבורי מסדי נתונים מוגדרים כרגע</p>
                <Button className="mt-4">הוסף חיבור חדש</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhook">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">Webhooks</CardTitle>
              <CardDescription className="text-right">
                הגדרת נקודות קצה לקבלת נתונים מסוכנויות
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-6 rounded-md text-center">
                <p>אין Webhooks מוגדרים כרגע</p>
                <Button className="mt-4">הוסף Webhook חדש</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default DataConnections;
