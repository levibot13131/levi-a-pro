
import React from 'react';
import { Asset } from '@/types/asset';
import { Badge } from '@/components/ui/badge';
import { CardTitle, CardDescription } from '@/components/ui/card';

interface AssetHeaderProps {
  asset: Asset;
  formatPrice: (price: number) => string;
}

const AssetHeader = ({ asset, formatPrice }: AssetHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2">
        {asset.imageUrl && (
          <img 
            src={asset.imageUrl} 
            alt={asset.name} 
            className="w-10 h-10 object-contain"
          />
        )}
      </div>
      <div className="text-right">
        <CardTitle className="text-2xl">{asset.name} ({asset.symbol})</CardTitle>
        <div className="flex items-center gap-2 justify-end mt-1">
          <Badge variant="outline">
            {asset.type === 'crypto' 
              ? 'קריפטו' 
              : asset.type === 'stocks' 
                ? 'מניה' 
                : 'מט"ח'}
          </Badge>
          <CardDescription className="text-lg">
            מחיר: ${formatPrice(asset.price)}
          </CardDescription>
          <Badge className={asset.change24h >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
            {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default AssetHeader;
