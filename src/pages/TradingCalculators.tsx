
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, TrendingUp, Shield, Copy } from 'lucide-react';
import { toast } from 'sonner';

const TradingCalculators: React.FC = () => {
  const [positionSize, setPositionSize] = useState({
    accountBalance: 10000,
    riskPercent: 2,
    entryPrice: 43000,
    stopLoss: 42000,
    result: 0
  });

  const [riskReward, setRiskReward] = useState({
    entryPrice: 43000,
    stopLoss: 42000,
    targetPrice: 46000,
    ratio: 0
  });

  const [leverageCalc, setLeverageCalc] = useState({
    accountBalance: 10000,
    positionSize: 20000,
    leverage: 0,
    margin: 0
  });

  const calculatePositionSize = () => {
    const riskAmount = (positionSize.accountBalance * positionSize.riskPercent) / 100;
    const priceRisk = Math.abs(positionSize.entryPrice - positionSize.stopLoss);
    const result = riskAmount / priceRisk;
    
    setPositionSize(prev => ({ ...prev, result }));
    toast.success('גודל פוזיציה חושב בהצלחה');
  };

  const calculateRiskReward = () => {
    const risk = Math.abs(riskReward.entryPrice - riskReward.stopLoss);
    const reward = Math.abs(riskReward.targetPrice - riskReward.entryPrice);
    const ratio = reward / risk;
    
    setRiskReward(prev => ({ ...prev, ratio }));
    toast.success('יחס סיכון/רווח חושב בהצלחה');
  };

  const calculateLeverage = () => {
    const leverage = leverageCalc.positionSize / leverageCalc.accountBalance;
    const margin = leverageCalc.positionSize / leverage;
    
    setLeverageCalc(prev => ({ ...prev, leverage, margin }));
    toast.success('מינוף וערבות חושבו בהצלחה');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('הועתק ללוח');
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">מחשבוני מסחר</h1>
        <p className="text-muted-foreground">כלים לחישוב סיכון, גודל פוזיציה ומינוף</p>
      </div>

      <Tabs defaultValue="position-size" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="position-size">גודל פוזיציה</TabsTrigger>
          <TabsTrigger value="risk-reward">סיכון/רווח</TabsTrigger>
          <TabsTrigger value="leverage">מינוף</TabsTrigger>
          <TabsTrigger value="daily-risk">סיכון יומי</TabsTrigger>
        </TabsList>

        <TabsContent value="position-size" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                מחשבון גודל פוזיציה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountBalance">יתרת חשבון ($)</Label>
                  <Input
                    id="accountBalance"
                    type="number"
                    value={positionSize.accountBalance}
                    onChange={(e) => setPositionSize(prev => ({ ...prev, accountBalance: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="riskPercent">סיכון לעסקה (%)</Label>
                  <Input
                    id="riskPercent"
                    type="number"
                    value={positionSize.riskPercent}
                    onChange={(e) => setPositionSize(prev => ({ ...prev, riskPercent: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="entryPrice">מחיר כניסה ($)</Label>
                  <Input
                    id="entryPrice"
                    type="number"
                    value={positionSize.entryPrice}
                    onChange={(e) => setPositionSize(prev => ({ ...prev, entryPrice: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="stopLoss">סטופ לוס ($)</Label>
                  <Input
                    id="stopLoss"
                    type="number"
                    value={positionSize.stopLoss}
                    onChange={(e) => setPositionSize(prev => ({ ...prev, stopLoss: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <Button onClick={calculatePositionSize} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                חשב גודל פוזיציה
              </Button>

              {positionSize.result > 0 && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700 mb-2">
                        {positionSize.result.toFixed(4)} יחידות
                      </div>
                      <div className="text-sm text-green-600 mb-4">
                        גודל פוזיציה מומלץ
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(positionSize.result.toFixed(4))}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        העתק
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk-reward" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                מחשבון יחס סיכון/רווח
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rrEntryPrice">מחיר כניסה ($)</Label>
                  <Input
                    id="rrEntryPrice"
                    type="number"
                    value={riskReward.entryPrice}
                    onChange={(e) => setRiskReward(prev => ({ ...prev, entryPrice: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="rrStopLoss">סטופ לוס ($)</Label>
                  <Input
                    id="rrStopLoss"
                    type="number"
                    value={riskReward.stopLoss}
                    onChange={(e) => setRiskReward(prev => ({ ...prev, stopLoss: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="rrTargetPrice">מחיר יעד ($)</Label>
                  <Input
                    id="rrTargetPrice"
                    type="number"
                    value={riskReward.targetPrice}
                    onChange={(e) => setRiskReward(prev => ({ ...prev, targetPrice: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <Button onClick={calculateRiskReward} className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                חשב יחס סיכון/רווח
              </Button>

              {riskReward.ratio > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-700 mb-2">
                        1:{riskReward.ratio.toFixed(2)}
                      </div>
                      <div className="text-sm text-blue-600 mb-4">
                        יחס סיכון לרווח
                      </div>
                      <Badge className={riskReward.ratio >= 2 ? 'bg-green-100 text-green-800' : riskReward.ratio >= 1.5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                        {riskReward.ratio >= 2 ? 'מצוין' : riskReward.ratio >= 1.5 ? 'טוב' : 'לא מומלץ'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leverage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                מחשבון מינוף וערבות
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="levAccountBalance">יתרת חשבון ($)</Label>
                  <Input
                    id="levAccountBalance"
                    type="number"
                    value={leverageCalc.accountBalance}
                    onChange={(e) => setLeverageCalc(prev => ({ ...prev, accountBalance: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="levPositionSize">גודל פוזיציה ($)</Label>
                  <Input
                    id="levPositionSize"
                    type="number"
                    value={leverageCalc.positionSize}
                    onChange={(e) => setLeverageCalc(prev => ({ ...prev, positionSize: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <Button onClick={calculateLeverage} className="w-full">
                <DollarSign className="h-4 w-4 mr-2" />
                חשב מינוף וערבות
              </Button>

              {leverageCalc.leverage > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-700 mb-2">
                          {leverageCalc.leverage.toFixed(1)}x
                        </div>
                        <div className="text-sm text-purple-600">מינוף נדרש</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-700 mb-2">
                          ${leverageCalc.margin.toFixed(2)}
                        </div>
                        <div className="text-sm text-orange-600">ערבות נדרשת</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily-risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                ניהול סיכון יומי
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">מגבלות יומיות מומלצות</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm">הפסד מקسימלי יומי</span>
                      <Badge className="bg-green-100 text-green-800">2-3%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm">מספר עסקאות מקסימלי</span>
                      <Badge className="bg-blue-100 text-blue-800">5-8</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm">סיכון לעסקה</span>
                      <Badge className="bg-purple-100 text-purple-800">1-2%</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">חישוב מהיר</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>יתרת חשבון ($10,000)</Label>
                      <div className="mt-2 space-y-1">
                        <div className="text-sm">הפסד מקסימלי יומי (3%): <span className="font-bold text-red-600">$300</span></div>
                        <div className="text-sm">סיכון לעסקה (2%): <span className="font-bold text-blue-600">$200</span></div>
                        <div className="text-sm">מספר עסקאות מקסימלי: <span className="font-bold text-green-600">1-2</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ חוקי זהב לניהול סיכון</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• לעולם אל תסכן יותר מ-2% מהחשבון בעסקה אחת</li>
                  <li>• הפסק את המסחר אחרי הגעה למגבלת הפסד יומי</li>
                  <li>• השתמש תמיד בסטופ לוס</li>
                  <li>• אל תגדיל פוזיציות מפסידות</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingCalculators;
