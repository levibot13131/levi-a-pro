
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useQuery } from '@tanstack/react-query';
import { 
  Eye, 
  Whale, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Plus,
  Info,
  Wallet
} from 'lucide-react';
import { WhaleMovement, getWhaleMovements, timeRangeOptions, addWalletToWatchlist, createWhaleAlert, getWhaleBehaviorPatterns } from '@/services/whaleTrackerService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WhaleTrackerProps {
  assetId: string;
  formatPrice: (price: number) => string;
}

const WhaleTracker: React.FC<WhaleTrackerProps> = ({ assetId, formatPrice }) => {
  const [activeTab, setActiveTab] = useState('movements');
  const [timeRange, setTimeRange] = useState('7');
  const [alertAmount, setAlertAmount] = useState(500000);
  const [alertType, setAlertType] = useState<'buy' | 'sell' | 'any'>('any');

  // שליפת תנועות ארנקים גדולים
  const { data: whaleMovements, isLoading: loadingMovements } = useQuery({
    queryKey: ['whaleMovements', assetId, timeRange],
    queryFn: () => getWhaleMovements(assetId, parseInt(timeRange)),
  });
  
  // שליפת דפוסי התנהגות
  const { data: behaviorPatterns, isLoading: loadingPatterns } = useQuery({
    queryKey: ['whaleBehaviorPatterns', assetId],
    queryFn: () => getWhaleBehaviorPatterns(assetId),
  });

  // הוספת ארנק למעקב
  const addToWatchlist = (address: string, label?: string) => {
    addWalletToWatchlist(address, label);
  };

  // יצירת התראה
  const createAlert = () => {
    createWhaleAlert(assetId, alertAmount, alertType);
  };

  // עיצוב לרמת המשמעות של תנועה
  const getSignificanceBadge = (significance: 'low' | 'medium' | 'high' | 'very-high') => {
    const styles = {
      'low': 'bg-blue-100 text-blue-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'very-high': 'bg-red-100 text-red-800'
    };
    
    const labels = {
      'low': 'נמוכה',
      'medium': 'בינונית',
      'high': 'גבוהה',
      'very-high': 'גבוהה מאוד'
    };
    
    return <Badge className={styles[significance]}>{labels[significance]}</Badge>;
  };

  // פורמט תאריך
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-right">
          <Whale className="h-6 w-6 ml-1" />
          מעקב ארנקים גדולים
        </CardTitle>
        <CardDescription className="text-right">
          מעקב אחר תנועות של ארנקים משמעותיים ודפוסי התנהגות ה-"כסף החכם"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="movements">תנועות ארנקים</TabsTrigger>
            <TabsTrigger value="patterns">דפוסי התנהגות</TabsTrigger>
          </TabsList>
          
          {/* לשונית תנועות ארנקים */}
          <TabsContent value="movements" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => setActiveTab('alerts')}
              >
                <Plus className="h-4 w-4" />
                התראה חדשה
              </Button>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="timeRange" className="text-sm">תקופה:</Label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="בחר תקופה" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeRangeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {loadingMovements ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">תאריך</TableHead>
                      <TableHead className="text-right">סוג</TableHead>
                      <TableHead className="text-right">ארנק</TableHead>
                      <TableHead className="text-right">סכום</TableHead>
                      <TableHead className="text-right">משמעות</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {whaleMovements?.map((movement: WhaleMovement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="font-medium">{formatDate(movement.timestamp)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            movement.transactionType === 'buy' 
                              ? 'border-green-500 text-green-700' 
                              : movement.transactionType === 'sell'
                                ? 'border-red-500 text-red-700'
                                : ''
                          }>
                            {movement.transactionType === 'buy' 
                              ? 'קנייה' 
                              : movement.transactionType === 'sell'
                                ? 'מכירה'
                                : 'העברה'
                            }
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate">
                          {movement.walletLabel || movement.walletAddress.substring(0, 10) + '...'}
                        </TableCell>
                        <TableCell>${formatPrice(movement.amount)}</TableCell>
                        <TableCell>
                          {getSignificanceBadge(movement.impact.significance)}
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => addToWatchlist(movement.walletAddress, movement.walletLabel)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>הוסף למעקב</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md mt-4">
              <h4 className="font-medium mb-2 text-right flex items-center gap-2">
                <Info className="h-4 w-4" />
                הגדרת התראה לתנועות ארנקים
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alertAmount" className="text-right block">סכום מינימלי להתראה</Label>
                  <div className="space-y-2">
                    <Slider 
                      id="alertAmount"
                      min={100000} 
                      max={2000000} 
                      step={100000} 
                      value={[alertAmount]}
                      onValueChange={(value) => setAlertAmount(value[0])}
                    />
                    <div className="text-center">
                      ${alertAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alertType" className="text-right block">סוג תנועה</Label>
                  <Select value={alertType} onValueChange={(value: 'buy' | 'sell' | 'any') => setAlertType(value)}>
                    <SelectTrigger id="alertType">
                      <SelectValue placeholder="בחר סוג תנועה" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">קניות בלבד</SelectItem>
                      <SelectItem value="sell">מכירות בלבד</SelectItem>
                      <SelectItem value="any">כל התנועות</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="mt-4 w-full" onClick={createAlert}>
                צור התראה
              </Button>
            </div>
          </TabsContent>
          
          {/* לשונית דפוסי התנהגות */}
          <TabsContent value="patterns">
            {loadingPatterns ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-right text-muted-foreground mb-4">
                  ניתוח דפוסי התנהגות היסטוריים של ארנקים גדולים והשפעתם האפשרית על מחיר הנכס
                </p>
                
                {behaviorPatterns?.map((pattern, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-sm">
                        רמת ביטחון: {pattern.confidence}%
                      </Badge>
                      <h3 className="font-bold text-lg text-right">{pattern.pattern}</h3>
                    </div>
                    <p className="text-right mb-2">{pattern.description}</p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-right">
                        <span className="font-medium block">התרחש לאחרונה</span>
                        <span>{formatDate(pattern.lastOccurrence)}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium block">השפעה אפשרית</span>
                        <span className={pattern.priceImpact.includes('+') ? 'text-green-600' : pattern.priceImpact.includes('-') ? 'text-red-600' : ''}>
                          {pattern.priceImpact}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium block">המלצה</span>
                        <span>{pattern.recommendation}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mt-4">
                  <div className="flex items-start gap-2">
                    <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
                    <div className="text-right">
                      <h4 className="font-medium">טיפ למסחר חכם</h4>
                      <p className="text-sm">
                        מעקב קבוע אחר דפוסי התנהגות של ארנקים גדולים יכול לתת יתרון משמעותי בזיהוי מגמות לפני שהן מתממשות במחיר. התמקד במגמות מתמשכות ולא בתנועות בודדות.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WhaleTracker;
