import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, User, Volume2, Zap, Download, Trash2, Moon, Sun } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

interface SettingsViewProps {
  onBack: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const SettingsView = ({ onBack, darkMode, setDarkMode }: SettingsViewProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold dark:text-dark-text">Registri & Profil</h2>
        <Button onClick={onBack} variant="ghost" className="p-2"><ChevronRight className="dark:text-dark-text" /></Button>
      </header>

      <section className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-border dark:border-dark-border shadow-sm text-center">
        <div className="w-20 h-20 bg-stone-100 dark:bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white dark:border-slate-700 shadow-inner">
          <User className="w-10 h-10 text-stone-400 dark:text-slate-500" />
        </div>
        <h3 className="font-bold text-lg dark:text-dark-text">Hafizh Arab</h3>
        <p className="text-xs text-text-muted dark:text-slate-400">ID: 884-291-NLP</p>
        <div className="flex justify-center gap-4 mt-4">
          <div className="text-center">
             <div className="text-lg font-bold text-primary dark:text-emerald-400">42</div>
             <div className="text-[10px] uppercase font-bold text-text-muted dark:text-slate-400">Mastered</div>
          </div>
          <div className="w-[1px] bg-border dark:bg-slate-700 h-8 self-center"></div>
          <div className="text-center">
             <div className="text-lg font-bold text-accent dark:text-orange-400">128</div>
             <div className="text-[10px] uppercase font-bold text-text-muted dark:text-slate-400">Learning</div>
          </div>
        </div>
      </section>

      <div className="space-y-3">
        <h4 className="text-[10px] font-bold uppercase text-text-muted dark:text-slate-400 tracking-widest px-2">Preferensi Belajar</h4>
        <Card className="divide-y divide-border dark:divide-dark-border">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-4 h-4 text-primary dark:text-emerald-400" />
              <span className="text-sm font-medium dark:text-dark-text">Mode Gelap</span>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={cn(
                "w-10 h-5 rounded-full relative transition-colors duration-200",
                darkMode ? "bg-primary" : "bg-stone-200"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200",
                darkMode ? "right-1" : "left-1"
              )}></div>
            </button>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-primary dark:text-emerald-400" />
              <span className="text-sm font-medium dark:text-dark-text">Bicara Otomatis</span>
            </div>
            <div className="w-10 h-5 bg-primary rounded-full relative">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-accent dark:text-orange-400" />
              <span className="text-sm font-medium dark:text-dark-text">Mode Tantangan</span>
            </div>
            <div className="w-10 h-5 bg-stone-200 dark:bg-slate-700 rounded-full relative">
              <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-bold uppercase text-text-muted tracking-widest px-2">Data Pengguna</h4>
        <Card className="divide-y divide-border">
          <button className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-left">Ekspor Progres (.json)</span>
            </div>
          </button>
          <button className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
             <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-500 text-left">Reset Leksikon</span>
            </div>
          </button>
        </Card>
      </div>
    </motion.div>
  );
};
