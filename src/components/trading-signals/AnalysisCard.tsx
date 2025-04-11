
import React from 'react';
import { MarketAnalysis } from '@/types/asset';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Lightbulb } from 'lucide-react';
import { getAnalysisSentimentStyles, getAnalysisTypeBadge } from './SignalTypeStyles';

interface AnalysisCardProps {
  analysis: MarketAnalysis;
  getAssetName: (assetId: string) => string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis, getAssetName }) => {
  const styles = getAnalysisSentimentStyles(analysis.sentiment);
  
  return (
    <Card key={analysis.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getAnalysisTypeBadge(analysis.type)}
            {styles.badge}
          </div>
          {styles.icon}
        </div>
        <div className="text-right mt-4">
          <CardTitle className="text-xl">{analysis.title}</CardTitle>
          <CardDescription className="mt-1">
            {analysis.assetId && `${getAssetName(analysis.assetId)} | `}
            {analysis.marketSector && `${analysis.marketSector} | `}
            {new Date(analysis.publishedAt).toLocaleDateString('he-IL')}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="text-right">
        <p className="text-lg mb-4">{analysis.summary}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4" />
          <p className="font-medium">{analysis.author}</p>
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-2 flex items-center gap-1">
            <Lightbulb className="h-4 w-4" />
            נקודות מפתח
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {analysis.keyPoints.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
        
        <div className="mt-6 p-4 rounded-md border border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold mb-2">מסקנה</h3>
          <p className={styles.textColor}>{analysis.conclusion}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>קרא את הניתוח המלא</Button>
      </CardFooter>
    </Card>
  );
};

export default AnalysisCard;
