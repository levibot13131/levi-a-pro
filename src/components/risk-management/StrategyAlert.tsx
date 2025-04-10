
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookMarked } from 'lucide-react';
import { tradingApproach } from '@/services/customTradingStrategyService';

const StrategyAlert = () => {
  return (
    <div className="mb-6">
      <Alert className="bg-blue-50 border-blue-300 text-right">
        <AlertTitle className="flex justify-end items-center">
          <span>אסטרטגיית מסחר KSM</span>
          <BookMarked className="h-5 w-5 ml-2" />
        </AlertTitle>
        <AlertDescription className="text-right">
          <p className="mb-2">{tradingApproach.description}</p>
          <ul className="list-disc mr-5 space-y-1">
            {tradingApproach.keyPrinciples.slice(0, 3).map((principle, idx) => (
              <li key={idx}>{principle}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default StrategyAlert;
