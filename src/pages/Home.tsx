
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Activity, LineChart, Wallet, Newspaper, AlertTriangle, History, Users } from 'lucide-react';

const Home = () => {
  const featureCards = [
    {
      title: 'נתוני שוק',
      description: 'צפה בנתוני שוק עדכניים, מחירים, ומידע על מטבעות קריפטו',
      icon: <LineChart className="h-6 w-6" />,
      href: '/market-data'
    },
    {
      title: 'מטבעות חמים',
      description: 'גלה מטבעות קריפטו מובילים ומגמות עכשוויות',
      icon: <Activity className="h-6 w-6" />,
      href: '/trending-coins'
    },
    {
      title: 'מעקב נכסים',
      description: 'עקוב אחר תיק ההשקעות שלך וקבל התראות בזמן אמת',
      icon: <Wallet className="h-6 w-6" />,
      href: '/asset-tracker'
    },
    {
      title: 'חדשות השוק',
      description: 'התעדכן בחדשות ובמידע העדכני ביותר בשוק הקריפטו',
      icon: <Newspaper className="h-6 w-6" />,
      href: '/market-news'
    },
    {
      title: 'איתותי מסחר',
      description: 'קבל איתותי מסחר מבוססי ניתוח טכני ופונדמנטלי',
      icon: <AlertTriangle className="h-6 w-6" />,
      href: '/trading-signals'
    },
    {
      title: 'ניתוח היסטורי',
      description: 'בצע בדיקות היסטוריות וניתוח מגמות קודמות',
      icon: <History className="h-6 w-6" />,
      href: '/backtesting'
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">ברוכים הבאים למערכת הניתוח והמסחר</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureCards.map((card, index) => (
          <Card key={index} className="transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {card.icon}
                {card.title}
              </CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={card.href}>כניסה</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>אינטגרציית Binance</CardTitle>
            <CardDescription>התחבר לחשבון הבינאנס שלך לקבלת נתונים בזמן אמת</CardDescription>
          </CardHeader>
          <CardContent>
            <p>עקוב אחר מחירים, חדשות ואיתותים ישירות מחשבון הבינאנס שלך. המידע מתעדכן בזמן אמת.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/binance-integration">התחבר לבינאנס</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Home;
