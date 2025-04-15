
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/hooks/use-app-settings';
import { Steps, Step } from '@/components/ui/steps';
import { ShieldCheck, ExternalLink, Zap, Server, Cloud, LockKeyhole } from 'lucide-react';

const RealModeGuide: React.FC = () => {
  const { demoMode, toggleDemoMode } = useAppSettings((state: any) => ({
    demoMode: state.demoMode,
    toggleDemoMode: state.toggleDemoMode
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-right text-xl lg:text-2xl">מדריך הגדרה למצב אמת</CardTitle>
        <CardDescription className="text-right text-base">
          הגדרות מומלצות להפעלה במצב אמת של המערכת לסביבת ייצור
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 bg-muted p-4 rounded-lg text-right">
          <h3 className="text-lg font-semibold mb-2">המערכת פועלת ב{demoMode ? 'מצב דמו' : 'מצב אמת'}</h3>
          <p className="text-sm mb-3">
            {demoMode 
              ? 'במצב דמו, המערכת משתמשת בנתונים מדומים ולא מבצעת פעולות אמיתיות.' 
              : 'במצב אמת, המערכת יכולה לבצע פעולות אמיתיות ולהשתמש בנתונים בזמן אמת.'}
          </p>
          <Button
            variant={demoMode ? "default" : "outline"}
            onClick={toggleDemoMode}
            className="w-full"
          >
            <Zap className="mr-2 h-4 w-4" />
            {demoMode ? 'עבור למצב אמת' : 'עבור למצב דמו'}
          </Button>
        </div>

        <div className="space-y-8">
          <h3 className="text-lg font-semibold text-right">שלבי הגדרה למצב אמת:</h3>
          
          <Steps>
            <Step 
              title="הגדרת שרת פרוקסי" 
              icon={<Server className="h-5 w-5" />}
            >
              <p>שרת פרוקסי הכרחי כדי לעקוף מגבלות CORS ולשמור על מפתחות API מאובטחים.</p>
              <p className="mt-1">
                <a href="/proxy-guide" className="text-primary hover:underline">מדריך מפורט להגדרת שרת פרוקסי</a>
              </p>
            </Step>
            
            <Step 
              title="הגדרת Binance API" 
              icon={<LockKeyhole className="h-5 w-5" />}
            >
              <p>צור מפתחות API בפלטפורמת Binance והגדר הרשאות מתאימות לקריאת נתונים ומסחר.</p>
              <p className="mt-1 text-muted-foreground">הרשאות מומלצות: קריאת מידע שוק, קריאת מידע חשבון, מסחר מלא (אם רוצים אוטומציה).</p>
            </Step>
            
            <Step 
              title="הגדרת אבטחת מידע" 
              icon={<ShieldCheck className="h-5 w-5" />}
            >
              <p>מומלץ להגדיר IP whitelist בהגדרות ה-API של בינאנס לשרת הפרוקסי שלך בלבד.</p>
              <p className="mt-1 text-muted-foreground">הגבל גישה למערכת עם אימות דו-שלבי וסיסמאות חזקות.</p>
            </Step>
            
            <Step 
              title="פריסה בענן" 
              icon={<Cloud className="h-5 w-5" />}
            >
              <p>העלה את האפליקציה לשרת ענן או VPS כדי לאפשר פעילות 24/7.</p>
              <p className="mt-1 text-muted-foreground">אפשרויות מומלצות: DigitalOcean, AWS, GCP, או Azure עם הגדרת SSL.</p>
              <Button variant="outline" className="mt-3" asChild>
                <a href="/deployment-guide">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  מדריך פריסה מלא
                </a>
              </Button>
            </Step>
          </Steps>
        </div>
        
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg text-right border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-2">אזהרות חשובות</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>הפעל את המערכת תחילה עם סכומים קטנים כדי לוודא שהכל עובד כצפוי</li>
            <li>הגדר התראות בזמן אמת על פעולות מסחר וכשלון פעולות</li>
            <li>הקפד לגבות את מפתחות ה-API והסיסמאות במקום מאובטח</li>
            <li>עקוב אחר לוגים של המערכת באופן קבוע לזיהוי בעיות</li>
            <li>וודא שתוכנת אנטי-וירוס מעודכנת במחשב ממנו אתה מפעיל את המערכת</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealModeGuide;
