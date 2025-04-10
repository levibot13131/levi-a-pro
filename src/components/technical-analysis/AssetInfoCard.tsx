
import React from 'react';
import { Asset } from '@/types/asset';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AssetInfoCardProps {
  asset: Asset;
  formatPrice: (price: number) => string;
}

const AssetInfoCard = ({ asset, formatPrice }: AssetInfoCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
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
                  : asset.type === 'stock' 
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
      </CardHeader>
    </Card>
  );
};

export default AssetInfoCard;
