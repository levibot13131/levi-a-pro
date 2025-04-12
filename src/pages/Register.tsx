
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, UserPlus } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !displayName) {
      toast.error('נא למלא את כל השדות');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('הסיסמאות אינן תואמות');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await register(email, password, displayName);
      
      if (success) {
        toast.success('הרשמה בוצעה בהצלחה');
        navigate('/');
      } else {
        toast.error('הרשמה נכשלה', {
          description: 'נסה שוב מאוחר יותר או פנה למנהל המערכת'
        });
      }
    } catch (error) {
      toast.error('אירעה שגיאה בעת ההרשמה');
    } finally {
      setIsLoading(false);
    }
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
          הרשמה למערכת המסחר האלגוריתמית
        </p>
      </div>
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-right">הרשמה</CardTitle>
          <CardDescription className="text-right">
            צור חשבון חדש למערכת
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-right block">שם מלא</Label>
              <Input
                id="displayName"
                placeholder="השם המלא שלך"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
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
                'מבצע רישום...'
              ) : (
                <>
                  <UserPlus className="ml-2 h-4 w-4" />
                  הרשם למערכת
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          יש לך כבר חשבון?{' '}
          <Link to="/login" className="text-primary hover:underline">
            התחבר כאן
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
