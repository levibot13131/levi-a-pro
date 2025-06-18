
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TradingSignals from "./pages/TradingSignals";
import SystemHealth from "./pages/SystemHealth";
import IntegrationStatus from "./pages/IntegrationStatus";
import TradingViewIntegration from "./pages/TradingViewIntegration";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import RequireAuth from "./components/auth/RequireAuth";
import Navbar from "./components/layout/Navbar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <RequireAuth>
                  <Navbar />
                  <Index />
                </RequireAuth>
              } />
              <Route path="/dashboard" element={
                <RequireAuth>
                  <Navbar />
                  <Dashboard />
                </RequireAuth>
              } />
              <Route path="/trading-signals" element={
                <RequireAuth>
                  <Navbar />
                  <TradingSignals />
                </RequireAuth>
              } />
              <Route path="/system-health" element={
                <RequireAuth>
                  <Navbar />
                  <SystemHealth />
                </RequireAuth>
              } />
              <Route path="/integration-status" element={
                <RequireAuth>
                  <Navbar />
                  <IntegrationStatus />
                </RequireAuth>
              } />
              <Route path="/tradingview" element={
                <RequireAuth>
                  <Navbar />
                  <TradingViewIntegration />
                </RequireAuth>
              } />
              <Route path="/admin" element={
                <RequireAuth>
                  <Navbar />
                  <Admin />
                </RequireAuth>
              } />
              <Route path="/profile" element={
                <RequireAuth>
                  <Navbar />
                  <Profile />
                </RequireAuth>
              } />
              
              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
