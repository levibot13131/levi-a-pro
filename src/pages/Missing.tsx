
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Home, ArrowLeft } from 'lucide-react';

const Missing = () => {
  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <div className="max-w-md mx-auto text-center">
        <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">דף לא נמצא</h2>
        
        <p className="text-muted-foreground mb-6">
          הדף שחיפשת אינו קיים. ייתכן שהכתובת שהזנת שגויה או שהדף הוסר.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              חזרה לדף הבית
            </Link>
          </Button>
          
          <Button asChild variant="ghost" onClick={() => window.history.back()}>
            <div>
              <ArrowLeft className="mr-2 h-4 w-4" />
              חזור לדף הקודם
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Missing;
