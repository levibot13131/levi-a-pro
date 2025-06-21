
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { navItems } from "./nav-items";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/auth/AuthGuard";
import Auth from "./pages/Auth";
import ErrorBoundary from "./components/ErrorBoundary";

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  console.log('🚀 App component initializing...');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <Routes>
                  {/* Public route - completely separate from AuthGuard */}
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* All protected routes wrapped in AuthGuard */}
                  {navItems.map(({ to, page }) => (
                    <Route 
                      key={to} 
                      path={to} 
                      element={
                        <AuthGuard>
                          {page}
                        </AuthGuard>
                      } 
                    />
                  ))}
                  
                  {/* Root redirect - only if not on /auth */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
                  {/* Catch all other routes */}
                  <Route path="*" element={<Navigate to="/auth" replace />} />
                </Routes>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
