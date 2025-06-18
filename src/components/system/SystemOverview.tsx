
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Brain,
  Activity,
  Shield,
  Zap,
  TrendingUp,
  BarChart3,
  Target,
  Globe,
  MessageCircle,
  Database,
  Wifi
} from 'lucide-react';

interface SystemOverviewProps {
  className?: string;
}

const SystemOverview: React.FC<SystemOverviewProps> = ({ className }) => {
  // System status data
  const implementedFeatures = [
    {
      category: '🔐 אימות וגישה',
      items: [
        { name: 'כניסת מנהל (almogahronov1997@gmail.com)', status: 'completed', priority: 'high' },
        { name: 'גישת משתמש (avraham.oron@gmail.com)', status: 'completed', priority: 'high' },
        { name: 'עקיפת אישור אימייל למנהל', status: 'completed', priority: 'medium' },
        { name: 'החזקת סשן לאחר כניסה', status: 'completed', priority: 'high' },
        { name: 'חסימת משתמשים לא מורשים', status: 'completed', priority: 'high' },
      ]
    },
    {
      category: '📈 מנוע איתותים',
      items: [
        { name: 'נתונים חיים כל 30 שניות', status: 'completed', priority: 'critical' },
        { name: 'אזורי לחץ רגשי (Emotional Pressure)', status: 'completed', priority: 'critical' },
        { name: 'ניתוח מומנטום', status: 'completed', priority: 'critical' },
        { name: 'דרישת 2+ שיטות מסכימות', status: 'completed', priority: 'critical' },
        { name: 'הגבלת ביטחון ל-95%', status: 'completed', priority: 'high' },
        { name: 'שמירה ב-DB עם live_data: true', status: 'completed', priority: 'high' },
        { name: 'חיבור Binance API', status: 'completed', priority: 'high' },
        { name: 'חיבור CoinGecko API', status: 'completed', priority: 'high' },
      ]
    },
    {
      category: '🧠 האסטרטגיה האישית (עדיפות מוחלטת)',
      items: [
        { name: 'השיטה המותאמת אישית פועלת ראשונה', status: 'completed', priority: 'critical' },
        { name: 'ניתוח לחץ רגשי מתקדם', status: 'completed', priority: 'critical' },
        { name: 'חישוב מומנטום עם נפח', status: 'completed', priority: 'critical' },
        { name: 'טריגרים בהתבסס על נפח > 1.5M', status: 'completed', priority: 'critical' },
        { name: 'אכיפת SL/TP ויחס R:R', status: 'completed', priority: 'high' },
        { name: 'איתותים רק עם עמידה בכל הקריטריונים', status: 'completed', priority: 'critical' },
        { name: 'אין איתותים מדמי/ברירת מחדל', status: 'completed', priority: 'high' },
      ]
    },
    {
      category: '📲 אינטגרציית טלגרם',
      items: [
        { name: 'שליחת איתותים אמיתיים בלבד', status: 'completed', priority: 'high' },
        { name: 'עיצוב בעברית', status: 'completed', priority: 'medium' },
        { name: 'משלוח מיידי', status: 'completed', priority: 'high' },
        { name: 'התראות על איתותים אישיים', status: 'completed', priority: 'high' },
      ]
    },
    {
      category: '📊 ניהול סיכונים',
      items: [
        { name: 'מחשבון גודל פוזיציה', status: 'completed', priority: 'high' },
        { name: 'אכיפת יחס 1.5R', status: 'completed', priority: 'high' },
        { name: 'מקס 3 עסקאות לסשן', status: 'in-progress', priority: 'medium' },
        { name: 'הגבלת 2% סיכון לעסקה', status: 'completed', priority: 'high' },
        { name: 'הגבלת 5% הפסד יומי', status: 'in-progress', priority: 'medium' },
      ]
    },
    {
      category: '🔄 שיטות מסחר נוספות',
      items: [
        { name: 'תבניות משולש / Wyckoff', status: 'partial', priority: 'medium' },
        { name: 'פריצות ושיאי נפח', status: 'completed', priority: 'medium' },
        { name: 'אזורי תמיכה והתנגדות', status: 'partial', priority: 'medium' },
        { name: 'RSI, MACD, ממוצעים נעים', status: 'completed', priority: 'medium' },
        { name: 'לוגיקת נרות (engulfing, doji וכו\')', status: 'partial', priority: 'low' },
        { name: 'ניתוח סיכון-תשואה', status: 'completed', priority: 'high' },
      ]
    }
  ];

  const pendingFeatures = [
    {
      category: '📰 חדשות ורגש (שלב 2)',
      items: [
        { name: 'אינטגרציית Twitter/X', status: 'pending', priority: 'high' },
        { name: 'חדשות Cointelegraph/CoinDesk', status: 'pending', priority: 'high' },
        { name: 'Reddit crypto subs', status: 'pending', priority: 'medium' },
        { name: 'חדשות CoinMarketCap', status: 'pending', priority: 'medium' },
        { name: 'מערכת ניקוד רגש', status: 'pending', priority: 'medium' },
      ]
    },
    {
      category: '🐋 ניטור ארנקי לווייתנים',
      items: [
        { name: 'התראות על עסקאות ארנק גדולות', status: 'pending', priority: 'high' },
        { name: 'ניתוח און-צ\'יין', status: 'pending', priority: 'medium' },
        { name: 'מעקב אחר תנועות משמעותיות', status: 'pending', priority: 'medium' },
      ]
    },
    {
      category: '🔄 לולאת משוב ולמידה',
      items: [
        { name: 'מעקב הצלחה/כישלון איתותים', status: 'pending', priority: 'high' },
        { name: 'התאמת משקלי אסטרטגיות', status: 'pending', priority: 'medium' },
        { name: 'שיפור אוטומטי של האלגוריתם', status: 'pending', priority: 'medium' },
      ]
    },
    {
      category: '🌍 בריאות שוק גלובלית',
      items: [
        { name: 'סורק בריאות שוק כללי', status: 'pending', priority: 'medium' },
        { name: 'טריגרים פונדמנטליים מאקרו', status: 'pending', priority: 'medium' },
        { name: 'טריגרים פונדמנטליים מטבע-ספציפיים', status: 'pending', priority: 'medium' },
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'partial':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'pending':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">✅ הושלם</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800">🔄 בתהליך</Badge>;
      case 'partial':
        return <Badge className="bg-orange-100 text-orange-800">⚠️ חלקי</Badge>;
      case 'pending':
        return <Badge className="bg-red-100 text-red-800">⏳ ממתין</Badge>;
      default:
        return <Badge variant="secondary">❓ לא ידוע</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Calculate completion statistics
  const allFeatures =. [...implementedFeatures, ...pendingFeatures];
  const totalItems = allFeatures.reduce((sum, category) => sum + category.items.length, 0);
  const completedItems = allFeatures.reduce((sum, category) => 
    sum + category.items.filter(item => item.status === 'completed').length, 0
  );
  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              סטטיסטיקות מערכת
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {completionPercentage}% הושלם
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>התקדמות כללית</span>
                <span>{completedItems}/{totalItems} פיצ'רים</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{completedItems} הושלמו</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span>{allFeatures.reduce((sum, cat) => sum + cat.items.filter(i => i.status === 'in-progress').length, 0)} בתהליך</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span>{allFeatures.reduce((sum, cat) => sum + cat.items.filter(i => i.status === 'partial').length, 0)} חלקיים</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>{allFeatures.reduce((sum, cat) => sum + cat.items.filter(i => i.status === 'pending').length, 0)} ממתינים</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implemented Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            פיצ'רים שהושלמו ופועלים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {implementedFeatures.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-3">
                <h3 className="font-semibold text-lg text-right">{category.category}</h3>
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <div 
                      key={itemIndex} 
                      className={`flex items-center justify-between p-3 rounded border-l-4 ${getPriorityColor(item.priority)}`}
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        {getStatusBadge(item.status)}
                      </div>
                      <span className="text-right font-medium">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Features (Phase 2) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            פיצ'רים ממתינים (שלב 2)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {pendingFeatures.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-3">
                <h3 className="font-semibold text-lg text-right">{category.category}</h3>
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <div 
                      key={itemIndex} 
                      className={`flex items-center justify-between p-3 rounded border-l-4 ${getPriorityColor(item.priority)} opacity-60`}
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        {getStatusBadge(item.status)}
                      </div>
                      <span className="text-right font-medium">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trading Strategies Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            פירוט שיטות המסחר המיושמות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-l-blue-500 bg-blue-50 p-4 rounded">
              <h4 className="font-bold text-lg text-right mb-2">🧠 האסטרטגיה האישית של אלמוג (עדיפות מוחלטת)</h4>
              <ul className="text-right space-y-1 text-sm">
                <li>• ניתוח אזורי לחץ רגשי מתקדם</li>
                <li>• חישוב מומנטום עם משקל נפח</li>
                <li>• דרישת נפח מעל 1.5 מיליון</li>
                <li>• צירוף של 2+ אסטרטגיות לפחות</li>
                <li>• הגבלת ביטחון מקסימלי ל-95%</li>
                <li>• יחס סיכון תשואה של 1.75:1</li>
                <li>• SL/TP אוטומטיים</li>
              </ul>
            </div>

            <div className="border-l-4 border-l-green-500 bg-green-50 p-4 rounded">
              <h4 className="font-bold text-lg text-right mb-2">📊 אסטרטגיות טכניות נוספות</h4>
              <ul className="text-right space-y-1 text-sm">
                <li>• <strong>מומנטום ופריצות:</strong> זיהוי פריצות עם אישור נפח</li>
                <li>• <strong>RSI + MACD:</strong> אותות קנייה/מכירה מקלאסיים</li>
                <li>• <strong>ממוצעים נעים:</strong> זיהוי מגמות ואישורים</li>
                <li>• <strong>ניתוח נפח:</strong> Volume Profile + VWAP</li>
                <li>• <strong>תבניות נרות:</strong> Engulfing, Doji, Pinbar</li>
                <li>• <strong>פיבונאצ'י:</strong> רמות תמיכה והתנגדות</li>
              </ul>
            </div>

            <div className="border-l-4 border-l-orange-500 bg-orange-50 p-4 rounded">
              <h4 className="font-bold text-lg text-right mb-2">🔮 אסטרטגיות מתקדמות (חלקי)</h4>
              <ul className="text-right space-y-1 text-sm">
                <li>• <strong>Wyckoff Method:</strong> זיהוי שלבי אקומולציה והפצה</li>
                <li>• <strong>Smart Money Concepts:</strong> Order Blocks, Liquidity Grabs</li>
                <li>• <strong>תבניות משולש:</strong> זיהוי המשכים ופריצות</li>
                <li>• <strong>Head & Shoulders:</strong> תבניות היפוך מגמה</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemOverview;
