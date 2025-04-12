
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

// Initialize real-time services with a refresh
document.addEventListener('DOMContentLoaded', () => {
  // Trigger any initialization or refresh needed
  console.log('DOM fully loaded, initializing real-time services...');
  
  // Example: You could dispatch a custom event that components can listen for
  const refreshEvent = new CustomEvent('system:refresh');
  window.dispatchEvent(refreshEvent);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-center" richColors closeButton dir="rtl" />
    </BrowserRouter>
  </React.StrictMode>
);
