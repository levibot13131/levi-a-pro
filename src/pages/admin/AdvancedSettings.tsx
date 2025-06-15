
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Settings, Shield, Cloud, Database } from 'lucide-react';
import { toast } from 'sonner';

const AdvancedSettings = () => {
  const [isResettingSystem, setIsResettingSystem] = useState(false);

  const handleSystemReset = async () => {
    setIsResettingSystem(true);
    try {
      // Clear all local storage data except user preferences
      const keysToKeep = ['user_preferences', 'theme'];
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      
      toast.success('המערכת אופסה בהצלחה');
      
      // Reload the page after reset
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error resetting system:', error);
      toast.error('שגיאה באיפוס המערכת');
    } finally {
      setIsResettingSystem(false);
    }
  };

  return (
    <Container className="py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-right">
            הגדרות מתקדמות
          </h1>
          <p className="text-muted-foreground text-right">
            ניהול מתקדם של מערכת LeviPro
          </p>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-right">
            אזור זה מיועד למשתמשים מתקדמים בלבד. שינויים כאן עלולים להשפיע על פעולת המערכת.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center justify-end gap-2">
              <Cloud className="h-5 w-5" />
              סטטוס מערכת ענן
            </CardTitle>
            <CardDescription className="text-right">
              מידע על תצורת המערכת הנוכחית
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  ענן מלא
                </Badge>
                <span className="text-right">מצב פעולה</span>
              </div>
              
              <div className="flex justify-between items-center">
                <Badge variant="secondary">
                  ישיר
                </Badge>
                <span className="text-right">סוג חיבור API</span>
              </div>
              
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  פעיל
                </Badge>
                <span className="text-right">WebSocket Streams</span>
              </div>
              
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Supabase
                </Badge>
                <span className="text-right">מסד נתונים</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center justify-end gap-2">
              <Database className="h-5 w-5" />
              ניהול נתונים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Button 
                  variant="destructive" 
                  onClick={handleSystemReset}
                  disabled={isResettingSystem}
                >
                  {isResettingSystem ? 'מאפס...' : 'איפוס מערכת'}
                </Button>
                <div className="text-right">
                  <div className="font-medium">איפוס כללי</div>
                  <div className="text-sm text-muted-foreground">מחיקת כל הנתונים המקומיים</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center justify-end gap-2">
              <Settings className="h-5 w-5" />
              הגדרות סביבה
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  production
                </code>
                <span className="text-right">סביבת הפעלה</span>
              </div>
              
              <div className="flex justify-between items-center">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  cloud-native
                </code>
                <span className="text-right">ארכיטקטורה</span>
              </div>
              
              <div className="flex justify-between items-center">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  real-time
                </code>
                <span className="text-right">מצב נתונים</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default AdvancedSettings;
