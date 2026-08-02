'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';

function ThemeHydration({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('aura_theme_preference') || 'dark';
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(savedTheme);
    } catch (e) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeHydration>{children}</ThemeHydration>
    </Provider>
  );
}
