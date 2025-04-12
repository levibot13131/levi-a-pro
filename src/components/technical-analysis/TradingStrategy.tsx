
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { tradingApproach, riskManagementRules } from '@/services/customTradingStrategyService';

const TradingStrategy = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>אסטרטגיית המסחר</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">{tradingApproach.name}</h3>
            <p className="text-sm text-muted-foreground">{tradingApproach.description}</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">עקרונות מפתח:</h4>
            <ul className="list-disc list-inside space-y-1">
              {tradingApproach.keyPrinciples.map((principle, i) => (
                <li key={i} className="text-sm">{principle}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">מדדי זמן מועדפים:</h4>
            <div className="flex gap-2 flex-wrap">
              {tradingApproach.preferredTimeframes.map((timeframe, i) => (
                <span key={i} className="px-2 py-1 bg-muted rounded text-xs">{timeframe}</span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">אינדיקטורים בשימוש:</h4>
            <div className="flex gap-2 flex-wrap">
              {tradingApproach.indicators.map((indicator, i) => (
                <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded text-xs">{indicator}</span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">ניהול סיכונים:</h4>
            <div className="bg-muted p-3 rounded">
              <p className="text-sm mb-2">סיכון מקסימלי לעסקה: <span className="font-semibold">{riskManagementRules.maxRiskPerTrade}%</span></p>
              <ul className="list-disc list-inside space-y-1">
                {riskManagementRules.stopLossPlacement.map((rule, i) => (
                  <li key={i} className="text-sm">{rule}</li>
                ))}
                {riskManagementRules.exitStrategies.map((strategy, i) => (
                  <li key={i} className="text-sm">{strategy}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Download className="h-4 w-4" />
            הורד גרסה PDF של האסטרטגיה
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingStrategy;
