import React from 'react';
import { Star } from 'lucide-react';
import { Card } from './ui/Card';
import { cn } from '@/lib/utils';
import { type Verb } from '@/lib/db';

interface VerbCardProps {
  verb: Verb;
  onClick: (verb: Verb) => void;
  onToggleFavorite?: (verb: Verb) => void;
}

import { TextLTR, TextRTL } from './ui/Typography';

export const VerbCard = ({ verb, onClick, onToggleFavorite }: VerbCardProps) => {
  return (
    <Card className="hover:bg-primary-light dark:hover:bg-emerald-950/30 transition-colors cursor-pointer group active:scale-[0.99] border-border dark:border-dark-border relative overflow-hidden">
      <div className="p-3 flex items-center gap-3">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(verb);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-slate-700 transition-all active:scale-90 shrink-0 z-10"
        >
          <Star className={cn("w-4 h-4", verb.isFavorite ? "fill-accent text-accent" : "text-stone-300 dark:text-slate-600")} />
        </button>

        <div className="flex-1 overflow-hidden flex items-center gap-3" onClick={() => onClick(verb)}>
          <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg flex items-center justify-center text-lg font-bold text-primary dark:text-emerald-400 shrink-0">
            <TextRTL>{verb.past[0]}</TextRTL>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-1">
              <TextLTR className="flex-shrink-0">
                {verb.isMazid && (
                  <span className="text-[8px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">Mazid</span>
                )}
              </TextLTR>
              <TextRTL className="text-md font-bold text-text-dark dark:text-dark-text leading-tight truncate">
                {verb.past} – {verb.present}
              </TextRTL>
            </div>
            <TextLTR className="text-[11px] text-text-muted dark:text-slate-400 font-medium truncate">
              {verb.translationId}
            </TextLTR>
          </div>
        </div>
      </div>
    </Card>
  );
};
