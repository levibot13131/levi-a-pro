
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Check, AlertTriangle } from 'lucide-react';
import { getAllAssets } from '@/services/realTimeAssetService';
import { Asset } from '@/types/asset';
import { addTrackedAsset, getTrackedAssets } from '@/services/assetTracking/assetManagement';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AssetSearchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAssetAdd: () => void;
}

const AssetSearchDialog: React.FC<AssetSearchDialogProps> = ({
  isOpen,
  onOpenChange,
  onAssetAdd
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Asset[]>([]);
  
  // Get current tracked assets to check if an asset is already being tracked
  const trackedAssets = getTrackedAssets();
  const trackedAssetIds = trackedAssets.map(a => a.id);
  
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const allAssets = getAllAssets();
    const filteredAssets = allAssets.filter(asset => 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(filteredAssets);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    
    // Auto-search after typing
    if (e.target.value.length > 2) {
      handleSearch();
    } else if (e.target.value.length === 0) {
      setSearchResults([]);
    }
  };
  
  const handleAddAsset = (assetId: string) => {
    const success = addTrackedAsset(assetId);
    if (success) {
      onAssetAdd();
    }
  };
  
  const renderAssetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'crypto': 'קריפטו',
      'stock': 'מניה',
      'stocks': 'מניה',
      'forex': 'מט"ח',
      'commodity': 'סחורה',
      'commodities': 'סחורה'
    };
    
    const colors: Record<string, string> = {
      'crypto': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'stock': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'stocks': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'forex': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'commodity': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'commodities': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    };
    
    return (
      <Badge className={colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'}>
        {labels[type] || type}
      </Badge>
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right">חיפוש נכסים להוספה</DialogTitle>
        </DialogHeader>
        
        <div className="flex space-x-2 mb-4">
          <Button variant="outline" type="button" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
          <Input
            placeholder="הקלד שם נכס או סימול"
            className="flex-1 text-right"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <ScrollArea className="h-[300px] rounded-md border p-4">
          {searchResults.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              {searchQuery.length > 0 ? (
                <>
                  <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p>לא נמצאו תוצאות עבור "{searchQuery}"</p>
                </>
              ) : (
                <>
                  <Search className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p>הקלד מילות חיפוש כדי למצוא נכסים</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {searchResults.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/40 transition-colors"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddAsset(asset.id)}
                    disabled={trackedAssetIds.includes(asset.id)}
                  >
                    {trackedAssetIds.includes(asset.id) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <div className="flex-1 text-right mr-4">
                    <div className="flex justify-end items-center gap-2">
                      <span className="font-medium">{asset.name}</span>
                      {renderAssetTypeLabel(asset.type)}
                    </div>
                    <div className="flex justify-end items-center gap-2 text-sm text-muted-foreground">
                      <span>{asset.symbol}</span>
                      <span>${asset.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AssetSearchDialog;
