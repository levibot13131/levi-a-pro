
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Unauthorized = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <div className="max-w-md mx-auto text-center">
        <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-2">גישה לא מורשית</h1>
        
        <p className="text-muted-foreground mb-6">
          אין לך הרשאות מתאימות לצפייה בדף זה. 
          {isAuthenticated 
            ? ' אנא פנה למנהל המערכת אם לדעתך זו טעות.'
            : ' אנא התחבר למערכת או פנה למנהל המערכת לקבלת הרשאות.'
          }
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              חזרה לדף הבית
            </Link>
          </Button>
          
          {!isAuthenticated && (
            <Button asChild>
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" />
                התחברות
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
