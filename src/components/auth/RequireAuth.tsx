
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface RequireAuthProps {
  children?: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-right">דרושה התחברות</CardTitle>
            <CardDescription className="text-right">
              עליך להתחבר כדי לצפות בדף זה
            </CardDescription>
          </CardHeader>
          <CardContent className="text-right">
            <p className="mb-4">
              דף זה דורש התחברות למערכת. אנא התחבר למערכת כדי לגשת לתוכן זה.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button asChild>
              <Link to="/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                התחבר למערכת
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <>
      {children || <Outlet />}
    </>
  );
};

export default RequireAuth;
