'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, Settings, History, Zap } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { db, seedVerbs, type Verb } from '@/lib/db';
import { conjugate, DHAMIRS } from '@/lib/conjugator';
import { type ActiveTab, type QuizQuestion } from '@/lib/types';
import { cn } from '@/lib/utils';

// Components
import { Header } from '@/components/Header';
import { NavButton } from '@/components/ui/NavButton';
import { HomeView } from '@/components/views/HomeView';
import { LearnView } from '@/components/views/LearnView';
import { AIView } from '@/components/views/AIView';
import { QuizView } from '@/components/views/QuizView';
import { SettingsView } from '@/components/views/SettingsView';
import { AccessView } from '@/components/views/AccessView';
import { GuideView } from '@/components/views/GuideView';

// --- Main App ---

export default function TashrifApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerb, setSelectedVerb] = useState<Verb | null>(null);
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  
  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const init = async () => {
      await seedVerbs();
      const allVerbs = await db.verbs.toArray();
      setVerbs(allVerbs);
      setLoading(false);
    };
    init();
  }, []);

  const handleVerbSelect = (verb: Verb) => {
    setSelectedVerb(verb);
    setActiveTab('learn');
  };

  const startQuiz = (verb: Verb) => {
    // Generate Dynamic Questions
    const madi = conjugate(verb.past, verb.present, 'past');
    const mudhari = conjugate(verb.past, verb.present, 'present');
    const amr = conjugate(verb.past, verb.present, 'imperative').filter(x => x.value !== '-');
    
    const genQuestions: QuizQuestion[] = [
      { 
        q: `Manakah bentuk Madi (Lampau) untuk '${DHAMIRS[6].ar}' (${DHAMIRS[6].en})?`, 
        options: [madi[6].value, madi[0].value, mudhari[6].value, 'قَائِل'].sort(() => Math.random() - 0.5),
        correct: madi[6].value 
      },
      { 
        q: `Manakah bentuk Mudhari' (Sekarang) untuk '${DHAMIRS[13].ar}' (${DHAMIRS[13].en})?`, 
        options: [mudhari[13].value, mudhari[0].value, madi[13].value, 'نَقَعَ'].sort(() => Math.random() - 0.5),
        correct: mudhari[13].value 
      },
      { 
        q: amr.length > 0 ? `Bentuk Amr (Perintah) untuk '${DHAMIRS[6].ar}' adalah?` : `Apa jenis fi'il dari '${verb.past}'?`, 
        options: amr.length > 0 ? [amr[0].value, amr[1].value, madi[6].value, 'يَقَعْ'].sort(() => Math.random() - 0.5) : ['Shahih', 'Mithal', 'Ajwaf', 'Naqis'],
        correct: amr.length > 0 ? amr[0].value : verb.type.charAt(0).toUpperCase() + verb.type.slice(1)
      }
    ];
    setQuizQuestions(genQuestions);
    setActiveTab('quiz');
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-stone-50 text-xs font-bold uppercase tracking-widest text-text-muted">Inisialisasi Leksikon...</div>;

  return (
    <div className={cn(
      "flex flex-col h-screen max-w-md mx-auto overflow-hidden relative shadow-2xl transition-colors duration-300",
      darkMode ? "dark bg-dark-bg" : "bg-stone-50"
    )}>
      <Header 
        activeTab={activeTab} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-y-auto px-6 py-6 pb-24 transition-colors duration-300",
        darkMode ? "bg-dark-bg" : "bg-[#F3F4F6]"
      )}>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <HomeView 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              verbs={verbs}
              handleVerbSelect={handleVerbSelect}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'learn' && selectedVerb && (
            <LearnView verb={selectedVerb} onBack={() => setActiveTab('home')} onStartQuiz={() => startQuiz(selectedVerb)} />
          )}

          {activeTab === 'ai' && (
            <AIView />
          )}

          {activeTab === 'guide' && (
            <GuideView onBack={() => setActiveTab('home')} />
          )}

          {activeTab === 'quiz' && selectedVerb && (
            <QuizView verb={selectedVerb} questions={quizQuestions} onComplete={() => setActiveTab('learn')} />
          )}

          {activeTab === 'settings' && (
            <SettingsView 
              onBack={() => setActiveTab('home')} 
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}

          {activeTab === 'access' && (
            <AccessView onSelectVerb={handleVerbSelect} onBack={() => setActiveTab('home')} />
          )}
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t px-8 py-3 flex items-center justify-between z-30 transition-colors duration-300",
        darkMode ? "bg-dark-card border-dark-border shadow-[0_-4px_12px_rgba(0,0,0,0.2)]" : "bg-white border-border shadow-[0_-4px_12px_rgba(0,0,0,0.03)]"
      )}>
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<History />} label="Koleksi" />
        <NavButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen />} label="Mesin" />
        <div className="relative -top-5">
          <button 
             onClick={() => setActiveTab('ai')}
             className={cn("w-12 h-12 rounded-lg flex items-center justify-center shadow-md transition-all active:scale-90 border", activeTab === 'ai' ? 'bg-accent text-white border-accent' : 'bg-primary text-white border-primary')}
          >
            <Brain className="w-5 h-5" />
          </button>
        </div>
        <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings />} label="Registri" />
        <NavButton active={activeTab === 'access'} onClick={() => setActiveTab('access')} icon={<Zap />} label="Akses" />
      </nav>
    </div>
  );
}
