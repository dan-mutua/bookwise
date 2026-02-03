'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  icon?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-display font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';

  const variants = {
    primary: 'bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-lg hover:shadow-2xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-brand-light before:to-brand-accent before:opacity-0 hover:before:opacity-30 before:transition-opacity before:duration-300 active:scale-95',
    secondary: 'bg-surface-elevated border-3 border-text-primary text-text-primary hover:border-brand-primary hover:bg-surface-muted shadow-md hover:shadow-lg after:absolute after:inset-0 after:bg-brand-primary after:opacity-0 hover:after:opacity-[0.08] after:transition-opacity after:duration-300 active:scale-95',
    accent: 'bg-brand-accent text-white shadow-lg hover:shadow-2xl before:absolute before:inset-0 before:bg-white before:opacity-0 hover:before:opacity-20 before:transition-opacity before:duration-300 active:scale-95',
    icon: 'bg-surface-elevated border-3 border-text-primary text-brand-primary hover:bg-brand-primary hover:text-white shadow-md hover:shadow-xl transition-all after:absolute after:inset-0 after:bg-gradient-to-br after:from-brand-primary after:to-transparent after:opacity-0 hover:after:opacity-20 after:transition-opacity after:duration-300 active:scale-90',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs rounded-lg',
    md: 'px-6 py-3 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-2xl',
  };

  if (variant === 'icon') {
    return (
      <motion.div 
        whileHover={{ scale: disabled ? 1 : 1.08 }} 
        whileTap={{ scale: disabled ? 1 : 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <button
          className={clsx(
            baseStyles,
            variants.icon,
            'w-11 h-11 flex items-center justify-center rounded-xl text-lg',
            className
          )}
          disabled={disabled}
          {...props}
        >
          {icon || children}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      whileHover={{ scale: disabled ? 1 : 1.05 }} 
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <button
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          'flex items-center justify-center gap-2.5 uppercase tracking-wider',
          className
        )}
        disabled={disabled}
        {...props}
      >
        {icon && <span className="text-base">{icon}</span>}
        {children}
      </button>
    </motion.div>
  );
}
