import React from 'react';
import { Star } from 'lucide-react';
import { Card } from './ui/Card';
import { cn } from '@/lib/utils';
import { type Verb } from '@/lib/db';

interface VerbCardProps {
  verb: Verb;
  onClick: (verb: Verb) => void;
}

export const VerbCard = ({ verb, onClick }: VerbCardProps) => {
  return (
    <Card className="hover:bg-primary-light dark:hover:bg-emerald-950/30 transition-colors cursor-pointer group active:scale-[0.99] border-border dark:border-dark-border">
      <div className="p-3 flex items-center justify-between" onClick={() => onClick(verb)}>
        <div className="flex items-center gap-4 text-left w-full">
          <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg flex items-center justify-center text-lg font-bold arabic-serif text-primary dark:text-emerald-400 shrink-0">
            {verb.past[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              {verb.isMazid && (
                <span className="text-[8px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">Mazid</span>
              )}
              <h3 className="text-md font-bold text-text-dark dark:text-dark-text leading-tight text-right arabic-serif flex-1" dir="rtl">{verb.past} – {verb.present}</h3>
            </div>
            <p className="text-[11px] text-text-muted dark:text-slate-400 font-medium text-left mt-1 leading-tight">{verb.translationId}</p>
          </div>
        </div>
        <Star className={cn("w-4 h-4 ml-2 shrink-0", verb.isFavorite ? "fill-accent text-accent" : "text-stone-300 dark:text-slate-600")} />
      </div>
    </Card>
  );
};
