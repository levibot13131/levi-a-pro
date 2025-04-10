import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { getAssets } from '@/services/mockDataService';
import { Asset } from '@/types/asset';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { extendedTimeframeOptions } from '@/components/technical-analysis/TimeframeOptions';
import { cn } from '@/lib/utils';
import { BacktestSettings } from '@/services/backtestingService';

interface BacktestingFormProps {
  onRunBacktest: (settings: BacktestSettings) => void;
  isLoading: boolean;
}

const formSchema = z.object({
  initialCapital: z.coerce.number().min(1000, {
    message: "ההון ההתחלתי חייב להיות לפחות 1,000",
  }),
  riskPerTrade: z.coerce.number().min(0.1).max(10, {
    message: "הסיכון לעסקה חייב להיות בין 0.1% ל-10%",
  }),
  strategy: z.enum(['KSEM', 'SMC', 'Wyckoff', 'Custom'], {
    required_error: "יש לבחור אסטרטגיה",
  }),
  entryType: z.enum(['market', 'limit'], {
    required_error: "יש לבחור סוג כניסה",
  }),
  stopLossType: z.enum(['fixed', 'atr', 'support'], {
    required_error: "יש לבחור סוג סטופ לוס",
  }),
  takeProfitType: z.enum(['fixed', 'resistance', 'riskReward'], {
    required_error: "יש לבחור סוג טייק פרופיט",
  }),
  riskRewardRatio: z.coerce.number().min(1).max(10, {
    message: "יחס סיכוי/סיכון חייב להיות בין 1 ל-10",
  }),
  timeframe: z.string({
    required_error: "יש לבחור טווח זמן",
  }),
  startDate: z.date({
    required_error: "יש לבחור תאריך התחלה",
  }),
  endDate: z.date({
    required_error: "יש לבחור תאריך סיום",
  }),
  trailingStop: z.boolean().default(false),
  maxOpenTrades: z.coerce.number().min(1).max(20, {
    message: "מספר העסקאות הפתוחות המקסימלי חייב להיות בין 1 ל-20",
  }),
  assetIds: z.array(z.string()).min(1, {
    message: "יש לבחור לפחות נכס אחד",
  }),
});

export function BacktestingForm({ onRunBacktest, isLoading }: BacktestingFormProps) {
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  
  const { data: assets } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialCapital: 100000,
      riskPerTrade: 1,
      strategy: 'KSEM',
      entryType: 'market',
      stopLossType: 'fixed',
      takeProfitType: 'riskReward',
      riskRewardRatio: 2,
      timeframe: '1d',
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
      endDate: new Date(),
      trailingStop: false,
      maxOpenTrades: 5,
      assetIds: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onRunBacktest({
      ...values, // This ensures all required properties are included
      initialCapital: values.initialCapital || 100000, // Provide a default if not specified
      startDate: format(values.startDate, 'yyyy-MM-dd'),
      endDate: format(values.endDate, 'yyyy-MM-dd'),
    });
  }

  const handleAssetSelect = (asset: Asset) => {
    const newAssets = [...selectedAssets];
    const assetIndex = newAssets.findIndex(a => a.id === asset.id);
    
    if (assetIndex >= 0) {
      newAssets.splice(assetIndex, 1);
    } else {
      newAssets.push(asset);
    }
    
    setSelectedAssets(newAssets);
    form.setValue('assetIds', newAssets.map(a => a.id));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-right">הגדרות הון וסיכון</h3>
            
            <FormField
              control={form.control}
              name="initialCapital"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>הון התחלתי</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="100000" />
                  </FormControl>
                  <FormDescription>
                    סכום הכסף לבדיקה
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="riskPerTrade"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>סיכון לעסקה</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} placeholder="1" />
                  </FormControl>
                  <FormDescription>
                    אחוז מההון בסיכון לכל עסקה
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxOpenTrades"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>מקסימום עסקאות פתוחות</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="5" />
                  </FormControl>
                  <FormDescription>
                    מספר עסקאות פתוחות מקסימלי בו-זמנית
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-right">הגדרות אסטרטגיה</h3>
            
            <FormField
              control={form.control}
              name="strategy"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>אסטרטגיה</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר אסטרטגיה" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="KSEM">KSEM</SelectItem>
                      <SelectItem value="SMC">Smart Money Concept</SelectItem>
                      <SelectItem value="Wyckoff">Wyckoff</SelectItem>
                      <SelectItem value="Custom">מותאם אישית</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    אסטרטגיית המסחר לבדיקה היסטורית
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="timeframe"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>טווח זמן</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר טווח זמן" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {extendedTimeframeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    טווח הזמן של הנרות לבדיקה
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="riskRewardRatio"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>יחס סיכוי/סיכון</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} placeholder="2" />
                  </FormControl>
                  <FormDescription>
                    יחס בין רווח פוטנציאלי להפסד פוטנציאלי
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-right">הגדרות כניסה ויציאה</h3>
            
            <FormField
              control={form.control}
              name="entryType"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>סוג כניסה</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר סוג כניסה" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="market">שוק (Market)</SelectItem>
                      <SelectItem value="limit">לימיט (Limit)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    אופן הכניסה לעסקאות
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="stopLossType"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>סוג סטופ לוס</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר סוג סטופ לוס" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fixed">קבוע (Fixed)</SelectItem>
                      <SelectItem value="atr">ATR</SelectItem>
                      <SelectItem value="support">תמיכה/התנגדות</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    שיטת קביעת סטופ לוס
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="takeProfitType"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>סוג טייק פרופיט</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר סוג טייק פרופיט" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fixed">קבוע (Fixed)</SelectItem>
                      <SelectItem value="resistance">תמיכה/התנגדות</SelectItem>
                      <SelectItem value="riskReward">יחס סיכוי/סיכון</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    שיטת קביעת יעד רווח
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="trailingStop"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>סטופ נגרר</FormLabel>
                    <FormDescription>
                      אפשר שימוש בסטופ נגרר
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-right">הגדרות זמן ונכסים</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col text-right">
                    <FormLabel>תאריך התחלה</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>בחר תאריך</span>
                            )}
                            <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2020-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col text-right">
                    <FormLabel>תאריך סיום</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>בחר תאריך</span>
                            )}
                            <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2020-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormItem className="text-right">
              <FormLabel>נכסים</FormLabel>
              <FormDescription>
                בחר נכסים לבדיקה
              </FormDescription>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                {assets?.map((asset) => (
                  <div
                    key={asset.id}
                    className={cn(
                      "flex items-center justify-between p-2 border rounded-md cursor-pointer transition-colors",
                      selectedAssets.some(a => a.id === asset.id) 
                        ? "border-primary bg-primary/10" 
                        : "border-border hover:bg-muted"
                    )}
                    onClick={() => handleAssetSelect(asset)}
                  >
                    <div className="flex items-center gap-2">
                      {asset.imageUrl && (
                        <img 
                          src={asset.imageUrl} 
                          alt={asset.name} 
                          className="w-6 h-6 object-contain" 
                        />
                      )}
                      <span className="text-sm">{asset.symbol}</span>
                    </div>
                    {asset.type && (
                      <Badge variant="outline" className="text-xs">
                        {asset.type === 'crypto' ? 'קריפטו' : 
                         asset.type === 'stock' ? 'מניה' : 'פורקס'}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
              
              {form.formState.errors.assetIds && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.assetIds.message}
                </p>
              )}
            </FormItem>
          </div>
        </div>
        
        <div className="flex justify-center pt-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="min-w-[200px]"
          >
            {isLoading ? "מבצע בדיקה..." : "הפעל בדיקה היסטורית"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default BacktestingForm;
