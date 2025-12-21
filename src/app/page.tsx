'use client';

import { useEffect, useState } from 'react';
import AboutPage from '@/app/about/page';
import SelectVersion from '@/app/select-version/page';
import { STORAGE_KEYS } from '@/constants/cache';

/**
 * Главная страница приложения
 * Показывает AboutPage при первом посещении, иначе SelectVersion
 */
export default function Page() {
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);

  useEffect(() => {
    const hasSeenAbout = localStorage.getItem(STORAGE_KEYS.HAS_SEEN_ABOUT);
    setShouldShow(!!hasSeenAbout);
  }, []);

  if (shouldShow === null) {
    return (
      <main className="flex h-screen w-screen items-center justify-center bg-gray-900 font-[Inter]" />
    );
  }

  return shouldShow ? <SelectVersion /> : <AboutPage />;
}
