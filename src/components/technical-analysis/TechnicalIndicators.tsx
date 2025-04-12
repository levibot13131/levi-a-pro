
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TechnicalIndicatorsProps {
  assetId: string;
}

const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({ assetId }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-right text-sm">מומנטום ו-RSI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-right">
            <p>מדדי מומנטום מצביעים על כיוון מגמה חיובי לנכס {assetId}.</p>
            <div className="mt-2">
              <div className="flex justify-between items-center">
                <span className="text-green-500">70</span>
                <span className="font-medium">RSI (14)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-500">0.1</span>
                <span className="font-medium">MACD</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-right text-sm">מדדי תנודתיות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-right">
            <p>תנודתיות ברמה בינונית עם מגמת ירידה.</p>
            <div className="mt-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-500">1.2%</span>
                <span className="font-medium">בולינגר</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-500">0.24</span>
                <span className="font-medium">ATR (14)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalIndicators;
