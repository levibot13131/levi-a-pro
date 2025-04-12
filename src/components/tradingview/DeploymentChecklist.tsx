
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { isTradingViewConnected } from '@/services/tradingView/tradingViewAuthService';
import { getAlertDestinations } from '@/services/tradingView/tradingViewAlertService';

const DeploymentChecklist: React.FC = () => {
  const isConnectedToTradingView = isTradingViewConnected();
  const alertDestinations = getAlertDestinations();
  const hasTelegramConfig = alertDestinations.some(d => d.type === 'telegram' && d.active);
  const hasWhatsappConfig = alertDestinations.some(d => d.type === 'whatsapp' && d.active);
  
  const checklistItems = [
    {
      id: 'tradingview',
      name: 'חיבור ל-TradingView',
      status: isConnectedToTradingView ? 'complete' : 'pending',
      description: isConnectedToTradingView 
        ? 'המערכת מחוברת ל-TradingView' 
        : 'נדרש חיבור לחשבון TradingView (החבילה הבסיסית מספיקה)'
    },
    {
      id: 'telegram',
      name: 'הגדרת טלגרם',
      status: hasTelegramConfig ? 'complete' : 'pending',
      description: hasTelegramConfig 
        ? 'טלגרם מוגדר ומוכן לשליחת התראות' 
        : 'מומלץ להגדיר קבוצת טלגרם לקבלת התראות'
    },
    {
      id: 'whatsapp',
      name: 'הגדרת וואטסאפ',
      status: hasWhatsappConfig ? 'complete' : 'pending',
      description: hasWhatsappConfig 
        ? 'וואטסאפ מוגדר ומוכן לשליחת התראות' 
        : 'ניתן להגדיר חיבור לוואטסאפ לקבלת התראות'
    },
    {
      id: 'webhook',
      name: 'הגדרת Webhook',
      status: 'pending',
      description: 'יש להגדיר את כתובת ה-Webhook בהגדרות ההתראות ב-TradingView'
    },
    {
      id: 'assets',
      name: 'הגדרת נכסים למעקב',
      status: 'pending',
      description: 'בחר נכסים למעקב או השתמש ברשימה האוטומטית'
    }
  ];
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            הושלם
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            ממתין להגדרה
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            שגיאה
          </Badge>
        );
      default:
        return <Badge variant="outline">לא ידוע</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">רשימת הכנה לפריסה</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checklistItems.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && <Separator className="my-2" />}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  {getStatusBadge(item.status)}
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-right">
                  <h4 className="font-medium">{item.name}</h4>
                  {getStatusIcon(item.status)}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
        
        <div className="mt-6 bg-blue-50 dark:bg-blue-950/50 p-4 rounded-md text-right">
          <h3 className="font-medium mb-2">הערה חשובה</h3>
          <p className="text-sm">
            המערכת מתוכננת לעבוד עם החבילה הבסיסית של TradingView ללא צורך בחשבון Pro.
            כל ההגדרות וההתראות פועלות גם עם החשבון החינמי.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeploymentChecklist;
