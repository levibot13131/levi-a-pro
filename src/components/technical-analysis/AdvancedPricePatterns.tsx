
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  ChevronDown, 
  Layers, 
  Target, 
  TrendingUp, 
  Grid3X3,
  Info
} from 'lucide-react';

interface AdvancedPricePatternsProps {
  assetId: string;
  formatPrice: (price: number) => string;
}

const AdvancedPricePatterns: React.FC<AdvancedPricePatternsProps> = ({ assetId, formatPrice }) => {
  const [activeTab, setActiveTab] = useState('quarter');
  const [showKeyLevels, setShowKeyLevels] = useState(true);
  
  // נתונים מדומים לרבעים
  const quarterLevels = {
    top: 32500,
    upperMiddle: 30000,
    lowerMiddle: 27500,
    bottom: 25000,
    current: 28300,
    nextTarget: 30000,
    nextSupport: 27500
  };
  
  // נתונים מדומים לאזורי ביקוש והיצע
  const supplyDemandZones = [
    {
      type: 'supply',
      min: 31200,
      max: 32100,
      strength: 'high',
      touches: 3,
      lastTest: '15 במרץ 2025',
      description: 'אזור היצע חזק שנבדק 3 פעמים, עם דחייה משמעותית בכל פעם'
    },
    {
      type: 'demand',
      min: 25800,
      max: 26500,
      strength: 'medium',
      touches: 2,
      lastTest: '2 בפברואר 2025',
      description: 'אזור ביקוש מאז תחילת המגמה העולה בינואר, עם תמיכה חזקה'
    },
    {
      type: 'demand',
      min: 24200,
      max: 24800,
      strength: 'high',
      touches: 4,
      lastTest: '10 בינואר 2025',
      description: 'אזור ביקוש היסטורי שנבדק מספר פעמים בשנתיים האחרונות'
    }
  ];
  
  // נתונים מדומים למספרי פיבונאצ'י
  const fibLevels = [
    { level: '0', price: 24200, type: 'support', strength: 'high' },
    { level: '0.236', price: 25900, type: 'support', strength: 'medium' },
    { level: '0.382', price: 27100, type: 'support', strength: 'high' },
    { level: '0.5', price: 28100, type: 'current', strength: 'neutral' },
    { level: '0.618', price: 29100, type: 'resistance', strength: 'high' },
    { level: '0.786', price: 30400, type: 'resistance', strength: 'medium' },
    { level: '1', price: 32000, type: 'resistance', strength: 'high' }
  ];
  
  // קביעת סגנון תג לפי סוג האזור וחוזק
  const getZoneBadgeStyle = (type: string, strength: string) => {
    if (type === 'supply') {
      return strength === 'high' 
        ? 'bg-red-100 text-red-800 border-red-200' 
        : 'bg-red-50 text-red-600 border-red-100';
    } else {
      return strength === 'high' 
        ? 'bg-green-100 text-green-800 border-green-200' 
        : 'bg-green-50 text-green-600 border-green-100';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">ניתוח דפוסי מחיר מתקדמים</CardTitle>
        <CardDescription className="text-right">
          זיהוי אזורי מחיר משמעותיים, רבעים, ואזורי ביקוש והיצע
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="quarter">שיטת הרבעים</TabsTrigger>
            <TabsTrigger value="sd">ביקוש והיצע</TabsTrigger>
            <TabsTrigger value="fibonacci">פיבונאצ'י</TabsTrigger>
          </TabsList>
          
          {/* לשונית שיטת הרבעים */}
          <TabsContent value="quarter" className="space-y-4">
            <div className="p-4 border rounded-md bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
              <div className="space-y-8 relative pb-6">
                {/* קו אנכי מקווקו אמצעי */}
                <div className="absolute h-full w-0.5 border-r border-dashed border-gray-300 dark:border-gray-600 left-1/2 top-0"></div>

                {/* רבע עליון */}
                <div className="text-right">
                  <div className="flex justify-between items-center mb-1">
                    <Badge variant="outline">גג</Badge>
                    <h3 className="font-bold">הרבע העליון (75%-100%)</h3>
                  </div>
                  <p className="text-sm mb-1">
                    אזור מכירה אופטימלי, סביר להניח שיש התנגדות משמעותית כלפי מעלה
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
                      התנגדות חזקה
                    </Badge>
                    <span className="font-mono">${formatPrice(quarterLevels.top)}</span>
                  </div>
                </div>
                
                {/* רבע עליון אמצעי */}
                <div className="text-right">
                  <div className="flex justify-between items-center mb-1">
                    <Badge variant="outline">אמצע עליון</Badge>
                    <h3 className="font-medium">רבע עליון-אמצעי (50%-75%)</h3>
                  </div>
                  <p className="text-sm mb-1">
                    אזור של הזדמנויות מכירה טובות אם המחיר באזור זה והמומנטום נחלש
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className={
                      quarterLevels.current >= quarterLevels.upperMiddle && quarterLevels.current < quarterLevels.top
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : ''
                    }>
                      {quarterLevels.current >= quarterLevels.upperMiddle && quarterLevels.current < quarterLevels.top
                        ? 'מחיר נוכחי'
                        : 'רמת פיבוט'
                      }
                    </Badge>
                    <span className="font-mono">${formatPrice(quarterLevels.upperMiddle)}</span>
                  </div>
                </div>
                
                {/* רבע תחתון אמצעי */}
                <div className="text-right">
                  <div className="flex justify-between items-center mb-1">
                    <Badge variant="outline">אמצע תחתון</Badge>
                    <h3 className="font-medium">רבע תחתון-אמצעי (25%-50%)</h3>
                  </div>
                  <p className="text-sm mb-1">
                    אזור ביניים, אפשר לצפות לתנודתיות, מתאים למסחר טווח קצר
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className={
                      quarterLevels.current >= quarterLevels.lowerMiddle && quarterLevels.current < quarterLevels.upperMiddle
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : ''
                    }>
                      {quarterLevels.current >= quarterLevels.lowerMiddle && quarterLevels.current < quarterLevels.upperMiddle
                        ? 'מחיר נוכחי'
                        : 'אזור ביניים'
                      }
                    </Badge>
                    <span className="font-mono">${formatPrice(quarterLevels.lowerMiddle)}</span>
                  </div>
                </div>
                
                {/* רבע תחתון */}
                <div className="text-right">
                  <div className="flex justify-between items-center mb-1">
                    <Badge variant="outline">רצפה</Badge>
                    <h3 className="font-bold">הרבע התחתון (0%-25%)</h3>
                  </div>
                  <p className="text-sm mb-1">
                    אזור קנייה אופטימלי, סביר להניח שיש תמיכה משמעותית כלפי מטה
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                      תמיכה חזקה
                    </Badge>
                    <span className="font-mono">${formatPrice(quarterLevels.bottom)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
                <div className="text-right">
                  <h4 className="font-medium mb-1">מיקום נוכחי:</h4>
                  <p className="text-sm">
                    <span className="font-bold">${formatPrice(quarterLevels.current)}</span> - נמצא ברבע 
                    {quarterLevels.current >= quarterLevels.upperMiddle 
                      ? ' העליון-אמצעי'
                      : quarterLevels.current >= quarterLevels.lowerMiddle
                        ? ' התחתון-אמצעי'
                        : ' התחתון'
                    }. 
                    היעד הבא כלפי מעלה: <span className="font-bold">${formatPrice(quarterLevels.nextTarget)}</span>. 
                    התמיכה הקרובה: <span className="font-bold">${formatPrice(quarterLevels.nextSupport)}</span>.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* לשונית אזורי ביקוש והיצע */}
          <TabsContent value="sd" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-key-levels" 
                  checked={showKeyLevels}
                  onCheckedChange={setShowKeyLevels}
                />
                <Label htmlFor="show-key-levels">הצג על הגרף</Label>
              </div>
              <h3 className="font-medium text-right">אזורי ביקוש והיצע משמעותיים</h3>
            </div>
            
            <div className="space-y-3">
              {supplyDemandZones.map((zone, index) => (
                <Collapsible key={index}>
                  <div className={`border rounded-md p-3 ${
                    zone.type === 'supply' ? 'border-red-200 dark:border-red-800' : 'border-green-200 dark:border-green-800'
                  }`}>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex justify-between items-center">
                        <Badge 
                          className={getZoneBadgeStyle(zone.type, zone.strength)}
                        >
                          {zone.type === 'supply' ? 'היצע' : 'ביקוש'}
                        </Badge>
                        <div className="text-right flex items-center gap-2">
                          <span className="font-medium">
                            ${formatPrice(zone.min)} - ${formatPrice(zone.max)}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="pt-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>חוזק: {zone.strength === 'high' ? 'גבוה' : 'בינוני'}</span>
                          <span className="text-right">בדיקות: {zone.touches}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>בדיקה אחרונה: {zone.lastTest}</span>
                          <span className="text-right">
                            {zone.type === 'supply' ? 'אזור מכירה' : 'אזור קנייה'}
                          </span>
                        </div>
                        <Separator className="my-2" />
                        <p className="text-right text-sm">{zone.description}</p>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800 text-right">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <h4 className="font-medium mb-1">זיהוי אזורי ביקוש והיצע</h4>
                  <p className="text-sm">
                    אזורי ביקוש והיצע הם אזורים שבהם המחיר שינה כיוון באופן חד בעבר. אזורים אלה מציגים חוסר איזון בין קונים למוכרים ונוטים לספק תמיכה או התנגדות משמעותית בבדיקות חוזרות.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* לשונית רמות פיבונאצ'י */}
          <TabsContent value="fibonacci" className="space-y-4">
            <div className="rounded-md border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="px-4 py-2 text-right">רמה</th>
                    <th className="px-4 py-2 text-right">מחיר</th>
                    <th className="px-4 py-2 text-right">סוג</th>
                    <th className="px-4 py-2 text-right">חוזק</th>
                  </tr>
                </thead>
                <tbody>
                  {fibLevels.map((level, index) => (
                    <tr 
                      key={index} 
                      className={
                        level.type === 'current' 
                          ? 'bg-yellow-50 dark:bg-yellow-900/20' 
                          : index % 2 === 0 
                            ? 'bg-white dark:bg-gray-900' 
                            : 'bg-gray-50 dark:bg-gray-800'
                      }
                    >
                      <td className="px-4 py-2 text-right font-medium">{level.level}</td>
                      <td className="px-4 py-2 text-right">${formatPrice(level.price)}</td>
                      <td className="px-4 py-2 text-right">
                        <Badge 
                          variant="outline"
                          className={
                            level.type === 'resistance' 
                              ? 'border-red-200 text-red-700' 
                              : level.type === 'support'
                                ? 'border-green-200 text-green-700'
                                : 'border-yellow-200 text-yellow-700'
                          }
                        >
                          {level.type === 'resistance' 
                            ? 'התנגדות' 
                            : level.type === 'support'
                              ? 'תמיכה'
                              : 'מחיר נוכחי'
                          }
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-right">
                        {level.strength === 'high' 
                          ? 'גבוה' 
                          : level.strength === 'medium'
                            ? 'בינוני'
                            : '-'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border rounded-md">
              <h4 className="font-medium text-right mb-2">משמעות רמות פיבונאצ'י</h4>
              <p className="text-right text-sm mb-3">
                רמות פיבונאצ'י מבוססות על יחסים מתמטיים ומשמשות לזיהוי נקודות מפנה פוטנציאליות. הן פועלות כאזורי תמיכה והתנגדות ומסייעות בזיהוי יעדי מחיר אפשריים.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 mt-1"></div>
                  <p className="text-right text-sm">
                    <span className="font-medium">0-0.382:</span> אזורי תמיכה, רמות נמוכות מצביעות על תיקון מינורי, הזדמנויות קנייה אפשריות
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 mt-1"></div>
                  <p className="text-right text-sm">
                    <span className="font-medium">0.5:</span> רמת אמצע, לעתים קרובות מספקת תמיכה/התנגדות משמעותית, נקודת החלטה
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500 mt-1"></div>
                  <p className="text-right text-sm">
                    <span className="font-medium">0.618:</span> רמת "הזהב" - הרמה החשובה ביותר, נקודת מפנה פוטנציאלית חזקה
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500 mt-1"></div>
                  <p className="text-right text-sm">
                    <span className="font-medium">0.786-1.0:</span> רמות גבוהות, לרוב אזורי התנגדות, מצביעות על חולשה אפשרית של המגמה הנוכחית
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-2">
              <Button variant="outline">
                <Grid3X3 className="h-4 w-4 ml-2" />
                הצג על הגרף
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedPricePatterns;
