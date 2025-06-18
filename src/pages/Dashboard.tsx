
import React, { useEffect, useState } from 'react';
import { Container } from '../components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RealTimeTradingDashboard from '../components/dashboard/RealTimeTradingDashboard';
import { useEngineStatus } from '@/hooks/useEngineStatus';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  Shield, 
  Zap, 
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { status: engineStatus, startEngine, stopEngine } = useEngineStatus();
  const { user, isAdmin, displayName } = useAuth();
  const [systemHealth, setSystemHealth] = useState({
    signalEngine: true,
    personalStrategy: true,
    riskManagement: true,
    realTimeData: true,
    database: true
  });

  useEffect(() => {
    // Welcome message for admin with LIVE confirmation
    if (isAdmin && user) {
      toast.success(`🚀 ברוך הבא ${displayName} - LeviPro LIVE!`, {
        description: 'מערכת מסחר אמיתית מוכנה לפעולה מלאה',
        duration: 8000,
      });
    }
  }, [isAdmin, user, displayName]);

  const handleEngineToggle = async () => {
    if (engineStatus.isRunning) {
      await stopEngine();
      toast.info('מנוע הסיגנלים LIVE הופסק');
    } else {
      const success = await startEngine();
      if (success) {
        toast.success('🚀 מנוע הסיגנלים LIVE הופעל בהצלחה!', {
          description: 'האסטרטגיה האישית שלך פועלת עם נתונים אמיתיים',
          duration: 10000,
        });
      }
    }
  };

  const getHealthIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <Container className="py-6">
      <div className="space-y-6">
        {/* Header with Admin Controls - LIVE MODE */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-right">
              לוח הבקרה הראשי - LeviPro LIVE
            </h1>
          </div>
          <p className="text-muted-foreground text-right">
            מערכת מסחר אלגוריתמית LIVE עם ניתוח בזמן אמת - נתונים אמיתיים בלבד
          </p>
          
          {isAdmin && (
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                מנהל מערכת - אלמוג
              </Badge>
              <Badge variant="default" className="gap-1 bg-green-600">
                <Activity className="h-3 w-3" />
                מצב LIVE
              </Badge>
              <Button
                variant={engineStatus.isRunning ? "destructive" : "default"}
                onClick={handleEngineToggle}
                className="gap-2"
              >
                {engineStatus.isRunning ? (
                  <>
                    <Activity className="h-4 w-4" />
                    הפסק מנוע LIVE
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    הפעל מנוע LIVE
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* System Status Overview - LIVE MODE */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                {getHealthIcon(systemHealth.signalEngine)}
                <div>
                  <p className="text-sm font-medium">מנוע איתותים LIVE</p>
                  <p className="text-xs text-muted-foreground">
                    {engineStatus.isRunning ? '🔥 פועל LIVE' : 'כבוי'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                {getHealthIcon(systemHealth.personalStrategy)}
                <div>
                  <p className="text-sm font-medium">אסטרטגיה אישית</p>
                  <p className="text-xs text-muted-foreground">🧠 LIVE מוכן</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                {getHealthIcon(systemHealth.riskManagement)}
                <div>
                  <p className="text-sm font-medium">ניהול סיכונים</p>
                  <p className="text-xs text-muted-foreground">🛡️ פעיל LIVE</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                {getHealthIcon(systemHealth.realTimeData)}
                <div>
                  <p className="text-sm font-medium">נתונים בזמן אמת</p>
                  <p className="text-xs text-muted-foreground">📡 מחובר LIVE</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-indigo-200 bg-indigo-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                {getHealthIcon(systemHealth.database)}
                <div>
                  <p className="text-sm font-medium">בסיס נתונים</p>
                  <p className="text-xs text-muted-foreground">💾 תקין LIVE</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Strategy Status - LIVE MODE (Admin Only) */}
        {isAdmin && (
          <Card className="border-2 border-primary bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-right">
                <Brain className="h-5 w-5" />
                האסטרטגיה האישית של אלמוג - מצב LIVE
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">🔥 ניתוח לחץ רגשי LIVE</p>
                    <p className="text-xs text-muted-foreground">זיהוי אוטומטי בזמן אמת</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">📊 מומנטום נרות LIVE</p>
                    <p className="text-xs text-muted-foreground">ניתוח תבניות אמיתיות</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">🎯 פריצות מאושרות LIVE</p>
                    <p className="text-xs text-muted-foreground">עם אישור נפח אמיתי</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Dashboard Tabs - LIVE MODE */}
        <Tabs defaultValue="trading" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trading">🚀 מסחר LIVE</TabsTrigger>
            <TabsTrigger value="risk">🛡️ ניהול סיכונים</TabsTrigger>
            <TabsTrigger value="analytics">📊 ביצועים LIVE</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trading">
            <RealTimeTradingDashboard />
          </TabsContent>
          
          <TabsContent value="risk">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>מחשבון פוזיציה LIVE</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    גש לעמוד ניהול הסיכונים לכלים מתקדמים עם נתונים אמיתיים
                  </p>
                  <Button className="mt-2" variant="outline">
                    פתח מחשבון פוזיציה LIVE
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>ביצועי המערכת LIVE</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>סה"כ איתותים LIVE:</span>
                      <span className="font-semibold">{engineStatus.totalSignals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>אסטרטגיות פעילות:</span>
                      <span className="font-semibold">{engineStatus.activeStrategies.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>סטטוס מנוע LIVE:</span>
                      <Badge variant={engineStatus.isRunning ? "default" : "secondary"}>
                        {engineStatus.isRunning ? '🔥 פועל LIVE' : 'כבוי'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default Dashboard;
