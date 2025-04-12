
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink } from 'lucide-react';

interface ConnectionGuideProps {
  onClose?: () => void;
}

const ConnectionGuide: React.FC<ConnectionGuideProps> = ({ onClose }) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-right">מדריך התחברות למערכת</CardTitle>
        <CardDescription className="text-right">
          הנחיות להתחברות למערכות החיצוניות כדי לקבל נתונים בזמן אמת
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="binance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="binance">Binance</TabsTrigger>
            <TabsTrigger value="tradingview">TradingView</TabsTrigger>
            <TabsTrigger value="twitter">Twitter</TabsTrigger>
          </TabsList>
          
          <TabsContent value="binance" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-right">התחברות ל-Binance</h3>
              <ol className="text-right space-y-2 list-decimal list-inside">
                <li>היכנס לחשבון ה-Binance שלך</li>
                <li>לך להגדרות API בחשבון שלך</li>
                <li>צור מפתח API חדש (מומלץ עם הרשאות קריאה בלבד)</li>
                <li>העתק את מפתח ה-API ואת הסיסמה הסודית</li>
                <li>חזור למערכת והזן את הפרטים בדף אינטגרציית Binance</li>
              </ol>
              <div className="bg-muted p-3 mt-4 rounded-md">
                <p className="text-right font-medium">קישור ישיר:</p>
                <a href="https://www.binance.com/en/my/settings/api-management" 
                   target="_blank" rel="noopener noreferrer"
                   className="text-primary flex items-center justify-end hover:underline">
                  <ExternalLink className="h-4 w-4 ml-1" />
                  דף ניהול ה-API של Binance
                </a>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tradingview" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-right">התחברות ל-TradingView</h3>
              <ol className="text-right space-y-2 list-decimal list-inside">
                <li>היכנס לחשבון ה-TradingView שלך</li>
                <li>לך להגדרות החשבון</li>
                <li>ב"אבטחה והרשאות" תמצא את מפתחות ה-API</li>
                <li>צור מפתח API חדש אם צריך</li>
                <li>העתק את שם המשתמש והמפתח</li>
                <li>חזור למערכת והזן את הפרטים בדף אינטגרציית TradingView</li>
              </ol>
              <div className="bg-muted p-3 mt-4 rounded-md">
                <p className="text-right font-medium">שים לב:</p>
                <p className="text-right text-sm text-muted-foreground">
                  כרגע, החיבור פועל במצב סימולציה לצורכי הדגמה. בפיתוח עתידי, יתווסף חיבור אמיתי ל-TradingView.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="twitter" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-right">התחברות ל-Twitter/X</h3>
              <ol className="text-right space-y-2 list-decimal list-inside">
                <li>צור חשבון פיתוח ב-Twitter Developer Portal</li>
                <li>צור פרויקט ואפליקציה חדשים</li>
                <li>בקש הרשאות לקריאת ציוצים ומידע</li>
                <li>קבל את מפתח ה-API, מפתח סודי ו-Bearer Token</li>
                <li>הזן את הפרטים במערכת בדף ניתוח הסנטימנט</li>
              </ol>
              <div className="bg-muted p-3 mt-4 rounded-md">
                <p className="text-right font-medium">קישור ישיר:</p>
                <a href="https://developer.twitter.com/en/portal/dashboard" 
                   target="_blank" rel="noopener noreferrer"
                   className="text-primary flex items-center justify-end hover:underline">
                  <ExternalLink className="h-4 w-4 ml-1" />
                  Twitter Developer Portal
                </a>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="justify-end">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            סגור
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ConnectionGuide;
