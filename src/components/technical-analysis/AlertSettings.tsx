
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

const AlertSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">הגדרות התראות</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-right">
          <div>
            <h3 className="font-medium mb-2">ערוצי התראות</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2 border rounded-md">
                <Button variant="outline" size="sm">הגדר</Button>
                <div className="flex items-center gap-2">
                  <span>Telegram</span>
                  <Send className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-center justify-between p-2 border rounded-md">
                <Button variant="outline" size="sm">הגדר</Button>
                <div className="flex items-center gap-2">
                  <span>WhatsApp</span>
                  <Send className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">סוגי התראות</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <input type="checkbox" id="price_alerts" className="h-4 w-4" defaultChecked />
                <label htmlFor="price_alerts" className="flex-1 text-right mr-2">התראות מחיר</label>
              </div>
              <div className="flex items-center justify-between">
                <input type="checkbox" id="technical_signals" className="h-4 w-4" defaultChecked />
                <label htmlFor="technical_signals" className="flex-1 text-right mr-2">איתותים טכניים</label>
              </div>
              <div className="flex items-center justify-between">
                <input type="checkbox" id="pattern_alerts" className="h-4 w-4" defaultChecked />
                <label htmlFor="pattern_alerts" className="flex-1 text-right mr-2">זיהוי תבניות</label>
              </div>
              <div className="flex items-center justify-between">
                <input type="checkbox" id="market_news" className="h-4 w-4" defaultChecked />
                <label htmlFor="market_news" className="flex-1 text-right mr-2">חדשות שוק רלוונטיות</label>
              </div>
            </div>
          </div>
          
          <Button className="w-full">שמור הגדרות</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertSettings;
