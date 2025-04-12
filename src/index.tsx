
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { initializeUsers } from './services/auth/userService';

// Import startup service to ensure initialization
import './services/tradingView/startup';

// Initialize users data when the app starts
initializeUsers();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-center" richColors closeButton dir="rtl" />
    </BrowserRouter>
  </React.StrictMode>
);
