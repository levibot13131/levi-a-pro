
import { useState, useEffect } from 'react';

export function useHebrew() {
  const [isHebrew, setIsHebrew] = useState(true);

  useEffect(() => {
    // Check localStorage for language preference or detect from browser
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setIsHebrew(savedLanguage === 'he');
    } else {
      // Default to Hebrew for LeviPro
      setIsHebrew(true);
    }
  }, []);

  const toggleLanguage = () => {
    const newIsHebrew = !isHebrew;
    setIsHebrew(newIsHebrew);
    localStorage.setItem('language', newIsHebrew ? 'he' : 'en');
  };

  return { isHebrew, toggleLanguage };
}
