
import React from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Server, Globe, Database, Key, FileKey, Shield } from 'lucide-react';
import { Steps, Step } from '@/components/ui/steps';

const DeploymentGuide = () => {
  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold mb-2 text-right">מדריך הפצה לסביבת ייצור</h1>
      <p className="text-muted-foreground mb-6 text-right">כל השלבים להשקת המערכת בסביבת אמת</p>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
          <TabsTrigger value="proxy">הגדרת פרוקסי</TabsTrigger>
          <TabsTrigger value="api-keys">מפתחות API</TabsTrigger>
          <TabsTrigger value="server">הגדרת שרת</TabsTrigger>
          <TabsTrigger value="security">אבטחה</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">סקירת תהליך ההפצה</CardTitle>
              <CardDescription className="text-right">
                השלבים המרכזיים להשקת המערכת בסביבת אמת
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle className="text-right">הקדמה</AlertTitle>
                <AlertDescription className="text-right">
                  מערכת Levi Bot מורכבת מממשק משתמש (React), חיבורים ל-API חיצוניים (Binance, TradingView) ושירותים נוספים. 
                  להפעלה מלאה בסביבת אמת, יש לוודא שכל המרכיבים מוגדרים ופועלים כראוי.
                </AlertDescription>
              </Alert>
              
              <Steps>
                <Step icon={<Server />} title="הגדרת פרוקסי" className="text-right">
                  הקמת שרת פרוקסי חיונית לביצוע בקשות API מאובטחות לשירותים כמו Binance ו-TradingView.
                </Step>
                <Step icon={<Key />} title="הגדרת מפתחות API" className="text-right">
                  יצירת חשבונות ומפתחות API אמיתיים עבור כל השירותים החיצוניים (Binance, TradingView).
                </Step>
                <Step icon={<Globe />} title="הגדרת דומיין" className="text-right">
                  רכישת דומיין והגדרתו לשימוש עם המערכת.
                </Step>
                <Step icon={<Database />} title="הגדרת בסיס נתונים" className="text-right">
                  הקמת בסיס נתונים לשמירת מידע משתמשים, העדפות ונתונים היסטוריים.
                </Step>
                <Step icon={<Shield />} title="אבטחה" className="text-right">
                  הגדרת SSL, הגנה מפני התקפות, וניהול הרשאות.
                </Step>
              </Steps>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proxy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">הגדרת שרת פרוקסי</CardTitle>
              <CardDescription className="text-right">
                הוראות מפורטות להגדרת שרת פרוקסי עבור גישת API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTitle className="text-right">למה נדרש פרוקסי?</AlertTitle>
                <AlertDescription className="text-right">
                  שרתי פרוקסי נדרשים כדי לעקוף מגבלות CORS ולאבטח מפתחות API. בסביבת אמת, הדפדפן לא יכול לגשת ישירות לממשקי API רבים.
                </AlertDescription>
              </Alert>

              <Steps>
                <Step 
                  title="בחירת ספק שרת" 
                  className="text-right"
                >
                  מומלץ להשתמש ב-Digital Ocean, AWS, או Heroku. לדוגמה, ניתן להקים Droplet ב-Digital Ocean (מחיר התחלתי כ-5$ לחודש).
                </Step>
                <Step 
                  title="התקנת Node.js ו-Express" 
                  className="text-right"
                >
                  <div className="font-mono text-sm bg-muted p-2 rounded mt-2 text-right">
                    <p>ssh root@your-server-ip</p>
                    <p>apt update && apt upgrade -y</p>
                    <p>curl -fsSL https://deb.nodesource.com/setup_18.x | bash -</p>
                    <p>apt-get install -y nodejs</p>
                    <p>mkdir -p /var/www/proxy</p>
                    <p>cd /var/www/proxy</p>
                    <p>npm init -y</p>
                    <p>npm install express cors axios dotenv helmet</p>
                  </div>
                </Step>
                <Step 
                  title="יצירת קוד הפרוקסי" 
                  className="text-right"
                >
                  צור קובץ app.js:
                  <div className="font-mono text-sm bg-muted p-2 rounded mt-2 text-right">
                    <pre dir="ltr">{`
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));
app.use(express.json());

// Binance proxy route
app.use('/api/binance', async (req, res) => {
  try {
    const endpoint = req.path;
    const method = req.method.toLowerCase();
    const data = method === 'get' ? req.query : req.body;
    
    const response = await axios({
      method,
      url: \`https://api.binance.com\${endpoint}\`,
      params: method === 'get' ? data : undefined,
      data: method !== 'get' ? data : undefined,
      headers: {
        'X-MBX-APIKEY': req.headers['x-mbx-apikey']
      }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      data: error.response?.data
    });
  }
});

// TradingView proxy route
app.use('/api/tradingview', async (req, res) => {
  try {
    const response = await axios({
      method: req.method.toLowerCase(),
      url: \`https://pine-api.tradingview.com\${req.path}\`,
      data: req.body,
      headers: {
        'Authorization': req.headers['authorization'],
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      data: error.response?.data
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(\`Proxy server running on port \${PORT}\`);
});
                    `}</pre>
                  </div>
                </Step>
                <Step 
                  title="הפעלת השרת" 
                  className="text-right"
                >
                  <div className="font-mono text-sm bg-muted p-2 rounded mt-2 text-right">
                    <p>npm install -g pm2</p>
                    <p>pm2 start app.js --name "api-proxy"</p>
                    <p>pm2 startup</p>
                    <p>pm2 save</p>
                  </div>
                </Step>
                <Step 
                  title="הגדרת NGINX (אופציונלי)" 
                  className="text-right"
                >
                  NGINX יעזור לנתב בקשות ולהוסיף שכבת אבטחה נוספת:
                  <div className="font-mono text-sm bg-muted p-2 rounded mt-2 text-right">
                    <p>apt install -y nginx certbot python3-certbot-nginx</p>
                  </div>
                  צור קובץ קונפיגורציה:
                  <div className="font-mono text-sm bg-muted p-2 rounded mt-2 text-right">
                    <pre dir="ltr">{`
server {
    listen 80;
    server_name proxy.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
                    `}</pre>
                  </div>
                  <p className="mt-2">הפעל את NGINX והגדר SSL:</p>
                  <div className="font-mono text-sm bg-muted p-2 rounded mt-2 text-right">
                    <p>ln -s /etc/nginx/sites-available/proxy.yourdomain.com /etc/nginx/sites-enabled/</p>
                    <p>nginx -t</p>
                    <p>systemctl restart nginx</p>
                    <p>certbot --nginx -d proxy.yourdomain.com</p>
                  </div>
                </Step>
              </Steps>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">הגדרת מפתחות API</CardTitle>
              <CardDescription className="text-right">
                הוראות ליצירת וניהול מפתחות API אמיתיים
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Steps>
                <Step title="Binance API" className="text-right">
                  <ol className="list-decimal list-inside space-y-2 mt-2">
                    <li>היכנס לחשבון ה-Binance שלך</li>
                    <li>עבור ל-API Management</li>
                    <li>צור API Key חדש בהגדרות "Read Info" ו-"Enable Trading" בלבד (לא לאפשר משיכות!)</li>
                    <li>הגבל את הגישה לפי IP של שרת הפרוקסי</li>
                    <li>שמור את המפתח והסוד בצורה מאובטחת</li>
                  </ol>
                </Step>
                
                <Step title="TradingView API" className="text-right">
                  <ol className="list-decimal list-inside space-y-2 mt-2">
                    <li>היכנס לחשבון ה-TradingView שלך (חשבון מסוג premium או Pro נדרש)</li>
                    <li>עבור להגדרות פרופיל</li>
                    <li>חפש את אפשרות ה-API Keys או Developer Access</li>
                    <li>צור מפתח חדש עם הרשאות לגישת קריאה</li>
                  </ol>
                </Step>
                
                <Step title="הגדרת מפתחות במערכת" className="text-right">
                  <ol className="list-decimal list-inside space-y-2 mt-2">
                    <li>בעמודי האינטגרציה השונים (Binance, TradingView), הזן את המפתחות כנדרש</li>
                    <li>וודא שכתובת הפרוקסי מוגדרת בהגדרות המערכת</li>
                    <li>בדוק את הסטטוס על ידי ניסיון חיבור</li>
                  </ol>
                </Step>
                
                <Step title="בדיקת קישוריות" className="text-right">
                  <p>לאחר הזנת כל המפתחות, בצע את הבדיקות הבאות:</p>
                  <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>עבור ל"בדיקת חיבור" בכל ממשק אינטגרציה</li>
                    <li>ודא שהנתונים מתקבלים בזמן אמת</li>
                    <li>בדוק שהלוגים לא מציגים שגיאות CORS או חיבור</li>
                  </ul>
                </Step>
              </Steps>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="server" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">הגדרת שרת לאפליקציה</CardTitle>
              <CardDescription className="text-right">
                הוראות להעלאת האפליקציה לאוויר
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Steps>
                <Step title="בניית האפליקציה" className="text-right">
                  <div className="font-mono text-sm bg-muted p-2 rounded mt-2 text-right">
                    <p>npm run build</p>
                  </div>
                  <p className="mt-2">לאחר הבנייה, התיקייה 'dist' תכיל את הקבצים הסטטיים של האפליקציה.</p>
                </Step>
                
                <Step title="אפשרויות הפצה" className="text-right">
                  <p className="font-semibold">אפשרות 1: שירותי אחסון סטטיים</p>
                  <ul className="list-disc list-inside space-y-1 mt-1 mb-3">
                    <li>Netlify</li>
                    <li>Vercel</li>
                    <li>GitHub Pages</li>
                    <li>Firebase Hosting</li>
                  </ul>
                  
                  <p className="font-semibold">אפשרות 2: שרת מותאם אישית</p>
                  <div className="font-mono text-sm bg-muted p-2 rounded mt-2 text-right">
                    <pre dir="ltr">{`
# ב-Digital Ocean או AWS:
# העלה את תיקיית dist לשרת
scp -r ./dist root@your-server-ip:/var/www/levi-bot

# התקן nginx
apt install -y nginx

# צור קובץ קונפיגורציה
cat > /etc/nginx/sites-available/levi-bot << EOF
server {
    listen 80;
    server_name app.yourdomain.com;
    
    root /var/www/levi-bot;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# הפעל את האתר
ln -s /etc/nginx/sites-available/levi-bot /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# הוסף SSL
certbot --nginx -d app.yourdomain.com
                    `}</pre>
                  </div>
                </Step>
                
                <Step title="הגדרת דומיין" className="text-right">
                  <ol className="list-decimal list-inside space-y-2 mt-2">
                    <li>רכוש דומיין דרך ספק כגון Namecheap, GoDaddy וכדומה</li>
                    <li>הוסף רשומות DNS שמפנות לשרת שלך:</li>
                    <ul className="list-disc list-inside ml-6 space-y-1">
                      <li>רשומת A: app.yourdomain.com ➡ IP של השרת שלך</li>
                      <li>רשומת A: proxy.yourdomain.com ➡ IP של שרת הפרוקסי</li>
                    </ul>
                    <li>המתן לעדכון ה-DNS (עשוי לקחת עד 48 שעות)</li>
                  </ol>
                </Step>

                <Step title="עדכוני קונפיגורציה" className="text-right">
                  <p className="mb-2">עדכן בהגדרות המערכת את כתובות הפרוקסי הנכונות:</p>
                  <div className="p-2 bg-muted rounded">
                    <p dir="ltr">Proxy URL: https://proxy.yourdomain.com</p>
                  </div>
                </Step>
              </Steps>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">הגדרות אבטחה</CardTitle>
              <CardDescription className="text-right">
                צעדים להבטחת אבטחת המערכת
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <FileKey className="h-4 w-4" />
                <AlertTitle className="text-right">אבטחת מפתחות API</AlertTitle>
                <AlertDescription className="text-right">
                  מפתחות API הם הנכס הרגיש ביותר שלך. אל תשתף אותם, אל תאחסן אותם בקוד גלוי, והשתמש תמיד בפרוקסי.
                </AlertDescription>
              </Alert>
              
              <Steps>
                <Step title="הגבלת IP בשירותים חיצוניים" className="text-right">
                  <p className="mt-2">הגדר את מפתחות ה-API של Binance ו-TradingView לאפשר גישה רק מ-IP של שרת הפרוקסי שלך.</p>
                </Step>
                
                <Step title="שימוש ב-HTTPS" className="text-right">
                  <p className="mt-2">ודא שכל התקשורת, כולל האפליקציה והפרוקסי, משתמשת ב-HTTPS עם SSL תקף.</p>
                </Step>
                
                <Step title="הגבלת CORS" className="text-right">
                  <p className="mt-2">הגדר את שרת הפרוקסי לקבל בקשות רק מהדומיין שלך:</p>
                  <div className="font-mono text-sm bg-muted p-2 rounded mt-2 text-right">
                    <pre dir="ltr">
                      {`// In .env file on proxy server:
ALLOWED_ORIGINS=https://app.yourdomain.com`}
                    </pre>
                  </div>
                </Step>
                
                <Step title="מערכת היררכית" className="text-right">
                  <p className="mt-2">הגדר הרשאות משתמשים בהתאם לרמות גישה:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>מנהל מערכת: גישה מלאה</li>
                    <li>מנהל: גישה למרבית התכונות, ללא הגדרות מערכת</li>
                    <li>משתמש: גישה מוגבלת לצפייה ופעולות בסיסיות</li>
                  </ul>
                </Step>
                
                <Step title="גיבוי נתונים" className="text-right">
                  <p className="mt-2">הגדר גיבויים אוטומטיים לנתוני המערכת, במיוחד הגדרות משתמשים ואסטרטגיות.</p>
                </Step>
                
                <Step title="ניטור" className="text-right">
                  <p className="mt-2">הוסף מערכת ניטור לזיהוי גישות חשודות או פעילות חריגה:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>הגדר התראות על ניסיונות כניסה מרובים</li>
                    <li>נטר בקשות API חריגות</li>
                    <li>הגדר התראות על שינויי הרשאות</li>
                  </ul>
                </Step>
              </Steps>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default DeploymentGuide;
