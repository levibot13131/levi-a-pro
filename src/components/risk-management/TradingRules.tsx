
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { riskManagementRules } from '@/services/customTradingStrategyService';

interface TradingRulesProps {
  showDetails?: boolean;
}

const TradingRules = ({ showDetails = true }: TradingRulesProps) => {
  // Categorize rules - using rule property in the riskManagementRules objects
  const stopLossRules = riskManagementRules.filter(rule => rule.rule.includes('סטופ') || rule.rule.includes('stop'));
  const positionRules = riskManagementRules.filter(rule => rule.rule.includes('פוזיציה') || rule.rule.includes('גודל'));
  const psychologyRules = riskManagementRules.filter(rule => rule.rule.includes('פסיכולוגיה') || rule.rule.includes('רגש'));
  const generalRules = riskManagementRules.filter(rule => !stopLossRules.includes(rule) && 
                                                       !positionRules.includes(rule) && 
                                                       !psychologyRules.includes(rule));
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <Info className="h-4 w-4 text-amber-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">קריטי</Badge>;
      case 'high':
        return <Badge variant="secondary">חשוב</Badge>;
      case 'medium':
        return <Badge variant="outline">בינוני</Badge>;
      default:
        return <Badge variant="outline">רגיל</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right flex items-center justify-between">
          <ShieldCheck className="h-5 w-5" />
          <div>כללי המסחר וניהול הסיכונים</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-right space-y-6">
          {/* Stop Loss Rules */}
          <div>
            <h3 className="font-semibold text-lg mb-2 flex justify-end items-center">
              <span>כללי סטופ לוס</span>
              <AlertTriangle className="h-5 w-5 ml-2 text-red-500" />
            </h3>
            <div className="space-y-2">
              {stopLossRules.map(rule => (
                <div key={rule.id} className="border rounded-lg p-2">
                  <div className="flex justify-between items-start">
                    {getPriorityBadge(rule.priority)}
                    <div className="text-right font-medium">{rule.rule}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Position Size Rules */}
          <div>
            <h3 className="font-semibold text-lg mb-2 flex justify-end items-center">
              <span>כללי גודל פוזיציה</span>
              <Info className="h-5 w-5 ml-2 text-blue-500" />
            </h3>
            <div className="space-y-2">
              {positionRules.map(rule => (
                <div key={rule.id} className="border rounded-lg p-2">
                  <div className="flex justify-between items-start">
                    {getPriorityBadge(rule.priority)}
                    <div className="text-right font-medium">{rule.rule}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Psychology Rules */}
          <div>
            <h3 className="font-semibold text-lg mb-2 flex justify-end items-center">
              <span>כללי פסיכולוגיה</span>
              <CheckCircle className="h-5 w-5 ml-2 text-green-500" />
            </h3>
            <div className="space-y-2">
              {psychologyRules.map(rule => (
                <div key={rule.id} className="border rounded-lg p-2">
                  <div className="flex justify-between items-start">
                    {getPriorityBadge(rule.priority)}
                    <div className="text-right font-medium">{rule.rule}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {generalRules.length > 0 && (
            <>
              <Separator />
              
              {/* General Rules */}
              <div>
                <h3 className="font-semibold text-lg mb-2 flex justify-end items-center">
                  <span>כללים כלליים</span>
                  <Info className="h-5 w-5 ml-2 text-gray-500" />
                </h3>
                <div className="space-y-2">
                  {generalRules.map(rule => (
                    <div key={rule.id} className="border rounded-lg p-2">
                      <div className="flex justify-between items-start">
                        {getPriorityBadge(rule.priority)}
                        <div className="text-right font-medium">{rule.rule}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingRules;
