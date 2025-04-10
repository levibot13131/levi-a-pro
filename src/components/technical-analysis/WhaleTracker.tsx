import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { getTopWallets, getRecentTransactions } from '@/services/whaleTrackerService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Droplets } from 'lucide-react';

interface WhaleTrackerProps {
  assetId: string;
  formatPrice: (price: number) => string;
}

const WhaleTracker = ({ assetId, formatPrice }: WhaleTrackerProps) => {
  // שליפת נתוני ארנקים גדולים
  const { data: topWallets, isLoading: walletsLoading } = useQuery({
    queryKey: ['topWallets', assetId],
    queryFn: () => getTopWallets(assetId),
  });

  // שליפת נתוני עסקאות אחרונות
  const { data: recentTransactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['recentTransactions', assetId],
    queryFn: () => getRecentTransactions(assetId),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">מעקב אחר ארנקים גדולים</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* טבלת ארנקים גדולים */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-right">5 ארנקים גדולים ביותר</h3>
          {walletsLoading ? (
            <p className="text-center">טוען נתונים...</p>
          ) : topWallets ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">כתובת</TableHead>
                  <TableHead className="text-right">כמות</TableHead>
                  <TableHead className="text-right">אחוז מסך הכל</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topWallets.map((wallet) => (
                  <TableRow key={wallet.address}>
                    <TableCell className="text-right">{wallet.address}</TableCell>
                    <TableCell className="text-right">{formatPrice(wallet.amount)}</TableCell>
                    <TableCell className="text-right">{wallet.percentage.toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center">לא נמצאו נתונים</p>
          )}
        </div>

        {/* גרף עסקאות אחרונות */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-right">עסקאות אחרונות</h3>
          {transactionsLoading ? (
            <p className="text-center">טוען נתונים...</p>
          ) : recentTransactions ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recentTransactions}>
                  <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} />
                  <YAxis tickFormatter={(amount) => formatPrice(amount)} />
                  <Tooltip formatter={(value) => [formatPrice(value), 'כמות']} />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center">לא נמצאו עסקאות</p>
          )}
        </div>

        {/* טבלת עסקאות אחרונות */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-right">פירוט עסקאות אחרונות</h3>
          {transactionsLoading ? (
            <p className="text-center">טוען נתונים...</p>
          ) : recentTransactions ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">סוג</TableHead>
                  <TableHead className="text-right">כמות</TableHead>
                  <TableHead className="text-right">זמן</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((tx) => (
                  <TableRow key={tx.timestamp}>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={tx.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {tx.type === 'buy' ? <ArrowUpRight className="inline-block h-4 w-4 ml-1" /> : <ArrowDownRight className="inline-block h-4 w-4 ml-1" />}
                        {tx.type === 'buy' ? 'קנייה' : 'מכירה'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatPrice(tx.amount)}</TableCell>
                    <TableCell className="text-right">{new Date(tx.timestamp).toLocaleTimeString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center">לא נמצאו עסקאות</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WhaleTracker;
