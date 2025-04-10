
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  SquaresPlusIcon, 
  FilePlus, 
  Upload, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface TradingLearningSystemProps {
  assetId: string;
}

// נתונים מדומים לדוגמה
const mockMistakePatterns = [
  {
    id: 'mistake-1',
    name: 'כניסה מאוחרת',
    description: 'כניסה לפוזיציה אחרי שמחיר הנכס כבר עלה משמעותית',
    occurrences: 12,
    averageLoss: -8.3,
    improvement: 65,
    solution: 'הגדר נקודות כניסה מראש והשתמש בהתראות מחיר'
  },
  {
    id: 'mistake-2',
    name: 'יציאה מוקדמת',
    description: 'סגירת פוזיציה רווחית לפני שהמחיר הגיע ליעד הרצוי',
    occurrences: 9,
    averageLoss: -15.2,
    improvement: 45,
    solution: 'הגדר יעדי מחיר ריאליים והימנע מבדיקת הגרף בתדירות גבוהה מדי'
  },
  {
    id: 'mistake-3',
    name: 'התעלמות מסימנים טכניים ברורים',
    description: 'התעלמות מאינדיקטורים טכניים מובהקים כמו RSI קיצוני או שבירת תמיכה',
    occurrences: 7,
    averageLoss: -12.8,
    improvement: 80,
    solution: 'הגדר כללים ברורים לכניסה ויציאה והקפד לעקוב אחריהם'
  },
  {
    id: 'mistake-4',
    name: 'היעדר ניהול סיכונים',
    description: 'אי הגדרת סטופ-לוס או גודל פוזיציה מתאים ביחס לסיכון',
    occurrences: 15,
    averageLoss: -18.5,
    improvement: 70,
    solution: 'תמיד הגדר סטופ-לוס והשתמש ב-1-2% מהתיק לפוזיציה בודדת'
  },
];

const mockSuccessPatterns = [
  {
    id: 'success-1',
    name: 'זיהוי שפל לאחר מכירת יתר',
    description: 'כניסה לפוזיציית קנייה לאחר ירידה חדה כשה-RSI מתחת ל-30',
    occurrences: 8,
    averageProfit: 12.7,
    reproducibility: 75,
    conditions: 'RSI מתחת ל-30, ירידה של יותר מ-15% בשבוע, נפח מסחר גבוה'
  },
  {
    id: 'success-2',
    name: 'פריצת אזור התנגדות',
    description: 'כניסה לאחר פריצה של אזור התנגדות חזק עם נפח מסחר גבוה',
    occurrences: 6,
    averageProfit: 9.2,
    reproducibility: 65,
    conditions: 'פריצת התנגדות, נפח מסחר גבוה, אישור הפריצה בנר הבא'
  },
];

