
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SetupGuideProps {
  hasActiveDestinations: boolean;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const SetupGuide: React.FC<SetupGuideProps> = ({ 
  hasActiveDestinations, 
  showSettings, 
  setShowSettings 
}) => {
  if (hasActiveDestinations && !showSettings) {
    return (
      <Card className="mb-6 border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-end gap-3 text-green-800">
            <div>
              <p className="font-medium text-right">יעדי התראות מוגדרים</p>
              <p className="text-sm text-right text-green-600">המערכת מוכנה לשליחת התראות ליעדים שהגדרת</p>
            </div>
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!hasActiveDestinations && !showSettings) {
    return (
      <Card className="mb-6 border-yellow-200 bg-yellow-50">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <CardTitle className="text-right text-yellow-800">הגדרה ראשונית נדרשת</CardTitle>
          </div>
          <CardDescription className="text-right text-yellow-700">
            יש להגדיר יעד להתראות לפני הפעלת ניתוח בזמן אמת
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="rounded-md bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3 text-right justify-end">
                <div>
                  <p className="font-medium">הגדר יעדי התראות</p>
                  <p className="text-sm text-muted-foreground">הוסף לפחות יעד אחד (Webhook) לקבלת התראות</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                  1
                </div>
              </div>
            </div>
            
            <div className="rounded-md bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3 text-right justify-end">
                <div>
                  <p className="font-medium">הפעל את הניתוח בזמן אמת</p>
                  <p className="text-sm text-muted-foreground">לחץ על כפתור "הפעל ניתוח בזמן אמת" בראש העמוד</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                  2
                </div>
              </div>
            </div>
            
            <div className="rounded-md bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3 text-right justify-end">
                <div>
                  <p className="font-medium">קבל התראות בזמן אמת</p>
                  <p className="text-sm text-muted-foreground">המערכת תשלח התראות כאשר מזוהים איתותי מסחר</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                  3
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowSettings(true)} 
              className="w-full mt-2"
            >
              <Zap className="h-4 w-4 mr-2" />
              הגדר יעדי התראות עכשיו
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return null;
};

export default SetupGuide;
