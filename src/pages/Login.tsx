
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the return URL from location state or default to home
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
        toast.success('התחברת בהצלחה');
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
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-right">התחברות למערכת</CardTitle>
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
            <div className="text-sm text-muted-foreground text-right">
              * עבור גרסת הדגמה:<br />
              משתמש רגיל: user@example.com / user123<br />
              מנהל מערכת: admin@example.com / admin123
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'מתחבר...' : 'התחבר'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
