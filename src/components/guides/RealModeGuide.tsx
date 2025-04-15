
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, BookOpen, Check, CheckCircle2, ExternalLink, 
  Key, Link2, ToggleLeft, ToggleRight, Zap 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { isBinanceConnected } from '@/services/binance/credentials';
import { isTradingViewConnected } from '@/services/tradingView/tradingViewAuthService';
import { setRealTimeMode, isRealTimeMode } from '@/services/binance/marketData';

const RealModeGuide: React.FC = () => {
  const binanceConnected = isBinanceConnected();
  const tradingViewConnected = isTradingViewConnected();
  const isRealMode = isRealTimeMode();
  
  const handleToggleRealMode = () => {
    setRealTimeMode(!isRealMode);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-right">מדריך למעבר ממצב דמו למצב אמיתי</CardTitle>
        <CardDescription className="text-right">
          כיצד להשתמש בנתונים אמיתיים במקום דמו במערכת
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert className={`${isRealMode ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
            <AlertDescription className="text-right flex items-center justify-between">
              <Button onClick={handleToggleRealMode} variant="outline" size="sm">
                {isRealMode ? (
                  <span className="flex items-center gap-2">
                    <ToggleRight className="h-4 w-4 text-green-600" />
                    מצב אמיתי פעיל
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ToggleLeft className="h-4 w-4" />
                    הפעל מצב אמיתי
                  </span>
                )}
              </Button>
              <span>
                המערכת כרגע במצב: <strong>{isRealMode ? 'אמיתי' : 'דמו'}</strong>
              </span>
            </AlertDescription>
          </Alert>
          
          <div className="mb-2 p-4 rounded-md bg-green-50 border border-green-200">
            <h3 className="font-semibold text-right mb-2 flex items-center justify-end">
              <Zap className="ml-2 h-5 w-5 text-green-600" />
              שלב 1: הפעלת מצב אמיתי
            </h3>
            <ul className="list-inside space-y-2 text-right">
              <li className="flex items-center justify-end gap-2">
                <span>לחץ על כפתור "הפעל מצב אמיתי" למעלה</span>
                {isRealMode ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                )}
              </li>
              <li className="flex items-center justify-end gap-2">
                <span>ודא שהטוגל במסך מציג "מצב אמיתי פעיל"</span>
                {isRealMode ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                )}
              </li>
              <li className="text-sm text-muted-foreground mt-1">
                שים לב: הגדרה זו נשמרת בדפדפן ותישאר פעילה גם לאחר רענון הדף
              </li>
            </ul>
          </div>
          
          <Tabs defaultValue="binance">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="binance">Binance</TabsTrigger>
              <TabsTrigger value="tradingview">TradingView</TabsTrigger>
            </TabsList>
            
            <TabsContent value="binance" className="space-y-4 mt-4">
              <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
                <h3 className="font-semibold text-right mb-2 flex items-center justify-end">
                  <Key className="ml-2 h-5 w-5 text-blue-600" />
                  שלב 2: חיבור ל-Binance
                </h3>
                <ul className="list-inside space-y-2 text-right">
                  <li className="flex items-center justify-end gap-2">
                    <span>התחבר לחשבון Binance שלך</span>
                    {binanceConnected ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                    )}
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span>הזן את מפתחות ה-API של Binance</span>
                    {binanceConnected ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                    )}
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span>הפעל את "מצב נתונים אמיתיים" במסך אינטגרציית Binance</span>
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                  </li>
                </ul>
                
                <div className="mt-4 flex justify-center">
                  <Button asChild variant="outline">
                    <Link to="/binance">
                      <Link2 className="h-4 w-4 mr-2" />
                      עבור למסך אינטגרציית Binance
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="p-4 rounded-md bg-muted">
                <h3 className="font-semibold text-right mb-2">יצירת מפתחות API בבינאנס</h3>
                <ol className="list-decimal list-inside space-y-1 text-right text-sm">
                  <li>היכנס לחשבון Binance שלך</li>
                  <li>נווט ל-API Management (בדרך כלל בהגדרות חשבון)</li>
                  <li>לחץ על "Create API"</li>
                  <li>תן שם למפתח (למשל "Crypto Trading App")</li>
                  <li>העתק את ה-API Key וה-Secret Key</li>
                  <li>הזן את המפתחות במערכת</li>
                </ol>
                
                <div className="mt-3 text-center">
                  <a 
                    href="https://www.binance.com/en/my/settings/api-management" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm inline-flex items-center"
                  >
                    פתח את דף ניהול ה-API בבינאנס
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tradingview" className="space-y-4 mt-4">
              <div className="p-4 rounded-md bg-purple-50 border border-purple-200">
                <h3 className="font-semibold text-right mb-2 flex items-center justify-end">
                  <Key className="ml-2 h-5 w-5 text-purple-600" />
                  שלב 3: חיבור ל-TradingView
                </h3>
                <ul className="list-inside space-y-2 text-right">
                  <li className="flex items-center justify-end gap-2">
                    <span>התחבר לחשבון TradingView שלך</span>
                    {tradingViewConnected ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                    )}
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span>ודא שהנתונים מתעדכנים בזמן אמת</span>
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                  </li>
                </ul>
                
                <div className="mt-4 flex justify-center">
                  <Button asChild variant="outline">
                    <Link to="/technical-analysis">
                      <Link2 className="h-4 w-4 mr-2" />
                      עבור למסך ניתוח טכני
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="p-4 rounded-md bg-green-50 border border-green-200">
            <h3 className="font-semibold text-right mb-2 flex items-center justify-end">
              <BookOpen className="ml-2 h-5 w-5 text-green-600" />
              טיפים נוספים
            </h3>
            <ul className="list-disc list-inside space-y-1 text-right text-sm">
              <li>לאחר הפעלת מצב אמיתי והתחברות, יש לעתים צורך לרענן את הדף</li>
              <li>ניתן לבדוק אם המערכת פועלת במצב אמיתי על ידי בדיקת התעודת זהות של הנתונים</li>
              <li>בעת שימוש במצב אמיתי, הנתונים יתעדכנו בקצב מהיר יותר</li>
              <li>לניתוחים מתקדמים, מומלץ להתחבר גם ל-TradingView וגם ל-Binance</li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={handleToggleRealMode} className="w-48">
              {isRealMode ? (
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  מצב אמיתי פעיל
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  הפעל מצב אמיתי
                </span>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealModeGuide;