const TradingLearningSystem: React.FC<TradingLearningSystemProps> = ({ assetId }) => {
  const [activeTab, setActiveTab] = useState('mistakes');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // סימולציה של העלאת קובץ
  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast.success('העלאת היומן הושלמה', {
            description: 'המערכת מנתחת את נתוני המסחר שלך. תוצאות הניתוח יוצגו בקרוב.',
          });
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  // סימולציה של יצירת אסטרטגיה חדשה מותאמת אישית
  const createCustomStrategy = () => {
    toast.success('האסטרטגיה החדשה נוצרה בהצלחה', {
      description: 'האסטרטגיה המותאמת אישית משלבת את כל הלקחים שנלמדו מהמסחרים הקודמים שלך.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">מערכת למידה חכמה</CardTitle>
        <CardDescription className="text-right">
          ניתוח טעויות מסחר ודפוסי הצלחה כדי לשפר את האסטרטגיה שלך
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="mistakes">דפוסי טעויות</TabsTrigger>
            <TabsTrigger value="successes">דפוסי הצלחה</TabsTrigger>
            <TabsTrigger value="upload">העלאת יומן מסחר</TabsTrigger>
          </TabsList>
          
          {/* לשונית דפוסי טעויות */}
          <TabsContent value="mistakes" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">דפוס</TableHead>
                    <TableHead className="text-right">מקרים</TableHead>
                    <TableHead className="text-right">הפסד ממוצע</TableHead>
                    <TableHead className="text-right">שיפור</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMistakePatterns.map((pattern) => (
                    <TableRow key={pattern.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="font-medium">{pattern.name}</TableCell>
                      <TableCell>{pattern.occurrences}</TableCell>
                      <TableCell className="text-red-600">{pattern.averageLoss}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={pattern.improvement} className="h-2 w-20" />
                          <span>{pattern.improvement}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* פירוט הטעות הנבחרת */}
            <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
              <h3 className="font-bold text-lg mb-2 text-right">{mockMistakePatterns[0].name}</h3>
              <p className="text-right mb-3">{mockMistakePatterns[0].description}</p>
              
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">הפסד ממוצע: {mockMistakePatterns[0].averageLoss}%</span>
                  <span className="text-right">מספר מקרים: {mockMistakePatterns[0].occurrences}</span>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-right border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium mb-1">הפתרון המומלץ:</h4>
                  <p className="text-sm">{mockMistakePatterns[0].solution}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-2">
              <Button onClick={createCustomStrategy}>
                <SquaresPlusIcon className="h-4 w-4 ml-2" />
                צור אסטרטגיה מתוקנת
              </Button>
            </div>
          </TabsContent>
          
          {/* לשונית דפוסי הצלחה */}
          <TabsContent value="successes" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockSuccessPatterns.map((pattern) => (
                <div key={pattern.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="bg-green-100 text-green-800">
                      {pattern.averageProfit}% רווח ממוצע
                    </Badge>
                    <h3 className="font-bold text-right">{pattern.name}</h3>
                  </div>
                  <p className="text-right text-sm mb-3">{pattern.description}</p>
                  
                  <div className="text-right text-sm">
                    <span className="font-medium block mb-1">תנאים לשחזור:</span>
                    <p className="text-muted-foreground">{pattern.conditions}</p>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <progress 
                        className="h-2 w-20" 
                        value={pattern.reproducibility} 
                        max="100"
                      ></progress>
                      <span className="text-sm">{pattern.reproducibility}% יכולת שחזור</span>
                    </div>
                    <span className="text-sm">{pattern.occurrences} מקרים</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md text-right border border-green-200 dark:border-green-800">
              <h3 className="font-medium mb-2">הוספת דפוסי ההצלחה למערכת האיתותים</h3>
              <p className="text-sm mb-3">המערכת יכולה לזהות אוטומטית מצבים דומים לדפוסי ההצלחה שלך ולהתריע בזמן אמת</p>
              <Button variant="outline" className="mt-1" onClick={() => toast.success('דפוסי ההצלחה נוספו למערכת האיתותים')}>
                <PieChart className="h-4 w-4 ml-2" />
                הוסף למערכת האיתותים
              </Button>
            </div>
          </TabsContent>
          
          {/* לשונית העלאת יומן מסחר */}
          <TabsContent value="upload" className="space-y-4">
            <div className="text-right mb-4">
              <h3 className="font-medium text-lg mb-1">העלאת יומן מסחר</h3>
              <p className="text-muted-foreground text-sm">
                העלה את יומן המסחר שלך כדי שהמערכת תוכל ללמוד את הדפוסים האישיים שלך ולהציע שיפורים מותאמים אישית
              </p>
            </div>
            
            <div className="border-2 border-dashed rounded-md p-8 text-center">
              {isUploading ? (
                <div className="space-y-4">
                  <p>מעלה את היומן...</p>
                  <Progress value={uploadProgress} className="h-2 w-full" />
                  <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="text-lg">גרור קבצים לכאן או לחץ לבחירה</p>
                  <p className="text-sm text-muted-foreground">תומך בקבצי CSV, Excel או JSON</p>
                  <Button 
                    variant="outline" 
                    onClick={simulateUpload}
                    disabled={isUploading}
                  >
                    <FilePlus className="h-4 w-4 ml-2" />
                    בחר קובץ
                  </Button>
                </div>
              )}
            </div>
            
            <div className="rounded-md p-4 bg-gray-50 dark:bg-gray-800 mt-4">
              <h4 className="font-medium text-right mb-2">פורמט מומלץ ליומן מסחר</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-right text-sm">כלול את כל העסקאות שלך, גם רווחיות וגם הפסדיות</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-right text-sm">הוסף מידע על נקודות כניסה ויציאה, גודל פוזיציה ורציונל לעסקה</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-right text-sm">ציין את האסטרטגיה ששימשה אותך וכל אינדיקטור שהסתמכת עליו</p>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-right text-sm">אל תכלול מידע אישי או פיננסי רגיש כמו פרטי חשבון או סיסמאות</p>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <Button 
                variant="link" 
                onClick={() => window.open('#', '_blank')}
              >
                הורד תבנית יומן מסחר
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradingLearningSystem;
