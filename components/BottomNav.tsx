'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/dashboard', label: 'Hoy', icon: '✦' },
  { href: '/diario', label: 'Diario', icon: '✎' },
  { href: '/rituales', label: 'Rituales', icon: '◐' },
  { href: '/afirmaciones', label: 'Afirma.', icon: '✨' },
  { href: '/comunidad', label: 'Comun.', icon: '◑' },
  { href: '/audios', label: 'Medit.', icon: '♪' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#12121c]/95 backdrop-blur border-t border-white/10">
      <div className="max-w-2xl mx-auto grid grid-cols-6">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                active ? 'text-gold' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              {tab.label.toUpperCase()}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
