
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getTwitterCredentials } from '@/services/twitter/twitterService';
import TwitterConnectForm from '@/components/twitter/TwitterConnectForm';
import TrendingTopicsPanel from '@/components/twitter/TrendingTopicsPanel';
import SentimentOverview from '@/components/twitter/SentimentOverview';

interface TwitterConnectedViewProps {
  isConnected: boolean;
  onDisconnect: () => void;
}

const TwitterConnectedView: React.FC<TwitterConnectedViewProps> = ({ 
  isConnected, 
  onDisconnect 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
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
          
          <SentimentOverview />
        </div>
        
        <TrendingTopicsPanel className="mt-6" />
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
            onDisconnect={onDisconnect}
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
  );
};

export default TwitterConnectedView;
