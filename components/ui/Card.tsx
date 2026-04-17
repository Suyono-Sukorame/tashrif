import React from 'react';
import { cn } from '@/lib/utils';

export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white rounded-xl border border-border shadow-sm overflow-hidden", className)}>
    {children}
  </div>
);
