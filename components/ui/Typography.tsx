import React from 'react';
import { cn } from '@/lib/utils';

interface TextProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * TextLTR: For Indonesian/English text. 
 * Automatically sets text-left and LTR direction.
 */
export const TextLTR = ({ children, className, as: Component = 'div' }: TextProps) => {
  return (
    <Component className={cn("text-left ltr-text", className)} dir="ltr">
      {children}
    </Component>
  );
};

/**
 * TextRTL: For Arabic text.
 * Automatically sets text-right, RTL direction, and Arabic font.
 */
export const TextRTL = ({ children, className, as: Component = 'div' }: TextProps) => {
  return (
    <Component className={cn("text-right rtl-text arabic-serif", className)} dir="rtl">
      {children}
    </Component>
  );
};
