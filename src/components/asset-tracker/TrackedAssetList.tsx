import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Pin, 
  PinOff, 
  BellRing, 
  BellOff, 
  ArrowDown, 
  ArrowUp,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TrackedAsset } from '@/services/assetTracking/types';
import { Card } from '@/components/ui/card';

interface TrackedAssetListProps {
  assets: TrackedAsset[];
  onTogglePin: (assetId: string) => void;
  onToggleAlerts: (assetId: string) => void;
  onSetPriority: (assetId: string, priority: 'high' | 'medium' | 'low') => void;
  compact?: boolean;
}

const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return price.toLocaleString('he-IL', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } else if (price >= 1) {
    return price.toLocaleString('he-IL', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  } else {
    return price.toLocaleString('he-IL', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  }
};

const TrackedAssetList: React.FC<TrackedAssetListProps> = ({ 
  assets, 
  onTogglePin, 
  onToggleAlerts, 
  onSetPriority,
  compact = false
}) => {
  if (!assets || assets.length === 0) {
    return (
      <Card className="text-center p-8">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium">אין נכסים במעקב</p>
        <p className="text-muted-foreground">הוסף נכסים למעקב כדי שיופיעו כאן</p>
      </Card>
    );
  }

  const renderPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    const colors = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    };
    
    const labels = {
      high: 'גבוהה',
      medium: 'בינונית',
      low: 'נמוכה'
    };
    
    return (
      <Badge className={`font-normal ${colors[priority]}`}>
        {labels[priority]}
      </Badge>
    );
  };
  
  const renderChangeClass = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };
  
  const renderChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-3 w-3 text-green-600 dark:text-green-400 inline" />;
    if (change < 0) return <ArrowDown className="h-3 w-3 text-red-600 dark:text-red-400 inline" />;
    return null;
  };

  const renderSignalType = (asset: TrackedAsset) => {
    if (asset.technicalSignal === 'buy') {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">קנייה</Badge>;
    } else if (asset.technicalSignal === 'sell') {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">מכירה</Badge>;
    } else if (asset.sentimentSignal === 'bullish') {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">סנטימנט חיובי</Badge>;
    } else if (asset.sentimentSignal === 'bearish') {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">סנטימנט שלילי</Badge>;
    }
    return null;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12"></TableHead>
          <TableHead className="text-right">נכס</TableHead>
          <TableHead className="text-left">מחיר</TableHead>
          <TableHead className="text-left">שינוי 24ש'</TableHead>
          {!compact && <TableHead className="text-right">עדיפות</TableHead>}
          {!compact && <TableHead className="text-right">סיגנל</TableHead>}
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => (
          <TableRow key={asset.id}>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => onTogglePin(asset.id)}
              >
                {asset.isPinned ? (
                  <Pin className="h-4 w-4 text-blue-500" />
                ) : (
                  <PinOff className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </TableCell>
            <TableCell className="font-medium text-right">
              <div className="flex flex-col items-end">
                <span>{asset.name}</span>
                <span className="text-xs text-muted-foreground">{asset.symbol}</span>
              </div>
            </TableCell>
            <TableCell className="font-medium">
              ${formatPrice(asset.price)}
            </TableCell>
            <TableCell className={renderChangeClass(asset.change24h)}>
              {renderChangeIcon(asset.change24h)} {asset.change24h.toFixed(2)}%
            </TableCell>
            {!compact && (
              <TableCell className="text-right">
                {renderPriorityBadge(asset.priority)}
              </TableCell>
            )}
            {!compact && (
              <TableCell className="text-right">
                {renderSignalType(asset)}
              </TableCell>
            )}
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>אפשרויות</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => onToggleAlerts(asset.id)}>
                      {asset.alertsEnabled ? (
                        <>
                          <BellOff className="h-4 w-4 mr-2" />
                          <span>בטל התראות</span>
                        </>
                      ) : (
                        <>
                          <BellRing className="h-4 w-4 mr-2" />
                          <span>הפעל התראות</span>
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>עדיפות</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onSetPriority(asset.id, 'high')}>
                      <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                      <span>גבוהה</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSetPriority(asset.id, 'medium')}>
                      <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                      <span>בינונית</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSetPriority(asset.id, 'low')}>
                      <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                      <span>נמוכה</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TrackedAssetList;
