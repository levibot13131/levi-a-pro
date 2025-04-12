
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

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
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center">
                <Badge variant="secondary" className="ml-2">
                  <ArrowUpIcon className="h-3 w-3 ml-1" />
                  קנייה
                </Badge>
                <span className="text-green-500">{formatPrice(250)} BTC</span>
              </div>
              <div className="text-sm text-gray-500">לפני 3 שעות</div>
            </div>
            
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center">
                <Badge variant="secondary" className="ml-2">
                  <ArrowDownIcon className="h-3 w-3 ml-1" />
                  מכירה
                </Badge>
                <span className="text-red-500">{formatPrice(180)} BTC</span>
              </div>
              <div className="text-sm text-gray-500">לפני 7 שעות</div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Badge variant="secondary" className="ml-2">
                  <ArrowUpIcon className="h-3 w-3 ml-1" />
                  קנייה
                </Badge>
                <span className="text-green-500">{formatPrice(430)} BTC</span>
              </div>
              <div className="text-sm text-gray-500">לפני 12 שעות</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-right text-sm">דוחות צבירה/הפצה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-right">
            <p className="mb-3">יחס צבירה/הפצה ב-7 ימים אחרונים:</p>
            <div className="flex justify-end items-center mb-2">
              <Badge className="ml-2 bg-green-500">חיובי</Badge>
              <span className="font-medium">1.4</span>
            </div>
            <p className="text-sm text-gray-600">
              היחס הנוכחי מצביע על צבירה נטו חיובית, כלומר כמות מטבעות גדולה יותר נכנסה לארנקי לוויתנים מאשר יצאה מהם בשבוע האחרון.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhaleTracker;
