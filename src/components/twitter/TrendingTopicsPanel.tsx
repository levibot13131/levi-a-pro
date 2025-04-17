
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface TrendingTopicsPanelProps {
  className?: string;
}

const TrendingTopicsPanel: React.FC<TrendingTopicsPanelProps> = ({ className = '' }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-right">נושאים חמים</CardTitle>
        <CardDescription className="text-right">
          הנושאים המדוברים ביותר ב-24 השעות האחרונות
        </CardDescription>
      </CardHeader>
      <CardContent className="text-right">
        <div className="flex flex-wrap gap-2 justify-end">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            #Bitcoin
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            #ETH
          </div>
          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            #Web3
          </div>
          <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
            #NFT
          </div>
          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
            #Trading
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
            #DeFi
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingTopicsPanel;
