
import React from 'react';
import { Container } from '@/components/ui/container';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const FAQ = () => {
  return (
    <Container className="py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">שאלות נפוצות</h1>
          <p className="text-muted-foreground">מידע מקיף לשאלות הנפוצות ביותר</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-right">שאלות נפוצות</CardTitle>
          <CardDescription className="text-right">
            תשובות לשאלות הנפוצות ביותר לגבי המערכת
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b">
              <AccordionTrigger className="text-right">איך אני מתחבר למקורות מידע חיצוניים?</AccordionTrigger>
              <AccordionContent className="text-right">
                ניתן להתחבר למקורות מידע חיצוניים דרך עמוד חיבורי מידע. יש להזין את מפתחות ה-API הנדרשים ולאשר את החיבור. המערכת תשמור את החיבורים באופן מאובטח.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-b">
              <AccordionTrigger className="text-right">איך אני מבצע בדיקת אסטרטגיות?</AccordionTrigger>
              <AccordionContent className="text-right">
                על מנת לבצע בדיקת אסטרטגיות, יש לגשת לעמוד בדיקת אסטרטגיות, לבחור את הנכס הרצוי, את האסטרטגיה ואת טווח הזמן לבדיקה. המערכת תריץ את הבדיקה ותציג את התוצאות בצורה גרפית ומספרית.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border-b">
              <AccordionTrigger className="text-right">איך אני מקבל איתותי מסחר בזמן אמת?</AccordionTrigger>
              <AccordionContent className="text-right">
                המערכת מספקת איתותי מסחר בזמן אמת בהתבסס על האסטרטגיות שהגדרת. ניתן לראות את האיתותים בעמוד איתותי מסחר, ולהגדיר התראות שיישלחו לטלגרם או לדוא"ל כאשר מתקבל איתות חדש.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border-b">
              <AccordionTrigger className="text-right">האם המערכת מבצעת מסחר אוטומטי?</AccordionTrigger>
              <AccordionContent className="text-right">
                כן, המערכת תומכת במסחר אוטומטי דרך חיבור לפלטפורמות מסחר שונות כמו בינאנס. יש להגדיר את כללי המסחר האוטומטי בהגדרות המערכת, ולהפעיל את המסחר האוטומטי דרך עמוד המסחר האוטומטי.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-right">איך אני מנהל את הסיכונים במסחר?</AccordionTrigger>
              <AccordionContent className="text-right">
                המערכת מספקת כלים לניהול סיכונים כמו הגדרת סטופ-לוס, טייק-פרופיט, וגודל פוזיציה מקסימלי. ניתן להגדיר את כללי ניהול הסיכונים בהגדרות המערכת, והמערכת תיישם אותם באופן אוטומטי במסחר.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </Container>
  );
};

export default FAQ;
