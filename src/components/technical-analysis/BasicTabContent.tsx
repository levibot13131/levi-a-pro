
import React from 'react';
import { Asset } from '@/types/asset';
import PriceVolumeChart from './PriceVolumeChart';
import { TechnicalIndicators } from './indicators';
import AdvancedAnalysisMethods from './AdvancedAnalysisMethods';
import AlertSettings from './AlertSettings';

interface BasicTabContentProps {
  historyLoading: boolean;
  assetHistory: any;
  showVolume: boolean;
  setShowVolume: (value: boolean) => void;
  formatPrice: (price: number) => string;
  analysisData: any;
  analysisLoading: boolean;
  selectedAsset: Asset | undefined;
  selectedAnalysisMethod: string;
  setSelectedAnalysisMethod: (value: string) => void;
  wyckoffPatterns: any;
  smcPatterns: any;
}

const BasicTabContent: React.FC<BasicTabContentProps> = ({
  historyLoading,
  assetHistory,
  showVolume,
  setShowVolume,
  formatPrice,
  analysisData,
  analysisLoading,
  selectedAsset,
  selectedAnalysisMethod,
  setSelectedAnalysisMethod,
  wyckoffPatterns,
  smcPatterns,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2">
        {/* גרף מחיר ונפח */}
        <PriceVolumeChart 
          historyLoading={historyLoading}
          assetHistory={assetHistory}
          showVolume={showVolume}
          setShowVolume={setShowVolume}
          formatPrice={formatPrice}
          analysisData={analysisData}
        />
        
        {/* אינדיקטורים טכניים */}
        <TechnicalIndicators 
          analysisLoading={analysisLoading}
          analysisData={analysisData}
          selectedAsset={selectedAsset}
        />
      </div>
      
      <div>
        {/* שיטות ניתוח מתקדמות */}
        <AdvancedAnalysisMethods 
          selectedAnalysisMethod={selectedAnalysisMethod}
          setSelectedAnalysisMethod={setSelectedAnalysisMethod}
          wyckoffPatterns={wyckoffPatterns}
          smcPatterns={smcPatterns}
          formatPrice={formatPrice}
        />
        
        {/* הגדרות התראות */}
        <AlertSettings />
      </div>
    </div>
  );
};

export default BasicTabContent;
