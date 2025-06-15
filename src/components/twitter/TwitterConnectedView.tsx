
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Twitter, CheckCircle, Settings, TrendingUp, BarChart3 } from 'lucide-react';
import { disconnectFromTwitter, testTwitterConnection, getTwitterCredentials } from '@/services/twitter/twitterService';
import TwitterSentimentChart from './TwitterSentimentChart';
import { toast } from 'sonner';

interface TwitterConnectedViewProps {
  isConnected: boolean;
  onDisconnect: () => void;
}

const TwitterConnectedView: React.FC<TwitterConnectedViewProps> = ({ isConnected, onDisconnect }) => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [lastConnected, setLastConnected] = useState<string>('');

  useEffect(() => {
    const credentials = getTwitterCredentials();
    if (credentials?.lastConnected) {
      setLastConnected(new Date(credentials.lastConnected).toLocaleString('he-IL'));
    }
  }, []);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const success = await testTwitterConnection();
      if (success) {
        toast.success('Twitter connection is working');
      }
    } catch (error) {
      toast.error('Twitter connection test failed');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleDisconnect = () => {
    disconnectFromTwitter();
    onDisconnect();
  };

  return (
    <div className="space-y-6">
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription className="text-right">
          Twitter מחובר בהצלחה! המערכת תקבל עדכוני סנטימנט בזמן אמת
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center justify-end gap-2">
            <Twitter className="h-5 w-5 text-blue-500" />
            סטטוס Twitter API
          </CardTitle>
          <CardDescription className="text-right">
            חיבור פעיל ל-Twitter API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleTestConnection} disabled={isTestingConnection}>
                {isTestingConnection ? 'בודק...' : 'בדוק חיבור'}
              </Button>
              <Button variant="destructive" onClick={handleDisconnect}>
                נתק חשבון
              </Button>
            </div>
            
            <div className="text-right">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                מחובר
              </Badge>
              {lastConnected && (
                <p className="text-xs text-muted-foreground mt-1">
                  התחבר לאחרונה: {lastConnected}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sentiment" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sentiment" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            ניתוח סנטימנט
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            אנליטיקס
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            הגדרות
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">ניתוח סנטימנט בזמן אמת</CardTitle>
              <CardDescription className="text-right">
                מעקב אחר סנטימנט השוק בטוויטר עבור מטבעות קריפטו מובילים
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TwitterSentimentChart data={[]} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">אנליטיקס Twitter</CardTitle>
              <CardDescription className="text-right">
                נתונים מפורטים על פעילות ההאזנה ב-Twitter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold">1,234</div>
                  <div className="text-sm text-muted-foreground">ציוצים נותחו</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold">87%</div>
                  <div className="text-sm text-muted-foreground">דיוק ניתוח</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold">5.2M</div>
                  <div className="text-sm text-muted-foreground">חשיפות כוללות</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-muted-foreground">מעקב פעיל</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">הגדרות Twitter</CardTitle>
              <CardDescription className="text-right">
                נהל את הגדרות ההאזנה והניתוח שלך
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>ניתוח סנטימנט אוטומטי</span>
                  <Badge variant="secondary">פעיל</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>התראות על שינויי סנטימנט</span>
                  <Badge variant="secondary">פעיל</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>שמירת היסטוריית נתונים</span>
                  <Badge variant="secondary">פעיל</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TwitterConnectedView;
