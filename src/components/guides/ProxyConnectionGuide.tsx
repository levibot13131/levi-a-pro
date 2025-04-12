
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Info, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ProxyConnectionGuide = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-right text-xl lg:text-2xl">מדריך מפורט להתחברות לשרת פרוקסי</CardTitle>
        <CardDescription className="text-right text-base">
          מדריך מדוייק להתחברות לשרת פרוקסי ללא ידע מקדים
        </CardDescription>
      </CardHeader>
      <CardContent className="text-right">
        <Tabs defaultValue="what-is" className="w-full space-y-5">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="what-is">מה זה פרוקסי?</TabsTrigger>
            <TabsTrigger value="when-use">מתי להשתמש?</TabsTrigger>
            <TabsTrigger value="setup">הגדרה</TabsTrigger>
            <TabsTrigger value="testing">בדיקה</TabsTrigger>
          </TabsList>
          
          <TabsContent value="what-is" className="space-y-4">
            <div className="text-base">
              <h3 className="text-lg font-bold mb-2">מה זה שרת פרוקסי?</h3>
              <p className="mb-3">
                שרת פרוקסי הוא שרת ביניים שמשמש כמתווך בין המחשב שלך לאינטרנט. 
                הוא מאפשר לך לגלוש באינטרנט דרך כתובת IP אחרת, ובכך להסתיר את כתובת ה-IP האמיתית שלך.
              </p>
              
              <div className="bg-muted p-4 rounded-md my-4">
                <h4 className="font-semibold mb-2">יתרונות שימוש בפרוקסי:</h4>
                <ul className="space-y-2 list-disc pr-5">
                  <li>הסתרת כתובת ה-IP האמיתית שלך</li>
                  <li>גישה לתוכן שחסום גיאוגרפית</li>
                  <li>עקיפת חסימות של אתרים על ידי ספקי אינטרנט</li>
                  <li>שיפור האבטחה ברשתות ציבוריות</li>
                  <li>אפשרות גישה למקורות מידע מסחריים המוגבלים למיקומים מסוימים</li>
                </ul>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>מידע חשוב</AlertTitle>
                <AlertDescription>
                  שרת פרוקסי לא מספק הצפנה מלאה של התעבורה שלך, בניגוד ל-VPN. אם אתה צריך אבטחה מלאה, שקול להשתמש ב-VPN.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          
          <TabsContent value="when-use" className="space-y-4">
            <div className="text-base">
              <h3 className="text-lg font-bold mb-2">מתי כדאי להשתמש בשרת פרוקסי?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">למסחר באלגוטריידינג</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p>
                      כאשר משתמשים בבוטים אוטומטיים למסחר, פרוקסי יכול לעזור לעקוף מגבלות של API ולהפחית את הסיכוי לחסימה.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">לגישה למידע מוגבל</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p>
                      מחקר שוק ואיסוף נתונים ממקורות שונים שעשויים להיות מוגבלים גיאוגרפית.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">שימוש בבורסות קריפטו</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p>
                      גישה לבורסות קריפטו שאינן זמינות באזור שלך או עקיפת מגבלות גיאוגרפיות.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">הגנה על פרטיות</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p>
                      שמירה על פרטיותך בעת ביצוע מחקר שוק או פעילות מסחרית רגישה.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>אזהרה</AlertTitle>
                <AlertDescription>
                  השימוש בפרוקסי עלול להיות מנוגד לתנאי השימוש של שירותים מסוימים. וודא שאתה פועל בהתאם לחוקים ולתנאי השימוש הרלוונטיים.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          
          <TabsContent value="setup" className="space-y-4">
            <div className="text-base">
              <h3 className="text-lg font-bold mb-2">הגדרת שרת פרוקסי - מדריך צעד אחר צעד</h3>
              
              <div className="space-y-6 my-4">
                <div className="border rounded-lg p-4 bg-background">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <span className="inline-block rounded-full bg-primary/10 text-primary w-6 h-6 text-center mr-2">1</span>
                    רכישת שירות פרוקסי
                  </h4>
                  <div className="pr-8">
                    <p className="mb-2">בחר ספק פרוקסי אמין. מומלצים:</p>
                    <ul className="list-disc pr-5 space-y-1">
                      <li>BrightData (לשעבר Luminati)</li>
                      <li>SmartProxy</li>
                      <li>Oxylabs</li>
                      <li>IPRoyal</li>
                    </ul>
                    <p className="mt-2">לאחר ההרשמה, תקבל פרטי התחברות שיכללו:</p>
                    <ul className="pr-5 space-y-1 mt-1">
                      <li><strong>כתובת שרת הפרוקסי:</strong> בדרך כלל IP או דומיין</li>
                      <li><strong>פורט:</strong> מספר בין 1-65535</li>
                      <li><strong>שם משתמש וסיסמה:</strong> אם נדרשת אימות</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-background">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <span className="inline-block rounded-full bg-primary/10 text-primary w-6 h-6 text-center mr-2">2</span>
                    קביעת תצורה בדפדפן
                  </h4>
                  <div className="pr-8">
                    <p className="font-medium">בדפדפן Chrome:</p>
                    <ol className="list-decimal pr-5 space-y-1 mt-1 mb-3">
                      <li>פתח את התפריט (שלוש נקודות אנכיות בפינה הימנית העליונה)</li>
                      <li>לחץ על "הגדרות"</li>
                      <li>גלול למטה ולחץ על "הצג הגדרות מתקדמות"</li>
                      <li>תחת "מערכת", לחץ על "פתח את הגדרות הפרוקסי של המחשב"</li>
                      <li>הזן את כתובת השרת והפורט בשדות המתאימים</li>
                      <li>אם נדרש אימות, תצטרך להזין שם משתמש וסיסמה כשתתבקש</li>
                    </ol>
                    
                    <p className="font-medium">בדפדפן Firefox:</p>
                    <ol className="list-decimal pr-5 space-y-1 mt-1">
                      <li>פתח את התפריט (שלושה פסים בפינה הימנית העליונה)</li>
                      <li>לחץ על "אפשרויות" / "העדפות"</li>
                      <li>גלול למטה ולחץ על "הגדרות רשת"</li>
                      <li>סמן "קבע תצורת פרוקסי ידנית"</li>
                      <li>הזן את כתובת השרת והפורט בשדות המתאימים</li>
                      <li>סמן את האפשרות "השתמש בפרוקסי זה גם עבור HTTPS" אם נדרש</li>
                      <li>לחץ על "אישור"</li>
                    </ol>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-background">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <span className="inline-block rounded-full bg-primary/10 text-primary w-6 h-6 text-center mr-2">3</span>
                    שימוש בפרוקסי באפליקציה
                  </h4>
                  <div className="pr-8">
                    <p className="mb-2">להגדרת פרוקסי באפליקציה זו:</p>
                    <ol className="list-decimal pr-5 space-y-2 mt-1">
                      <li>
                        לחץ על "הגדרות" בתפריט הניווט
                      </li>
                      <li>
                        בחר את הכרטיסיה "חיבורים ותקשורת"
                      </li>
                      <li>
                        מלא את פרטי הפרוקסי:
                        <ul className="list-disc pr-5 space-y-1 mt-1">
                          <li>כתובת השרת (לדוגמה: proxy.example.com)</li>
                          <li>מספר הפורט (לדוגמה: 8080)</li>
                          <li>פרוטוקול (HTTP, HTTPS, SOCKS5)</li>
                          <li>שם משתמש וסיסמה (אם נדרש)</li>
                        </ul>
                      </li>
                      <li>
                        לחץ על "שמור" להחלת ההגדרות
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <Alert className="bg-green-500/10 border-green-500 text-green-500">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>טיפ</AlertTitle>
                <AlertDescription>
                  רוב ספקי הפרוקסי מספקים הוראות מפורטות להגדרה בפלטפורמות שונות. בדוק באתר הספק שלך לקבלת הנחיות ספציפיות.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          
          <TabsContent value="testing" className="space-y-4">
            <div className="text-base">
              <h3 className="text-lg font-bold mb-2">בדיקת החיבור לפרוקסי</h3>
              
              <div className="space-y-4 my-4">
                <p>
                  לאחר הגדרת הפרוקסי, חשוב לוודא שהוא עובד כראוי. הנה כמה דרכים לבדוק את החיבור שלך:
                </p>
                
                <div className="border rounded-lg p-4 bg-background">
                  <h4 className="font-semibold mb-2">בדיקת כתובת ה-IP שלך</h4>
                  <p className="mb-2">
                    בקר באחד מהאתרים הבאים כדי לראות את כתובת ה-IP הנוכחית שלך. אם הפרוקסי פעיל, תראה את כתובת ה-IP של שרת הפרוקסי ולא את הכתובת האמיתית שלך:
                  </p>
                  <ul className="list-disc pr-5 space-y-1">
                    <li>whatismyip.com</li>
                    <li>iplocation.net</li>
                    <li>whatismyipaddress.com</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 bg-background">
                  <h4 className="font-semibold mb-2">בדיקת דליפות DNS</h4>
                  <p className="mb-2">
                    לפעמים, גם אם הפרוקסי מסתיר את כתובת ה-IP שלך, עדיין יכולות להיות דליפות DNS שחושפות את הפעילות שלך. בדוק באתר:
                  </p>
                  <ul className="list-disc pr-5">
                    <li>dnsleaktest.com</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 bg-background">
                  <h4 className="font-semibold mb-2">בדיקת מהירות החיבור</h4>
                  <p className="mb-2">
                    פרוקסי יכול להאט את החיבור שלך. בדוק את מהירות החיבור שלך עם הפרוקסי:
                  </p>
                  <ul className="list-disc pr-5">
                    <li>speedtest.net</li>
                    <li>fast.com</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 bg-background">
                  <h4 className="font-semibold mb-2">בדיקה באפליקציה</h4>
                  <p className="mb-2">
                    לאחר הגדרת הפרוקסי באפליקציה, תוכל לבדוק את החיבור:
                  </p>
                  <ol className="list-decimal pr-5 space-y-1">
                    <li>לחץ על "הגדרות" > "חיבורים ותקשורת"</li>
                    <li>לחץ על כפתור "בדוק חיבור פרוקסי"</li>
                    <li>המערכת תבדוק את החיבור ותציג את התוצאות</li>
                  </ol>
                </div>
              </div>
              
              <Alert className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>פתרון בעיות</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">אם הפרוקסי אינו עובד:</p>
                  <ul className="list-disc pr-5 space-y-1">
                    <li>ודא שהזנת את כתובת הפרוקסי והפורט הנכונים</li>
                    <li>בדוק שהזנת שם משתמש וסיסמה נכונים (אם נדרש)</li>
                    <li>וודא שחבילת הפרוקסי שרכשת עדיין בתוקף</li>
                    <li>נסה להשתמש בפרוטוקול אחר (HTTP, HTTPS או SOCKS)</li>
                    <li>פנה לשירות הלקוחות של ספק הפרוקסי לקבלת עזרה</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProxyConnectionGuide;
