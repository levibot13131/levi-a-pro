
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  Activity, 
  BarChart3,
  Settings,
  Database,
  Bell,
  Zap,
  FileText
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { liveSignalEngine } from '@/services/trading/liveSignalEngine';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import Navbar from '@/components/layout/Navbar';

const Admin: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const engineStatus = liveSignalEngine.getEngineStatus();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-bold mb-2">גישה לא מורשית</h2>
              <p className="text-muted-foreground">אין לך הרשאות מנהל לצפייה בדף זה</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Admin Header */}
        <Card className="border-2 border-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-500" />
              פאנל ניהול LeviPro
              <Badge variant="destructive">
                מנהל
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1</div>
                <div className="text-sm text-muted-foreground">משתמשים רשומים</div>
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold ${engineStatus.isRunning ? 'text-green-600' : 'text-red-600'}`}>
                  {engineStatus.isRunning ? 'פעיל' : 'כבוי'}
                </div>
                <div className="text-sm text-muted-foreground">מנוע AI</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {engineStatus.totalSignals}
                </div>
                <div className="text-sm text-muted-foreground">איתותים נשלחו</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">100%</div>
                <div className="text-sm text-muted-foreground">זמינות מערכת</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="dashboard">לוח בקרה</TabsTrigger>
            <TabsTrigger value="users">ניהול משתמשים</TabsTrigger>
            <TabsTrigger value="signals">ניהול איתותים</TabsTrigger>
            <TabsTrigger value="reports">דוחות</TabsTrigger>
            <TabsTrigger value="system">מערכת</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    פעילות מערכת
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>מנוע AI:</span>
                      <Badge variant={engineStatus.isRunning ? "default" : "secondary"}>
                        {engineStatus.isRunning ? 'פעיל' : 'כבוי'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>טלגרם בוט:</span>
                      <Badge variant="default">פעיל</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>בסיס נתונים:</span>
                      <Badge variant="default">מחובר</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    סטטיסטיקות
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>איתותים היום:</span>
                      <span className="font-bold">{engineStatus.totalSignals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ניתוחים:</span>
                      <span className="font-bold">{engineStatus.analysisCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>דחיות:</span>
                      <span className="font-bold">{engineStatus.totalRejections}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  ניהול משתמשים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <div className="font-semibold">{user?.email}</div>
                      <div className="text-sm text-muted-foreground">מנהל מערכת</div>
                    </div>
                    <Badge variant="destructive">מנהל</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  ניהול איתותים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Button>שלח איתות בדיקה</Button>
                    <Button variant="outline">איפוס סטטיסטיקות</Button>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded">
                    <h4 className="font-semibold mb-2">הגדרות איתותים</h4>
                    <div className="text-sm space-y-1">
                      <div>רמת ביטחון מינימלית: 70%</div>
                      <div>יחס סיכון/תשואה: 1:1.2</div>
                      <div>תדירות בדיקה: 30 שניות</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <ReportGenerator />
          </TabsContent>
          
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  הגדרות מערכת
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      גיבוי בסיס נתונים
                    </Button>
                    <Button variant="outline">
                      <Bell className="h-4 w-4 mr-2" />
                      הגדרות התראות
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded">
                    <h4 className="font-semibold text-green-800 mb-2">סטטוס מערכת</h4>
                    <div className="text-sm text-green-700">
                      ✅ כל המערכות פועלות תקין
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
