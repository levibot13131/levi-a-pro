
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ChevronRight, Lock, ShieldCheck } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  
  const { token } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Validate token - in a real app, this would be a server call
    if (token && token.length > 10) {
      setIsTokenValid(true);
    } else {
      toast.error('קישור איפוס סיסמה לא תקין', {
        description: 'הקישור לא תקין או שפג תוקפו'
      });
    }
  }, [token]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error('נא להזין את כל השדות');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('הסיסמאות אינן תואמות');
      return;
    }
    
    if (password.length < 6) {
      toast.error('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate password reset
    setTimeout(() => {
      toast.success('הסיסמה שונתה בהצלחה');
      setIsLoading(false);
      navigate('/login');
    }, 1500);
  };
  
  if (!isTokenValid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-right">קישור לא תקין</CardTitle>
              <CardDescription className="text-right">
                הקישור לאיפוס סיסמה אינו תקין או שפג תוקפו
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">נא לבקש קישור חדש לאיפוס סיסמה.</p>
              <Button asChild>
                <Link to="/forgot-password">בקש קישור חדש</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
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
          קביעת סיסמה חדשה
        </p>
      </div>
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-right">איפוס סיסמה</CardTitle>
          <CardDescription className="text-right">
            הזן את הסיסמה החדשה שלך
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-right block">סיסמה חדשה</Label>
              <Input
                id="password"
                type="password"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground text-right">לפחות 6 תווים</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-right block">אימות סיסמה</Label>
              <Input
                id="confirmPassword"
                type="password"
                dir="ltr"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                'מעדכן סיסמה...'
              ) : (
                <>
                  <ShieldCheck className="ml-2 h-4 w-4" />
                  עדכן סיסמה
                </>
              )}
            </Button>
          </CardFooter>
        </form>
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

export default ResetPassword;
