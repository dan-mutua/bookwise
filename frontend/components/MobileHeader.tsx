'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from './Button';

interface MobileHeaderProps {
  title: string;
  onMenuClick?: () => void;
  onAddClick?: () => void;
}

export function MobileHeader({ title, onMenuClick, onAddClick }: MobileHeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-surface-elevated/95 backdrop-blur-sm border-b-2 border-text-primary/10 md:hidden"
    >
      <div className="flex items-center justify-between px-4 h-16">
        <button
          onClick={onMenuClick}
          className="text-2xl text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Open menu"
        >
          ☰
        </button>

        <h1 className="font-display font-bold text-base text-text-primary">
          {title}
        </h1>

        <Button
          variant="icon"
          onClick={onAddClick}
          className="bg-gradient-to-r from-brand-primary to-brand-accent text-white border-0"
        >
          +
        </Button>
      </div>
    </motion.header>
  );
}
