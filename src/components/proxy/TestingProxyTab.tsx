
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const TestingProxyTab = () => {
  return (
    <div className="text-base space-y-4">
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
            <li>לחץ על "הגדרות" {'>'} "חיבורים ותקשורת"</li>
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
  );
};

export default TestingProxyTab;
