import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

/**
 * InputLTR: For Indonesian/English input.
 * Aligns text to the left and sets LTR direction.
 */
export const InputLTR = ({ className, ...props }: InputProps) => {
  return (
    <input
      {...props}
      dir="ltr"
      className={cn(
        "w-full px-4 py-3 bg-stone-50 dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-dark-text text-left ltr-text",
        className
      )}
    />
  );
};

/**
 * InputRTL: For Arabic input.
 * Aligns text to the right, sets RTL direction, and uses Arabic font.
 */
export const InputRTL = ({ className, ...props }: InputProps) => {
  return (
    <input
      {...props}
      dir="rtl"
      className={cn(
        "w-full px-4 py-3 bg-stone-50 dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl font-bold arabic-serif text-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-dark-text text-right rtl-text",
        className
      )}
    />
  );
};
