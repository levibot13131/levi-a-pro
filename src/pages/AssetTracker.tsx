import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  initializeTrackedAssets, 
  getFilteredTrackedAssets,
  startAssetTracking,
  stopAssetTracking,
  isTrackingActive,
  toggleAssetPin,
  toggleAssetAlerts,
  setAssetPriority
} from '@/services/assetTracking';
import TrackedAssetList from '@/components/asset-tracker/TrackedAssetList';
import AssetSearchDialog from '@/components/asset-tracker/AssetSearchDialog';
import SocialMonitoring from '@/components/asset-tracker/SocialMonitoring';
import { Button } from '@/components/ui/button';
import { 
  Pause, 
  Play, 
  RefreshCw, 
  PlusCircle, 
  BarChart4,
  Bell,
  Rocket
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useTradingViewConnection } from '@/hooks/use-tradingview-connection';
import TradingViewConnectButton from '@/components/technical-analysis/tradingview/TradingViewConnectButton';

const AssetTracker = () => {
  const [activeMarket, setActiveMarket] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [signalFilter, setSignalFilter] = useState<string>('all');
  const [trackingActive, setTrackingActive] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const { isConnected } = useTradingViewConnection();
  
  const { data: trackedAssets = [], refetch } = useQuery({
    queryKey: ['trackedAssets', activeMarket, priorityFilter, signalFilter],
    queryFn: () => getFilteredTrackedAssets(
      activeMarket !== 'all' ? activeMarket : undefined,
      priorityFilter !== 'all' ? priorityFilter as any : undefined,
      signalFilter !== 'all' ? signalFilter as any : undefined
    ),
    refetchInterval: 5000,
  });
  
  useEffect(() => {
    initializeTrackedAssets();
    setTrackingActive(isTrackingActive());
    
    if (!isTrackingActive()) {
      startAssetTracking();
      setTrackingActive(true);
    }
    
    return () => {};
  }, []);
  
  const handleToggleTracking = () => {
    if (trackingActive) {
      stopAssetTracking();
      setTrackingActive(false);
    } else {
      startAssetTracking();
      setTrackingActive(true);
    }
  };
  
  const handleTogglePin = (assetId: string) => {
    toggleAssetPin(assetId);
    refetch();
  };
  
  const handleToggleAlerts = (assetId: string) => {
    toggleAssetAlerts(assetId);
    refetch();
  };
  
  const handleSetPriority = (assetId: string, priority: 'high' | 'medium' | 'low') => {
    setAssetPriority(assetId, priority);
    refetch();
  };
  
  const cryptoCount = trackedAssets.filter(a => a.type === 'crypto').length;
  const stocksCount = trackedAssets.filter(a => a.type === 'stocks').length;
  const forexCount = trackedAssets.filter(a => a.type === 'forex').length;
  const commoditiesCount = trackedAssets.filter(a => a.type === 'commodities').length;
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="order-2 md:order-1">
          <Button 
            onClick={handleToggleTracking}
            variant={trackingActive ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {trackingActive ? (
              <>
                <Pause className="h-4 w-4" />
                הפסק מעקב בזמן אמת
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                הפעל מעקב בזמן אמת
              </>
            )}
          </Button>
          
          <Button variant="outline" className="ml-2" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            רענן נתונים
          </Button>
          
          <Button variant="outline" className="ml-2" onClick={() => setIsSearchOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            הוסף נכס למעקב
          </Button>
        </div>
        
        <div className="order-1 md:order-2 flex-1 text-right">
          <h1 className="text-3xl font-bold">מערכת מעקב נכסים</h1>
          <p className="text-muted-foreground">
            עוקב אחר {trackedAssets.length} נכסים בזמן אמת
          </p>
        </div>
      </div>
      
      {!isConnected && (
        <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-right md:flex-1">
              <h3 className="font-semibold text-lg">חיבור לחשבון TradingView</h3>
              <p className="text-sm text-muted-foreground">חבר את חשבון ה-TradingView שלך כדי לקבל איתותים בזמן אמת</p>
            </div>
            <div>
              <TradingViewConnectButton />
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid grid-cols-5 md:w-auto">
          <TabsTrigger value="dashboard">
            <BarChart4 className="h-4 w-4 mr-2 hidden md:inline" />
            דשבורד
          </TabsTrigger>
          <TabsTrigger value="crypto">
            <span className="hidden md:inline mr-2">קריפטו</span>
            <span className="md:hidden">🪙</span>
            <span className="ml-1 text-xs rounded-full bg-secondary px-1.5">{cryptoCount}</span>
          </TabsTrigger>
          <TabsTrigger value="stocks">
            <span className="hidden md:inline mr-2">מניות</span>
            <span className="md:hidden">📈</span>
            <span className="ml-1 text-xs rounded-full bg-secondary px-1.5">{stocksCount}</span>
          </TabsTrigger>
          <TabsTrigger value="forex">
            <span className="hidden md:inline mr-2">מט"ח</span>
            <span className="md:hidden">💱</span>
            <span className="ml-1 text-xs rounded-full bg-secondary px-1.5">{forexCount}</span>
          </TabsTrigger>
          <TabsTrigger value="commodities">
            <span className="hidden md:inline mr-2">סחורות</span>
            <span className="md:hidden">🛢️</span>
            <span className="ml-1 text-xs rounded-full bg-secondary px-1.5">{commoditiesCount}</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col md:flex-row gap-2 justify-end">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">סינון עדיפות:</label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="כל העדיפויות" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל העדיפויות</SelectItem>
                <SelectItem value="high">גבוהה</SelectItem>
                <SelectItem value="medium">בינונית</SelectItem>
                <SelectItem value="low">נמוכה</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">סינון איתותים:</label>
            <Select value={signalFilter} onValueChange={setSignalFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="כל האיתותים" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל האיתותים</SelectItem>
                <SelectItem value="buy">קנייה (טכני)</SelectItem>
                <SelectItem value="sell">מכירה (טכני)</SelectItem>
                <SelectItem value="bullish">חיובי (סנטימנט)</SelectItem>
                <SelectItem value="bearish">שלילי (סנטימנט)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center justify-end gap-2">
                  <Rocket className="h-5 w-5" />
                  נכסים מובילים
                </CardTitle>
                <CardDescription className="text-right">
                  נכסים בעדיפות גבוהה במעקב שלך
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TrackedAssetList 
                  assets={trackedAssets.filter(a => a.priority === 'high').slice(0, 5)}
                  onTogglePin={handleTogglePin}
                  onToggleAlerts={handleToggleAlerts}
                  onSetPriority={handleSetPriority}
                  compact={true}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center justify-end gap-2">
                  <Bell className="h-5 w-5" />
                  התראות אחרונות
                </CardTitle>
                <CardDescription className="text-right">
                  התראות על שינויים משמעותיים בנכסים
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4 text-muted-foreground">
                  <p>ההתראות האחרונות יופיעו כאן</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <SocialMonitoring />
        </TabsContent>
        
        <TabsContent value="crypto">
          <TrackedAssetList 
            assets={trackedAssets.filter(a => a.type === 'crypto')}
            onTogglePin={handleTogglePin}
            onToggleAlerts={handleToggleAlerts}
            onSetPriority={handleSetPriority}
          />
        </TabsContent>
        
        <TabsContent value="stocks">
          <TrackedAssetList 
            assets={trackedAssets.filter(a => a.type === 'stocks')}
            onTogglePin={handleTogglePin}
            onToggleAlerts={handleToggleAlerts}
            onSetPriority={handleSetPriority}
          />
        </TabsContent>
        
        <TabsContent value="forex">
          <TrackedAssetList 
            assets={trackedAssets.filter(a => a.type === 'forex')}
            onTogglePin={handleTogglePin}
            onToggleAlerts={handleToggleAlerts}
            onSetPriority={handleSetPriority}
          />
        </TabsContent>
        
        <TabsContent value="commodities">
          <TrackedAssetList 
            assets={trackedAssets.filter(a => a.type === 'commodities')}
            onTogglePin={handleTogglePin}
            onToggleAlerts={handleToggleAlerts}
            onSetPriority={handleSetPriority}
          />
        </TabsContent>
      </Tabs>
      
      <AssetSearchDialog 
        isOpen={isSearchOpen} 
        onOpenChange={setIsSearchOpen} 
        onAssetAdd={() => refetch()}
      />
    </div>
  );
};

export default AssetTracker;
