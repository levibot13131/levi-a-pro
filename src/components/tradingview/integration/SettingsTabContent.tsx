
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clipboard, Book, Shield, Bell, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const SettingsTabContent: React.FC = () => {
  const webhookUrl = `${window.location.origin}/api/tradingview/webhook`;
  
  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success('כתובת ה-Webhook הועתקה ללוח', {
      description: 'השתמש בכתובת זו בהגדרות ההתראות של TradingView'
    });
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-right">הגדרות Webhook</CardTitle>
          <CardDescription className="text-right">
            השתמש בהגדרות אלו כדי לחבר את TradingView למערכת
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-right">
            <h3 className="text-sm font-medium mb-1">כתובת Webhook:</h3>
            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyWebhookUrl}
                className="h-8 w-8 p-0"
              >
                <Clipboard className="h-4 w-4" />
                <span className="sr-only">העתק</span>
              </Button>
              <code dir="ltr" className="flex-1 text-xs font-mono truncate text-left">
                {webhookUrl}
              </code>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              העתק כתובת זו להגדרות ההתראות ב-TradingView
            </p>
          </div>
          
          <Separator />
          
          <div className="text-right">
            <h3 className="text-sm font-medium mb-2">ניתן להשתמש עם חשבון TradingView בסיסי</h3>
            <p className="text-sm text-muted-foreground">
              המערכת תוכננה לעבוד עם החבילה הבסיסית של TradingView.
              אין צורך בחשבון פרימיום לשימוש בפונקציות הבסיסיות.
            </p>
            <div className="mt-2">
              <Badge variant="outline" className="me-1">חינמי</Badge>
              <Badge variant="outline" className="me-1">בסיסי</Badge>
              <Badge variant="outline">ללא Pro</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-right">הוראות פריסה</CardTitle>
          <CardDescription className="text-right">
            שלבים להפעלת המערכת בסביבת הייצור
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-right list-decimal list-inside">
            <li className="text-sm">
              <span className="font-medium">חיבור ל-TradingView</span>
              <p className="text-xs text-muted-foreground mt-1">
                התחבר לחשבון ה-TradingView שלך (חשבון בסיסי מספיק)
              </p>
            </li>
            <li className="text-sm">
              <span className="font-medium">הגדרת ערוצי התראות</span>
              <p className="text-xs text-muted-foreground mt-1">
                הגדר לפחות ערוץ התראות אחד (טלגרם או וואטסאפ)
              </p>
            </li>
            <li className="text-sm">
              <span className="font-medium">הגדרת Webhook ב-TradingView</span>
              <p className="text-xs text-muted-foreground mt-1">
                הוסף את כתובת ה-Webhook שלנו להתראות ב-TradingView
              </p>
            </li>
            <li className="text-sm">
              <span className="font-medium">אימות חיבורים</span>
              <p className="text-xs text-muted-foreground mt-1">
                בדוק את החיבורים באמצעות שליחת התראות בדיקה
              </p>
            </li>
            <li className="text-sm">
              <span className="font-medium">הגדרת נכסים למעקב</span>
              <p className="text-xs text-muted-foreground mt-1">
                בחר נכסים למעקב או השתמש ברשימה האוטומטית
              </p>
            </li>
          </ol>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" className="gap-1">
                <Shield className="h-4 w-4" />
                בדוק אבטחה
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Book className="h-4 w-4" />
                מדריך מלא
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-right">הגדרת התראות ב-TradingView</CardTitle>
          <CardDescription className="text-right">
            כיצד להגדיר התראות ב-TradingView שיעבדו עם המערכת
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-right">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-1">צעד 1: יצירת התראה חדשה ב-TradingView</h3>
                <p className="text-sm text-muted-foreground">
                  פתח את הגרף, לחץ על הצלמית של הפעמון והגדר התראה חדשה.
                </p>
              </div>
              <Badge className="mt-1">צעד 1</Badge>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-1">צעד 2: הגדרת תנאי ההתראה</h3>
                <p className="text-sm text-muted-foreground">
                  הגדר את התנאי להתראה (לדוגמה, כאשר המחיר עובר רמה מסוימת).
                </p>
              </div>
              <Badge className="mt-1">צעד 2</Badge>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-1">צעד 3: הגדרת פעולת Webhook</h3>
                <p className="text-sm text-muted-foreground">
                  בחר באפשרות "Webhook URL" והדבק את כתובת ה-Webhook שלנו.
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 p-2 mt-1 rounded-md text-xs font-mono overflow-x-auto">
                  <code dir="ltr">
                    {"{{exchange}}:{{ticker}}, {{action}}, {{close}}, {{message}}"}
                  </code>
                </div>
              </div>
              <Badge className="mt-1">צעד 3</Badge>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-1">צעד 4: שמירה והפעלה</h3>
                <p className="text-sm text-muted-foreground">
                  שמור את ההתראה והיא תהיה פעילה מיידית. המערכת תקבל ותעבד את ההתראות באופן אוטומטי.
                </p>
              </div>
              <Badge className="mt-1">צעד 4</Badge>
            </div>
            
            <div className="flex justify-end mt-2">
              <Button variant="outline" size="sm" className="gap-1" asChild>
                <a href="https://www.tradingview.com/support/solutions/43000529348-webhooks/" target="_blank" rel="noopener noreferrer">
                  <ArrowUpRight className="h-4 w-4" />
                  מדריך Webhook של TradingView
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTabContent;
