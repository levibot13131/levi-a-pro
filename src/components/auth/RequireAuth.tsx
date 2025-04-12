
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
  resource?: string;
  requiredPermission?: 'view' | 'edit' | 'delete';
}

const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  resource, 
  requiredPermission = 'view' 
}) => {
  const { isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to the login page, but save the current location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a resource is specified, check if user has permission to access it
  if (resource && !hasPermission(resource, requiredPermission)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg max-w-lg">
          <h2 className="text-lg font-semibold mb-2">אין לך גישה לעמוד זה</h2>
          <p className="mb-4">
            אין לך מספיק הרשאות לצפות בתוכן זה. אנא פנה למנהל המערכת לקבלת הרשאות מתאימות.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
