
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, BarChart3, Brain, Target } from 'lucide-react';

const ComprehensiveAnalysis: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');

  return (
    <div className="space-y-6">
      <div className="text-right">
        <h1 className="text-3xl font-bold">ניתוח מקיף</h1>
        <p className="text-gray-600">ניתוח טכני, בסיסי ורגשי משולב</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center justify-between">
            {selectedSymbol} - ניתוח כולל
            <BarChart3 className="h-6 w-6" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="technical" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="technical">טכני</TabsTrigger>
              <TabsTrigger value="fundamental">בסיסי</TabsTrigger>
              <TabsTrigger value="sentiment">רגשי</TabsTrigger>
              <TabsTrigger value="combined">משולב</TabsTrigger>
            </TabsList>

            <TabsContent value="technical" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right text-sm">RSI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-center">67.3</div>
                    <Badge className="w-full justify-center bg-yellow-100 text-yellow-800">נייטרלי</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-right text-sm">MACD</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-center text-green-600">+234</div>
                    <Badge className="w-full justify-center bg-green-100 text-green-800">חיובי</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-right text-sm">Fibonacci</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-center">61.8%</div>
                    <Badge className="w-full justify-center bg-blue-100 text-blue-800">תמיכה</Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="fundamental" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">נתוני שוק</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>$847B</span>
                      <span>שווי שוק:</span>
                    </div>
                    <div className="flex justify-between">
                      <span>$32.4B</span>
                      <span>נפח 24 שעות:</span>
                    </div>
                    <div className="flex justify-between">
                      <span>52.3%</span>
                      <span>דומיננטיות:</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">מטריקות רשת</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>2.3 EH/s</span>
                      <span>Hash Rate:</span>
                    </div>
                    <div className="flex justify-between">
                      <span>6 min</span>
                      <span>זמן בלוק ממוצע:</span>
                    </div>
                    <div className="flex justify-between">
                      <span>High</span>
                      <span>אבטחת רשת:</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sentiment" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right text-sm">Fear & Greed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-center text-orange-600">42</div>
                    <Badge className="w-full justify-center bg-orange-100 text-orange-800">פחד</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-right text-sm">רשתות חברתיות</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-center text-green-600">68%</div>
                    <Badge className="w-full justify-center bg-green-100 text-green-800">חיובי</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-right text-sm">חדשות</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-center text-blue-600">7.2</div>
                    <Badge className="w-full justify-center bg-blue-100 text-blue-800">טוב</Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="combined" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    המלצת המערכת
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-green-600">קנה</div>
                    <Badge className="text-lg px-4 py-2 bg-green-100 text-green-800">ביטחון גבוה - 87%</Badge>
                    <div className="text-right space-y-2">
                      <p className="font-medium">נימוק משולב:</p>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• אישור מומנטום חיובי מ-MACD</li>
                        <li>• תמיכה חזקה ברמת פיבונאצ'י 61.8%</li>
                        <li>• סנטימנט חיובי ברשתות החברתיות</li>
                        <li>• השיטה האישית מאשרת הזדמנות</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">יעדי מחיר</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-bold text-green-600">$44,800</span>
                      <span>יעד ראשון:</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-green-600">$46,200</span>
                      <span>יעד שני:</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-red-600">$42,100</span>
                      <span>סטופ לוס:</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">ניהול סיכונים</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-bold">2.1%</span>
                      <span>סיכון לעסקה:</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-green-600">1.8:1</span>
                      <span>יחס רווח/סיכון:</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">$1,250</span>
                      <span>גודל פוזיציה מומלץ:</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveAnalysis;
