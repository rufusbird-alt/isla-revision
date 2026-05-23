'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/',         label: 'Home',     icon: '🏠' },
  { href: '/quiz',     label: 'Quiz',     icon: '✏️' },
  { href: '/progress', label: 'Progress', icon: '📈' },
];

export default function Nav() {
  const path = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-t border-white/10 safe-area-bottom">
      <div className="flex justify-around max-w-lg mx-auto px-4 py-2">
        {links.map(({ href, label, icon }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 ${
                active ? 'text-violet-300' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span className="text-xs font-medium">{label}</span>
              {active && <span className="block w-1 h-1 rounded-full bg-violet-400" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
