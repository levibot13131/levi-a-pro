
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { showProductionWarningIfNeeded } from './services/environment/productionFallbacks';

// Initialize production notifications
showProductionWarningIfNeeded();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
