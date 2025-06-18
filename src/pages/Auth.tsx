
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Lock, Info, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp, isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !password) {
      setError('נא להזין אימייל וסיסמה');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        const message = isSignUp ? 'חשבון נוצר בהצלחה!' : 'ברוך הבא ל-LeviPro!';
        toast.success(message);
      }
    } catch (err) {
      const errorMessage = 'אירעה שגיאה בלתי צפויה';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fill admin credentials for quick access
  const fillAdminCredentials = () => {
    setEmail('almogahronov1997@gmail.com');
    setPassword('1907900');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">LeviPro</h1>
          <p className="text-muted-foreground">פלטפורמת מודיעין מסחר מאובטחת</p>
        </div>

        {/* Quick Access Notice */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium">גישה מהירה זמינה</p>
                <p>לחץ על "מלא נתוני מנהל" וכנס ישירות למערכת</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auth Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              <Lock className="h-5 w-5 inline mr-2" />
              {isSignUp ? 'יצירת חשבון' : 'כניסה למערכת'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">אימייל</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">סיסמה</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'מעבד...' : (isSignUp ? 'יצירת חשבון' : 'כניסה למערכת')}
              </Button>
            </form>

            <div className="text-center mt-4">
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm"
              >
                {isSignUp 
                  ? 'יש לך כבר חשבון? התחבר' 
                  : 'צריך חשבון? הירשם'
                }
              </Button>
            </div>

            {/* Admin Quick Login */}
            <div className="text-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={fillAdminCredentials}
                className="text-xs"
              >
                מלא נתוני מנהל
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-2">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">מערכת פרטית</p>
                <p>הגישה מוגבלת למשתמשים מורשים בלבד.</p>
                <p className="mt-2 text-xs">
                  אימיילים מורשים: almogahronov1997@gmail.com, avraham.oron@gmail.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
