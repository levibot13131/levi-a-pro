
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Show loading spinner while auth is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">🔐 LeviPro Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    console.log('❌ Not authenticated, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // If authenticated, render protected content
  console.log('✅ Authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
