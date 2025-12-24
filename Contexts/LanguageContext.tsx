
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TranslationResource } from '../locales/types';
import en from '../locales/en';
import am from '../locales/am';

type LanguageCode = 'en' | 'am';

// Map of available languages for easy expansion (e.g., add 'om', 'sw' here later)
const resources: Record<LanguageCode, TranslationResource> = {
  en,
  am,
};

interface LanguageContextType {
  language: LanguageCode;
  changeLanguage: (lang: LanguageCode) => void;
  t: (path: string) => any;
  availableLanguages: { code: LanguageCode; label: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to access nested properties safely (e.g., "settings.labels.theme")
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || path;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('am'); // Default to Amharic

  useEffect(() => {
    const savedLang = localStorage.getItem('zemenai-language') as LanguageCode;
    if (savedLang && resources[savedLang]) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    localStorage.setItem('zemenai-language', lang);
  };

  const t = (path: string): any => {
    const currentResource = resources[language];
    return getNestedValue(currentResource, path);
  };

  const availableLanguages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
  ];

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
