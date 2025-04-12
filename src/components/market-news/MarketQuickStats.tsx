
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, BarChart3, DollarSign } from 'lucide-react';

const MarketQuickStats = () => {
  const stats = [
    {
      name: 'שווי שוק כולל',
      value: '$1.79T',
      change: '+2.3%',
      isPositive: true,
      icon: BarChart3
    },
    {
      name: 'נפח מסחר 24 שעות',
      value: '$94.5B',
      change: '-5.1%',
      isPositive: false,
      icon: Activity
    },
    {
      name: 'דומיננטיות BTC',
      value: '47.2%',
      change: '+0.8%',
      isPositive: true,
      icon: TrendingUp
    },
    {
      name: 'שינוי שבועי',
      value: '+4.7%',
      change: '',
      isPositive: true,
      icon: DollarSign
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="flex justify-between items-center p-4">
            <div className="space-y-1 text-right">
              <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change && (
                <p className={`text-xs ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} {stat.isPositive ? <TrendingUp className="inline h-3 w-3" /> : <TrendingDown className="inline h-3 w-3" />}
                </p>
              )}
            </div>
            <div className={`p-2 rounded-full ${stat.isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
              <stat.icon className={`h-5 w-5 ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MarketQuickStats;
