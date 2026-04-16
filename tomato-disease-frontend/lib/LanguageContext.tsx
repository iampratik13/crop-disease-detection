'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

export type LanguageCode = 'en' | 'mr' | 'hi' | 'kn';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>('en');

  // Optional: Add a useEffect to pull saved language preference from localStorage if needed

  const t = (key: string): string => {
    const translationSet = translations[language] || translations['en'];
    return translationSet[key as keyof typeof translationSet] || translations['en'][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
