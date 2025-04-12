
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useBinanceConnection } from '@/hooks/use-binance-connection';
import BinanceConnectButton from '@/components/binance/BinanceConnectButton';
import BinanceConnectionStatus from '@/components/binance/BinanceConnectionStatus';
import { useAuth } from '@/contexts/AuthContext';
import RequireAuth from '@/components/auth/RequireAuth';
import { LineChart, Wallet, ArrowUpDown, Clock, Settings } from 'lucide-react';

const BinanceIntegration = () => {
  const { isConnected } = useBinanceConnection();
  const [activeTab, setActiveTab] = useState('overview');
  const { isAdmin } = useAuth();

  return (
    <RequireAuth>
      <Container className="py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">אינטגרציית Binance</h1>
            <p className="text-muted-foreground">חיבור וניהול חשבון בינאנס דרך המערכת</p>
          </div>
          <div className="mt-4 md:mt-0">
            <BinanceConnectButton />
          </div>
        </div>

        {!isConnected ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-right">התחבר לחשבון ה-Binance שלך</CardTitle>
              <CardDescription className="text-right">
                חבר את המערכת לחשבון הבינאנס שלך כדי לקבל נתונים בזמן אמת ולבצע פעולות מסחר
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-muted/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-right">נתונים בזמן אמת</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LineChart className="h-12 w-12 mb-2 text-primary mx-auto" />
                    <p className="text-sm text-center">קבל נתוני מסחר ומחירים בזמן אמת ישירות מבורסת בינאנס</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-right">מעקב נכסים</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Wallet className="h-12 w-12 mb-2 text-primary mx-auto" />
                    <p className="text-sm text-center">עקוב אחר הנכסים שלך, היתרות והרווחים בזמן אמת</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-right">מסחר אוטומטי</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ArrowUpDown className="h-12 w-12 mb-2 text-primary mx-auto" />
                    <p className="text-sm text-center">הפעל אסטרטגיות מסחר אוטומטיות בהתאם לאיתותים</p>
                  </CardContent>
                </Card>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  המפתחות נשמרים מקומית במכשיר שלך בלבד ולא נשלחים לשרת.
                </p>
                <BinanceConnectButton />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <LineChart className="h-4 w-4" />
                סקירה
              </TabsTrigger>
              <TabsTrigger value="assets" className="flex items-center gap-1">
                <Wallet className="h-4 w-4" />
                נכסים
              </TabsTrigger>
              <TabsTrigger value="trading" className="flex items-center gap-1">
                <ArrowUpDown className="h-4 w-4" />
                מסחר
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                היסטוריה
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="settings" className="flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  הגדרות
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BinanceConnectionStatus />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">סיכום חשבון</CardTitle>
                    <CardDescription className="text-right">
                      נתוני החשבון שלך בבינאנס
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-center text-sm">
                        הנתונים יטענו כאשר החיבור לבינאנס יאומת
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="assets">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">נכסים</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-center text-sm">
                      פיתוח ניהול נכסים בתהליך...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trading">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">מסחר</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-center text-sm">
                      פיתוח ממשק מסחר בתהליך...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">היסטוריית מסחר</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-center text-sm">
                      פיתוח היסטוריית מסחר בתהליך...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">הגדרות בינאנס</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-center text-sm">
                        פיתוח הגדרות מתקדמות בתהליך...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        )}
      </Container>
    </RequireAuth>
  );
};

export default BinanceIntegration;
