import React, { useState, useEffect } from 'react';
import { Asset } from '@/types/asset';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface AssetListProps {
  assets: Asset[];
  isLoading?: boolean;
  onAssetSelect?: (asset: Asset) => void;
}

const AssetList: React.FC<AssetListProps> = ({ assets, isLoading = false, onAssetSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Asset>('marketCap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  
  useEffect(() => {
    let result = [...assets];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(asset => 
        asset.name.toLowerCase().includes(query) || 
        asset.symbol.toLowerCase().includes(query)
      );
    }
    
    if (selectedType !== 'all') {
      result = result.filter(asset => asset.type === selectedType);
    }
    
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      return sortDirection === 'asc' 
        ? aString.localeCompare(bString) 
        : bString.localeCompare(aString);
    });
    
    setFilteredAssets(result);
  }, [assets, searchQuery, sortField, sortDirection, selectedType]);
  
  const handleSort = (field: keyof Asset) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const renderSortIcon = (field: keyof Asset) => {
    if (field !== sortField) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חיפוש נכסים..."
              className="pl-8 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="all" value={selectedType} onValueChange={setSelectedType}>
            <TabsList>
              <TabsTrigger value="all">הכל</TabsTrigger>
              <TabsTrigger value="crypto">קריפטו</TabsTrigger>
              <TabsTrigger value="stocks">מניות</TabsTrigger>
              <TabsTrigger value="forex">מט"ח</TabsTrigger>
              <TabsTrigger value="commodities">סחורות</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]"></TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center justify-end gap-1">
                    {renderSortIcon('name')}
                    <span>שם</span>
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('price')}>
                  <div className="flex items-center justify-end gap-1">
                    {renderSortIcon('price')}
                    <span>מחיר</span>
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('change24h')}>
                  <div className="flex items-center justify-end gap-1">
                    {renderSortIcon('change24h')}
                    <span>שינוי 24ש'</span>
                  </div>
                </TableHead>
                <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('marketCap')}>
                  <div className="flex items-center justify-end gap-1">
                    {renderSortIcon('marketCap')}
                    <span>שווי שוק</span>
                  </div>
                </TableHead>
                <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('volume24h')}>
                  <div className="flex items-center justify-end gap-1">
                    {renderSortIcon('volume24h')}
                    <span>מחזור 24ש'</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : filteredAssets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    לא נמצאו נכסים מתאימים
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssets.map(asset => (
                  <TableRow 
                    key={asset.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onAssetSelect && onAssetSelect(asset)}
                  >
                    <TableCell>
                      {asset.imageUrl ? (
                        <img 
                          src={asset.imageUrl} 
                          alt={asset.symbol} 
                          className="h-8 w-8 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          {asset.symbol.substring(0, 2)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <Badge 
                          variant={asset.change24h >= 0 ? "outline" : "secondary"}
                          className={`flex items-center ${
                            asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {asset.change24h >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      ${(asset.marketCap / 1_000_000).toFixed(1)}M
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      ${(asset.volume24h / 1_000_000).toFixed(1)}M
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetList;
