import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  MessageCircle, Twitter, TrendingUp, Settings, RefreshCw, Filter, ChevronDown, ChevronUp
} from 'lucide-react';
import TwitterConnectForm from '@/components/twitter/TwitterConnectForm';
import { isTwitterConnected, getTwitterCredentials } from '@/services/twitter/twitterService';
import { useAppSettings } from '@/hooks/use-app-settings';
import { toast } from 'sonner';
import RealModeGuide from '@/components/guides/RealModeGuide';

const TwitterIntegration: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedGuide, setExpandedGuide] = useState(false);
  const { demoMode } = useAppSettings();
  
  useEffect(() => {
    setIsConnected(isTwitterConnected());
    
    const handleConnectionChange = (event: CustomEvent<{ isConnected: boolean }>) => {
      setIsConnected(event.detail.isConnected);
    };
    
    window.addEventListener(
      'twitter-connection-changed',
      handleConnectionChange as EventListener
    );
    
    return () => {
      window.removeEventListener(
        'twitter-connection-changed',
        handleConnectionChange as EventListener
      );
    };
  }, []);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('הנתונים התעדכנו בהצלחה');
    }, 1500);
  };
  
  return (
    <Container className="py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Twitter/X אינטגרציה</h1>
          <p className="text-muted-foreground">חיבור וניהול נתונים מטוויטר/X דרך המערכת</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={!isConnected || isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            רענן נתונים
          </Button>
        </div>
      </div>
      
      {demoMode && (
        <Card className="mb-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setExpandedGuide(!expandedGuide)}
                className="text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900 dark:hover:text-amber-300"
              >
                {expandedGuide ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {expandedGuide ? 'הסתר' : 'הראה הנחיות'}
              </Button>
              <div className="flex items-center">
                <div className="font-medium text-amber-800 dark:text-amber-300">⚠️ אתה במצב דמו</div>
              </div>
            </div>
            
            {expandedGuide && (
              <div className="mt-4">
                <RealModeGuide />
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {!isConnected ? (
        <TwitterConnectForm 
          onConnect={() => setIsConnected(true)} 
          isConnected={isConnected}
          onDisconnect={() => setIsConnected(false)}
        />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex gap-2 items-center">
              <Twitter className="h-4 w-4" />
              סקירה כללית
            </TabsTrigger>
            <TabsTrigger value="feeds" className="flex gap-2 items-center">
              <MessageCircle className="h-4 w-4" />
              פידים
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex gap-2 items-center">
              <TrendingUp className="h-4 w-4" />
              אנליטיקה
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex gap-2 items-center">
              <Settings className="h-4 w-4" />
              הגדרות
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">סקירת חיבור Twitter/X</CardTitle>
                <CardDescription className="text-right">
                  סטטוס חיבור ונתונים כלליים
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setActiveTab('settings');
                      }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      הגדרות חיבור
                    </Button>
                    <div className="text-right">
                      <div className="text-green-700 dark:text-green-400 font-medium text-lg">✓ מחובר לטוויטר</div>
                      <div className="text-sm text-muted-foreground">
                        חשבון: @{getTwitterCredentials()?.username || 'api_user'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="bg-muted/40">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-right">ניטור פעיל</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-4xl font-bold mb-2">8</div>
                      <div className="text-sm text-muted-foreground">מילות מפתח במעקב</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/40">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-right">ניתוחי סנטימנט</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-4xl font-bold mb-2">5</div>
                      <div className="text-sm text-muted-foreground">ניתוחים אחרונים</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/40">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-right">התראות פעילות</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-4xl font-bold mb-2">3</div>
                      <div className="text-sm text-muted-foreground">התראות מוגדרות</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="text-right mb-4">
                  <h3 className="text-lg font-medium mb-2">פעולות מהירות</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button variant="outline" className="justify-start" onClick={() => setActiveTab('analytics')}>
                      <TrendingUp className="h-4 w-4 ml-2" />
                      נתח סנטימנט קריפטו
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => setActiveTab('feeds')}>
                      <MessageCircle className="h-4 w-4 ml-2" />
                      הגדר פיד חדש
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => setActiveTab('settings')}>
                      <Filter className="h-4 w-4 ml-2" />
                      הגדר מסננים חדשים
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="feeds">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">פידים מוגדרים</CardTitle>
                <CardDescription className="text-right">
                  ניהול פידים ומעקב אחר מילות מפתח
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <MessageCircle className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">אין פידים מוגדרים כרגע</p>
                  <Button>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    הגדר פיד חדש
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">אנליטיקת Twitter/X</CardTitle>
                <CardDescription className="text-right">
                  ניתוח מגמות וסנטימנט
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <TrendingUp className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">הגדר ניתוח סנטימנט חדש כדי להתחיל</p>
                  <Button>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    ניתוח סנטימנט חדש
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <TwitterConnectForm 
              onConnect={() => setIsConnected(true)} 
              isConnected={isConnected}
              onDisconnect={() => setIsConnected(false)}
            />
          </TabsContent>
        </Tabs>
      )}
    </Container>
  );
};

export default TwitterIntegration;
