'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

interface Filter {
  id: string;
  label: string;
  count?: number;
}

interface FilterPillsProps {
  filters: Filter[];
  activeFilter: string;
  onChange: (filterId: string) => void;
}

export function FilterPills({ filters, activeFilter, onChange }: FilterPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
      {filters.map((filter, index) => {
        const isActive = activeFilter === filter.id;

        return (
          <motion.button
            key={filter.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onChange(filter.id)}
            className={clsx(
              'px-5 py-2.5 rounded-full transition-all duration-200',
              'font-medium text-xs whitespace-nowrap',
              'flex items-center gap-2',
              isActive
                ? 'bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-md scale-105'
                : 'bg-surface-muted/70 text-text-secondary hover:bg-surface-muted hover:text-text-primary'
            )}
          >
            <span>{filter.label}</span>
            {filter.count !== undefined && (
              <span
                className={clsx(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold',
                  isActive
                    ? 'bg-white/20'
                    : 'bg-surface-elevated'
                )}
              >
                {filter.count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
