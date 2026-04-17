import React from 'react';
import { cn } from '@/lib/utils';

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export const NavButton = ({ active, onClick, icon, label }: NavButtonProps) => {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 group">
      <div className={cn("transition-all duration-300", active ? "text-primary scale-110" : "text-stone-400 group-hover:text-stone-600")}>
        <div className="w-5 h-5 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <span className={cn("text-[10px] font-bold uppercase tracking-tighter transition-all", active ? "opacity-100 text-primary" : "opacity-0 text-stone-400 group-hover:opacity-100")}>{label}</span>
    </button>
  );
};
