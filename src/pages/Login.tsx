
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { LogIn, ChevronRight, Key, Server } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // הפניה לדף אליו המשתמש ניסה להגיע לפני הכניסה
  const from = (location.state as any)?.from?.pathname || '/';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('נא להזין אימייל וסיסמה');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success('ברוך הבא ל-Levi Bot');
        navigate(from, { replace: true });
      } else {
        toast.error('התחברות נכשלה', {
          description: 'אימייל או סיסמה שגויים'
        });
      }
    } catch (error) {
      toast.error('אירעה שגיאה', {
        description: 'אנא נסה שוב מאוחר יותר'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center w-full max-w-md px-4">
        <Link to="/proxy-guide" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
          <Server className="mr-1 h-4 w-4" />
          מדריך התחברות לפרוקסי
        </Link>
        <Link to="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
          <ChevronRight className="mr-1 h-4 w-4" />
          חזרה לדף הבית
        </Link>
      </div>
      
      <div className="mb-8 mt-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Levi Bot
        </h1>
        <p className="text-muted-foreground">
          מערכת מסחר אלגוריתמית מבוססת בינה מלאכותית
        </p>
      </div>
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-right">כניסה למערכת</CardTitle>
          <CardDescription className="text-right">
            הזן את פרטי ההתחברות שלך להמשך
          </CardDescription>
        </CardHeader>
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
            <div className="space-y-2">
              <Label htmlFor="password" className="text-right block">סיסמה</Label>
              <Input
                id="password"
                type="password"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground text-right p-3 bg-muted rounded-md">
              <div className="font-semibold flex items-center mb-2">
                <Key className="h-4 w-4 ml-1" />
                פרטי כניסה לדוגמה:
              </div>
              <p><strong>מנהל מערכת:</strong> almogahronov1997@gmail.com / 1907900</p>
              <p><strong>משתמש רגיל:</strong> user@example.com / user123</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                'מתחבר...'
              ) : (
                <>
                  <LogIn className="ml-2 h-4 w-4" />
                  התחבר ל-Levi Bot
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Levi Bot - פלטפורמת מסחר אלגוריתמית בגרסה 1.0.0
      </p>
    </div>
  );
};

export default Login;
