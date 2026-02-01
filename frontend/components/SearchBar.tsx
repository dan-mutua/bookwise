'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search bookmarks...' }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
          🔍
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full h-12 pl-12 pr-4 rounded-xl
            bg-surface-muted/50 backdrop-blur-sm
            border-2 transition-all duration-200
            font-medium text-sm text-text-primary
            placeholder:text-text-muted
            focus:outline-none
            ${isFocused
              ? 'border-brand-primary bg-surface-elevated shadow-lg'
              : 'border-transparent'
            }
          `}
        />
      </div>
    </motion.div>
  );
}
