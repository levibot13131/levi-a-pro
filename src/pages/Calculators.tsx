import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calculator, DollarSign, Shield, Target, TrendingUp, AlertTriangle } from 'lucide-react';

const Calculators: React.FC = () => {
  // Position Size Calculator State
  const [capital, setCapital] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(2);
  const [entryPrice, setEntryPrice] = useState<number>(50000);
  const [stopLoss, setStopLoss] = useState<number>(48500);
  const [leverage, setLeverage] = useState<number>(1);

  // Risk/Reward Calculator State
  const [targetPrice, setTargetPrice] = useState<number>(52000);

  // Daily Loss Calculator State
  const [dailyLossLimit, setDailyLossLimit] = useState<number>(200);
  const [currentDayLoss, setCurrentDayLoss] = useState<number>(0);

  // Position Size Calculations
  const riskAmount = (capital * riskPercent) / 100;
  const priceRisk = Math.abs(entryPrice - stopLoss);
  const positionSize = riskAmount / priceRisk;
  const leveragedPosition = positionSize * leverage;
  const marginRequired = leveragedPosition / leverage;

  // Risk/Reward Calculations
  const potentialLoss = Math.abs(entryPrice - stopLoss);
  const potentialProfit = Math.abs(targetPrice - entryPrice);
  const riskRewardRatio = potentialLoss > 0 ? potentialProfit / potentialLoss : 0;

  // Daily Loss Calculations
  const remainingRisk = Math.max(0, dailyLossLimit - currentDayLoss);
  const canTrade = currentDayLoss < dailyLossLimit;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">מחשבוני LeviPro</h1>
          <p className="text-gray-600">כלי ניהול סיכונים ומחשבון עמדות מתקדם</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Position Size Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-500" />
                מחשבון גודל עמדה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">הון זמין ($)</label>
                  <Input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(Number(e.target.value))}
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">סיכון למסחר (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(Number(e.target.value))}
                    placeholder="2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">מחיר כניסה ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(Number(e.target.value))}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">סטופ לוס ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(Number(e.target.value))}
                    placeholder="48500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">מינוף (X)</label>
                  <Input
                    type="number"
                    step="1"
                    value={leverage}
                    onChange={(e) => setLeverage(Number(e.target.value))}
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold text-blue-800">תוצאות חישוב:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">סכום סיכון:</span>
                    <span className="font-bold text-blue-700 ml-2">${riskAmount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">סיכון למניה:</span>
                    <span className="font-bold text-blue-700 ml-2">${priceRisk.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">גודל עמדה:</span>
                    <span className="font-bold text-green-700 ml-2">{positionSize.toFixed(4)} יחידות</span>
                  </div>
                  <div>
                    <span className="text-gray-600">עמדה עם מינוף:</span>
                    <span className="font-bold text-green-700 ml-2">{leveragedPosition.toFixed(4)} יחידות</span>
                  </div>
                  <div>
                    <span className="text-gray-600">מרג'ין נדרש:</span>
                    <span className="font-bold text-orange-700 ml-2">${marginRequired.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk/Reward Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                מחשבון סיכון/תשואה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">מחיר יעד ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  placeholder="52000"
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold text-green-800">ניתוח סיכון/תשואה:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">הפסד פוטנציאלי:</span>
                    <span className="font-bold text-red-600">${potentialLoss.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">רווח פוטנציאלי:</span>
                    <span className="font-bold text-green-600">${potentialProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">יחס R/R:</span>
                    <span className={`font-bold text-lg ${riskRewardRatio >= 2 ? 'text-green-600' : riskRewardRatio >= 1.5 ? 'text-yellow-600' : 'text-red-600'}`}>
                      1:{riskRewardRatio.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-2 p-2 rounded bg-white">
                    {riskRewardRatio >= 2 ? (
                      <span className="text-green-600 text-sm">✅ יחס מעולה - מומלץ למסחר</span>
                    ) : riskRewardRatio >= 1.5 ? (
                      <span className="text-yellow-600 text-sm">⚠️ יחס סביר - שקול בזהירות</span>
                    ) : (
                      <span className="text-red-600 text-sm">❌ יחס לא מספק - לא מומלץ</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Loss Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                מעקב הפסדים יומי
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">מגבלת הפסד יומית ($)</label>
                  <Input
                    type="number"
                    value={dailyLossLimit}
                    onChange={(e) => setDailyLossLimit(Number(e.target.value))}
                    placeholder="200"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">הפסד נוכחי היום ($)</label>
                  <Input
                    type="number"
                    value={currentDayLoss}
                    onChange={(e) => setCurrentDayLoss(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className={`p-4 rounded-lg ${canTrade ? 'bg-green-50' : 'bg-red-50'}`}>
                <h4 className={`font-semibold ${canTrade ? 'text-green-800' : 'text-red-800'}`}>
                  {canTrade ? 'מותר למסחר' : 'אסור למסחר'}
                </h4>
                <div className="space-y-2 text-sm mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">סכום נותר לסיכון:</span>
                    <span className={`font-bold ${remainingRisk > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${remainingRisk.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">אחוז מהמגבלה:</span>
                    <span className="font-bold">
                      {((currentDayLoss / dailyLossLimit) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                {!canTrade && (
                  <div className="mt-3 p-2 bg-red-100 rounded flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-red-700 text-sm">הגעת למגבלת ההפסד היומית</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Trading Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                כללי המסחר שלי
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-purple-50 rounded">
                  <h5 className="font-semibold text-purple-800">ניהול הון:</h5>
                  <ul className="list-disc list-inside text-purple-700 mt-1 space-y-1">
                    <li>סיכון מקסימלי 2% מההון למסחר</li>
                    <li>מגבלת הפסד יומית: $200</li>
                    <li>מינוף מקסימלי: 5X (זהירות!)</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-blue-50 rounded">
                  <h5 className="font-semibold text-blue-800">כניסה למסחר:</h5>
                  <ul className="list-disc list-inside text-blue-700 mt-1 space-y-1">
                    <li>יחס R/R מינימלי: 1:2</li>
                    <li>ביטחון מינימלי: 75%</li>
                    <li>אישור ב-3 timeframes</li>
                  </ul>
                </div>

                <div className="p-3 bg-green-50 rounded">
                  <h5 className="font-semibold text-green-800">יציאה ממסחר:</h5>
                  <ul className="list-disc list-inside text-green-700 mt-1 space-y-1">
                    <li>יציאה מיידית בסטופ לוס</li>
                    <li>הזזת סטופ לוס ברווח של 1:1</li>
                    <li>לקיחת רווח חלקי ב-50% מהיעד</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calculators;