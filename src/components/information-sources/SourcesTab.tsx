
import React from 'react';
import { FinancialDataSource } from '@/types/marketInformation'; 
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookmarkIcon, ExternalLink, Globe, Info, Newspaper } from 'lucide-react';

interface SourcesTabProps {
  sources: FinancialDataSource[];
  focusedSourceIds: Set<string>;
  onFocus: (id: string) => void;
}

const SourcesTab: React.FC<SourcesTabProps> = ({
  sources,
  focusedSourceIds,
  onFocus
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sources.map(source => (
        <Card key={source.id} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                {source.type === 'news' ? (
                  <Newspaper className="h-5 w-5 text-primary" />
                ) : source.type === 'data' ? (
                  <Info className="h-5 w-5 text-primary" />
                ) : (
                  <Globe className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="text-right">
                <h3 className="font-bold text-lg">{source.name}</h3>
                <div className="flex items-center gap-2 mt-1 justify-end">
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">
                    {source.type === 'news' 
                      ? 'חדשות' 
                      : source.type === 'data' 
                      ? 'נתונים' 
                      : source.type === 'social'
                      ? 'מדיה חברתית'
                      : source.type === 'research'
                      ? 'מחקר'
                      : 'אחר'}
                  </span>
                  {source.isFeatured && (
                    <span className="text-xs bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500 px-2 py-0.5 rounded">
                      מומלץ
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 text-right">{source.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-4 justify-end">
              {source.categories.map(category => (
                <span 
                  key={category} 
                  className="text-xs bg-muted px-2 py-0.5 rounded"
                >
                  {category}
                </span>
              ))}
            </div>
            
            <div className="flex justify-between gap-2">
              <Button
                variant={focusedSourceIds.has(source.id) ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => onFocus(source.id)}
              >
                <BookmarkIcon className="h-4 w-4 mr-2" />
                {focusedSourceIds.has(source.id) ? 'במעקב' : 'הוסף למעקב'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.open(source.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                פתח מקור
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {sources.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">לא נמצאו מקורות התואמים את החיפוש</p>
        </div>
      )}
    </div>
  );
};

export default SourcesTab;
