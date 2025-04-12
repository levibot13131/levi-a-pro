
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainNavigation from './components/MainNavigation';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';

// Pages
import Home from './pages/Home';
import MarketData from './pages/MarketData';
import AssetTracker from './pages/AssetTracker';
import MarketNews from './pages/MarketNews';
import TradingSignals from './pages/TradingSignals';
import RiskManagement from './pages/RiskManagement';
import Backtesting from './pages/Backtesting';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';
import InformationSources from './pages/InformationSources';
import ComprehensiveAnalysis from './pages/ComprehensiveAnalysis';
import BinanceIntegration from './pages/BinanceIntegration';
import TrendingCoins from './pages/TrendingCoins';
import CryptoSentiment from './pages/CryptoSentiment';
import TradingViewIntegration from './pages/TradingViewIntegration';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex">
            <div className="flex-none">
              <MainNavigation />
            </div>
            <div className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/market-data" element={<MarketData />} />
                <Route path="/asset-tracker" element={<AssetTracker />} />
                <Route path="/market-news" element={<MarketNews />} />
                <Route path="/trading-signals" element={<TradingSignals />} />
                <Route path="/risk-management" element={<RiskManagement />} />
                <Route path="/backtesting" element={<Backtesting />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/login" element={<Login />} />
                <Route path="/information-sources" element={<InformationSources />} />
                <Route path="/comprehensive-analysis" element={<ComprehensiveAnalysis />} />
                <Route path="/binance-integration" element={<BinanceIntegration />} />
                <Route path="/trending-coins" element={<TrendingCoins />} />
                <Route path="/crypto-sentiment" element={<CryptoSentiment />} />
                <Route path="/tradingview-integration" element={<TradingViewIntegration />} />
              </Routes>
            </div>
          </div>
          <Toaster dir="rtl" position="top-center" />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
