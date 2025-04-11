
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Link2, MessageSquare, AlertCircle, BarChart2, RefreshCw } from 'lucide-react';

interface StepProps {
  number: number;
  title: string;
  description: string;
  status: 'complete' | 'in-progress' | 'pending';
  icon: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ number, title, description, status, icon }) => {
  return (
    <div className="flex space-x-4 space-x-reverse rtl:space-x-reverse">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        status === 'complete' 
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
          : status === 'in-progress'
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
      }`}>
        {number}
      </div>
      <div className="flex-1 pb-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{title}</h3>
          {status === 'complete' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
          {status === 'in-progress' && <Badge className="bg-blue-500">בתהליך</Badge>}
          {status === 'pending' && <Badge variant="outline">ממתין</Badge>}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        <div className="mt-2">
          {icon}
        </div>
      </div>
    </div>
  );
};

const IntegrationGuide: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>מדריך הקמה צעד אחר צעד</CardTitle>
      </CardHeader>
      <CardContent className="text-right">
        <p className="mb-6">
          מדריך זה יעזור לך להקים את כל מרכיבי המערכת ולחבר אותם יחד כדי ליצור אקו-סיסטם שלם למעקב שוק, ניתוח וקבלת התראות.
        </p>
        
        <div className="space-y-2">
          <Step 
            number={1}
            title="הגדרת רשימות מעקב"
            description="הוספת נכסים לרשימת המעקב והגדרת התראות"
            status="complete"
            icon={<Badge className="mr-1 bg-green-100 text-green-800 dark:bg-green-900/20">הושלם</Badge>}
          />
          
          <Separator />
          
          <Step 
            number={2}
            title="חיבור לטריידינגויו"
            description="שילוב עם TradingView לקבלת נתונים בזמן אמת וניתוחים"
            status="in-progress"
            icon={<div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-blue-500" />
              <span className="text-sm">יש לחבר את המערכת ל-TradingView דרך ההגדרות</span>
            </div>}
          />
          
          <Separator />
          
          <Step 
            number={3}
            title="הגדרת התראות בטלגרם"
            description="שליחת איתותים והתראות לקבוצת טלגרם"
            status="in-progress"
            icon={<div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="text-sm">הוגדר השירות, יש לחבר בוט טלגרם</span>
            </div>}
          />
          
          <Separator />
          
          <Step 
            number={4}
            title="הגדרת התראות בוואטסאפ"
            description="שליחת איתותים והתראות לוואטסאפ"
            status="in-progress"
            icon={<div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="text-sm">הוגדר השירות, יש להגדיר webhook</span>
            </div>}
          />
          
          <Separator />
          
          <Step 
            number={5}
            title="ניתוח מתקדם בזמן אמת"
            description="הגדרת ניתוחים טכניים אוטומטיים בזמן אמת"
            status="pending"
            icon={<div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-gray-500" />
              <span className="text-sm">המערכת תנתח נכסים ותזהה מגמות באופן אוטומטי</span>
            </div>}
          />
          
          <Separator />
          
          <Step 
            number={6}
            title="יצירת סקירות שוק אוטומטיות"
            description="הפקת סקירות שוק יומיות ושבועיות"
            status="pending"
            icon={<div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-gray-500" />
              <span className="text-sm">המערכת תפיק באופן אוטומטי סקירות מקיפות</span>
            </div>}
          />
          
          <Separator />
          
          <Step 
            number={7}
            title="סנכרון נתונים היסטוריים"
            description="שמירת וניתוח נתונים היסטוריים לשיפור ביצועים"
            status="pending"
            icon={<div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-gray-500" />
              <span className="text-sm">המערכת תשמור נתונים היסטוריים לניתוח</span>
            </div>}
          />
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <h3 className="font-semibold mb-2">מה נשאר לעשות?</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>השלמת חיבור לטריידינגויו לקבלת נתונים בזמן אמת</li>
            <li>חיבור מלא של בוט טלגרם לשליחת התראות לקבוצה</li>
            <li>הגדרת webhook לוואטסאפ</li>
            <li>הפעלת ניתוח אוטומטי בזמן אמת</li>
            <li>הגדרת מנגנון סקירות שוק אוטומטיות</li>
            <li>בדיקות מקיפות של המערכת לפני העלייה לאוויר</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationGuide;
