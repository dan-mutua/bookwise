'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { id: 'all', label: 'All', icon: '📚', href: '/' },
  { id: 'favorites', label: 'Favs', icon: '⭐', href: '/favorites' },
  { id: 'tags', label: 'Tags', icon: '🏷️', href: '/tags' },
  { id: 'profile', label: 'You', icon: '👤', href: '/profile' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface-elevated border-t-2 border-text-primary/10"
    >
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.id} href={item.href}>
              <div
                className={clsx(
                  'h-full flex flex-col items-center justify-center gap-1 transition-colors',
                  isActive
                    ? 'text-brand-primary'
                    : 'text-text-muted'
                )}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
