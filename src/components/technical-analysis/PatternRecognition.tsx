
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PatternRecognitionProps {
  assetId: string;
}

const PatternRecognition: React.FC<PatternRecognitionProps> = ({ assetId }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-right text-sm">תבניות נרות יפניים</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-right space-y-2">
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="border-green-500 text-green-600">חזק</Badge>
              <span>Bullish Engulfing</span>
            </div>
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="border-gray-400 text-gray-500">חלש</Badge>
              <span>Morning Star</span>
            </div>
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="border-yellow-500 text-yellow-600">בינוני</Badge>
              <span>Hammer</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-right text-sm">תבניות מחיר</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-right space-y-2">
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="border-green-500 text-green-600">מאומת</Badge>
              <span>דגל עולה</span>
            </div>
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="border-yellow-500 text-yellow-600">בהתהוות</Badge>
              <span>תחתית כפולה</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatternRecognition;
