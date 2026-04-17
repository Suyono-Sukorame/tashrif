import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { getIshtilahy } from '@/lib/conjugator';
import { type Verb } from '@/lib/db';

interface IshtilahySummaryProps {
  verb: Verb;
}

export const IshtilahySummary = ({ verb }: IshtilahySummaryProps) => {
  const ishtilahyData = getIshtilahy(verb);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="grid grid-cols-2 gap-3"
    >
      {ishtilahyData.map((item, i) => (
        <Card key={i} className="p-3 bg-white dark:bg-dark-card border-border dark:border-dark-border border flex flex-col items-center text-center">
          <span className="text-[10px] font-bold text-text-muted dark:text-slate-500 uppercase tracking-widest mb-1">{item.title}</span>
          <span className="text-xl font-bold arabic-serif text-primary dark:text-emerald-400" dir="rtl">{item.value}</span>
        </Card>
      ))}
    </motion.div>
  );
};
