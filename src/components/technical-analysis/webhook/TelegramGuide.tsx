
import React from 'react';
import { AlertCircle, BrandTelegram, ChevronLeft, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const TelegramGuide: React.FC = () => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg text-right flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-amber-500" />
        מדריך להתחברות עם בוט טלגרם
      </h3>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-100 dark:border-blue-800">
        <h4 className="font-medium text-right mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-300">
          <BrandTelegram className="h-5 w-5" />
          שלבים להקמת בוט טלגרם והתחברות למערכת
        </h4>
        
        <ol className="list-decimal list-inside rtl space-y-4 text-right text-sm">
          <li className="font-medium">פתח את טלגרם וחפש את @BotFather</li>
          <div className="mr-6 bg-white dark:bg-gray-800 p-3 rounded-md text-xs">
            <p>זהו בוט רשמי של טלגרם שמאפשר לך ליצור בוטים משלך.</p>
            <p className="mt-1">פתח צ'אט עם @BotFather והתחל שיחה.</p>
          </div>
          
          <Separator className="my-1" />
          
          <li className="font-medium">התחל צ'אט ושלח את הפקודה /newbot</li>
          <div className="mr-6 bg-white dark:bg-gray-800 p-3 rounded-md text-xs">
            <p>BotFather יבקש ממך לבחור:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>שם לבוט שלך (שם תצוגה)</li>
              <li>שם משתמש לבוט (חייב להסתיים ב-bot, למשל: trading_signals_bot)</li>
            </ul>
          </div>
          
          <Separator className="my-1" />
          
          <li className="font-medium">שמור את הטוקן של הבוט</li>
          <div className="mr-6 bg-white dark:bg-gray-800 p-3 rounded-md text-xs">
            <p>לאחר יצירת הבוט, תקבל הודעה עם טוקן שנראה בערך כך:</p>
            <pre className="bg-gray-100 dark:bg-gray-700 p-1 mt-1 rounded text-[10px] overflow-x-auto">
              123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
            </pre>
            <p className="mt-1 font-bold">שמור את הטוקן הזה! הוא יידרש לחיבור למערכת.</p>
          </div>
          
          <Separator className="my-1" />
          
          <li className="font-medium">הוסף את הבוט לקבוצה או התחל שיחה פרטית</li>
          <div className="mr-6 bg-white dark:bg-gray-800 p-3 rounded-md text-xs">
            <p>יש לך שתי אפשרויות:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>התחל שיחה פרטית עם הבוט (לקבלת התראות פרטיות)</li>
              <li>הוסף את הבוט לקבוצה (לשיתוף התראות עם משתמשים נוספים)</li>
            </ul>
          </div>
          
          <Separator className="my-1" />
          
          <li className="font-medium">קבל את מזהה הצ'אט (Chat ID)</li>
          <div className="mr-6 bg-white dark:bg-gray-800 p-3 rounded-md text-xs">
            <p>שלח הודעה כלשהי בצ'אט שבו נמצא הבוט, ואז גש לכתובת הבאה בדפדפן:</p>
            <pre className="bg-gray-100 dark:bg-gray-700 p-1 mt-1 rounded text-[10px] overflow-x-auto">
              https://api.telegram.org/bot[YOUR-BOT-TOKEN]/getUpdates
            </pre>
            <p className="mt-1">החלף את [YOUR-BOT-TOKEN] בטוקן שקיבלת בשלב 3.</p>
            <p className="mt-1">בתוצאה שתקבל חפש את השדה "chat" ובתוכו "id". זהו ה-Chat ID שלך.</p>
            <p className="mt-1">לדוגמה:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>צ'אט פרטי: מספר כמו "123456789"</li>
              <li>קבוצה: מספר שלילי כמו "-1001234567890"</li>
            </ul>
          </div>
          
          <Separator className="my-1" />
          
          <li className="font-medium">הזן את הנתונים במערכת</li>
          <div className="mr-6 bg-white dark:bg-gray-800 p-3 rounded-md text-xs">
            <p>כעת, הזן במערכת את:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Bot Token - הטוקן שקיבלת מ-BotFather</li>
              <li>Chat ID - מזהה הצ'אט שמצאת בשלב הקודם</li>
            </ul>
            <p className="mt-1">לחץ על "חבר לטלגרם" כדי להשלים את התהליך.</p>
          </div>
          
          <Separator className="my-1" />
          
          <li className="font-medium">בדוק את החיבור</li>
          <div className="mr-6 bg-white dark:bg-gray-800 p-3 rounded-md text-xs">
            <p>לאחר החיבור, לחץ על "שלח הודעת בדיקה" כדי לוודא שהכל עובד כראוי.</p>
            <p className="mt-1">אם ההודעה התקבלה בטלגרם - החיבור הושלם בהצלחה!</p>
          </div>
        </ol>
      </div>
      
      <div className="flex justify-center mt-4 gap-2">
        <a 
          href="https://core.telegram.org/bots" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
        >
          <ChevronLeft className="h-4 w-4" />
          תיעוד רשמי של טלגרם
        </a>
        <a 
          href="https://t.me/botfather" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
        >
          פתח את BotFather
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default TelegramGuide;
