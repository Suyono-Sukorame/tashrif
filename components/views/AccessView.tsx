import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Layers, History, Star } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { VerbCard } from '../VerbCard';
import { db, type Verb } from '@/lib/db';

interface AccessViewProps {
  onSelectVerb: (v: Verb) => void;
  onBack: () => void;
}

export const AccessView = ({ onSelectVerb, onBack }: AccessViewProps) => {
  const [favorites, setFavorites] = useState<Verb[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavs = async () => {
      const allFavs = await db.verbs.filter(v => v.isFavorite || false).toArray();
      setFavorites(allFavs);
      setLoading(false);
    };
    fetchFavs();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Layers className="w-5 h-5 text-primary dark:text-emerald-400" />
           <h2 className="text-xl font-bold dark:text-dark-text">Portal Akses Cepat</h2>
        </div>
        <Button onClick={onBack} variant="ghost" className="p-2"><ChevronRight className="dark:text-dark-text" /></Button>
      </header>

      <section className="grid grid-cols-2 gap-3">
         <button className="p-4 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl text-left hover:border-primary transition-all group">
            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-center justify-center mb-3">
               <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-text-muted dark:text-slate-400 mb-1">Terakhir</div>
            <div className="text-sm font-bold dark:text-dark-text">Kilas Balik Sesi</div>
         </button>
         <button className="p-4 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl text-left hover:border-accent transition-all group">
            <div className="w-8 h-8 bg-orange-50 dark:bg-orange-950 rounded-lg flex items-center justify-center mb-3">
               <Star className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-text-muted dark:text-slate-400 mb-1">Unggulan</div>
            <div className="text-sm font-bold dark:text-dark-text">Koleksi Bintang</div>
         </button>
      </section>

      <div>
        <h4 className="text-[10px] font-bold uppercase text-text-muted dark:text-slate-400 tracking-widest mb-3 px-1">Markah Kata Terpilih</h4>
        {loading ? (
          <div className="p-10 text-center text-xs text-text-muted dark:text-slate-500">Sinkronisasi Metadata...</div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {favorites.map(v => (
               <VerbCard key={v.id} verb={v} onClick={onSelectVerb} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-dark-card rounded-3xl border border-dashed border-border dark:border-dark-border">
             <Star className="w-8 h-8 text-stone-200 dark:text-slate-700 mx-auto mb-3" />
             <p className="text-xs text-text-muted dark:text-slate-500 leading-relaxed">Belum ada kata kerja yang ditandai. Berikan bintang pada kata kerja untuk akses instan di sini.</p>
          </div>
        )}
      </div>

      <section className="bg-stone-900 dark:bg-slate-950 rounded-2xl p-6 text-white border border-white/5 dark:border-slate-800">
         <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4">Informasi Sistem</h4>
         <div className="space-y-3">
            <div className="flex justify-between text-xs">
               <span className="text-white/60">Engine Version</span>
               <span className="font-mono">v2.8.4-stable</span>
            </div>
            <div className="flex justify-between text-xs">
               <span className="text-white/60">Local Database</span>
               <span className="font-mono">IndexedDB/Dexie</span>
            </div>
            <div className="flex justify-between text-xs">
               <span className="text-white/60">Last Sync</span>
               <span className="font-mono">Just now</span>
            </div>
         </div>
      </section>
    </motion.div>
  );
};
