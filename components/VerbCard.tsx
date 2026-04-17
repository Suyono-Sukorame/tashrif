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
    <Card className="hover:bg-primary-light transition-colors cursor-pointer group active:scale-[0.99] border-border">
      <div className="p-3 flex items-center justify-between" onClick={() => onClick(verb)}>
        <div className="flex items-center gap-4 text-left w-full">
          <div className="w-10 h-10 bg-white border border-border rounded-lg flex items-center justify-center text-lg font-bold arabic-serif text-primary shrink-0">
            {verb.past[0]}
          </div>
          <div className="flex-1">
            <h3 className="text-md font-bold text-text-dark leading-tight text-right arabic-serif" dir="rtl">{verb.past} – {verb.present}</h3>
            <p className="text-[11px] text-text-muted font-medium text-left mt-1">{verb.translationId} (Wazan {verb.wazan})</p>
          </div>
        </div>
        <Star className={cn("w-4 h-4 ml-2", verb.isFavorite ? "fill-accent text-accent" : "text-stone-300")} />
      </div>
    </Card>
  );
};
