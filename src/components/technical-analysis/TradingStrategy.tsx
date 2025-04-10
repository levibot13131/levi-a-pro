
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Lightbulb, ActivitySquare } from 'lucide-react';
import { tradingApproach, riskManagementRules } from '@/services/customTradingStrategyService';

const TradingStrategy: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right text-xl">
          {tradingApproach.name}
        </CardTitle>
        <CardDescription className="text-right">
          {tradingApproach.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-right mb-2 flex items-center justify-end gap-2">
              <ActivitySquare className="h-4 w-4" />
              עקרונות מפתח
            </h3>
            <ul className="space-y-2 text-right">
              {tradingApproach.keyPrinciples.map((principle, idx) => (
                <li key={idx} className="flex items-center gap-2 justify-end">
                  <span>{principle}</span>
                  <span className="text-primary text-sm font-bold">{idx + 1}.</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-right mb-2 flex items-center justify-end gap-2">
              <ShieldAlert className="h-4 w-4" />
              כללי ניהול סיכונים
            </h3>
            <div className="space-y-2">
              {riskManagementRules.map((rule) => (
                <div key={rule.id} className="border rounded-md p-3">
                  <div className="flex items-center justify-between mb-1">
                    <Badge className={
                      rule.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                      rule.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                      rule.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    }>
                      {rule.priority === 'critical' ? 'קריטי' : 
                       rule.priority === 'high' ? 'גבוה' : 
                       rule.priority === 'medium' ? 'בינוני' : 'נמוך'}
                    </Badge>
                    <Badge className={
                      rule.rule.includes('סטופ') ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                      rule.rule.includes('פוזיציה') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      rule.rule.includes('פסיכולוגיה') ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }>
                      {rule.rule.includes('סטופ') ? 'סטופ לוס' : 
                       rule.rule.includes('פוזיציה') ? 'גודל פוזיציה' : 
                       rule.rule.includes('פסיכולוגיה') ? 'פסיכולוגיה' : 'כללי'}
                    </Badge>
                  </div>
                  <p className="text-right">{rule.explanation}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-right mb-2 flex items-center justify-end gap-2">
              <Lightbulb className="h-4 w-4" />
              איך לשלב בניתוח
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-right">
              <p className="mb-2">כדי לשלב את השיטה בניתוח הטכני:</p>
              <ol className="list-decimal list-inside space-y-1 mr-4">
                <li>זהה את המגמה הראשית בטווח הארוך (1D ומעלה)</li>
                <li>אתר תבניות מחיר בטווח הבינוני (4H)</li>
                <li>חפש נקודות כניסה בטווח הקצר (1H, 15M)</li>
                <li>ודא התאמה בין כל טווחי הזמן</li>
                <li>הגדר מראש סטופ לוס וגודל פוזיציה</li>
              </ol>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingStrategy;
