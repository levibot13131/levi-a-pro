
import React from 'react';
import { FinancialDataSource } from '@/types/marketInformation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ExternalLink, Newspaper, Star } from 'lucide-react';

interface SourcesTabProps {
  sources: FinancialDataSource[] | undefined;
  sourceCategory: string;
  setSourceCategory: (value: string) => void;
  handleToggleSource: (sourceId: string, focused: boolean) => void;
  isLoading: boolean;
}

const SourcesTab: React.FC<SourcesTabProps> = ({
  sources,
  sourceCategory,
  setSourceCategory,
  handleToggleSource,
  isLoading
}) => {
  // Category badges
  const getCategoryBadge = (category: FinancialDataSource['category']) => {
    switch(category) {
      case 'news':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">חדשות</Badge>;
      case 'data':
        return <Badge variant="outline" className="bg-green-100 text-green-800">נתונים</Badge>;
      case 'analysis':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">ניתוח</Badge>;
      case 'social':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">רשתות חברתיות</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Select value={sourceCategory} onValueChange={setSourceCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="כל הקטגוריות" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הקטגוריות</SelectItem>
            <SelectItem value="news">חדשות</SelectItem>
            <SelectItem value="data">מאגרי נתונים</SelectItem>
            <SelectItem value="analysis">ניתוח</SelectItem>
            <SelectItem value="social">רשתות חברתיות</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : sources && sources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sources.map(source => (
            <Card key={source.id} className={source.focused ? "border-primary" : ""}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="text-right">
                  <CardTitle className="text-xl">{source.name}</CardTitle>
                  <div className="flex gap-2 mt-1">
                    {getCategoryBadge(source.category)}
                    <Badge variant="outline" className={source.accessType === 'free' ? "bg-green-50" : ""}>
                      {source.accessType === 'free' ? 'חינמי' : source.accessType === 'paid' ? 'בתשלום' : 'API'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className={`h-6 w-6 ${source.focused ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                </div>
              </CardHeader>
              <CardContent className="text-right">
                <p className="text-sm text-gray-600 mb-3">{source.description}</p>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">אמינות:</span>
                    <span className="text-sm font-medium">{source.reliability}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">שפות:</span>
                    <span className="text-sm">{source.languages.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">תדירות עדכון:</span>
                    <span className="text-sm">{source.updateFrequency}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button variant="outline" size="sm" onClick={() => window.open(source.url, '_blank')}>
                  בקר באתר
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{source.focused ? "במעקב" : "הוסף למעקב"}</span>
                  <Switch 
                    checked={source.focused} 
                    onCheckedChange={(checked) => handleToggleSource(source.id, checked)}
                  />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-1">לא נמצאו מקורות מידע</p>
            <p className="text-muted-foreground">נסה לשנות את החיפוש או הפילטר שלך</p>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default SourcesTab;
