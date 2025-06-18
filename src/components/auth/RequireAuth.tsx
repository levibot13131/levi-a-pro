
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

export interface RequireAuthProps {
  children?: React.ReactNode;
  adminOnly?: boolean;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isLoading, isAdmin, user } = useAuth();

  // Show loading spinner while auth is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Verifying authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // Check admin requirements
  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-muted-foreground mb-4">
              This page requires administrator privileges.
            </p>
            <p className="text-sm text-muted-foreground">
              Current user: {user?.email}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
