import React from 'react';
import { cn } from '@/lib/utils';

export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-xl shadow-sm overflow-hidden transition-colors duration-300", className)}>
    {children}
  </div>
);
