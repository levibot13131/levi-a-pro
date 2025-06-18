
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
    // Welcome message for admin
    if (isAdmin && user) {
      toast.success(`ברוך הבא ${displayName}!`, {
        description: 'מערכת LeviPro מוכנה לפעולה מלאה',
        duration: 5000,
      });
    }
  }, [isAdmin, user, displayName]);

  const handleEngineToggle = async () => {
    if (engineStatus.isRunning) {
      await stopEngine();
      toast.info('מנוע הסיגנלים הופסק');
    } else {
      const success = await startEngine();
      if (success) {
        toast.success('מנוע הסיגנלים הופעל בהצלחה!', {
          description: 'האסטרטגיה האישית שלך פעילה',
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
        {/* Header with Admin Controls */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-right">
              לוח הבקרה הראשי - LeviPro
            </h1>
          </div>
          <p className="text-muted-foreground text-right">
            מערכת מסחר אלגוריתמית מתקדמת עם ניתוח בזמן אמת
          </p>
          
          {isAdmin && (
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                מנהל מערכת
              </Badge>
              <Button
                variant={engineStatus.isRunning ? "destructive" : "default"}
                onClick={handleEngineToggle}
                className="gap-2"
              >
                {engineStatus.isRunning ? (
                  <>
                    <Activity className="h-4 w-4" />
                    הפסק מנוע
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    הפעל מנוע
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                {getHealthIcon(systemHealth.signalEngine)}
                <div>
                  <p className="text-sm font-medium">מנוע איתותים</p>
                  <p className="text-xs text-muted-foreground">
                    {engineStatus.isRunning ? 'פועל' : 'כבוי'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                {getHealthIcon(systemHealth.personalStrategy)}
                <div>
                  <p className="text-sm font-medium">אסטרטגיה אישית</p>
                  <p className="text-xs text-muted-foreground">מוכן</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                {getHealthIcon(systemHealth.riskManagement)}
                <div>
                  <p className="text-sm font-medium">ניהול סיכונים</p>
                  <p className="text-xs text-muted-foreground">פעיל</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                {getHealthIcon(systemHealth.realTimeData)}
                <div>
                  <p className="text-sm font-medium">נתונים בזמן אמת</p>
                  <p className="text-xs text-muted-foreground">מחובר</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                {getHealthIcon(systemHealth.database)}
                <div>
                  <p className="text-sm font-medium">בסיס נתונים</p>
                  <p className="text-xs text-muted-foreground">תקין</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Strategy Status (Admin Only) */}
        {isAdmin && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-right">
                <Brain className="h-5 w-5" />
                האסטרטגיה האישית של אלמוג
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">ניתוח לחץ רגשי</p>
                    <p className="text-xs text-muted-foreground">זיהוי אוטומטי</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">מומנטום נרות</p>
                    <p className="text-xs text-muted-foreground">ניתוח תבניות</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">פריצות מאושרות</p>
                    <p className="text-xs text-muted-foreground">עם אישור נפח</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="trading" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trading">מסחר בזמן אמת</TabsTrigger>
            <TabsTrigger value="risk">ניהול סיכונים</TabsTrigger>
            <TabsTrigger value="analytics">ניתוח ביצועים</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trading">
            <RealTimeTradingDashboard />
          </TabsContent>
          
          <TabsContent value="risk">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>מחשבון פוזיציה מהיר</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    גש לעמוד ניהול הסיכונים לכלים מתקדמים
                  </p>
                  <Button className="mt-2" variant="outline">
                    פתח מחשבון פוזיציה
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>ביצועי המערכת</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>סה"כ איתותים:</span>
                      <span className="font-semibold">{engineStatus.totalSignals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>אסטרטגיות פעילות:</span>
                      <span className="font-semibold">{engineStatus.activeStrategies.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>סטטוס מנוע:</span>
                      <Badge variant={engineStatus.isRunning ? "default" : "secondary"}>
                        {engineStatus.isRunning ? 'פועל' : 'כבוי'}
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
