
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Shield, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const EmailConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get tokens from URL parameters
        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');
        const type = searchParams.get('type');

        console.log('Email confirmation tokens:', { access_token, refresh_token, type });

        if (!access_token || !refresh_token) {
          setStatus('error');
          setMessage('קישור אימות לא תקין - אסימונים חסרים');
          return;
        }

        // Set the session using the tokens
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          console.error('Session error:', error);
          setStatus('error');
          setMessage('שגיאה באימות האימייל: ' + error.message);
          return;
        }

        if (data.user) {
          console.log('User confirmed successfully:', data.user.email);
          setStatus('success');
          setMessage('האימייל אומת בהצלחה! מעביר לדשבורד...');
          toast.success('האימייל אומת בהצלחה - ברוך הבא ל-LeviPro!');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
        } else {
          setStatus('error');
          setMessage('שגיאה באימות המשתמש');
        }
      } catch (err) {
        console.error('Email confirmation error:', err);
        setStatus('error');
        setMessage('שגיאה בלתי צפויה באימות האימייל');
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate]);

  const handleReturnToLogin = () => {
    navigate('/auth', { replace: true });
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
          <p className="text-muted-foreground">אימות כתובת אימייל</p>
        </div>

        {/* Confirmation Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
              {status === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
              {status === 'error' && <AlertTriangle className="h-5 w-5 text-red-600" />}
              
              {status === 'loading' && 'מאמת אימייל...'}
              {status === 'success' && 'אימות הושלם בהצלחה!'}
              {status === 'error' && 'שגיאה באימות'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {status === 'loading' && (
              <div>
                <p className="text-muted-foreground">אנא המתן בזמן שאנו מאמתים את כתובת האימייל שלך...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {message}
                  </AlertDescription>
                </Alert>
                <p className="text-sm text-muted-foreground">
                  תועבר אוטומטית לדשבורד תוך שניות...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
                
                <Button onClick={handleReturnToLogin} className="w-full">
                  חזור לדף הכניסה
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  <p>אם הבעיה נמשכת, אנא פנה למנהל המערכת</p>
                  <p className="mt-1">almogahronov1997@gmail.com</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="bg-gray-50">
            <CardContent className="pt-4">
              <div className="text-xs text-gray-600">
                <p className="font-medium">Debug Info:</p>
                <p>Access Token: {searchParams.get('access_token') ? 'Present' : 'Missing'}</p>
                <p>Refresh Token: {searchParams.get('refresh_token') ? 'Present' : 'Missing'}</p>
                <p>Type: {searchParams.get('type') || 'Not specified'}</p>
                <p>Status: {status}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmailConfirm;
