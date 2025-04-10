
import React from 'react';
import AdvancedPricePatterns from './AdvancedPricePatterns';
import WhaleTracker from './WhaleTracker';

interface AdvancedTabContentProps {
  assetId: string;
  formatPrice: (price: number) => string;
}

const AdvancedTabContent: React.FC<AdvancedTabContentProps> = ({
  assetId,
  formatPrice,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* לשונית ניתוח מתקדם */}
      <AdvancedPricePatterns 
        assetId={assetId}
        formatPrice={formatPrice}
      />
      
      {/* מעקב אחר ארנקים גדולים */}
      <WhaleTracker 
        assetId={assetId}
        formatPrice={formatPrice}
      />
    </div>
  );
};

export default AdvancedTabContent;
