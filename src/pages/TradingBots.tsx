
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TradingBot } from '@/types/asset';
import { getTradingBots } from '@/services/mockTradingService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { ArrowUpIcon, ArrowDownIcon, BarChart3, Award, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const TradingBots = () => {
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  
  // שליפת נתוני הבוטים
  const { data: bots, isLoading, error } = useQuery({
    queryKey: ['tradingBots'],
    queryFn: getTradingBots,
  });

  const selectedBot = selectedBotId 
    ? bots?.find(bot => bot.id === selectedBotId) 
    : bots?.[0];

  // מדד צבע לפי רמת סיכון
  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return '';
    }
  };

  // נכסים נתמכים למחרוזת
  const getAssetTypeLabel = (type: string) => {
    switch (type) {
      case 'crypto': return 'קריפטו';
      case 'stock': return 'מניות';
      case 'forex': return 'מט"ח';
      default: return type;
    }
  };

  // מיון הבוטים לפי ביצועים
  const sortedBots = bots?.slice().sort((a, b) => 
    b.performance.totalReturn - a.performance.totalReturn
  );

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-right">סקירת בוטים מובילים למסחר</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-10 text-center">
            <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-medium">שגיאה בטעינת נתוני הבוטים</p>
            <p className="text-muted-foreground">אנא נסה שוב מאוחר יותר</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* רשימת הבוטים */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">בוטים מובילים</CardTitle>
                <CardDescription className="text-right">מדורגים לפי תשואה כוללת</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-y-auto max-h-[600px]">
                  {sortedBots?.map((bot, index) => (
                    <div 
                      key={bot.id}
                      className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                        bot.id === selectedBot?.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedBotId(bot.id)}
                    >
                      <div className="flex items-center justify-between">
                        <Badge>{`#${index + 1}`}</Badge>
                        <div className="text-right">
                          <h3 className="font-medium">{bot.name}</h3>
                          <p className="text-sm text-muted-foreground">{bot.strategy}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <Badge 
                            variant="outline" 
                            className={getRiskColor(bot.riskLevel)}
                          >
                            סיכון {bot.riskLevel === 'low' ? 'נמוך' : bot.riskLevel === 'medium' ? 'בינוני' : 'גבוה'}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className={bot.performance.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {bot.performance.totalReturn >= 0 ? '+' : ''}{bot.performance.totalReturn}%
                            </span>
                            {bot.performance.totalReturn >= 0 ? 
                              <ArrowUpIcon className="h-4 w-4 text-green-600" /> : 
                              <ArrowDownIcon className="h-4 w-4 text-red-600" />
                            }
                          </div>
                          <p className="text-xs text-muted-foreground">תשואה כוללת</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* מידע מפורט על הבוט הנבחר */}
          <div className="lg:col-span-2">
            {selectedBot && (
              <Card>
                <CardHeader className="flex flex-col md:flex-row justify-between md:items-center">
                  <div className="flex items-center gap-4 mb-4 md:mb-0 mr-auto">
                    {selectedBot.imageUrl && (
                      <div className="w-16 h-16">
                        <img 
                          src={selectedBot.imageUrl} 
                          alt={selectedBot.name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="text-right">
                      <CardTitle>{selectedBot.name}</CardTitle>
                      <CardDescription>{selectedBot.description}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="outline" 
                      className={getRiskColor(selectedBot.riskLevel)}
                    >
                      סיכון {selectedBot.riskLevel === 'low' ? 'נמוך' : selectedBot.riskLevel === 'medium' ? 'בינוני' : 'גבוה'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="performance">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="performance">ביצועים</TabsTrigger>
                      <TabsTrigger value="details">פרטים</TabsTrigger>
                      <TabsTrigger value="returns">תשואות חודשיות</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="performance" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
                            <p className="text-xl font-bold">{selectedBot.performance.totalReturn}%</p>
                            <p className="text-sm text-muted-foreground">תשואה כוללת</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <Award className="h-6 w-6 text-primary mx-auto mb-2" />
                            <p className="text-xl font-bold">{selectedBot.performance.winRate}%</p>
                            <p className="text-sm text-muted-foreground">אחוז הצלחה</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <ArrowUpIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
                            <p className="text-xl font-bold text-green-600">+{selectedBot.performance.averageProfit}%</p>
                            <p className="text-sm text-muted-foreground">רווח ממוצע</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <ArrowDownIcon className="h-6 w-6 text-red-600 mx-auto mb-2" />
                            <p className="text-xl font-bold text-red-600">{selectedBot.performance.averageLoss}%</p>
                            <p className="text-sm text-muted-foreground">הפסד ממוצע</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2 text-right">תשואות חודשיות</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={selectedBot.monthlyReturns}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis 
                                width={40}
                                tickFormatter={(value) => `${value}%`}
                              />
                              <Tooltip 
                                formatter={(value: number) => [`${value}%`, 'תשואה']}
                                labelFormatter={(value) => `חודש: ${value}`}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="return" 
                                stroke="#8884d8" 
                                name="תשואה חודשית"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="details" className="space-y-4 mt-4">
                      <div className="space-y-4 text-right">
                        <div>
                          <h3 className="font-semibold">אסטרטגיית מסחר</h3>
                          <p>{selectedBot.strategy}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold">נכסים נתמכים</h3>
                          <div className="flex gap-2 flex-wrap mt-1">
                            {selectedBot.supportedAssets.map(asset => (
                              <Badge key={asset} variant="outline">
                                {getAssetTypeLabel(asset)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold">מדדי ביצוע נוספים</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {selectedBot.performance.sharpeRatio && (
                              <div>
                                <p className="text-sm text-muted-foreground">יחס שארפ:</p>
                                <p className="font-medium">{selectedBot.performance.sharpeRatio}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-muted-foreground">ירידה מקסימלית:</p>
                              <p className="font-medium">{selectedBot.performance.maxDrawdown}%</p>
                            </div>
                          </div>
                        </div>
                        
                        {selectedBot.creatorInfo && (
                          <div>
                            <h3 className="font-semibold">מידע על היוצר</h3>
                            <p>{selectedBot.creatorInfo}</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="returns" className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">חודש</TableHead>
                            <TableHead className="text-right">תשואה</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedBot.monthlyReturns.map((item) => (
                            <TableRow key={item.month}>
                              <TableCell className="text-right">{item.month}</TableCell>
                              <TableCell className="text-right">
                                <span className={item.return >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {item.return >= 0 ? '+' : ''}{item.return}%
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingBots;
