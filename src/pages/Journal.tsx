
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Activity } from 'lucide-react';

const Journal = () => {
  const [activeTab, setActiveTab] = useState('entries');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">יומן מסחר</h1>
        
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          רשומה חדשה
        </Button>
      </div>
      
      <Tabs defaultValue="entries" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="entries">רשומות יומן</TabsTrigger>
          <TabsTrigger value="stats">סטטיסטיקות</TabsTrigger>
          <TabsTrigger value="insights">תובנות</TabsTrigger>
        </TabsList>
        
        <TabsContent value="entries" className="mt-6">
          {activeTab === 'entries' && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>רשומות יומן מסחר אחרונות</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted p-6 text-center rounded-md">
                      <FileText className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">אין רשומות יומן זמינות</h3>
                      <p className="text-muted-foreground mb-4">
                        תיעוד העסקאות שלך ביומן יעזור לך לשפר את המסחר שלך עם הזמן.
                      </p>
                      <Button variant="outline">הוסף רשומה ראשונה</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="stats" className="mt-6">
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>סטטיסטיקות מסחר</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-6 text-center rounded-md">
                    <Activity className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">אין נתונים זמינים</h3>
                    <p className="text-muted-foreground">
                      הסטטיסטיקות יופיעו כאשר תתחיל לתעד עסקאות ביומן שלך.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="insights" className="mt-6">
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>תובנות מסחר</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-6 text-center rounded-md">
                    <h3 className="text-lg font-medium mb-2">תובנות אינן זמינות עדיין</h3>
                    <p className="text-muted-foreground">
                      התובנות יהיו זמינות כאשר יהיו מספיק רשומות יומן לניתוח.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Journal;
