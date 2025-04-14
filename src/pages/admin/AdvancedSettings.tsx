
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import TelegramConfig from '@/components/messaging/TelegramConfig';
import { RefreshCw, Wrench, MessageSquare, BellRing, Database, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { isTrackingActive, startAssetTracking, stopAssetTracking } from '@/services/assetTracking/realTimeSync';
import { clearCache as clearCoinGeckoCache } from '@/services/crypto/coinGeckoService';

const AdvancedSettings = () => {
  const [telegramConfigured, setTelegramConfigured] = useState(false);
  const [assetTracking, setAssetTracking] = useState(isTrackingActive());
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const handleResetCache = (service: string) => {
    setIsLoading(prev => ({ ...prev, [service]: true }));
    
    setTimeout(() => {
      try {
        switch (service) {
          case 'coingecko':
            clearCoinGeckoCache();
            toast.success('מטמון CoinGecko נוקה');
            break;
          case 'all':
            clearCoinGeckoCache();
            localStorage.removeItem('trending_coins_cache');
            localStorage.removeItem('market_data_cache');
            toast.success('כל המטמונים נוקו');
            break;
          default:
            toast.info(`אין מטמון לניקוי עבור ${service}`);
        }
      } catch (error) {
        console.error(`Error clearing cache for ${service}:`, error);
        toast.error(`שגיאה בניקוי מטמון ${service}`);
      } finally {
        setIsLoading(prev => ({ ...prev, [service]: false }));
      }
    }, 1000);
  };

  const toggleAssetTracking = () => {
    if (assetTracking) {
      stopAssetTracking();
      setAssetTracking(false);
      toast.success('מעקב נכסים בזמן אמת הופסק');
    } else {
      startAssetTracking();
      setAssetTracking(true);
      toast.success('מעקב נכסים בזמן אמת הופעל');
    }
  };

  return (
    <Container className="py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-right">הגדרות מתקדמות</h1>
        <p className="text-muted-foreground text-right">
          ניהול הגדרות מתקדמות למערכת הניתוח והאיתותים
        </p>
      </div>
      
      <Tabs defaultValue="messaging">
        <TabsList className="mb-6 grid grid-cols-4 w-full">
          <TabsTrigger value="messaging" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 ml-1" />
            הודעות ואיתותים
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-1">
            <Wrench className="h-4 w-4 ml-1" />
            הגדרות מערכת
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <BellRing className="h-4 w-4 ml-1" />
            התראות
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-1">
            <Database className="h-4 w-4 ml-1" />
            ניהול נתונים
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="messaging" className="space-y-6">
          <TelegramConfig onStatusChange={setTelegramConfigured} />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-right">הגדרות שליחת איתותים</CardTitle>
              <CardDescription className="text-right">
                הגדרות לשליחת איתותים אוטומטיים
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-right text-sm">
                    לאחר הגדרת טלגרם, איתותים חדשים שייווצרו במערכת יישלחו אוטומטית לטלגרם.
                    חזור לעמוד "איתותי מסחר" והפעל את ניתוח זמן אמת כדי להתחיל לקבל איתותים.
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  disabled={!telegramConfigured}
                  onClick={() => {
                    window.location.href = '/trading-signals';
                  }}
                >
                  <Upload className="h-4 w-4 ml-2" />
                  עבור לעמוד האיתותים
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">מעקב נכסים בזמן אמת</CardTitle>
              <CardDescription className="text-right">
                הפעל או כבה מעקב נכסים בזמן אמת
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md text-right">
                  <p className="text-sm">
                    {assetTracking 
                      ? 'מעקב נכסים בזמן אמת פעיל. המערכת תעדכן את מחירי הנכסים באופן אוטומטי.' 
                      : 'מעקב נכסים בזמן אמת כבוי. המערכת לא תעדכן את מחירי הנכסים.'}
                  </p>
                </div>
                
                <Button onClick={toggleAssetTracking} variant={assetTracking ? "destructive" : "default"}>
                  {assetTracking ? 'הפסק מעקב' : 'הפעל מעקב'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-right">ניהול מטמונים</CardTitle>
              <CardDescription className="text-right">
                ניקוי מטמונים של API ונתונים
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => handleResetCache('coingecko')} 
                    disabled={isLoading['coingecko']}
                  >
                    <RefreshCw className={`h-4 w-4 ml-2 ${isLoading['coingecko'] ? 'animate-spin' : ''}`} />
                    נקה מטמון CoinGecko
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleResetCache('all')} 
                    disabled={isLoading['all']}
                  >
                    <RefreshCw className={`h-4 w-4 ml-2 ${isLoading['all'] ? 'animate-spin' : ''}`} />
                    נקה את כל המטמונים
                  </Button>
                </div>
                <Separator />
                <div className="bg-muted p-4 rounded-md text-right">
                  <p className="text-sm">
                    ניקוי מטמונים יכריח את המערכת לטעון נתונים חדשים בפעם הבאה שתיגש לעמוד רלוונטי. 
                    זה יכול לגרום לעיכוב בטעינת המידע.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">הגדרות התראות</CardTitle>
              <CardDescription className="text-right">
                הגדר את העדפות ההתראות שלך
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-10">
                <p>בקרוב - הגדרות התראות מתקדמות</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">ניהול נתונים</CardTitle>
              <CardDescription className="text-right">
                גיבוי ושחזור נתונים
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-10">
                <p>בקרוב - ניהול נתונים מתקדם</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default AdvancedSettings;
