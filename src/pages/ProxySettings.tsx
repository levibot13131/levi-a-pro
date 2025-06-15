
import React from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Cloud } from 'lucide-react';

const ProxySettings = () => {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-right">
            חיבורים ותקשורת
          </h1>
          <p className="text-muted-foreground text-right">
            המערכת פועלת במצב ענן מלא - ללא צורך בהגדרת פרוקסי
          </p>
        </div>

        <Alert>
          <Cloud className="h-4 w-4" />
          <AlertDescription className="text-right">
            LeviPro פועל כעת במצב ענן מלא עם חיבורים ישירים לכל ה-APIs. אין צורך בהגדרת פרוקסי או שרתים מקומיים.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center justify-end gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              סטטוס חיבורים פעילים
            </CardTitle>
            <CardDescription className="text-right">
              כל החיבורים פועלים ישירות דרך הענן
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between items-center p-3 border rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">פעיל</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">Binance API</div>
                  <div className="text-sm text-muted-foreground">חיבור ישיר לבורסה</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">פעיל</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">CoinGecko API</div>
                  <div className="text-sm text-muted-foreground">נתוני שוק בזמן אמת</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">פעיל</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">Telegram API</div>
                  <div className="text-sm text-muted-foreground">התראות אוטומטיות</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">פעיל</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">WebSocket Streams</div>
                  <div className="text-sm text-muted-foreground">נתונים בזמן אמת</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right">יתרונות מצב ענן</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-right">
            <ul className="space-y-2">
              <li className="flex items-center gap-2 justify-end">
                <span>חיבורים מהירים ויציבים</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </li>
              <li className="flex items-center gap-2 justify-end">
                <span>ללא צורך בהגדרת שרתים מקומיים</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </li>
              <li className="flex items-center gap-2 justify-end">
                <span>אבטחה מתקדמת</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </li>
              <li className="flex items-center gap-2 justify-end">
                <span>זמינות 24/7</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default ProxySettings;
