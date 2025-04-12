
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Flag, Globe, Info, Newspaper, Search } from 'lucide-react';

export interface FinancialDataSource {
  id: string;
  name: string;
  type: 'news' | 'data' | 'social' | 'research' | 'other';
  description: string;
  url: string;
  isFeatured: boolean;
  isPaid: boolean;
  frequencyUpdate: string;
  reliability: number;
  languages: string[];
  categories: string[];
  logo?: string;
}

const financialDataSources: FinancialDataSource[] = [
  {
    id: 'bloomberg',
    name: 'Bloomberg',
    type: 'news',
    description: 'מקור מוביל לחדשות כלכליות, נתוני שוק ומחקר פיננסי.',
    url: 'https://www.bloomberg.com',
    isFeatured: true,
    isPaid: true,
    frequencyUpdate: 'real-time',
    reliability: 5,
    languages: ['en', 'he'],
    categories: ['equities', 'commodities', 'forex', 'crypto']
  },
  {
    id: 'ft',
    name: 'Financial Times',
    type: 'news',
    description: 'עיתון פיננסי מוביל עם ניתוחים מעמיקים.',
    url: 'https://www.ft.com',
    isFeatured: true,
    isPaid: true,
    frequencyUpdate: 'daily',
    reliability: 5,
    languages: ['en', 'he'],
    categories: ['equities', 'markets', 'economy']
  },
  {
    id: 'yahoo-finance',
    name: 'Yahoo Finance',
    type: 'data',
    description: 'נתוני שוק ומניות, תרשימים, וחדשות פיננסיות.',
    url: 'https://finance.yahoo.com',
    isFeatured: false,
    isPaid: false,
    frequencyUpdate: 'real-time',
    reliability: 4,
    languages: ['en', 'he'],
    categories: ['equities', 'charts', 'screeners']
  },
  {
    id: 'tradingview',
    name: 'TradingView',
    type: 'data',
    description: 'פלטפורמת תרשימים ואנליזה מובילה.',
    url: 'https://www.tradingview.com',
    isFeatured: true,
    isPaid: false,
    frequencyUpdate: 'real-time',
    reliability: 5,
    languages: ['en', 'he'],
    categories: ['charts', 'technical-analysis', 'community']
  },
  {
    id: 'investing',
    name: 'Investing.com',
    type: 'data',
    description: 'נתוני מסחר, כלים טכניים וחדשות פיננסיות.',
    url: 'https://www.investing.com',
    isFeatured: false,
    isPaid: false,
    frequencyUpdate: 'real-time',
    reliability: 4,
    languages: ['en', 'he'],
    categories: ['equities', 'forex', 'crypto', 'commodities']
  }
];

const FundamentalData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter sources based on search term and category
  const filteredSources = financialDataSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         source.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeTab === 'all' || source.type === activeTab;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-right">מקורות מידע פונדמנטלי</h1>
      <p className="text-muted-foreground mb-6 text-right">
        גישה למגוון מקורות מידע פיננסי, כולל חדשות, נתונים, ומחקרים
      </p>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חיפוש מקורות מידע..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-right"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">הכל</TabsTrigger>
            <TabsTrigger value="news" className="flex-1">חדשות</TabsTrigger>
            <TabsTrigger value="data" className="flex-1">נתונים</TabsTrigger>
            <TabsTrigger value="research" className="flex-1">מחקר</TabsTrigger>
            <TabsTrigger value="social" className="flex-1">מדיה חברתית</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {filteredSources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSources.map(source => (
            <Card key={source.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  {source.logo ? (
                    <img src={source.logo} alt={source.name} className="h-8 w-8" />
                  ) : (
                    <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                      {source.type === 'news' ? (
                        <Newspaper className="h-4 w-4" />
                      ) : source.type === 'data' ? (
                        <Info className="h-4 w-4" />
                      ) : (
                        <Globe className="h-4 w-4" />
                      )}
                    </div>
                  )}
                  <div className="text-right">
                    <CardTitle className="text-lg">{source.name}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
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
                      {source.isPaid && (
                        <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-800/30 dark:text-orange-500 px-2 py-0.5 rounded">
                          בתשלום
                        </span>
                      )}
                      {source.isFeatured && (
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500 px-2 py-0.5 rounded">
                          מומלץ
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-right mb-4 text-sm">
                  {source.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {source.categories.map(category => (
                    <span 
                      key={category} 
                      className="text-xs bg-muted px-2 py-0.5 rounded"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <span>עדכניות:</span>
                    <span className="font-medium">
                      {source.frequencyUpdate === 'real-time' 
                        ? 'זמן אמת' 
                        : source.frequencyUpdate === 'daily'
                        ? 'יומי'
                        : source.frequencyUpdate === 'weekly'
                        ? 'שבועי'
                        : 'חודשי'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>שפות:</span>
                    <div className="flex gap-1">
                      {source.languages.map(lang => (
                        <Flag key={lang} className="h-3 w-3" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full text-primary"
                  onClick={() => window.open(source.url, '_blank')}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  פתח מקור
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">לא נמצאו תוצאות</h3>
          <p className="text-muted-foreground mt-1">
            נסה לחפש מונחים אחרים או לשנות את הסינון
          </p>
        </div>
      )}
    </div>
  );
};

export default FundamentalData;
