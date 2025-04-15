
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, Zap, Link, AlertTriangle, CheckCircle2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Steps, Step } from '@/components/ui/steps';

const RealModeGuide: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">מדריך למעבר ממצב דמו למצב אמיתי</CardTitle>
        <CardDescription className="text-right">
          עקוב אחר השלבים הפשוטים הבאים כדי להעביר את המערכת ממצב דמו למצב נתונים אמיתיים
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="binance">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="binance">בינאנס</TabsTrigger>
            <TabsTrigger value="tradingview">TradingView</TabsTrigger>
          </TabsList>
          
          <TabsContent value="binance" className="pt-4">
            <Alert className="mb-4 bg-amber-50 dark:bg-amber-950/10 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-right text-amber-800">חשוב לדעת</AlertTitle>
              <AlertDescription className="text-right text-amber-700">
                כדי לקבל נתונים אמיתיים מבינאנס, יש לבצע מספר פעולות הגדרה. 
                אחרת המערכת תמשיך להציג נתוני דמו.
              </AlertDescription>
            </Alert>
            
            <Steps className="mb-4">
              <Step>
                <div className="text-right">
                  <h3 className="text-lg font-semibold mb-1">התחבר לחשבון בינאנס</h3>
                  <p className="text-sm text-muted-foreground">
                    יש להתחבר לחשבון בינאנס דרך דף האינטגרציה.
                    לחץ על "התחבר לבינאנס" והזן את פרטי ה-API שלך.
                  </p>
                </div>
                <Button size="sm" className="mt-2" asChild>
                  <a href="/binance-integration">עבור לדף אינטגרציית בינאנס</a>
                </Button>
              </Step>
              
              <Step>
                <div className="text-right">
                  <h3 className="text-lg font-semibold mb-1">הגדר פרוקסי (מומלץ)</h3>
                  <p className="text-sm text-muted-foreground">
                    הגדרת פרוקסי תאפשר גישה מאובטחת ל-API של בינאנס.
                    בסביבת פיתוח/מקומית אין צורך בפרוקסי.
                  </p>
                </div>
                <Button size="sm" className="mt-2" variant="outline" asChild>
                  <a href="/proxy-settings">הגדר פרוקסי</a>
                </Button>
              </Step>
              
              <Step>
                <div className="text-right">
                  <h3 className="text-lg font-semibold mb-1">הפעל מצב נתונים אמיתיים</h3>
                  <p className="text-sm text-muted-foreground">
                    עבור לקומפוננטת סטטוס בינאנס ולחץ על 
                    "מצב נתוני דמו" כדי להחליף למצב אמיתי.
                  </p>
                </div>
              </Step>
              
              <Step>
                <div className="text-right">
                  <h3 className="text-lg font-semibold mb-1">וודא שמצב זמן אמת פעיל</h3>
                  <p className="text-sm text-muted-foreground">
                    וודא שמצב זמן אמת מופעל. זה יאפשר עדכון שוטף 
                    של הנתונים מבינאנס.
                  </p>
                </div>
              </Step>
            </Steps>
            
            <Alert className="mt-4 bg-green-50 dark:bg-green-950/10 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-right text-green-800">טיפ שימושי</AlertTitle>
              <AlertDescription className="text-right text-green-700">
                אם אתה מתחבר למערכת מסביבת פיתוח מקומית, ניתן להשתמש במצב דמו או להפעיל את מצב הנתונים האמיתיים ללא צורך בפרוקסי.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="tradingview" className="pt-4">
            <Alert className="mb-4 bg-blue-50 dark:bg-blue-950/10 border-blue-200">
              <InfoIcon className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-right text-blue-800">מידע</AlertTitle>
              <AlertDescription className="text-right text-blue-700">
                כדי לקבל נתונים אמיתיים מ-TradingView, יש להתחבר לחשבון TradingView ולהגדיר את המערכת.
              </AlertDescription>
            </Alert>
            
            <Steps className="mb-4">
              <Step>
                <div className="text-right">
                  <h3 className="text-lg font-semibold mb-1">התחבר לחשבון TradingView</h3>
                  <p className="text-sm text-muted-foreground">
                    התחבר לחשבון TradingView דרך דף האינטגרציה.
                    לחץ על "התחבר ל-TradingView" והזן את פרטי החיבור שלך.
                  </p>
                </div>
                <Button size="sm" className="mt-2" asChild>
                  <a href="/tradingview-integration">עבור לדף אינטגרציית TradingView</a>
                </Button>
              </Step>
              
              <Step>
                <div className="text-right">
                  <h3 className="text-lg font-semibold mb-1">הפעל סנכרון אוטומטי</h3>
                  <p className="text-sm text-muted-foreground">
                    בדף האינטגרציה, הפעל את האפשרות "סנכרון אוטומטי"
                    כדי לקבל עדכונים שוטפים מ-TradingView.
                  </p>
                </div>
              </Step>
              
              <Step>
                <div className="text-right">
                  <h3 className="text-lg font-semibold mb-1">וודא שמצב זמן אמת פעיל</h3>
                  <p className="text-sm text-muted-foreground">
                    וודא שמצב זמן אמת מופעל בכל המערכת כדי לקבל
                    עדכונים שוטפים.
                  </p>
                </div>
              </Step>
            </Steps>
            
            <Alert className="mt-4 bg-green-50 dark:bg-green-950/10 border-green-200">
              <Zap className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-right text-green-800">טיפ שימושי</AlertTitle>
              <AlertDescription className="text-right text-green-700">
                חיבור ל-TradingView מאפשר גם קבלת התראות והמלצות מסחר בזמן אמת על סמך הגדרות שלך בפלטפורמה.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 p-4 bg-muted rounded-md">
          <h3 className="text-lg font-semibold text-right mb-2">בעיות נפוצות</h3>
          <ul className="list-disc list-inside text-right space-y-2">
            <li>
              <span className="font-medium">לא רואה נתונים אמיתיים?</span>
              <p className="text-sm text-muted-foreground">וודא שלחצת על כפתור "מצב נתוני דמו" כדי להחליף למצב אמיתי</p>
            </li>
            <li>
              <span className="font-medium">אין התחברות לבינאנס?</span>
              <p className="text-sm text-muted-foreground">בדוק שהמפתחות שהזנת תקינים ובעלי הרשאות צפייה מינימליות</p>
            </li>
            <li>
              <span className="font-medium">לא מופיעים גרפים?</span>
              <p className="text-sm text-muted-foreground">וודא שאתה מחובר ל-TradingView וסנכרון אוטומטי מופעל</p>
            </li>
          </ul>
        </div>
        
        <div className="mt-4 text-center">
          <Button 
            variant="outline" 
            className="gap-2"
            asChild
          >
            <a href="/settings">
              <Settings className="h-4 w-4" />
              עבור להגדרות מערכת
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealModeGuide;
