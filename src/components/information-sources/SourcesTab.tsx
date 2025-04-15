
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface SourcesTabProps {
  searchQuery: string;
}

const SourcesTab: React.FC<SourcesTabProps> = ({ searchQuery }) => {
  const sources = [
    {
      name: 'CoinMarketCap',
      url: 'https://coinmarketcap.com',
      category: 'מחירים',
      description: 'מידע מקיף על מחירי מטבעות, שווי שוק ונתונים פיננסיים',
      verified: true,
    },
    {
      name: 'CoinDesk',
      url: 'https://www.coindesk.com',
      category: 'חדשות',
      description: 'חדשות ועדכונים מעולם הקריפטו והבלוקצ׳יין',
      verified: true,
    },
    {
      name: 'Binance Research',
      url: 'https://research.binance.com',
      category: 'מחקר',
      description: 'מחקרים מעמיקים על פרויקטים ומגמות בשוק הקריפטו',
      verified: true,
    },
    {
      name: 'Glassnode',
      url: 'https://glassnode.com',
      category: 'אנליטיקה',
      description: 'ניתוח נתוני בלוקצ׳יין והתנהגות משקיעים',
      verified: true,
    },
    {
      name: 'CryptoCompare',
      url: 'https://www.cryptocompare.com',
      category: 'מחירים',
      description: 'השוואת מחירים בבורסות קריפטו שונות',
      verified: false,
    },
  ];

  const filteredSources = searchQuery
    ? sources.filter(source => 
        source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.description.includes(searchQuery) ||
        source.category.includes(searchQuery)
      )
    : sources;

  return (
    <div className="space-y-4">
      {filteredSources.length === 0 ? (
        <div className="text-center py-8">
          <p>לא נמצאו תוצאות עבור "{searchQuery}"</p>
        </div>
      ) : (
        filteredSources.map((source, index) => (
          <div 
            key={index} 
            className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div className="mb-3 md:mb-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-lg">{source.name}</h3>
                {source.verified && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                    מאומת
                  </Badge>
                )}
                <Badge>{source.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{source.description}</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                בקר באתר
              </a>
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default SourcesTab;
