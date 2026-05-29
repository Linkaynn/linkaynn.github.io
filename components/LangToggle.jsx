'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { otherLang } from '@/lib/lang';

// Locale toggle: a Link to the SAME path under the other locale. Replaces the
// original DOM-swapping button. Shows the current lang label like the original.
export default function LangToggle({ lang }) {
  const pathname = usePathname() || `/${lang}`;
  const other = otherLang(lang);
  // Swap the leading /es or /en segment to the other locale.
  const target = pathname.replace(/^\/(es|en)(?=\/|$)/, `/${other}`);

  return (
    <Link href={target} className="mini magnetic" data-strength="0.25" title="toggle language">
      {lang}
    </Link>
  );
}
