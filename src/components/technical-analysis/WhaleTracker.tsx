
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WhaleTrackerProps {
  assetId: string;
  formatPrice: (price: number) => string;
}

const WhaleTracker: React.FC<WhaleTrackerProps> = ({ assetId, formatPrice }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-right text-sm">תנועות לוויתנים אחרונות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-right space-y-3">
            <div className="border p-3 rounded-md">
              <div className="flex justify-between items-start mb-1">
                <Badge variant="outline" className="bg-green-100 text-green-800">קנייה</Badge>
                <div>
                  <p className="font-medium">1,500 BTC</p>
                  <p className="text-xs text-muted-foreground">לפני 3 שעות</p>
                </div>
              </div>
              <div className="text-sm">
                <p>ארנק: bc1q...34jk</p>
                <p>שווי: {formatPrice(1500 * 45000)} USD</p>
              </div>
            </div>
            
            <div className="border p-3 rounded-md">
              <div className="flex justify-between items-start mb-1">
                <Badge variant="outline" className="bg-red-100 text-red-800">מכירה</Badge>
                <div>
                  <p className="font-medium">850 BTC</p>
                  <p className="text-xs text-muted-foreground">לפני 8 שעות</p>
                </div>
              </div>
              <div className="text-sm">
                <p>ארנק: bc1q...87fg</p>
                <p>שווי: {formatPrice(850 * 45500)} USD</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-right text-sm">זרימת לוויתנים - 7 ימים אחרונים</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-right space-y-2">
            <div className="flex justify-between">
              <span className="text-green-500 font-medium">+3,200 BTC</span>
              <span>קניות נטו</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-500 font-medium">-1,800 BTC</span>
              <span>מכירות נטו</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-blue-500">+1,400 BTC</span>
              <span>מאזן נטו</span>
            </div>
            <p className="text-sm mt-2">התנהגות הלוויתנים מצביעה על אמון בשוק בטווח הארוך.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhaleTracker;
