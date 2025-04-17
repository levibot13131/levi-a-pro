
import React, { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

// האירוע המותאם אישית לשינוי מצב דמו
export const DEMO_MODE_CHANGE_EVENT = 'demo-mode-change';

// Get demo mode from environment or default to true
const getInitialDemoMode = (): boolean => {
  const envDemoMode = import.meta.env.VITE_DEMO_MODE;
  if (envDemoMode !== undefined) {
    return envDemoMode === 'true' || envDemoMode === true;
  }
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
          
          // השמעת אירוע שינוי מצב דמו
          const event = new CustomEvent(DEMO_MODE_CHANGE_EVENT, {
            detail: {
              demoMode: newDemoMode
            }
          });
          window.dispatchEvent(event);
          
          // הצגת הודעת טוסט על השינוי
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

// Hook להאזנה לשינויים במצב דמו
export const useDemoModeListener = (callback: (demoMode: boolean) => void) => {
  useEffect(() => {
    const handleDemoModeChange = (event: CustomEvent) => {
      callback((event as any).detail.demoMode);
    };
    
    // הוספת האזנה לאירוע
    window.addEventListener(DEMO_MODE_CHANGE_EVENT, handleDemoModeChange as EventListener);
    
    // ניקוי האזנה בעת פירוק הקומפוננטה
    return () => {
      window.removeEventListener(DEMO_MODE_CHANGE_EVENT, handleDemoModeChange as EventListener);
    };
  }, [callback]);
  
  // החזרת הערך הנוכחי של מצב דמו
  return useAppSettings((state) => state.demoMode);
};

// בנוסף, נייצא גם גישה ישירה למצב הדמו
export const isDemoMode = () => useAppSettings.getState().demoMode;
