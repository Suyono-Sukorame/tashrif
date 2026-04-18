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
      <div className="flex items-center justify-between mb-3">
        {/* Menu di Kiri */}
        {activeTab === 'quiz' ? (
          <div className="w-10" /> // Spacer
        ) : (
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
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, x: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, x: -10, scale: 0.95 }}
                    className="absolute left-0 mt-2 w-[50vw] min-w-[200px] bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-2 space-y-1">
                      <div className="px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">Menu Navigasi</div>
                      {menuItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id as ActiveTab);
                            setIsMenuOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors",
                            activeTab === item.id 
                              ? "bg-primary-light dark:bg-emerald-950/50 text-primary dark:text-emerald-400" 
                              : "text-text-dark dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-800"
                          )}
                        >
                          <span className={cn(activeTab === item.id ? "text-primary dark:text-emerald-400" : "text-text-muted")}>
                            {item.icon}
                          </span>
                          {item.label}
                        </button>
                      ))}
                      <div className="border-t border-border dark:border-dark-border my-1" />
                      <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-text-muted hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors">
                        <Info className="w-4 h-4" />
                        Tentang Aplikasi
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Logo di Kanan/Tengah */}
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold dark:text-dark-text tracking-tight">Tashrif<span className="text-primary dark:text-emerald-400">Master</span></h1>
          <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">ت</div>
        </div>

        {activeTab === 'quiz' && (
          <div className="text-xs font-bold text-primary dark:text-emerald-400 bg-primary-light dark:bg-emerald-950 px-2 py-1 rounded">Mode Kuis</div>
        )}
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
