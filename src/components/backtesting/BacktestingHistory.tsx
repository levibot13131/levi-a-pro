
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { BacktestResults, Trade } from '@/services/backtesting/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface BacktestingHistoryProps {
  results: BacktestResults[];
  onSelectBacktest: (result: BacktestResults) => void;
}

const BacktestingHistory: React.FC<BacktestingHistoryProps> = ({ results, onSelectBacktest }) => {
  if (!results || results.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center">
            <p className="text-muted-foreground">אין היסטוריית בדיקות זמינה</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">היסטוריית בדיקות</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">תאריך</TableHead>
              <TableHead className="text-right">אסטרטגיה</TableHead>
              <TableHead className="text-right">תשואה</TableHead>
              <TableHead className="text-right">אחוז הצלחה</TableHead>
              <TableHead className="text-right">עסקאות</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={index}>
                <TableCell className="text-right">
                  {new Date().toLocaleDateString('he-IL')}
                </TableCell>
                <TableCell className="text-right">
                  {result.trades[0]?.strategyUsed || 'לא ידוע'}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={result.performance.totalReturnPercentage >= 0 ? 'default' : 'destructive'}>
                    {result.performance.totalReturnPercentage.toFixed(2)}%
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {result.performance.winRate.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">
                  {result.performance.totalTrades}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onSelectBacktest(result)}
                  >
                    הצג
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {results.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-right mb-3">השוואת ביצועים</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={results.map((result, index) => ({
                  name: `בדיקה ${index + 1}`,
                  return: result.performance.totalReturnPercentage,
                  winRate: result.performance.winRate
                }))}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="return" name="תשואה %" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BacktestingHistory;
