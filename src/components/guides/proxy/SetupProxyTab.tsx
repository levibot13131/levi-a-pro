
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

const SetupProxyTab = () => {
  return (
    <div className="text-base space-y-4">
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
  );
};

export default SetupProxyTab;
