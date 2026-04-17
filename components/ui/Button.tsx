import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export const Button = ({ children, onClick, variant = 'primary', className, disabled, type = 'button' }: ButtonProps) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/95',
    secondary: 'bg-primary-light text-primary hover:bg-emerald-100',
    ghost: 'bg-transparent text-text-muted hover:bg-stone-100',
    accent: 'bg-accent text-white hover:bg-accent/90',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn("px-4 py-2.5 rounded-lg font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 text-sm", variants[variant], className)}
    >
      {children}
    </button>
  );
};
