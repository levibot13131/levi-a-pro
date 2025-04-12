
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { initializeUsers } from './services/auth/userService';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';

// יצירת ריאקט קווארי קליינט
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 דקות
    },
  },
});

// אתחול משתמשים
initializeUsers();

// ייבוא שירות האתחול להבטחת אתחול
import './services/tradingView/startup';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
        <Toaster 
          position="top-center" 
          richColors 
          closeButton 
          dir="rtl"
          toastOptions={{
            classNames: {
              title: "font-bold text-right",
              description: "text-right"
            }
          }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
