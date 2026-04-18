import React from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Award, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { VerbCard } from '../VerbCard';
import { type Verb } from '@/lib/db';
import { type ActiveTab } from '@/lib/types';
import { TextLTR, TextRTL } from '../ui/Typography';

interface HomeViewProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  verbs: Verb[];
  handleVerbSelect: (verb: Verb) => void;
  setActiveTab: (tab: ActiveTab) => void;
  stats: { mastery: number, count: number };
}

export const HomeView = ({ searchQuery, setSearchQuery, verbs, handleVerbSelect, setActiveTab, stats }: HomeViewProps) => {
  const filteredVerbs = verbs.filter(v => 
    v.past.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.present.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.root.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.translationId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <section className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-white dark:bg-dark-card border-border dark:border-dark-border">
          <TextLTR className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary dark:text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted dark:text-slate-400">Indeks Penguasaan</span>
          </TextLTR>
          <TextLTR className="text-2xl font-bold text-text-dark dark:text-dark-text">{stats.mastery}%</TextLTR>
          <TextLTR className="text-[10px] text-text-muted dark:text-slate-500">+5.2% drift sesi</TextLTR>
        </Card>
        <Card className="p-4 bg-white dark:bg-dark-card border-border dark:border-dark-border">
          <TextLTR className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-accent dark:text-orange-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted dark:text-slate-400">Perpustakaan Kata</span>
          </TextLTR>
          <TextLTR className="text-2xl font-bold text-text-dark dark:text-dark-text">{stats.count.toLocaleString()}</TextLTR>
          <TextLTR className="text-[10px] text-text-muted dark:text-slate-500">Level {Math.floor(stats.count / 10) + 1} Tercapai</TextLTR>
        </Card>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <TextLTR className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-muted dark:text-slate-400" />
            <h2 className="text-[11px] font-bold text-text-muted dark:text-slate-400 uppercase tracking-wider">Pilih Kata Kerja</h2>
          </TextLTR>
          <div className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary-light rounded-full">{filteredVerbs.length} Kata</div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {filteredVerbs.length > 0 ? (
            filteredVerbs.map((verb) => (
              <VerbCard key={verb.id} verb={verb} onClick={handleVerbSelect} />
            ))
          ) : (
            <div className="py-12 text-center space-y-3 bg-stone-50/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-border dark:border-dark-border">
               <div className="text-4xl opacity-20">🔍</div>
               <div className="space-y-1">
                 <p className="text-[11px] text-text-dark dark:text-dark-text font-bold uppercase tracking-widest">Kata Tidak Ditemukan</p>
                 <p className="text-[10px] text-text-muted dark:text-slate-500">Coba kata kunci lain atau periksa ejaan Anda</p>
               </div>
               <Button onClick={() => setSearchQuery('')} variant="ghost" className="text-[10px] text-primary">Reset Pencarian</Button>
            </div>
          )}
        </div>
      </section>

      <section className="bg-primary rounded-3xl p-6 text-white overflow-hidden relative shadow-lg shadow-primary/20">
        <div className="relative z-10">
          <TextLTR>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full mb-3 inline-block uppercase tracking-widest">Modul Terpilih</span>
            <TextRTL as="h3" className="text-xl font-bold mb-2 leading-tight">تَصْرِيفُ المِثَال (Logika Mithal)</TextRTL>
            <p className="text-xs text-white/80 mb-5 leading-relaxed">Pelajari bagaimana huruf &quot;Waw&quot; dihilangkan dalam penggunaan bahasa Arab standar.</p>
            <Button onClick={() => setActiveTab('guide')} variant="secondary" className="w-full py-3.5 border-none shadow-md">Pelajari Sekarang</Button>
          </TextLTR>
        </div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </section>
    </motion.div>
  );
};
