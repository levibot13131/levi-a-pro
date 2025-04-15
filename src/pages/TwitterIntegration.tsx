
import React from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Twitter, MessageCircle, TrendingUp, Users } from 'lucide-react';
import TwitterConnectForm from '@/components/twitter/TwitterConnectForm';
import { isTwitterConnected } from '@/services/twitter/twitterService';

const TwitterIntegration: React.FC = () => {
  const isConnected = isTwitterConnected();
  
  return (
    <Container className="py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">אינטגרציית Twitter</h1>
          <p className="text-muted-foreground">קבל עדכונים וניתוחים מחשבונות מובילים בטוויטר</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Twitter className="h-5 w-5 text-blue-400" />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'מחובר לטוויטר' : 'לא מחובר לטוויטר'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TwitterConnectForm />
        </div>
        
        <div className="md:col-span-2">
          {isConnected ? (
            <Tabs defaultValue="tweets">
              <TabsList className="w-full">
                <TabsTrigger value="tweets" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  ציוצים
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  מגמות
                </TabsTrigger>
                <TabsTrigger value="influencers" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  משפיענים
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tweets" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">ציוצים אחרונים</CardTitle>
                    <CardDescription className="text-right">
                      ציוצים מחשבונות מובילים בתחום הקריפטו
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-6 rounded-md text-center">
                      <p>ציוצים יטענו כאן לאחר הגדרת החשבונות לעקוב אחריהם</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="trends" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">מגמות מובילות</CardTitle>
                    <CardDescription className="text-right">
                      מגמות ונושאים פופולריים בתחום הקריפטו
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-6 rounded-md text-center">
                      <p>מגמות יטענו כאן לאחר חיבור מלא</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="influencers" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">משפיעני קריפטו</CardTitle>
                    <CardDescription className="text-right">
                      חשבונות מובילים לניתוח ועדכונים בתחום הקריפטו
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-6 rounded-md text-center">
                      <p>רשימת משפיענים תופיע כאן לאחר הגדרת החשבונות לעקוב אחריהם</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-right">התחבר לטוויטר תחילה</CardTitle>
                <CardDescription className="text-right">
                  חיבור לטוויטר יאפשר לך לקבל עדכונים וניתוחים מחשבונות מובילים
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-right">
                    התחבר לטוויטר באמצעות הטופס כדי להתחיל לקבל עדכונים וניתוחים בזמן אמת.
                    המערכת תציג כאן ציוצים ממקורות מובילים בתחום הקריפטו.
                  </AlertDescription>
                </Alert>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-md text-center">
                    <MessageCircle className="h-10 w-10 mx-auto mb-2 text-blue-500" />
                    <h3 className="font-medium">ציוצים אחרונים</h3>
                    <p className="text-sm text-muted-foreground">
                      קבל עדכונים מהציוצים האחרונים מחשבונות שאתה עוקב אחריהם
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md text-center">
                    <TrendingUp className="h-10 w-10 mx-auto mb-2 text-blue-500" />
                    <h3 className="font-medium">מגמות מובילות</h3>
                    <p className="text-sm text-muted-foreground">
                      גלה מגמות ונושאים פופולריים בתחום הקריפטו
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md text-center">
                    <Users className="h-10 w-10 mx-auto mb-2 text-blue-500" />
                    <h3 className="font-medium">משפיעני קריפטו</h3>
                    <p className="text-sm text-muted-foreground">
                      עקוב אחרי החשבונות המשפיעים ביותר בעולם הקריפטו
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
};

export default TwitterIntegration;
