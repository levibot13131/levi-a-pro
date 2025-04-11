
import React from 'react';
import { Asset } from '@/types/asset';
import { Card, CardHeader } from '@/components/ui/card';
import AssetHeader from './components/AssetHeader';
import AssetMetricsGrid from './components/AssetMetricsGrid';
import AssetActionLinks from './components/AssetActionLinks';

interface AssetInfoCardProps {
  asset: Asset;
  formatPrice: (price: number) => string;
}

const AssetInfoCard = ({ asset, formatPrice }: AssetInfoCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        {/* כותרת הנכס עם מחיר ושינוי */}
        <AssetHeader asset={asset} formatPrice={formatPrice} />
        
        {/* רשת כרטיסי מידע */}
        <AssetMetricsGrid asset={asset} formatPrice={formatPrice} />
        
        {/* קישורים לפעולות */}
        <AssetActionLinks asset={asset} />
      </CardHeader>
    </Card>
  );
};

export default AssetInfoCard;
