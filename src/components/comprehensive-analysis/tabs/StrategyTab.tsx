
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, LineChart, ListChecks, BookMarked } from 'lucide-react';

interface UserStrategy {
  description: string;
  riskRules: string[];
  entryRules: string[];
  exitRules: string[];
}

interface StrategyTabProps {
  userStrategy: UserStrategy;
}

const StrategyTab: React.FC<StrategyTabProps> = ({ userStrategy }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">האסטרטגיה האישית שלי</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-right">
          <p className="mb-6">{userStrategy.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Risk Management Rules */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <ShieldCheck className="h-5 w-5 ml-2 text-red-500" />
                <h3 className="font-semibold">ניהול סיכונים</h3>
              </div>
              <ul className="list-disc mr-5 space-y-2 text-sm">
                {userStrategy.riskRules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
            
            {/* Entry Rules */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <LineChart className="h-5 w-5 ml-2 text-blue-500" />
                <h3 className="font-semibold">כללי כניסה</h3>
              </div>
              <ul className="list-disc mr-5 space-y-2 text-sm">
                {userStrategy.entryRules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
            
            {/* Exit Rules */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <ListChecks className="h-5 w-5 ml-2 text-green-500" />
                <h3 className="font-semibold">כללי יציאה</h3>
              </div>
              <ul className="list-disc mr-5 space-y-2 text-sm">
                {userStrategy.exitRules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col items-center">
            <Button className="gap-2 mb-2">
              <BookMarked className="h-4 w-4 ml-1" />
              עדכן אסטרטגיה
            </Button>
            <p className="text-sm text-gray-500 max-w-md text-center">
              ניתן לערוך ולהתאים את האסטרטגיה בהתאם לצרכים שלך ולהגדרות השוק המשתנות
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategyTab;
