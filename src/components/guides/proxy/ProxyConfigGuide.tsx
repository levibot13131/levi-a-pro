
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardCopy, Info, Server, ShieldCheck, DollarSign, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProxyConfigGuide: React.FC = () => {
  const handleCopyConfig = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">הגדרת שרת פרוקסי למערכת המסחר</CardTitle>
          <CardDescription>
            מדריך מפורט להגדרת שרת פרוקסי לתמיכה ביישום המסחר שלך
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>מדוע להשתמש בשרת פרוקסי?</AlertTitle>
            <AlertDescription>
              שרת פרוקסי מאפשר גישה מאובטחת לנתוני מסחר בזמן אמת, מניעת הגבלות IP, והפחתת זמני תגובה לביצועי מסחר טובים יותר.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="requirements">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="requirements">דרישות מערכת</TabsTrigger>
              <TabsTrigger value="installation">התקנה</TabsTrigger>
              <TabsTrigger value="configuration">הגדרה</TabsTrigger>
              <TabsTrigger value="deployment">פריסה</TabsTrigger>
              <TabsTrigger value="testing">בדיקה</TabsTrigger>
            </TabsList>

            <TabsContent value="requirements" className="space-y-4">
              <h3 className="text-lg font-semibold">דרישות מערכת לשרת פרוקסי</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>שרת לינוקס (Ubuntu 20.04+ או CentOS 8+)</li>
                <li>לפחות 2GB RAM</li>
                <li>2 ליבות מעבד</li>
                <li>20GB שטח דיסק</li>
                <li>כתובת IP סטטית</li>
                <li>גישת SSH לשרת</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-4">תוכנות נדרשות</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Node.js (גרסה 18 ומעלה)</li>
                <li>Nginx (גרסה 1.18 ומעלה)</li>
                <li>PM2 (מנהל תהליכים)</li>
                <li>Certbot (לאבטחת SSL)</li>
              </ul>
            </TabsContent>

            <TabsContent value="installation" className="space-y-4">
              <h3 className="text-lg font-semibold">התקנת הרכיבים הנדרשים</h3>
              
              <Card className="bg-muted">
                <CardContent className="pt-4">
                  <p className="font-semibold mb-2">התקנת Node.js</p>
                  <pre className="bg-black text-white p-3 rounded-md text-sm whitespace-pre-wrap overflow-x-auto">
                    {`curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v  # וודא את גרסת Node.js`}
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleCopyConfig('curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -\nsudo apt install -y nodejs\nnode -v')}
                  >
                    <ClipboardCopy className="h-4 w-4 mr-2" /> העתק
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-muted">
                <CardContent className="pt-4">
                  <p className="font-semibold mb-2">התקנת Nginx</p>
                  <pre className="bg-black text-white p-3 rounded-md text-sm whitespace-pre-wrap overflow-x-auto">
                    {`sudo apt update
sudo apt install nginx
sudo systemctl enable nginx
sudo systemctl start nginx`}
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleCopyConfig('sudo apt update\nsudo apt install nginx\nsudo systemctl enable nginx\nsudo systemctl start nginx')}
                  >
                    <ClipboardCopy className="h-4 w-4 mr-2" /> העתק
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-muted">
                <CardContent className="pt-4">
                  <p className="font-semibold mb-2">התקנת PM2</p>
                  <pre className="bg-black text-white p-3 rounded-md text-sm whitespace-pre-wrap overflow-x-auto">
                    {`sudo npm install -g pm2
pm2 --version`}
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleCopyConfig('sudo npm install -g pm2\npm2 --version')}
                  >
                    <ClipboardCopy className="h-4 w-4 mr-2" /> העתק
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-muted">
                <CardContent className="pt-4">
                  <p className="font-semibold mb-2">התקנת Certbot</p>
                  <pre className="bg-black text-white p-3 rounded-md text-sm whitespace-pre-wrap overflow-x-auto">
                    {`sudo apt install certbot python3-certbot-nginx
certbot --version`}
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleCopyConfig('sudo apt install certbot python3-certbot-nginx\ncertbot --version')}
                  >
                    <ClipboardCopy className="h-4 w-4 mr-2" /> העתק
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="configuration" className="space-y-4">
              <h3 className="text-lg font-semibold">הגדרת Nginx כשרת פרוקסי</h3>
              
              <Card className="bg-muted">
                <CardContent className="pt-4">
                  <p className="font-semibold mb-2">קובץ הגדרות Nginx</p>
                  <pre className="bg-black text-white p-3 rounded-md text-sm whitespace-pre-wrap overflow-x-auto">
                    {`sudo nano /etc/nginx/sites-available/trading-app

# הכנס את התוכן הבא לקובץ:

server {
    listen 80;
    server_name your-domain.com;  # הכנס את שם הדומיין שלך

    location / {
        proxy_pass http://localhost:3000;  # היכן שהאפליקציה שלך רצה
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    location /api/ {
        proxy_pass http://localhost:3001/api/;  # אם יש לך שרת API נפרד
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# שמור ויצא (Ctrl+X, Y, Enter)`}
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleCopyConfig(`server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`)}
                  >
                    <ClipboardCopy className="h-4 w-4 mr-2" /> העתק הגדרות
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-muted">
                <CardContent className="pt-4">
                  <p className="font-semibold mb-2">הפעלת הגדרות Nginx</p>
                  <pre className="bg-black text-white p-3 rounded-md text-sm whitespace-pre-wrap overflow-x-auto">
                    {`sudo ln -s /etc/nginx/sites-available/trading-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx`}
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleCopyConfig('sudo ln -s /etc/nginx/sites-available/trading-app /etc/nginx/sites-enabled/\nsudo nginx -t\nsudo systemctl restart nginx')}
                  >
                    <ClipboardCopy className="h-4 w-4 mr-2" /> העתק
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-muted">
                <CardContent className="pt-4">
                  <p className="font-semibold mb-2">הגדרת SSL עם Certbot</p>
                  <pre className="bg-black text-white p-3 rounded-md text-sm whitespace-pre-wrap overflow-x-auto">
                    {`sudo certbot --nginx -d your-domain.com
# עקוב אחר ההוראות להשלמת התקנת ה-SSL`}
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleCopyConfig('sudo certbot --nginx -d your-domain.com')}
                  >
                    <ClipboardCopy className="h-4 w-4 mr-2" /> העתק
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deployment" className="space-y-4">
              <h3 className="text-lg font-semibold">פריסת אפליקציית המסחר</h3>
              
              <Card className="bg-muted">
                <CardContent className="pt-4">
                  <p className="font-semibold mb-2">יצירת תיקייה לאפליקציה</p>
                  <pre className="bg-black text-white p-3 rounded-md text-sm whitespace-pre-wrap overflow-x-auto">
                    {`sudo mkdir -p /var/www/trading-app
sudo chown -R $USER:$USER /var/www/trading-app`}
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleCopyConfig('sudo mkdir -p /var/www/trading-app\nsudo chown -R $USER:$USER /var/www/trading-app')}
                  >
                    <ClipboardCopy className="h-4 w-4 mr-2" /> העתק
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-muted">
                <CardContent className="pt-4">
                  <p className="font-semibold mb-2">העלאת קבצי האפליקציה (בשרת)</p>
                  <pre className="bg-black text-white p-3 rounded-md text-sm whitespace-pre-wrap overflow-x-auto">
                    {`cd /var/www/trading-app
# העלה את קבצי האפליקציה שלך לתיקייה זו`}
                  </pre>
                </CardContent>
              </Card>
              
              <Card className="bg-muted">
                <CardContent className="pt-4">
                  <p className="font-semibold mb-2">העלאת קבצי האפליקציה (מהמחשב המקומי)</p>
                  <pre className="bg-black text-white p-3 rounded-md text-sm whitespace-pre-wrap overflow-x-auto">
                    {`# מהמחשב המקומי שלך:
scp -r ./build/* user@your-server-ip:/var/www/trading-app/`}
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleCopyConfig('scp -r ./build/* user@your-server-ip:/var/www/trading-app/')}
                  >
                    <ClipboardCopy className="h-4 w-4 mr-2" /> העתק
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-muted">
                <CardContent className="pt-4">
                  <p className="font-semibold mb-2">התקנת תלויות והפעלת האפליקציה</p>
                  <pre className="bg-black text-white p-3 rounded-md text-sm whitespace-pre-wrap overflow-x-auto">
                    {`cd /var/www/trading-app
npm install
# אם האפליקציה שלך דורשת קובץ .env
nano .env
# הוספת משתני סביבה נדרשים

# הפעלת האפליקציה עם PM2
pm2 start npm -- start
pm2 save
pm2 startup`}
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleCopyConfig('cd /var/www/trading-app\nnpm install\npm2 start npm -- start\npm2 save\npm2 startup')}
                  >
                    <ClipboardCopy className="h-4 w-4 mr-2" /> העתק
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testing" className="space-y-4">
              <h3 className="text-lg font-semibold">בדיקת הפריסה</h3>
              
              <Card className="bg-muted">
                <CardContent className="pt-4">
                  <p className="font-semibold mb-2">בדיקת האפליקציה</p>
                  <pre className="bg-black text-white p-3 rounded-md text-sm whitespace-pre-wrap overflow-x-auto">
                    {`# בדוק שהשירות פעיל
pm2 status

# בדוק את לוגים של האפליקציה
pm2 logs

# פתח את הדפדפן ונווט אל:
https://your-domain.com`}
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleCopyConfig('pm2 status\npm2 logs')}
                  >
                    <ClipboardCopy className="h-4 w-4 mr-2" /> העתק
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-muted">
                <CardContent className="pt-4">
                  <p className="font-semibold mb-2">פתרון בעיות</p>
                  <pre className="bg-black text-white p-3 rounded-md text-sm whitespace-pre-wrap overflow-x-auto">
                    {`# בדיקת לוגים של Nginx
sudo tail -f /var/log/nginx/error.log

# בדיקת חיבור פתוח
sudo netstat -tulpn | grep nginx

# הפעלה מחדש של השירותים
sudo systemctl restart nginx
pm2 restart all`}
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleCopyConfig('sudo tail -f /var/log/nginx/error.log\nsudo netstat -tulpn | grep nginx\nsudo systemctl restart nginx\npm2 restart all')}
                  >
                    <ClipboardCopy className="h-4 w-4 mr-2" /> העתק
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Server className="mr-2 h-5 w-5" />
                  אחסון וביצועים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  השתמש בספקי שירות אמינים כמו DigitalOcean, AWS או Linode עם חבילות זיכרון מינימום 2GB.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  אבטחה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  וודא הגדרת Firewall, הגבלות SSH, וגיבוי קבוע. השתמש בcertbot לתעודות SSL.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  אופטימיזציה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  הגדר מטמון Nginx, העבר משאבים סטטיים ל-CDN והגדר PM2 למיטוב ביצועים.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Rocket className="mr-2 h-5 w-5" />
            פרטי פריסה של האפליקציה שלך
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-md font-semibold mb-2">פרטי תצורה</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>שם האפליקציה:</strong> Levi Trading Bot</li>
                <li><strong>פורט ברירת מחדל:</strong> 3000</li>
                <li><strong>נקודת כניסה עיקרית:</strong> index.html</li>
                <li><strong>תלויות עיקריות:</strong> React, Tailwind CSS, Tanstack Query</li>
                <li><strong>סביבת הרצה:</strong> Node.js</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-md font-semibold mb-2">הגדרות ספציפיות</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>משתני סביבה נדרשים:</strong></li>
                <li className="ml-4">API_KEY=your_api_key</li>
                <li className="ml-4">API_SECRET=your_api_secret</li>
                <li className="ml-4">APP_ID=your_app_id</li>
                <li className="ml-4">AUTH_TOKEN=your_auth_token</li>
                <li className="ml-4">PROXY_SERVER=proxy_server_address</li>
                <li className="ml-4">PROXY_PORT=proxy_port</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">פקודות בנייה והרצה</h3>
            <pre className="bg-black text-white p-3 rounded-md text-sm whitespace-pre-wrap overflow-x-auto">
              {`# Build the application
npm run build

# Start the application
npm start

# Run with PM2
pm2 start npm -- start`}
            </pre>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => handleCopyConfig('npm run build\nnpm start\npm2 start npm -- start')}
            >
              <ClipboardCopy className="h-4 w-4 mr-2" /> העתק
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProxyConfigGuide;
