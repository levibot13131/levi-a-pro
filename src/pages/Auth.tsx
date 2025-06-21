
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Lock, CheckCircle, Zap, Brain } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const auth = useAuth();

  // Simple loading state while auth initializes
  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">מאתחל מערכת LeviPro...</p>
        </div>
      </div>
    );
  }

  // Redirect if already authenticated - but only after loading is complete
  if (auth.isAuthenticated) {
    console.log('User authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
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
        ? await auth.signUp(email, password)
        : await auth.signIn(email, password);

      if (error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        const message = isSignUp ? 'חשבון נוצר בהצלחה!' : 'ברוך הבא ל-LeviPro!';
        toast.success(message);
        // Don't manually redirect - let the auth state change handle it
      }
    } catch (err) {
      const errorMessage = 'אירעה שגיאה בלתי צפויה';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('almogahronov1997@gmail.com');
    setPassword('1907900');
  };

  const fillUserCredentials = () => {
    setEmail('avraham.oron@gmail.com');
    setPassword('user123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Enhanced Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">LeviPro</h1>
          <p className="text-muted-foreground">מערכת מסחר אלגוריתמית מתקדמת</p>
          <div className="flex items-center justify-center gap-2 text-sm text-green-600">
            <Zap className="h-4 w-4" />
            <span>מערכת פעילה ומחוברת</span>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 gap-3">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-4">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium">גישה מהירה למנהל</p>
                  <p>לחץ על "מנהל מערכת" להתחברות מיידית</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">אבטחה מתקדמת</p>
                  <p>גישה מוגבלת למשתמשים מורשים בלבד</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                  dir="ltr"
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
                  dir="ltr"
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

            {/* Quick Login Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={fillAdminCredentials}
                className="text-xs"
              >
                🔑 מנהל מערכת
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fillUserCredentials}
                className="text-xs"
              >
                👤 משתמש
              </Button>
            </div>

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
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-4">
            <div className="text-sm text-purple-800 space-y-2">
              <p className="font-medium">✅ מערכת מוכנה להפעלה</p>
              <div className="text-xs space-y-1">
                <p>• מנוע איתותים: מוכן לפעולה</p>
                <p>• אסטרטגיה אישית: מחכה להפעלה</p>
                <p>• ניהול סיכונים: זמין</p>
                <p>• התראות בזמן אמת: מוכן</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
