
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Wallet, ArrowUpDown } from 'lucide-react';

const BinanceFeatureCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-muted/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-right">נתונים בזמן אמת</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart className="h-12 w-12 mb-2 text-primary mx-auto" />
          <p className="text-sm text-center">קבל נתוני מסחר ומחירים בזמן אמת ישירות מבורסת בינאנס</p>
        </CardContent>
      </Card>
      <Card className="bg-muted/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-right">מעקב נכסים</CardTitle>
        </CardHeader>
        <CardContent>
          <Wallet className="h-12 w-12 mb-2 text-primary mx-auto" />
          <p className="text-sm text-center">עקוב אחר הנכסים שלך, היתרות והרווחים בזמן אמת</p>
        </CardContent>
      </Card>
      <Card className="bg-muted/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-right">מסחר אוטומטי</CardTitle>
        </CardHeader>
        <CardContent>
          <ArrowUpDown className="h-12 w-12 mb-2 text-primary mx-auto" />
          <p className="text-sm text-center">הפעל אסטרטגיות מסחר אוטומטיות בהתאם לאיתותים</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BinanceFeatureCards;
