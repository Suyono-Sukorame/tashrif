'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, Settings, Library, Zap, Save } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { db, seedVerbs, type Verb } from '@/lib/db';
import { conjugate, DHAMIRS } from '@/lib/conjugator';
import { type ActiveTab, type QuizQuestion } from '@/lib/types';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { VerbCard } from '@/components/VerbCard';

// Components
import { Header } from '@/components/Header';
import { NavButton } from '@/components/ui/NavButton';
import { HomeView } from '@/components/views/HomeView';
import { LearnView } from '@/components/views/LearnView';
import { AIView } from '@/components/views/AIView';
import { QuizView } from '@/components/views/QuizView';
import { AuthView } from '@/components/views/AuthView';
import { AdminView } from '@/components/views/AdminView';
import { SettingsView } from '@/components/views/SettingsView';
import { AccessView } from '@/components/views/AccessView';
import { GuideView } from '@/components/views/GuideView';

// --- Main App ---

export default function TashrifApp() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const isAdmin = session?.user?.email === 'admin@tashrif.com'; // Admin toggle
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerb, setSelectedVerb] = useState<Verb | null>(null);
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ mastery: 0, count: 0 });
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
      // Auth Check
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      await seedVerbs();
      const allVerbs = await db.verbs.toArray();
      const allProgress = await db.progress.toArray();
      
      const avgMastery = allProgress.length > 0 
        ? Math.round(allProgress.reduce((acc, p) => acc + p.score, 0) / allProgress.length)
        : 0;

      setVerbs(allVerbs);
      setStats({
        mastery: avgMastery,
        count: allVerbs.length
      });
      setLoading(false);
      
      // Background Sync
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        import('@/lib/sync').then(m => m.syncWithCloud());
      }
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
  if (!session) return <AuthView />;

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
              key="home"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              verbs={verbs}
              handleVerbSelect={handleVerbSelect}
              setActiveTab={setActiveTab}
              stats={stats}
            />
          )}

          {activeTab === 'learn' && (
            selectedVerb ? (
              <LearnView key="learn" verb={selectedVerb} onBack={() => setSelectedVerb(null)} onStartQuiz={() => startQuiz(selectedVerb)} />
            ) : (
              <div key="select-verb" className="space-y-4">
                <div className="flex items-center justify-between px-1">
                   <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted dark:text-slate-400">Pilih Kata Kerja</h2>
                </div>
                <div className="grid grid-cols-1 gap-2">
                   {verbs.filter(v => v.past.includes(searchQuery) || v.translationId.includes(searchQuery)).map((verb) => (
                     <VerbCard key={verb.id} verb={verb} onClick={handleVerbSelect} />
                   ))}
                </div>
              </div>
            )
          )}

          {activeTab === 'ai' && (
            <AIView key="ai" />
          )}

          {activeTab === 'guide' && (
            <GuideView key="guide" onBack={() => setActiveTab('home')} />
          )}

          {activeTab === 'quiz' && selectedVerb && (
            <QuizView key="quiz" verb={selectedVerb} questions={quizQuestions} onComplete={() => setActiveTab('learn')} />
          )}

          {activeTab === 'settings' && (
            <SettingsView 
              key="settings"
              onBack={() => setActiveTab('home')} 
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}

          {activeTab === 'access' && (
            <AccessView key="access" onSelectVerb={handleVerbSelect} onBack={() => setActiveTab('home')} />
          )}

          {activeTab === 'admin' && isAdmin && (
            <AdminView key="admin" />
          )}
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t px-8 py-3 flex items-center justify-between z-30 transition-colors duration-300",
        darkMode ? "bg-dark-card border-dark-border shadow-[0_-4px_12px_rgba(0,0,0,0.2)]" : "bg-white border-border shadow-[0_-4px_12px_rgba(0,0,0,0.03)]"
      )}>
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Library />} label="Koleksi" />
        <NavButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen />} label="Tashrif" />
        <div className="relative -top-5">
          <button 
             onClick={() => setActiveTab('ai')}
             className={cn(
               "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 border-4", 
               activeTab === 'ai' 
                 ? "bg-accent text-white border-accent" 
                 : (darkMode ? "bg-slate-800 text-emerald-400 border-dark-bg" : "bg-primary text-white border-[#F3F4F6]")
             )}
          >
            <Brain className="w-6 h-6" />
          </button>
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-text-muted dark:text-slate-500 uppercase tracking-tighter">Mesin</span>
        </div>
        <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings />} label="Profil" />
        {isAdmin ? (
          <NavButton active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} icon={<Save />} label="CMS" />
        ) : (
          <NavButton active={activeTab === 'access'} onClick={() => setActiveTab('access')} icon={<Zap />} label="Akses" />
        )}
      </nav>
    </div>
  );
}
