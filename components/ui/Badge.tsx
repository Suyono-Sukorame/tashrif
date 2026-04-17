import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'warning' | 'outline';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

/**
 * Badge Component: Reusable for notifications, status labels, and tags.
 */
export const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'xs', 
  className 
}: BadgeProps) => {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    accent: "bg-accent/10 text-accent border-accent/20",
    success: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
    danger: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50",
    warning: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
    outline: "bg-transparent text-text-muted border-border dark:text-slate-400 dark:border-slate-700"
  };

  const sizes = {
    xs: "text-[9px] px-1.5 py-0.5",
    sm: "text-[10px] px-2 py-1",
    md: "text-[12px] px-3 py-1.5"
  };

  return (
    <span className={cn(
      "inline-flex items-center justify-center font-bold uppercase tracking-widest rounded-full border transition-all duration-300",
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
};

/**
 * NotificationBadge: Specifically for counting/alert dots on icons.
 */
export const NotificationBadge = ({ count, className }: { count?: number, className?: string }) => {
  if (count === 0) return null;
  return (
    <span className={cn(
      "absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-dark-card",
      className
    )}>
      {count && count > 99 ? '99+' : count}
    </span>
  );
};
