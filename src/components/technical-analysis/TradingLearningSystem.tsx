import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, BookOpen, SquarePlus, BookMarked } from 'lucide-react';

interface TradingLearningSystemProps {
  assetId: string;
}

const TradingLearningSystem = ({ assetId }: TradingLearningSystemProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">מערכת למידה חכמה</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fundamentals">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="fundamentals">
              <BookOpen className="h-4 w-4 mr-2" />
              יסודות
            </TabsTrigger>
            <TabsTrigger value="patterns">
              <SquarePlus className="h-4 w-4 mr-2" />
              תבניות
            </TabsTrigger>
            <TabsTrigger value="risk">
              <Alert className="h-4 w-4 mr-2" />
              ניהול סיכונים
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Brain className="h-4 w-4 mr-2" />
              מתקדם
            </TabsTrigger>
          </TabsList>
          <TabsContent value="fundamentals" className="space-y-4 mt-4">
            <div className="text-right">
              <h3 className="text-lg font-semibold mb-2">ניתוח בסיסי</h3>
              <p>סקירה של עקרונות הניתוח הבסיסיים ביותר, כולל הבנת דוחות פיננסיים, ניתוח שוק והערכת שווי.</p>
              <Badge variant="secondary">רמת קושי: קל</Badge>
            </div>
          </TabsContent>
          <TabsContent value="patterns" className="space-y-4 mt-4">
            <div className="text-right">
              <h3 className="text-lg font-semibold mb-2">זיהוי תבניות</h3>
              <p>לימוד טכניקות לזיהוי תבניות גרפיות נפוצות ושימוש בהן לקבלת החלטות מסחר מושכלות.</p>
              <Badge variant="secondary">רמת קושי: בינוני</Badge>
            </div>
          </TabsContent>
          <TabsContent value="risk" className="space-y-4 mt-4">
            <div className="text-right">
              <h3 className="text-lg font-semibold mb-2">ניהול סיכונים</h3>
              <p>הבנת חשיבות ניהול הסיכונים במסחר ויישום אסטרטגיות להגנה על ההשקעות שלך.</p>
              <Badge variant="secondary">רמת קושי: בינוני</Badge>
            </div>
          </TabsContent>
          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="text-right">
              <h3 className="text-lg font-semibold mb-2">טכניקות מתקדמות</h3>
              <p>הצגת כלים וטכניקות מתקדמות לניתוח שוק, כולל שימוש באלגוריתמים וניתוח נתונים מורכב.</p>
              <Badge variant="secondary">רמת קושי: קשה</Badge>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradingLearningSystem;

import { Alert } from "@/components/ui/alert"
