'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initEffects } from '@/lib/effects';

// Mounts the ported vanilla-DOM interactive layer. Re-binds on every client
// navigation (the DOM is replaced between pages) by keying the effect on the
// pathname; the cleanup tears down every listener/interval/observer so there
// is no double-binding (also safe under React StrictMode's dev double-mount).
export default function Interactions({ lang }) {
  const pathname = usePathname();
  useEffect(() => {
    const cleanup = initEffects();
    return cleanup;
  }, [pathname, lang]);
  return null;
}
