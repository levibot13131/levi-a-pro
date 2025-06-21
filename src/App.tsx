import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Toaster } from 'sonner';

// Layout components
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import AuthGuard from '@/components/auth/AuthGuard';

// Page components
import Dashboard from '@/components/Dashboard';
import TradingSignals from '@/components/trading/TradingSignals';
import ComprehensiveAnalysis from '@/components/comprehensive-analysis/ComprehensiveAnalysis';
import AdaptiveDashboard from '@/components/trading/AdaptiveDashboard';
import SystemAudit from '@/components/system/SystemAudit';
import Settings from '@/components/Settings';
import SystemOverview from '@/components/system/SystemOverview';
import Login from '@/components/auth/Login';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: supaUser } } = await supabase.auth.getUser();
        setUser(supaUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <AuthGuard>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/signals" element={<TradingSignals />} />
                  <Route path="/analysis" element={<ComprehensiveAnalysis />} />
                  <Route path="/adaptive" element={<AdaptiveDashboard />} />
                  <Route path="/audit" element={<SystemAudit />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/system" element={<SystemOverview />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </main>
            </div>
          </div>
        </AuthGuard>
      </div>
    </Router>
  );
}

export default App;
