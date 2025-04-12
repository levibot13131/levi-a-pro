
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { Shield } from 'lucide-react';

const Login = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">מערכת ניתוח מסחר מתקדמת</h1>
          <p className="text-muted-foreground">התחבר כדי להמשיך לפלטפורמה</p>
        </div>
        <LoginForm />
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            מערכת ניתוח מסחר מתקדמת - כל הזכויות שמורות
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
