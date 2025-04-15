
import React, { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

// האירוע המותאם אישית לשינוי מצב דמו
export const DEMO_MODE_CHANGE_EVENT = 'demo-mode-change';

export const useAppSettings = create()(
  persist(
    (set, get) => ({
      demoMode: true,
      darkMode: true,
      language: 'he',
      autoRefresh: true,
      refreshInterval: 60000,
      
      toggleDemoMode: () => {
        set((state: any) => {
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
      
      toggleDarkMode: () => set((state: any) => ({
        ...state,
        darkMode: !state.darkMode
      })),
      
      setLanguage: (language: string) => set((state: any) => ({
        ...state,
        language
      })),
      
      toggleAutoRefresh: () => set((state: any) => ({
        ...state,
        autoRefresh: !state.autoRefresh
      })),
      
      setRefreshInterval: (refreshInterval: number) => set((state: any) => ({
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
  return useAppSettings((state: any) => state.demoMode);
};

// בנוסף, נייצא גם גישה ישירה למצב הדמו
export const isDemoMode = () => useAppSettings.getState().demoMode;
