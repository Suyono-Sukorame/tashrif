import React, { useState } from 'react';
import { Search, Menu, X, Book, Zap, ShieldCheck, Info } from 'lucide-react';
import { type ActiveTab } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header = ({ activeTab, setActiveTab, searchQuery, setSearchQuery }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'guide', label: 'Panduan & Istilah', icon: <Book className="w-4 h-4" /> },
    { id: 'access', label: 'Pusat Akses', icon: <Zap className="w-4 h-4" /> },
    { id: 'admin', label: 'CMS Admin', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <header className="px-6 py-4 bg-white dark:bg-dark-card sticky top-0 z-40 border-b border-border dark:border-dark-border transition-colors duration-300">
      <div className="grid grid-cols-3 items-center mb-3">
        {/* Sisi Kiri: Menu */}
        <div className="flex justify-start">
          {activeTab !== 'quiz' && (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 -ml-2 rounded-full hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-text-muted dark:text-slate-400" />}
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onClick={() => setIsMenuOpen(false)}
                      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    />
                    
                    <motion.div 
                      initial={{ x: '-100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '-100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="fixed left-0 top-0 h-screen w-[70vw] sm:w-[50vw] bg-white/95 dark:bg-dark-card/95 backdrop-blur-2xl border-r border-border dark:border-dark-border shadow-2xl z-50 overflow-hidden flex flex-col"
                    >
                      <div className="p-6 border-b border-border dark:border-dark-border flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">ت</div>
                            <h1 className="text-lg font-bold dark:text-dark-text tracking-tight">Menu</h1>
                         </div>
                         <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors">
                            <X className="w-5 h-5 text-text-muted" />
                         </button>
                      </div>

                      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <div className="px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60">Navigasi Utama</div>
                        {menuItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id as ActiveTab);
                              setIsMenuOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all",
                              activeTab === item.id 
                                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                : "text-text-dark dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-800"
                            )}
                          >
                            <span className={cn(activeTab === item.id ? "text-white" : "text-primary dark:text-emerald-400")}>
                              {item.icon}
                            </span>
                            {item.label}
                          </button>
                        ))}
                        
                        <div className="pt-6">
                          <div className="border-t border-border dark:border-dark-border my-4" />
                          <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-text-muted hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors">
                            <Info className="w-5 h-5 text-accent" />
                            Tentang Aplikasi
                          </button>
                        </div>
                      </div>

                      <div className="p-6 bg-stone-50 dark:bg-slate-900/50 border-t border-border dark:border-dark-border">
                         <p className="text-[9px] text-text-muted dark:text-slate-500 font-bold uppercase text-center tracking-widest">Tashrif Master v4.0.2</p>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Tengah: Logo */}
        <div className="flex justify-center items-center gap-2">
          <h1 className="text-lg font-bold dark:text-dark-text tracking-tight whitespace-nowrap">Tashrif<span className="text-primary dark:text-emerald-400">Master</span></h1>
          <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20 shrink-0">ت</div>
        </div>

        {/* Sisi Kanan: Status Kuis / Spacer */}
        <div className="flex justify-end">
          {activeTab === 'quiz' && (
            <div className="text-[10px] font-bold text-primary dark:text-emerald-400 bg-primary-light dark:bg-emerald-950 px-2 py-1 rounded">KUIS</div>
          )}
        </div>
      </div>
      
      {activeTab === 'home' && (
        <div className="relative group">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-slate-400 transition-colors" />
          <input
            type="text"
            placeholder="Cari akar atau kata kerja Arab..."
            className="w-full pr-10 pl-4 py-2 bg-background dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:bg-white dark:focus:bg-slate-700 transition-all text-right arabic-text dark:text-dark-text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}
    </header>
  );
};
