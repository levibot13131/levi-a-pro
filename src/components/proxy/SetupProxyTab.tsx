
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code } from '@/components/ui/code';
import { Info, Server, Shield, Globe } from 'lucide-react';

const SetupProxyTab = () => {
  return (
    <div className="text-base space-y-4">
      <h3 className="text-lg font-bold mb-2">הגדרת שרת פרוקסי</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Cloudflare Tunnel
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <p>הפתרון המומלץ - מנהרה מאובטחת וקבועה:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>חינמי לחלוטין</li>
              <li>כתובת HTTPS קבועה</li>
              <li>אבטחה מובנית</li>
              <li>קל להגדרה</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center gap-2">
              <Server className="h-4 w-4" />
              Nginx Reverse Proxy
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <p>פתרון מתקדם לשרתים קיימים:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>שליטה מלאה</li>
              <li>תמיכה ב-SSL</li>
              <li>ניהול CORS</li>
              <li>דורש VPS</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted p-4 rounded-md space-y-4">
        <h4 className="font-semibold">שלבי הגדרה:</h4>
        
        <div className="space-y-2">
          <h5 className="font-medium">1. התקנת הפרוקסי</h5>
          <Code>
            npm install express cors axios
          </Code>
        </div>
        
        <div className="space-y-2">
          <h5 className="font-medium">2. הגדרת שרת Express בסיסי</h5>
          <Code>
{`const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Routes here...

app.listen(3001);`}
          </Code>
        </div>
        
        <div className="space-y-2">
          <h5 className="font-medium">3. הגדרת נתיבים</h5>
          <Code>
{`app.use('/proxy', require('./routes/proxy'));
app.use('/binance', require('./routes/binance'));
app.use('/twitter', require('./routes/twitter'));`}
          </Code>
        </div>
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>שים לב</AlertTitle>
        <AlertDescription>
          לאחר הגדרת הפרוקסי, יש להגדיר את כתובת הפרוקסי הקבועה בדף ההגדרות של האפליקציה.
        </AlertDescription>
      </Alert>

      <Alert variant="warning" className="bg-amber-50 border-amber-200">
        <Shield className="h-4 w-4" />
        <AlertTitle>אבטחת מידע</AlertTitle>
        <AlertDescription>
          מומלץ להוסיף מפתח API או מנגנון אימות לפרוקסי בסביבת הייצור כדי למנוע שימוש לא מורשה.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SetupProxyTab;
