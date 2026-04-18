import React, { useState, useRef } from 'react';
import { Star } from 'lucide-react';
import { Card } from './ui/Card';
import { cn } from '@/lib/utils';
import { type Verb } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';

interface VerbCardProps {
  verb: Verb;
  onClick: (verb: Verb) => void;
  onToggleFavorite?: (verb: Verb) => void;
}

import { TextLTR, TextRTL } from './ui/Typography';

export const VerbCard = ({ verb, onClick, onToggleFavorite }: VerbCardProps) => {
  const [showHeart, setShowHeart] = useState(false);
  const lastTap = useRef<number>(0);

  const handleTouch = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // Double Tap detected
      onToggleFavorite?.(verb);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
      lastTap.current = 0; // Reset
    } else {
      lastTap.current = now;
    }
  };

  return (
    <Card className="hover:bg-primary-light dark:hover:bg-emerald-950/30 transition-colors cursor-pointer group active:scale-[0.98] border-border dark:border-dark-border relative overflow-hidden select-none">
      <div className="p-2 flex items-center gap-2">
        {/* Larger Hit Area for Star */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(verb);
          }}
          className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-slate-700 transition-all active:scale-75 shrink-0 z-10"
          aria-label="Toggle Favorite"
        >
          <Star className={cn("w-5 h-5 transition-transform", verb.isFavorite ? "fill-accent text-accent scale-110" : "text-stone-300 dark:text-slate-600")} />
        </button>

        {/* Main Content with Double Tap */}
        <div 
          className="flex-1 overflow-hidden flex items-center gap-4 py-4 pr-5 pl-2" 
          onClick={(e) => {
            handleTouch(e);
            setTimeout(() => {
              if (Date.now() - lastTap.current >= 300 && lastTap.current !== 0) {
                onClick(verb);
              }
            }, 300);
          }}
        >
          <div className="w-11 h-11 bg-white dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl flex items-center justify-center text-xl font-bold text-primary dark:text-emerald-400 shrink-0 shadow-sm">
            <TextRTL>{verb.past[0]}</TextRTL>
          </div>
          
          <div className="flex-1 overflow-hidden text-right">
            <div className="flex items-center justify-end gap-2 mb-1.5">
              <TextLTR className="flex-shrink-0 flex gap-1">
                {verb.isMazid && (
                  <span className="text-[8px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">Mazid</span>
                )}
                {verb.type === 'mithal' && (
                  <span className="text-[8px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">Mithal</span>
                )}
                {verb.type === 'ajwaf' && (
                  <span className="text-[8px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">Ajwaf</span>
                )}
                {verb.type === 'naqis' && (
                  <span className="text-[8px] font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">Naqis</span>
                )}
              </TextLTR>
              <TextRTL className="text-lg font-bold text-text-dark dark:text-dark-text leading-tight truncate">
                {verb.past} – {verb.present}
              </TextRTL>
            </div>
            <TextLTR className="text-[12px] text-text-muted dark:text-slate-400 font-medium truncate text-left pl-1">
              {verb.translationId}
            </TextLTR>
          </div>
        </div>

        {/* Double Tap Animation */}
        <AnimatePresence>
          {showHeart && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1.5, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -20 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <Star className="w-20 h-20 fill-accent text-accent shadow-2xl drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};
