'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  count?: number;
}

interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
}

interface SidebarProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
}

const navItems: NavItem[] = [
  { id: 'all', label: 'All Bookmarks', icon: '📚', href: '/' },
  { id: 'favorites', label: 'Favorites', icon: '⭐', href: '/favorites' },
  { id: 'recent', label: 'Recent', icon: '🕒', href: '/recent' },
  { id: 'tags', label: 'Tags', icon: '🏷️', href: '/tags' },
];

export function Sidebar({ categories, activeCategory, onCategoryChange }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] h-screen bg-surface-elevated border-r-2 border-text-primary/10 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b-2 border-text-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl flex items-center justify-center">
            <span className="text-xl">📖</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-text-primary">
              Bookwise
            </h1>
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
              Smart Archives
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.id} href={item.href}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={clsx(
                    'group relative px-4 py-3 rounded-xl transition-all duration-200',
                    'flex items-center gap-3',
                    isActive
                      ? 'bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-md'
                      : 'text-text-secondary hover:bg-surface-muted/50'
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className={clsx(
                        'ml-auto text-xs font-mono font-semibold px-2 py-0.5 rounded-full',
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-surface-muted text-text-muted'
                      )}
                    >
                      {item.count}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Categories Section */}
        <div className="mt-8">
          <h2 className="px-4 mb-3 text-[11px] font-mono font-semibold text-text-muted uppercase tracking-wider">
            Categories
          </h2>
          <div className="space-y-1">
            {categories.map((category, index) => {
              const isActive = activeCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  onClick={() => onCategoryChange?.(category.id)}
                  className={clsx(
                    'w-full px-4 py-2 rounded-lg transition-all duration-200',
                    'flex items-center justify-between',
                    isActive
                      ? 'bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-md'
                      : 'hover:bg-surface-muted/50 text-text-secondary hover:text-text-primary'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: isActive ? '#ffffff' : category.color }}
                    />
                    <span className="text-sm capitalize">{category.name}</span>
                  </div>
                  <span className={clsx(
                    'text-xs font-mono',
                    isActive ? 'text-white/80 font-semibold' : 'text-text-muted'
                  )}>
                    {category.count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t-2 border-text-primary/10">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-surface-muted/50">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-display font-bold text-sm">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">User</p>
            <p className="text-[11px] text-text-muted font-mono">Settings</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
