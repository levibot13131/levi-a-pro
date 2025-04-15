
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ToggleRight, CheckCircle2 } from 'lucide-react';
import { useAppSettings } from '@/hooks/use-app-settings';

const RealModeGuide: React.FC = () => {
  const { demoMode, toggleDemoMode } = useAppSettings();
  
  return (
    <div className="space-y-4">
      {demoMode ? (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>אתה במצב דמו</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-3">מצב דמו משתמש בנתונים מוגדרים מראש לצורכי הדגמה בלבד. כדי להשתמש בנתונים אמיתיים, עליך לעבור למצב אמיתי ולהגדיר את החיבורים הנדרשים.</p>
            <Button onClick={toggleDemoMode} variant="outline" className="mt-2">
              <ToggleRight className="h-4 w-4 mr-2" />
              עבור למצב אמיתי
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="default">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>אתה במצב אמיתי</AlertTitle>
          <AlertDescription>
            המערכת תשתמש בחיבורים האמיתיים שהגדרת. וודא שכל החיבורים הנדרשים מוגדרים.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-right">
            לעבודה במצב אמיתי, נדרשים החיבורים הבאים:
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-muted/20 p-3">
              <div className="flex justify-between items-center">
                <Badge variant="outline">חובה למטבעות</Badge>
                <div className="font-medium">חיבור Binance</div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-right">
                נדרש לקבלת נתוני מטבעות בזמן אמת ומידע על חשבון
              </p>
              <div className="mt-2 text-left">
                <Button variant="outline" size="sm" asChild>
                  <a href="/binance-integration">
                    הגדר חיבור
                  </a>
                </Button>
              </div>
            </Card>
            
            <Card className="bg-muted/20 p-3">
              <div className="flex justify-between items-center">
                <Badge variant="outline">אופציונלי</Badge>
                <div className="font-medium">חיבור TradingView</div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-right">
                נדרש לניתוחים טכניים מתקדמים והתראות
              </p>
              <div className="mt-2 text-left">
                <Button variant="outline" size="sm" asChild>
                  <a href="/tradingview-integration">
                    הגדר חיבור
                  </a>
                </Button>
              </div>
            </Card>
            
            <Card className="bg-muted/20 p-3">
              <div className="flex justify-between items-center">
                <Badge variant="outline">אופציונלי</Badge>
                <div className="font-medium">חיבור Twitter/X</div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-right">
                נדרש לניתוח סנטימנט והתראות מבוססות-טוויטר
              </p>
              <div className="mt-2 text-left">
                <Button variant="outline" size="sm" asChild>
                  <a href="/twitter-integration">
                    הגדר חיבור
                  </a>
                </Button>
              </div>
            </Card>
            
            <Card className="bg-muted/20 p-3">
              <div className="flex justify-between items-center">
                <Badge variant="outline">מומלץ</Badge>
                <div className="font-medium">הגדרות פרוקסי</div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-right">
                נדרש למקרים של חסימות IP או הגבלות בגישה לבורסות
              </p>
              <div className="mt-2 text-left">
                <Button variant="outline" size="sm" asChild>
                  <a href="/proxy-settings">
                    הגדר פרוקסי
                  </a>
                </Button>
              </div>
            </Card>
          </div>
          
          <div className="bg-primary/10 p-3 rounded-md text-right">
            <h3 className="font-medium mb-1">שים לב:</h3>
            <p className="text-sm">
              כל המפתחות נשמרים במכשיר המקומי שלך בלבד ולא נשלחים לשרת. על מנת להשיג ביצועים מיטביים, 
              מומלץ להגדיר את כל החיבורים האפשריים ולהשתמש בפרוקסי אם הגישה מוגבלת.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealModeGuide;
