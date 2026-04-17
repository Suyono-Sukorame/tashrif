import React from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Award, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { VerbCard } from '../VerbCard';
import { type Verb } from '@/lib/db';
import { type ActiveTab } from '@/lib/types';

interface HomeViewProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  verbs: Verb[];
  handleVerbSelect: (verb: Verb) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const HomeView = ({ searchQuery, setSearchQuery, verbs, handleVerbSelect, setActiveTab }: HomeViewProps) => {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <section className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-white border-border">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Indeks Penguasaan</span>
          </div>
          <div className="text-2xl font-bold text-text-dark">84%</div>
          <div className="text-[10px] text-text-muted">+5.2% drift sesi</div>
        </Card>
        <Card className="p-4 bg-white border-border">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Perpustakaan Kata</span>
          </div>
          <div className="text-2xl font-bold text-text-dark">1,480</div>
          <div className="text-[10px] text-text-muted">Level 5 Tercapai</div>
        </Card>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3 ltr-text px-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-muted" />
            <h2 className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Registri Kata Kerja</h2>
          </div>
          <Button variant="ghost" className="text-[11px] font-bold text-primary px-2 py-1">Ekspor Data</Button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {verbs.filter(v => v.past.includes(searchQuery) || v.translationId.includes(searchQuery)).map((verb) => (
            <VerbCard key={verb.id} verb={verb} onClick={handleVerbSelect} />
          ))}
        </div>
      </section>

      <section className="bg-primary rounded-3xl p-6 text-white overflow-hidden relative shadow-lg shadow-primary/20">
        <div className="relative z-10">
          <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full mb-3 inline-block uppercase tracking-widest">Modul Terpilih</span>
          <h3 className="text-xl font-bold mb-2 arabic-serif leading-tight">تَصْرِيفُ المِثَال (Logika Mithal)</h3>
          <p className="text-xs text-white/80 mb-5 leading-relaxed">Pelajari bagaimana huruf &quot;Waw&quot; dihilangkan dalam penggunaan bahasa Arab standar.</p>
          <Button onClick={() => setActiveTab('guide')} variant="secondary" className="w-full py-3.5 border-none shadow-md">Pelajari Sekarang</Button>
        </div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </section>
    </motion.div>
  );
};
