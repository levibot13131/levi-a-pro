
import React, { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

// Custom event for demo mode change
export const DEMO_MODE_CHANGE_EVENT = 'demo-mode-change';

// Get demo mode from environment or default to true
const getInitialDemoMode = (): boolean => {
  // Check environment variable first (highest priority)
  const envDemoMode = import.meta.env.VITE_DEMO_MODE;
  if (envDemoMode !== undefined) {
    console.log('Demo mode from environment:', envDemoMode);
    return envDemoMode === 'true' || envDemoMode === true;
  }
  
  // If not in env, check localStorage
  const storedDemoMode = localStorage.getItem('app_demo_mode');
  if (storedDemoMode !== null) {
    console.log('Demo mode from localStorage:', storedDemoMode);
    return storedDemoMode === 'true';
  }
  
  console.log('Using default demo mode: true');
  return true; // Default to demo mode if not specified
};

export interface AppSettingsState {
  demoMode: boolean;
  darkMode: boolean;
  language: string;
  autoRefresh: boolean;
  refreshInterval: number;
  toggleDemoMode: () => void;
  toggleDarkMode: () => void;
  setLanguage: (language: string) => void;
  toggleAutoRefresh: () => void;
  setRefreshInterval: (refreshInterval: number) => void;
}

export const useAppSettings = create<AppSettingsState>()(
  persist(
    (set, get) => ({
      demoMode: getInitialDemoMode(),
      darkMode: true,
      language: 'he',
      autoRefresh: true,
      refreshInterval: 60000,
      
      toggleDemoMode: () => {
        set((state) => {
          const newDemoMode = !state.demoMode;
          localStorage.setItem('app_demo_mode', String(newDemoMode));
          
          // Dispatch custom event for demo mode change
          const event = new CustomEvent(DEMO_MODE_CHANGE_EVENT, {
            detail: {
              demoMode: newDemoMode
            }
          });
          window.dispatchEvent(event);
          
          // Show toast notification about the change
          if (newDemoMode) {
            toast.info('עברת למצב דמו', {
              description: 'כל הנתונים הם לצורכי הדגמה בלבד'
            });
          } else {
            toast.warning('עברת למצב אמיתי', {
              description: 'המערכת תשתמש בנתונים אמיתיים מהחיבורים שהגדרת'
            });
          }
          
          console.log(`App mode changed to ${newDemoMode ? 'DEMO' : 'REAL'} mode`);
          
          return {
            ...state,
            demoMode: newDemoMode
          };
        });
      },
      
      toggleDarkMode: () => set((state) => ({
        ...state,
        darkMode: !state.darkMode
      })),
      
      setLanguage: (language: string) => set((state) => ({
        ...state,
        language
      })),
      
      toggleAutoRefresh: () => set((state) => ({
        ...state,
        autoRefresh: !state.autoRefresh
      })),
      
      setRefreshInterval: (refreshInterval: number) => set((state) => ({
        ...state,
        refreshInterval
      }))
    }),
    {
      name: 'app-settings'
    }
  )
);

// Hook for listening to demo mode changes
export const useDemoModeListener = (callback: (demoMode: boolean) => void) => {
  useEffect(() => {
    const handleDemoModeChange = (event: CustomEvent) => {
      callback((event as any).detail.demoMode);
    };
    
    // Add event listener
    window.addEventListener(DEMO_MODE_CHANGE_EVENT, handleDemoModeChange as EventListener);
    
    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener(DEMO_MODE_CHANGE_EVENT, handleDemoModeChange as EventListener);
    };
  }, [callback]);
  
  // Return current demo mode value
  return useAppSettings((state) => state.demoMode);
};

// Direct access to demo mode
export const isDemoMode = () => useAppSettings.getState().demoMode;
