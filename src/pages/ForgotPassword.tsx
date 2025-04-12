
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ChevronRight, Mail } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('נא להזין כתובת אימייל');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate password reset request
    setTimeout(() => {
      setIsSent(true);
      setIsLoading(false);
      toast.success('הוראות לאיפוס סיסמה נשלחו', {
        description: 'בדוק את תיבת הדואר שלך'
      });
    }, 1500);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Link to="/" className="absolute top-4 right-4 flex items-center text-muted-foreground hover:text-primary transition-colors">
        <ChevronRight className="mr-1 h-4 w-4" />
        חזרה לדף הבית
      </Link>
      
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Levi Bot
        </h1>
        <p className="text-muted-foreground">
          איפוס סיסמה
        </p>
      </div>
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-right">שכחתי סיסמה</CardTitle>
          <CardDescription className="text-right">
            הזן את כתובת האימייל שלך כדי לקבל קישור לאיפוס הסיסמה
          </CardDescription>
        </CardHeader>
        
        {!isSent ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-right block">אימייל</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  'שולח הוראות...'
                ) : (
                  <>
                    <Mail className="ml-2 h-4 w-4" />
                    שלח קישור לאיפוס
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-md text-center">
              <p>הוראות לאיפוס הסיסמה נשלחו לכתובת:</p>
              <p className="font-semibold mt-2 dir-ltr">{email}</p>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              אם לא קיבלת את המייל תוך מספר דקות, בדוק את תיקיית הספאם או נסה שוב.
            </p>
          </CardContent>
        )}
      </Card>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          <Link to="/login" className="text-primary hover:underline">
            חזרה לדף ההתחברות
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
