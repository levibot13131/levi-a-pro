
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BacktestingResult, Trade } from '@/services/backtestingService';

interface ResultsTradesTabProps {
  results: BacktestingResult;
}

const ResultsTradesTab: React.FC<ResultsTradesTabProps> = ({ results }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-3 text-right">עסקאות</h3>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">נכס</TableHead>
                <TableHead className="text-right">כיוון</TableHead>
                <TableHead className="text-right">תאריך כניסה</TableHead>
                <TableHead className="text-right">תאריך יציאה</TableHead>
                <TableHead className="text-right">מחיר כניסה</TableHead>
                <TableHead className="text-right">מחיר יציאה</TableHead>
                <TableHead className="text-right">רווח/הפסד</TableHead>
                <TableHead className="text-right">רווח %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.trades.map((trade, index) => (
                <TableRow key={index}>
                  <TableCell className="text-right">{trade.assetName || trade.assetId}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={trade.direction === 'long' ? 'default' : 'destructive'}>
                      {trade.direction === 'long' ? 'קנייה' : 'מכירה'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{new Date(trade.entryDate).toLocaleDateString('he-IL')}</TableCell>
                  <TableCell className="text-right">{new Date(trade.exitDate).toLocaleDateString('he-IL')}</TableCell>
                  <TableCell className="text-right">{trade.entryPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{trade.exitPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <span className={trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {trade.profit.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={trade.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {trade.profitPercentage.toFixed(2)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsTradesTab;
