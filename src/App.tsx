
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import MainNavigation from './components/MainNavigation';
import TradingSignals from './pages/TradingSignals';
import AssetTracker from './pages/AssetTracker';
import RiskManagement from './pages/RiskManagement';
import TechnicalAnalysis from './pages/TechnicalAnalysis';
import { useEffect } from 'react';
import { initializeAssets } from './services/realTimeAssetService';

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

function App() {
  // Initialize asset data on app load
  useEffect(() => {
    initializeAssets();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div dir="rtl">
        <Toaster position="top-center" closeButton />
        <MainNavigation />
        <Routes>
          <Route path="/" element={<TradingSignals />} />
          <Route path="/trading-signals" element={<TradingSignals />} />
          <Route path="/asset-tracker" element={<AssetTracker />} />
          <Route path="/risk-management" element={<RiskManagement />} />
          <Route path="/technical-analysis" element={<TechnicalAnalysis />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
