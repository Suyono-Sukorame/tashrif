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
        <div className="flex items-center justify-between mb-3 px-1">
          <TextLTR className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-muted dark:text-slate-400" />
            <h2 className="text-[11px] font-bold text-text-muted dark:text-slate-400 uppercase tracking-wider">Registri Kata Kerja</h2>
          </TextLTR>
          <Button 
            onClick={() => {
              const csv = "data:text/csv;charset=utf-8,ID,Root,Past,Present,Translation\n" + 
                verbs.map(v => `${v.id},${v.root},${v.past},${v.present},${v.translationId}`).join("\n");
              const encodedUri = encodeURI(csv);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "tashrif_master_export.csv");
              document.body.appendChild(link);
              link.click();
            }}
            variant="ghost" 
            className="text-[11px] font-bold text-primary dark:text-emerald-400 px-2 py-1"
          >
            Ekspor Data
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {verbs.filter(v => v.isFavorite && (v.past.includes(searchQuery) || v.translationId.includes(searchQuery))).length > 0 ? (
            verbs.filter(v => v.isFavorite && (v.past.includes(searchQuery) || v.translationId.includes(searchQuery))).map((verb) => (
              <VerbCard key={verb.id} verb={verb} onClick={handleVerbSelect} />
            ))
          ) : (
            <div className="py-10 text-center space-y-2">
               <div className="text-3xl opacity-20">📚</div>
               <p className="text-[11px] text-text-muted dark:text-slate-500 uppercase font-bold tracking-widest">Koleksi Masih Kosong</p>
               <Button onClick={() => setSearchQuery('')} variant="ghost" className="text-[10px] text-primary">Cari Kata di Tashrif</Button>
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
