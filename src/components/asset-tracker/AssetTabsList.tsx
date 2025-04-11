
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart4 } from 'lucide-react';

interface AssetTabsListProps {
  cryptoCount: number;
  stocksCount: number;
  forexCount: number;
  commoditiesCount: number;
}

const AssetTabsList: React.FC<AssetTabsListProps> = ({
  cryptoCount,
  stocksCount,
  forexCount,
  commoditiesCount
}) => {
  return (
    <TabsList className="grid grid-cols-5 md:w-auto">
      <TabsTrigger value="dashboard">
        <BarChart4 className="h-4 w-4 mr-2 hidden md:inline" />
        דשבורד
      </TabsTrigger>
      <TabsTrigger value="crypto">
        <span className="hidden md:inline mr-2">קריפטו</span>
        <span className="md:hidden">🪙</span>
        <span className="ml-1 text-xs rounded-full bg-secondary px-1.5">{cryptoCount}</span>
      </TabsTrigger>
      <TabsTrigger value="stocks">
        <span className="hidden md:inline mr-2">מניות</span>
        <span className="md:hidden">📈</span>
        <span className="ml-1 text-xs rounded-full bg-secondary px-1.5">{stocksCount}</span>
      </TabsTrigger>
      <TabsTrigger value="forex">
        <span className="hidden md:inline mr-2">מט"ח</span>
        <span className="md:hidden">💱</span>
        <span className="ml-1 text-xs rounded-full bg-secondary px-1.5">{forexCount}</span>
      </TabsTrigger>
      <TabsTrigger value="commodities">
        <span className="hidden md:inline mr-2">סחורות</span>
        <span className="md:hidden">🛢️</span>
        <span className="ml-1 text-xs rounded-full bg-secondary px-1.5">{commoditiesCount}</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default AssetTabsList;
