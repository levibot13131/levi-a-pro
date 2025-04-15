
import React from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Info, Server, Globe, Key, Workflow, Code, ExternalLink } from 'lucide-react';

const DeploymentGuide: React.FC = () => {
  return (
    <Container className="py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">מדריך התקנה והפעלה</h1>
        <p className="text-muted-foreground">הנחיות להתקנה, הגדרה והפעלה של Levi-A-Pro</p>
      </div>
      
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>מידע חשוב</AlertTitle>
        <AlertDescription>
          מדריך זה מיועד למשתמשים שמעוניינים להפעיל את Levi-A-Pro בסביבת ייצור.
          עקוב אחר ההנחיות בקפידה כדי להבטיח התקנה והפעלה מוצלחות.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="requirements">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requirements">דרישות מערכת</TabsTrigger>
          <TabsTrigger value="installation">התקנה</TabsTrigger>
          <TabsTrigger value="configuration">הגדרות</TabsTrigger>
          <TabsTrigger value="deployment">העלאה לשרת</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">דרישות מערכת</CardTitle>
              <CardDescription className="text-right">
                המשאבים הנדרשים להפעלת המערכת
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium">חומרה</h3>
                      <Server className="h-5 w-5 text-primary" />
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <Badge variant="outline">מינימום</Badge>
                        <span>מעבד כפול, 4GB RAM</span>
                      </li>
                      <li className="flex justify-between">
                        <Badge variant="outline">מומלץ</Badge>
                        <span>מעבד 4 ליבות, 8GB RAM</span>
                      </li>
                      <li className="flex justify-between">
                        <Badge variant="outline">אחסון</Badge>
                        <span>20GB SSD</span>
                      </li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium">תוכנה</h3>
                      <Code className="h-5 w-5 text-primary" />
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <Badge variant="outline">מערכת הפעלה</Badge>
                        <span>Linux / Windows / macOS</span>
                      </li>
                      <li className="flex justify-between">
                        <Badge variant="outline">Node.js</Badge>
                        <span>18.x ומעלה</span>
                      </li>
                      <li className="flex justify-between">
                        <Badge variant="outline">NPM</Badge>
                        <span>8.x ומעלה</span>
                      </li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium">תקשורת</h3>
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <Badge variant="outline">אינטרנט</Badge>
                        <span>חיבור יציב, 10Mbps+</span>
                      </li>
                      <li className="flex justify-between">
                        <Badge variant="outline">פורטים</Badge>
                        <span>80, 443 (אופציונלי)</span>
                      </li>
                      <li className="flex justify-between">
                        <Badge variant="outline">IP</Badge>
                        <span>רצוי קבוע</span>
                      </li>
                    </ul>
                  </Card>
                </div>
                
                <Card className="p-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    חיבורים חיצוניים נדרשים
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <div>
                        <Badge>חובה</Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">Binance API</div>
                        <div className="text-sm text-muted-foreground">מפתח API וסוד לגישה לנתוני מסחר ומחירים</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between border-b pb-2">
                      <div>
                        <Badge variant="outline">מומלץ</Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">TradingView</div>
                        <div className="text-sm text-muted-foreground">חשבון TradingView לניתוחים מתקדמים והתראות</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div>
                        <Badge variant="outline">אופציונלי</Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">Twitter/X API</div>
                        <div className="text-sm text-muted-foreground">גישה ל-API של טוויטר לניתוח סנטימנט</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="installation">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">התקנה</CardTitle>
              <CardDescription className="text-right">
                הנחיות להורדה והתקנה של המערכת
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-right mb-2">1. הורדה והתקנה מ-GitHub</h3>
                
                <div className="bg-muted p-4 rounded-md overflow-auto">
                  <pre className="text-xs">
                    <code>
                      # Clone the repository{'\n'}
                      git clone https://github.com/yourusername/levi-a-pro.git{'\n\n'}
                      # Navigate to the project directory{'\n'}
                      cd levi-a-pro{'\n\n'}
                      # Install dependencies{'\n'}
                      npm install{'\n\n'}
                      # Build for production{'\n'}
                      npm run build
                    </code>
                  </pre>
                </div>
                
                <h3 className="text-lg font-medium text-right mb-2 mt-4">2. התקנה באמצעות NPM (אלטרנטיבה)</h3>
                
                <div className="bg-muted p-4 rounded-md overflow-auto">
                  <pre className="text-xs">
                    <code>
                      # Install the package globally{'\n'}
                      npm install -g levi-a-pro{'\n\n'}
                      # Create a new levi-a-pro instance{'\n'}
                      npx create-levi-app my-trading-bot{'\n\n'}
                      # Navigate to the project directory{'\n'}
                      cd my-trading-bot{'\n\n'}
                      # Start the development server{'\n'}
                      npm run dev
                    </code>
                  </pre>
                </div>
                
                <h3 className="text-lg font-medium text-right mb-2 mt-4">3. הפעלה בסביבת פיתוח</h3>
                
                <div className="bg-muted p-4 rounded-md overflow-auto">
                  <pre className="text-xs">
                    <code>
                      # Start development server{'\n'}
                      npm run dev{'\n\n'}
                      # The application will be available at:{'\n'}
                      # http://localhost:5173
                    </code>
                  </pre>
                </div>
                
                <Alert className="mt-4">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>עצות להתקנה מוצלחת</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>וודא שיש לך הרשאות מתאימות בתיקיית ההתקנה</li>
                      <li>הגדר את Node.js ל-Active LTS לביצועים וזמינות מיטביים</li>
                      <li>השתמש ב-Node Version Manager (nvm) לניהול קל של גרסאות Node.js</li>
                      <li>אם אתה נתקל בשגיאות התקנה, נסה לנקות את מטמון ה-npm עם <code>npm cache clean --force</code></li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">הגדרות</CardTitle>
              <CardDescription className="text-right">
                הגדרת המערכת לסביבת ייצור
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-right mb-2">1. הגדרת קובץ הקונפיגורציה</h3>
                
                <div className="bg-muted p-4 rounded-md overflow-auto">
                  <pre className="text-xs">
                    <code>
                      // config.js{'\n\n'}
                      module.exports = {'{'}
                      {'\n'}  // Server configuration
                      {'\n'}  server: {'{'}
                      {'\n'}    port: process.env.PORT || 3000,
                      {'\n'}    host: '0.0.0.0',
                      {'\n'}    cors: {'{'}
                      {'\n'}      origin: '*', // Restrict in production
                      {'\n'}      methods: ['GET', 'POST']
                      {'\n'}    {'}'}
                      {'\n'}  {'}'},{'\n'}
                      {'\n'}  // API configuration
                      {'\n'}  api: {'{'}
                      {'\n'}    binance: {'{'}
                      {'\n'}      useTestnet: false, // Set to false for real trading
                      {'\n'}      reconnectInterval: 5000,
                      {'\n'}      maxReconnectAttempts: 5
                      {'\n'}    {'}'},
                      {'\n'}    tradingview: {'{'}
                      {'\n'}      syncInterval: 60000 // 1 minute
                      {'\n'}    {'}'}
                      {'\n'}  {'}'},{'\n'}
                      {'\n'}  // Logging configuration
                      {'\n'}  logging: {'{'}
                      {'\n'}    level: 'info', // 'debug', 'info', 'warn', 'error'
                      {'\n'}    file: './logs/app.log',
                      {'\n'}    maxSize: '10m',
                      {'\n'}    maxFiles: 5
                      {'\n'}  {'}'}
                      {'\n'}{'}'}
                    </code>
                  </pre>
                </div>
                
                <h3 className="text-lg font-medium text-right mb-2 mt-4">2. הגדרת משתני סביבה</h3>
                
                <div className="bg-muted p-4 rounded-md overflow-auto">
                  <pre className="text-xs">
                    <code>
                      # .env file (do not commit to version control){'\n\n'}
                      # Server{'\n'}
                      PORT=3000{'\n'}
                      NODE_ENV=production{'\n\n'}
                      # Proxy{'\n'}
                      PROXY_URL=https://your-proxy-url.com{'\n'}
                      PROXY_ENABLED=true{'\n\n'}
                      # Security{'\n'}
                      JWT_SECRET=your_secret_key_here{'\n'}
                      SESSION_SECRET=your_session_secret_here{'\n\n'}
                      # API Keys (DO NOT COMMIT){'\n'}
                      # These should be entered via the UI in production{'\n'}
                      BINANCE_API_KEY={'\n'}
                      BINANCE_API_SECRET={'\n'}
                      TRADINGVIEW_USERNAME={'\n'}
                      TRADINGVIEW_PASSWORD={'\n'}
                      TWITTER_API_KEY={'\n'}
                      TWITTER_API_SECRET={'\n'}
                    </code>
                  </pre>
                </div>
                
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle>הערה חשובה לגבי אבטחה</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">אל תשמור מפתחות API ומידע רגיש אחר בקוד או בקבצי קונפיגורציה שמתווספים לניהול גרסאות.</p>
                    <p>בסביבת ייצור, מומלץ להזין את מפתחות ה-API דרך ממשק המשתמש או לשמור אותם במנהל סודות מאובטח.</p>
                  </AlertDescription>
                </Alert>
                
                <h3 className="text-lg font-medium text-right mb-2 mt-4">3. הגדרת פרוקסי (מומלץ)</h3>
                
                <Card className="p-4">
                  <p className="text-right mb-3">
                    לביצועים מיטביים ולהתגברות על מגבלות IP, מומלץ להגדיר פרוקסי עבור בקשות API.
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm" asChild>
                      <a href="/proxy-settings">
                        הגדר פרוקסי
                      </a>
                    </Button>
                    
                    <div className="text-right">
                      <h4 className="font-medium">אפשרויות פרוקסי מומלצות:</h4>
                      <ul className="text-sm space-y-1 mt-1">
                        <li>Nginx כפרוקסי הפוך</li>
                        <li>Cloudflare Workers</li>
                        <li>AWS API Gateway</li>
                        <li>CORS Anywhere (לפיתוח בלבד)</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deployment">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">העלאה לשרת</CardTitle>
              <CardDescription className="text-right">
                הנחיות לפרישת המערכת בסביבת ייצור
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium">שרת פרטי / VPS</h3>
                      <Server className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md overflow-auto mb-3">
                      <pre className="text-xs">
                        <code>
                          # Install PM2 globally{'\n'}
                          npm install -g pm2{'\n\n'}
                          # Start the application with PM2{'\n'}
                          pm2 start npm --name "levi-a-pro" -- start{'\n\n'}
                          # Ensure app starts on system reboot{'\n'}
                          pm2 startup{'\n'}
                          pm2 save
                        </code>
                      </pre>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <p>✓ שליטה מלאה בסביבה</p>
                      <p>✓ יכולת התאמה מקסימלית</p>
                      <p>✓ רמת אבטחה גבוהה</p>
                      <p>✗ דורש תחזוקה רבה יותר</p>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium">שירותי ענן</h3>
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    
                    <ul className="space-y-3 mb-3">
                      <li className="flex justify-between items-center">
                        <Button variant="outline" size="sm" asChild>
                          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            פרטים
                          </a>
                        </Button>
                        <div className="text-right">
                          <div className="font-medium">Vercel</div>
                          <div className="text-xs text-muted-foreground">מתאים לממשק משתמש בלבד</div>
                        </div>
                      </li>
                      
                      <li className="flex justify-between items-center">
                        <Button variant="outline" size="sm" asChild>
                          <a href="https://aws.amazon.com" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            פרטים
                          </a>
                        </Button>
                        <div className="text-right">
                          <div className="font-medium">AWS</div>
                          <div className="text-xs text-muted-foreground">פתרון מלא, EC2/ECS/Lambda</div>
                        </div>
                      </li>
                      
                      <li className="flex justify-between items-center">
                        <Button variant="outline" size="sm" asChild>
                          <a href="https://cloud.digitalocean.com" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            פרטים
                          </a>
                        </Button>
                        <div className="text-right">
                          <div className="font-medium">DigitalOcean</div>
                          <div className="text-xs text-muted-foreground">App Platform או Droplets</div>
                        </div>
                      </li>
                    </ul>
                    
                    <div className="text-sm space-y-1">
                      <p>✓ קל לפרישה וניהול</p>
                      <p>✓ סקלביליות אוטומטית</p>
                      <p>✓ תמיכה בזמינות גבוהה</p>
                      <p>✗ עלות גבוהה יותר</p>
                    </div>
                  </Card>
                </div>
                
                <h3 className="text-lg font-medium text-right mb-2">הגדרת HTTPS (חובה לסביבת ייצור)</h3>
                
                <div className="bg-muted p-4 rounded-md overflow-auto">
                  <pre className="text-xs">
                    <code>
                      # Using Certbot with Nginx{'\n\n'}
                      # Install Certbot{'\n'}
                      sudo apt-get update{'\n'}
                      sudo apt-get install certbot python3-certbot-nginx{'\n\n'}
                      # Obtain and install certificate{'\n'}
                      sudo certbot --nginx -d yourdomain.com
                    </code>
                  </pre>
                </div>
                
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-right">רשימת תיוג להשקה</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-end">
                        <span className="text-right">בדיקת HTTPS ואבטחת תקשורת</span>
                        <div className="h-5 w-5 ml-2 rounded-full border border-primary flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end">
                        <span className="text-right">הגדרת לוגים וניטור</span>
                        <div className="h-5 w-5 ml-2 rounded-full border border-primary flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end">
                        <span className="text-right">בדיקת חיבורים לבורסות ומקורות מידע</span>
                        <div className="h-5 w-5 ml-2 rounded-full border border-primary flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end">
                        <span className="text-right">הגדרת גיבויים</span>
                        <div className="h-5 w-5 ml-2 rounded-full border border-primary flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end">
                        <span className="text-right">בדיקות עומסים</span>
                        <div className="h-5 w-5 ml-2 rounded-full border border-primary flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end">
                        <span className="text-right">הגדרת התראות מערכת</span>
                        <div className="h-5 w-5 ml-2 rounded-full border border-primary flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 border-t pt-6">
        <h2 className="text-xl font-medium text-right mb-4">תמיכה טכנית</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h3 className="font-medium text-right mb-2">תיעוד טכני</h3>
            <p className="text-sm text-right mb-3">קרא את התיעוד המלא עם הוראות מפורטות והסברים.</p>
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              צפה בתיעוד
            </Button>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-medium text-right mb-2">קהילת פיתוח</h3>
            <p className="text-sm text-right mb-3">הצטרף לקהילת המפתחים שלנו לשאלות, עדכונים ותמיכה.</p>
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              הצטרף לקהילה
            </Button>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-medium text-right mb-2">תמיכה ישירה</h3>
            <p className="text-sm text-right mb-3">צור קשר עם צוות התמיכה הטכנית שלנו לסיוע מקצועי.</p>
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              שלח בקשת תמיכה
            </Button>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default DeploymentGuide;
