import React from 'react';
import { Search, Menu } from 'lucide-react';
import { type ActiveTab } from '@/lib/types';

interface HeaderProps {
  activeTab: ActiveTab;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header = ({ activeTab, searchQuery, setSearchQuery }: HeaderProps) => {
  return (
    <header className="px-6 py-4 bg-white sticky top-0 z-20 border-b border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-lg">ت</div>
          <h1 className="text-lg font-bold">Tashrif<span className="text-primary">Master</span></h1>
        </div>
        {activeTab === 'quiz' ? (
          <div className="text-xs font-bold text-primary bg-primary-light px-2 py-1 rounded">Mode Kuis</div>
        ) : (
          <button className="p-2 rounded-full hover:bg-stone-100">
            <Menu className="w-5 h-5 text-text-muted" />
          </button>
        )}
      </div>
      
      {activeTab === 'home' && (
        <div className="relative group">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted transition-colors" />
          <input
            type="text"
            placeholder="Cari akar atau kata kerja Arab..."
            className="w-full pr-10 pl-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary focus:bg-white transition-all text-right arabic-text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}
    </header>
  );
};
