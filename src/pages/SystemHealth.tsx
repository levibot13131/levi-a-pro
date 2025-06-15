
import React from 'react';
import { Container } from '../components/ui/container';
import SystemHealthChecker from '../components/system/SystemHealthChecker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Activity, TrendingUp } from 'lucide-react';

const SystemHealth = () => {
  const authorizedUsers = [
    'almogahronov1997@gmail.com',
    'avraham.oron@gmail.com'
  ];

  const systemFeatures = [
    {
      name: 'Real-time Trading Engine',
      status: 'active',
      description: 'מנוע מסחר פועל כל 30 שניות עם 9 אסטרטגיות'
    },
    {
      name: 'Telegram Bot Integration',
      status: 'active',
      description: 'בוט טלגרם שולח איתותים אוטומטיים'
    },
    {
      name: 'Live Market Data',
      status: 'active',
      description: 'נתוני שוק בזמן אמת מ-Binance'
    },
    {
      name: 'TradingView Charts',
      status: 'active',
      description: 'גרפים חיים עם אינדיקטורים טכניים'
    },
    {
      name: 'Strategy Engine',
      status: 'active',
      description: 'מנוע אסטרטגיות עם למידה אדפטיבית'
    },
    {
      name: 'Real-time Dashboard',
      status: 'active',
      description: 'דשבורד מתעדכן בזמן אמת'
    }
  ];

  return (
    <Container className="py-6">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-right mb-2">
            מצב מערכת LeviPro
          </h1>
          <p className="text-muted-foreground text-right">
            בדיקה מקיפה של כל רכיבי המערכת
          </p>
        </div>

        {/* Security Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-right">
              <Shield className="h-5 w-5" />
              מצב אבטחה והרשאות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="default" className="bg-green-500">
                  מאובטח
                </Badge>
                <span className="font-medium">מערכת פרטית מלאה</span>
              </div>
              
              <div>
                <h3 className="font-medium mb-2 text-right">משתמשים מורשים:</h3>
                <div className="space-y-1">
                  {authorizedUsers.map((email, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <Badge variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        מורשה
                      </Badge>
                      <span className="text-sm">{email}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Features Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-right">
              <Activity className="h-5 w-5" />
              סטטוס תכונות המערכת
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {systemFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <Badge variant="default" className="bg-green-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    פעיל
                  </Badge>
                  <div className="text-right">
                    <h3 className="font-medium">{feature.name}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health Checker */}
        <SystemHealthChecker />
      </div>
    </Container>
  );
};

export default SystemHealth;
