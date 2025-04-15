
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import RequireAuth from '@/components/auth/RequireAuth';
import TwitterConnectForm from '@/components/twitter/TwitterConnectForm';
import { isTwitterConnected, getTwitterCredentials } from '@/services/twitter/twitterService';
import { useAppSettings } from '@/hooks/use-app-settings';

const TwitterIntegration = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { isAdmin } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const { demoMode } = useAppSettings((state: any) => ({
    demoMode: state.demoMode
  }));
  
  useEffect(() => {
    checkConnection();
  }, []);
  
  const checkConnection = () => {
    const connected = isTwitterConnected();
    setIsConnected(connected);
  };
  
  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <RequireAuth>
      <Container className="py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">אינטגרציית Twitter</h1>
            <p className="text-muted-foreground">ניתוח סנטימנט וניטור השוק בטוויטר</p>
          </div>
        </div>

        {!isConnected && !demoMode ? (
          <TwitterConnectForm 
            isConnected={isConnected}
            onDisconnect={handleDisconnect}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                סקירה
              </TabsTrigger>
              <TabsTrigger value="trending">
                טרנדים
              </TabsTrigger>
              <TabsTrigger value="sentiment">
                סנטימנט
              </TabsTrigger>
              <TabsTrigger value="settings">
                הגדרות
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">סטטוס חיבור</CardTitle>
                    <CardDescription className="text-right">
                      {isConnected ? 'מחובר לחשבון טוויטר' : 'מצב דמו - נתונים לדוגמה בלבד'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-3 rounded-md text-right">
                      <p>
                        {isConnected 
                          ? `מחובר באמצעות: ${getTwitterCredentials()?.username || 'חשבון לא ידוע'}`
                          : 'המערכת פועלת במצב דמו. הנתונים הם לצורכי הדגמה בלבד.'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {isConnected 
                          ? `חובר לאחרונה בתאריך: ${new Date(getTwitterCredentials()?.lastConnected || Date.now()).toLocaleString()}`
                          : 'התחבר לקבלת נתונים עדכניים מטוויטר.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">סיכום נתונים</CardTitle>
                  </CardHeader>
                  <CardContent className="text-right">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">היקף איסוף</p>
                        <p className="text-2xl font-bold">5,280</p>
                        <p className="text-xs text-muted-foreground">ציוצים שנאספו ב-24 שעות</p>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">סנטימנט כולל</p>
                        <p className="text-2xl font-bold text-green-500">חיובי</p>
                        <p className="text-xs text-muted-foreground">מבוסס על ניתוח 5,280 ציוצים</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-right">נושאים חמים</CardTitle>
                  <CardDescription className="text-right">
                    הנושאים המדוברים ביותר ב-24 השעות האחרונות
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-right">
                  <div className="flex flex-wrap gap-2 justify-end">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      #Bitcoin
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      #ETH
                    </div>
                    <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      #Web3
                    </div>
                    <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                      #NFT
                    </div>
                    <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      #Trading
                    </div>
                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                      #DeFi
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trending">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">מגמות מטבעות קריפטו בטוויטר</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-muted p-4 rounded-md text-right">
                      <p className="text-center text-sm">
                        {isConnected 
                          ? 'טוען נתוני טרנדים עדכניים...'
                          : 'נתוני טרנדים דורשים חיבור לטוויטר או מצב דמו.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sentiment">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">ניתוח סנטימנט</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-muted p-4 rounded-md text-right">
                      <p className="text-center text-sm">
                        {isConnected 
                          ? 'טוען נתוני סנטימנט עדכניים...'
                          : 'נתוני סנטימנט דורשים חיבור לטוויטר או מצב דמו.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              {isConnected && (
                <TwitterConnectForm
                  isConnected={true}
                  onDisconnect={handleDisconnect}
                />
              )}
              
              {!isConnected && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">הגדרות טוויטר</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-md text-right">
                      <p className="text-center text-sm">
                        יש להתחבר תחילה לטוויטר כדי לנהל את ההגדרות.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </Container>
    </RequireAuth>
  );
};

export default TwitterIntegration;
