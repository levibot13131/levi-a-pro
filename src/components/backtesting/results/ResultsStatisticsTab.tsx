
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BacktestingResult } from '@/services/backtestingService';
import { Asset } from '@/types/asset';

interface ResultsStatisticsTabProps {
  results: BacktestingResult;
  asset?: Asset;
}

const ResultsStatisticsTab: React.FC<ResultsStatisticsTabProps> = ({ results, asset }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3 text-right">ביצועים לפי נכסים</h3>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">נכס</TableHead>
                  <TableHead className="text-right">מספר עסקאות</TableHead>
                  <TableHead className="text-right">אחוז הצלחה</TableHead>
                  <TableHead className="text-right">תשואה כוללת</TableHead>
                  <TableHead className="text-right">רווח ממוצע</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.assetPerformance.map((assetPerf, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-right">{assetPerf.assetName}</TableCell>
                    <TableCell className="text-right">{assetPerf.trades}</TableCell>
                    <TableCell className="text-right">{assetPerf.winRate.toFixed(2)}%</TableCell>
                    <TableCell className="text-right">
                      <span className={assetPerf.return >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {assetPerf.return.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={assetPerf.averageReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {assetPerf.averageReturn.toFixed(2)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {asset && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-right">מידע על הנכס</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{asset.name} ({asset.symbol})</span>
                <span className="text-sm">שם</span>
              </div>
              {asset.marketCap && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">${(asset.marketCap / 1000000000).toFixed(2)}B</span>
                  <span className="text-sm">שווי שוק</span>
                </div>
              )}
              {asset.volume24h && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">${(asset.volume24h / 1000000).toFixed(2)}M</span>
                  <span className="text-sm">מחזור מסחר 24 שעות</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="font-medium">${asset.price.toFixed(2)}</span>
                <span className="text-sm">מחיר נוכחי</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResultsStatisticsTab;
