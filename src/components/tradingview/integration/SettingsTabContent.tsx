
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Clock } from 'lucide-react';
import { useTradingViewIntegration } from '../../../hooks/use-tradingview-integration';

const SettingsTabContent: React.FC = () => {
  const { syncEnabled, toggleAutoSync } = useTradingViewIntegration();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">הגדרות אינטגרציה</CardTitle>
      </CardHeader>
      <CardContent className="text-right">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md mb-4">
            <h3 className="font-semibold mb-2">הוראות סנכרון TradingView:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>התחבר לחשבון TradingView שלך</li>
              <li>הפעל את סנכרון אוטומטי לעדכוני מחיר</li>
              <li>הגדר התראות עבור הנכסים שברצונך לעקוב אחריהם</li>
              <li>קבל עדכונים בזמן אמת ישירות לתוך המערכת</li>
            </ol>
          </div>
          
          <div className="flex items-center justify-between mb-4 p-4 border rounded-md">
            <Button 
              variant={syncEnabled ? "default" : "outline"}
              onClick={toggleAutoSync}
              className="gap-1"
            >
              <Clock className="h-4 w-4" />
              {syncEnabled ? 'כיבוי סנכרון אוטומטי' : 'הפעלת סנכרון אוטומטי'}
            </Button>
            
            <div className="text-right">
              <h3 className="font-medium mb-1">סנכרון נתונים בזמן אמת</h3>
              <p className="text-sm text-muted-foreground">
                {syncEnabled 
                  ? 'נתונים מתעדכנים אוטומטית כל 30 שניות' 
                  : 'הפעל סנכרון אוטומטי לקבלת עדכונים בזמן אמת'}
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
            <h3 className="font-semibold mb-2">יתרונות האינטגרציה:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>גישה למידע מחירים בזמן אמת</li>
              <li>קבלת חדשות עדכניות מהשוק</li>
              <li>התראות מותאמות אישית</li>
              <li>גישה למגוון רחב של כלי ניתוח טכני</li>
              <li>סנכרון הגדרות בין חשבון TradingView למערכת</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsTabContent;
