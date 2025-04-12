
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PatternRecognitionProps {
  assetId: string;
}

const PatternRecognition: React.FC<PatternRecognitionProps> = ({ assetId }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-right text-sm">תבניות נבחרות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-right">
            <p className="mb-2">המערכת מזהה מספר תבניות אפשריות לנכס {assetId}.</p>
            <ul className="list-disc list-inside space-y-1">
              <li>תבנית הכתפיים העוקפת: סבירות בינונית (65%)</li>
              <li>תמיכה משמעותית בגובה $48,500</li>
              <li>התנגדות מהותית בגובה $52,000</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-right text-sm">תבניות בעלות סבירות גבוהה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-right">
            <div className="mb-3 pb-3 border-b">
              <h3 className="font-medium mb-1">תבנית דגל עולה</h3>
              <p className="text-sm text-muted-foreground">סבירות: 78%</p>
              <p className="text-sm">אופייני למגמה עולה, עם התמשכות צפויה של העלייה</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">מנייד נר יפני</h3>
              <p className="text-sm text-muted-foreground">סבירות: 65%</p>
              <p className="text-sm">נר מקלות אורך עם פתיל תחתון משמעותי</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatternRecognition;
