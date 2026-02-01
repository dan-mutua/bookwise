'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
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
  const baseStyles = 'font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-md hover:shadow-lg hover:scale-105',
    secondary: 'bg-surface-elevated border-2 border-text-primary/20 text-text-primary hover:border-brand-primary hover:text-brand-primary',
    icon: 'bg-surface-elevated border-2 border-text-primary/20 text-brand-primary hover:border-brand-primary hover:bg-brand-primary hover:text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-5 py-3 text-sm rounded-xl',
    lg: 'px-6 py-3.5 text-base rounded-xl',
  };

  if (variant === 'icon') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
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
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        'flex items-center justify-center gap-2',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </motion.button>
  );
}
