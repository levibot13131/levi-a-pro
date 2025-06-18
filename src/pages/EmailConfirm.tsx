
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Shield, CheckCircle, AlertTriangle, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';

const EmailConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get tokens from URL parameters
        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');
        const type = searchParams.get('type');
        const error_code = searchParams.get('error_code');
        const error_description = searchParams.get('error_description');

        console.log('Email confirmation attempt:', { 
          hasAccessToken: !!access_token, 
          hasRefreshToken: !!refresh_token, 
          type,
          errorCode: error_code,
          errorDescription: error_description
        });

        // Check for URL errors first
        if (error_code || error_description) {
          console.error('URL contains error:', { error_code, error_description });
          setStatus('error');
          setMessage('קישור האימות פג או לא תקין. אנא בקש אימייל חדש.');
          return;
        }

        // Handle confirmation with tokens
        if (access_token && refresh_token && (type === 'signup' || type === 'email_change')) {
          console.log('Setting session with tokens...');
          
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

          if (data.user && data.session) {
            console.log('User confirmed successfully:', data.user.email);
            
            // Check if user is authorized
            const authorizedUsers = ['almogahronov1997@gmail.com', 'avraham.oron@gmail.com'];
            if (!authorizedUsers.includes(data.user.email || '')) {
              console.error('Unauthorized user confirmed:', data.user.email);
              await supabase.auth.signOut();
              setStatus('error');
              setMessage('שגיאה: משתמש לא מורשה');
              return;
            }
            
            setStatus('success');
            setMessage('האימייל אומת בהצלחה! מעביר לדשבורד...');
            toast.success('האימייל אומת בהצלחה - ברוך הבא ל-LeviPro!');
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 2000);
          } else {
            console.error('No user or session after confirmation');
            setStatus('error');
            setMessage('שגיאה באימות המשתמש - לא התקבלו נתוני משתמש');
          }
        } else {
          // Check if user is already logged in
          const { data: sessionData } = await supabase.auth.getSession();
          
          if (sessionData.session) {
            console.log('User already has valid session');
            setStatus('success');
            setMessage('כבר מחובר למערכת! מעביר לדשבורד...');
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 1000);
          } else {
            setStatus('error');
            setMessage('קישור האימות לא תקין או פג תוקף. אנא נסה להתחבר שוב או בקש אימייל חדש.');
          }
        }
      } catch (err) {
        console.error('Email confirmation exception:', err);
        setStatus('error');
        setMessage('שגיאה בלתי צפויה באימות האימייל');
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate]);

  const handleReturnToLogin = () => {
    navigate('/auth', { replace: true });
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // Try to resend confirmation email - this will work if user exists but isn't confirmed
      const email = 'almogahronov1997@gmail.com'; // You can make this dynamic if needed
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });

      if (error) {
        toast.error('שגיאה בשליחת האימייל: ' + error.message);
      } else {
        toast.success('אימייל אימות נשלח מחדש! אנא בדוק את תיבת הדואר שלך');
      }
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('שגיאה בשליחת האימייל');
    } finally {
      setIsResending(false);
    }
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
                  תועבר אוטומטיטי לדשבורד תוך שניות...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
                
                <div className="flex flex-col gap-2">
                  <Button onClick={handleReturnToLogin} className="w-full">
                    חזור לדף הכניסה
                  </Button>
                  
                  <Button 
                    onClick={handleResendEmail} 
                    variant="outline" 
                    className="w-full"
                    disabled={isResending}
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        שולח...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        שלח אימייל אימות חדש
                      </>
                    )}
                  </Button>
                </div>
                
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
                <p>Error Code: {searchParams.get('error_code') || 'None'}</p>
                <p>Status: {status}</p>
                <p>Current URL: {window.location.href}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmailConfirm;
