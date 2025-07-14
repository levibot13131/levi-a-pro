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
  FileText,
  AlertTriangle,
  TrendingDown,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { liveSignalEngine } from '@/services/trading/liveSignalEngine';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { UserManagementPanel } from '@/components/admin/UserManagementPanel';
import { AccessControlManager } from '@/components/admin/AccessControlManager';
import { SystemStatusPanel } from '@/components/admin/SystemStatusPanel';
import { RejectionAnalysisPanel } from '@/components/admin/RejectionAnalysisPanel';
import { SignalEngineDebugPanel } from '@/components/diagnostics/SignalEngineDebugPanel';
import TelegramTestPanel from '@/components/admin/TelegramTestPanel';
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
              פאנל ניהול LeviPro Production
              <Badge variant="destructive">
                מנהל
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
                <div className="text-2xl font-bold text-orange-600">
                  {engineStatus.totalRejections}
                </div>
                <div className="text-sm text-muted-foreground">איתותים נדחו</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {engineStatus.signalsLast24h ?? 0}
                </div>
                <div className="text-sm text-muted-foreground">24 שעות אחרונות</div>
              </div>

              <div className="text-center">
                <div className={`text-2xl font-bold ${engineStatus.failedTelegram > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {engineStatus.failedTelegram}
                </div>
                <div className="text-sm text-muted-foreground">כשלי טלגרם</div>
              </div>
            </div>
            
            {/* System Health Alert */}
            {!engineStatus.isRunning && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">
                  ⚠️ מנוע האיתותים כבוי - לא יישלחו איתותים חדשים
                </span>
              </div>
            )}

            {engineStatus.failedTelegram > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">
                  ⚠️ {engineStatus.failedTelegram} כשלים בשליחת הודעות טלגרם
                </span>
              </div>
            )}
            
            {engineStatus.isRunning && engineStatus.totalSignals === 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-yellow-800 font-medium">
                  📊 המנוע פעיל אך טרם נשלחו איתותים - בדוק את פילטרי האיכות
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Tabs */}
        <Tabs defaultValue="status" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="status">מצב מערכת</TabsTrigger>
            <TabsTrigger value="telegram">טלגרם</TabsTrigger>
            <TabsTrigger value="users">ניהול משתמשים</TabsTrigger>
            <TabsTrigger value="access">בקרת גישה</TabsTrigger>
            <TabsTrigger value="rejections">ניתוח דחיות</TabsTrigger>
            <TabsTrigger value="debug">Debug Panel</TabsTrigger>
            <TabsTrigger value="signals">ניהול איתותים</TabsTrigger>
            <TabsTrigger value="reports">דוחות</TabsTrigger>
            <TabsTrigger value="system">הגדרות מערכת</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-4">
            <SystemStatusPanel />
          </TabsContent>

          <TabsContent value="telegram" className="space-y-4">
            <TelegramTestPanel />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  סטטוס טלגרם מפורט
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded">
                  <h4 className="font-semibold mb-2">סטטוס טלגרם</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">הודעות נשלחו</div>
                      <div className="font-semibold">{engineStatus.totalSignals}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">כשלים</div>
                      <div className={`font-semibold ${engineStatus.failedTelegram > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {engineStatus.failedTelegram}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">הודעה אחרונה</div>
                      <div className="font-semibold">
                        {engineStatus.lastSuccessfulSignal > 0 ? 
                          new Date(engineStatus.lastSuccessfulSignal).toLocaleString('he-IL') : 
                          'אף פעם'
                        }
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">24 שעות</div>
                      <div className="font-semibold">{engineStatus.signalsLast24h ?? 0}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <UserManagementPanel />
          </TabsContent>
          
          <TabsContent value="access" className="space-y-4">
            <AccessControlManager />
          </TabsContent>
          
          <TabsContent value="rejections" className="space-y-4">
            <RejectionAnalysisPanel />
          </TabsContent>
          
          <TabsContent value="debug" className="space-y-4">
            <SignalEngineDebugPanel />
          </TabsContent>
          
          <TabsContent value="signals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  ניהול איתותים מתקדם
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => liveSignalEngine.sendTestSignal()}
                      className="h-16"
                    >
                      <div className="text-center">
                        <div>שלח איתות בדיקה</div>
                        <div className="text-xs opacity-75">לבדיקת התקשורת</div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => liveSignalEngine.start()}
                      disabled={engineStatus.isRunning}
                      className="h-16"
                    >
                      <div className="text-center">
                        <div>הפעל מנוע</div>
                        <div className="text-xs opacity-75">התחל ניתוח</div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      onClick={() => liveSignalEngine.stop()}
                      disabled={!engineStatus.isRunning}
                      className="h-16"
                    >
                      <div className="text-center">
                        <div>עצור מנוע</div>
                        <div className="text-xs opacity-75">הפסק ניתוח</div>
                      </div>
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded">
                    <h4 className="font-semibold mb-2">הגדרות איתותים פרודקשן</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">ביטחון מינימלי</div>
                        <div className="font-semibold">65% (Learning)</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">יחס סיכון/תשואה</div>
                        <div className="font-semibold">1:1.2</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">תדירות בדיקה</div>
                        <div className="font-semibold">30 שניות</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">זמן המתנה</div>
                        <div className="font-semibold">15 דקות</div>
                      </div>
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
                  הגדרות מערכת מתקדמות
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
                    <div className="text-sm text-green-700 space-y-1">
                      <div>✅ כל המערכות פועלות תקין</div>
                      <div>✅ RLS פעיל על כל הטבלאות</div>
                      <div>✅ מנוע AI מוכן לפעולה</div>
                      <div>✅ טלגרם בוט מחובר</div>
                      <div>✅ בסיס נתונים זמין</div>
                      <div>✅ מערכת לימוד פעילה</div>
                    </div>
                  </div>
                  
                  {/* Engine Status Summary */}
                  <div className="p-4 bg-blue-50 rounded">
                    <h4 className="font-semibold text-blue-800 mb-2">סיכום פעילות המנוע</h4>
                    <div className="text-sm text-blue-700">
                      <div>🔍 ניתוחים בוצעו: {engineStatus.analysisCount}</div>
                      <div>📈 איתותים נשלחו: {engineStatus.totalSignals}</div>
                      <div>❌ איתותים נדחו: {engineStatus.totalRejections}</div>
                      <div>📊 איתותים 24 שעות: {engineStatus.signalsLast24h ?? 0}</div>
                      <div>📱 כשלי טלגרם: {engineStatus.failedTelegram}</div>
                      <div>⏰ ניתוח אחרון: {engineStatus.lastAnalysis > 0 ? 
                        new Date(engineStatus.lastAnalysis).toLocaleString('he-IL') : 
                        'טרם בוצע'
                      }</div>
                      <div>🎯 איתות אחרון: {engineStatus.lastSuccessfulSignal && engineStatus.lastSuccessfulSignal > 0 ? 
                        new Date(engineStatus.lastSuccessfulSignal).toLocaleString('he-IL') : 
                        'אף פעם'
                      }</div>
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
