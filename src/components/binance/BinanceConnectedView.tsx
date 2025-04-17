
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LineChart, Wallet, ArrowUpDown, Clock, Settings, Book } from 'lucide-react';
import BinanceConnectionStatus from '@/components/binance/BinanceConnectionStatus';
import BinanceRealTimeStatus from '@/components/binance/BinanceRealTimeStatus';
import BinanceTabPlaceholder from '@/components/binance/BinanceTabPlaceholder';
import RealModeGuide from '@/components/guides/RealModeGuide';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface BinanceConnectedViewProps {
  isAdmin: boolean;
  onActiveTabChange: (tab: string) => void;
  onStatusChange: () => void;
}

const BinanceConnectedView: React.FC<BinanceConnectedViewProps> = ({ 
  isAdmin, 
  onActiveTabChange,
  onStatusChange
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onActiveTabChange(value);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview" className="flex items-center gap-1">
          <LineChart className="h-4 w-4" />
          סקירה
        </TabsTrigger>
        <TabsTrigger value="assets" className="flex items-center gap-1">
          <Wallet className="h-4 w-4" />
          נכסים
        </TabsTrigger>
        <TabsTrigger value="trading" className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4" />
          מסחר
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          היסטוריה
        </TabsTrigger>
        <TabsTrigger value="guide" className="flex items-center gap-1">
          <Book className="h-4 w-4" />
          מדריך
        </TabsTrigger>
        {isAdmin && (
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            הגדרות
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="overview">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BinanceConnectionStatus onStatusChange={onStatusChange} />
          <BinanceRealTimeStatus />
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-right">סיכום חשבון</CardTitle>
            <CardDescription className="text-right">
              נתוני החשבון שלך בבינאנס
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-center text-sm">
                נתונים יטענו כאשר החיבור לבינאנס יאומת
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="assets">
        <BinanceTabPlaceholder title="נכסים" />
      </TabsContent>

      <TabsContent value="trading">
        <BinanceTabPlaceholder title="מסחר" />
      </TabsContent>

      <TabsContent value="history">
        <BinanceTabPlaceholder title="היסטוריית מסחר" />
      </TabsContent>

      <TabsContent value="guide">
        <RealModeGuide />
      </TabsContent>

      {isAdmin && (
        <TabsContent value="settings">
          <BinanceTabPlaceholder title="הגדרות בינאנס" />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default BinanceConnectedView;
