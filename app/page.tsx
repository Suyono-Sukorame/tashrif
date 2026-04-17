'use client';

import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Search, BookOpen, Brain, Settings, History, Star, ChevronLeft, ChevronRight, Menu, Play, CheckCircle2, AlertCircle, TrendingUp, Award, Clock, User, Download, Trash2, Volume2, Layers, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, seedVerbs, type Verb } from '@/lib/db';
import { conjugate, DHAMIRS, type Tense } from '@/lib/conjugator';
import { useMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// --- Components ---

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white rounded-xl border border-border shadow-sm overflow-hidden", className)}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className, disabled, type = 'button' }: { children: React.ReactNode, onClick?: () => void, variant?: 'primary' | 'secondary' | 'ghost' | 'accent', className?: string, disabled?: boolean, type?: 'button' | 'submit' }) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/95',
    secondary: 'bg-primary-light text-primary hover:bg-emerald-100',
    ghost: 'bg-transparent text-text-muted hover:bg-stone-100',
    accent: 'bg-accent text-white hover:bg-accent/90',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn("px-4 py-2.5 rounded-lg font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 text-sm", variants[variant], className)}
    >
      {children}
    </button>
  );
};

// --- Main App ---

export default function TashrifApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'learn' | 'ai' | 'settings' | 'quiz' | 'guide' | 'access'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerb, setSelectedVerb] = useState<Verb | null>(null);
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Quiz State
  const [quizScore, setQuizScore] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<{q: string, options: string[], correct: string}[]>([]);

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
    // Generate Dynamic Questions in Event Handler
    const madi = conjugate(verb.past, verb.present, 'past');
    const mudhari = conjugate(verb.past, verb.present, 'present');
    const amr = conjugate(verb.past, verb.present, 'imperative').filter(x => x.value !== '-');
    
    const genQuestions = [
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
    setQuizScore(0);
    setActiveTab('quiz');
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-stone-50 overflow-hidden relative shadow-2xl">
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-6 pb-24 bg-[#F3F4F6]">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
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
                    <Card key={verb.id} className="hover:bg-primary-light transition-colors cursor-pointer group active:scale-[0.99] border-border">
                      <div className="p-3 flex items-center justify-between" onClick={() => handleVerbSelect(verb)}>
                        <div className="flex items-center gap-4 text-left w-full">
                          <div className="w-10 h-10 bg-white border border-border rounded-lg flex items-center justify-center text-lg font-bold arabic-serif text-primary shrink-0">
                            {verb.past[0]}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-md font-bold text-text-dark leading-tight text-right arabic-serif" dir="rtl">{verb.past} – {verb.present}</h3>
                            <p className="text-[11px] text-text-muted font-medium text-left mt-1">{verb.translationId} (Wazan {verb.wazan})</p>
                          </div>
                        </div>
                        <Star className={cn("w-4 h-4 ml-2", verb.isFavorite ? "fill-accent text-accent" : "text-stone-300")} />
                      </div>
                    </Card>
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
            <SettingsView onBack={() => setActiveTab('home')} />
          )}

          {activeTab === 'access' && (
            <AccessView onSelectVerb={handleVerbSelect} onBack={() => setActiveTab('home')} />
          )}
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-border px-8 py-3 flex items-center justify-between z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
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

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 group">
      <div className={cn("transition-all duration-300", active ? "text-primary scale-110" : "text-stone-400 group-hover:text-stone-600")}>
        <div className="w-5 h-5 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <span className={cn("text-[10px] font-bold uppercase tracking-tighter transition-all", active ? "opacity-100 text-primary" : "opacity-0 text-stone-400 group-hover:opacity-100")}>{label}</span>
    </button>
  );
}

// --- Specific Views ---

function LearnView({ verb, onBack, onStartQuiz }: { verb: Verb, onBack: () => void, onStartQuiz: () => void }) {
  const [activeTense, setActiveTense] = useState<Tense>('past');
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const conjugations = conjugate(verb.past, verb.present, activeTense);

  const tenses: { id: Tense, label: string }[] = [
    { id: 'past', label: 'Lampau' },
    { id: 'present', label: 'Sekarang' },
    { id: 'future', label: 'Mendatang' },
    { id: 'imperative', label: 'Perintah' },
  ];

  const playAudio = async (text: string, index: number) => {
    setIsSpeaking(index);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: `Katakan dengan jelas dalam bahasa Arab: ${text}` }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }
            }
          }
        }
      });
      
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
        audio.onended = () => setIsSpeaking(null);
        await audio.play();
      }
    } catch (err) {
      console.error(err);
      setIsSpeaking(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <section className="bg-white border border-border rounded-xl p-5 flex justify-between items-center shadow-sm">
        <div className="verb-info">
          <h1 className="text-3xl font-bold text-primary arabic-serif leading-none mb-2">{verb.past} – {verb.present}</h1>
          <div className="flex gap-2">
             <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold uppercase">{verb.type}</span>
             <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold uppercase">Pattern {verb.wazan}</span>
             <span className="text-[11px] text-text-muted">{verb.translationId}</span>
          </div>
        </div>
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-text-muted hover:bg-stone-50">
           <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      <div className="flex gap-1 p-1 bg-white border border-border rounded-xl overflow-x-auto no-scrollbar">
        {tenses.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTense(t.id)}
            className={cn("flex-1 whitespace-nowrap px-3 py-2 rounded-lg text-[11px] font-bold uppercase transition-all tracking-wider", activeTense === t.id ? "bg-primary text-white shadow-sm" : "text-text-muted hover:bg-stone-50")}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="table-container bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 bg-background border-b border-border py-2 text-[10px] font-bold uppercase text-text-muted tracking-widest px-4">
          <div className="col-span-4 border-r border-border pr-2 text-left">Subjek</div>
          <div className="col-span-8 text-right pl-4">Konjugasi Arab</div>
        </div>
        <div className="divide-y divide-border h-[300px] overflow-y-auto">
          {conjugations.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-12 items-center hover:bg-primary-light transition-colors group"
            >
              <div className="col-span-4 bg-stone-50/50 py-2.5 px-4 text-[12px] text-text-muted border-r border-border h-full flex flex-col justify-center text-left">
                <span className="font-bold text-primary">{c.dhamir}</span>
                <span className="text-[10px] opacity-70">{c.pronoun}</span>
              </div>
              <div className="col-span-8 flex justify-end items-center px-4 py-2.5 gap-4">
                 <div className="text-xl font-bold arabic-serif text-primary" dir="rtl">
                    {c.parts.map((p, pIdx) => (
                      <span key={pIdx} className={cn(
                        p.type === 'prefix' ? "text-accent" : 
                        p.type === 'suffix' ? "text-accent" : 
                        "text-primary"
                      )}>
                        {p.text}
                      </span>
                    ))}
                 </div>
                 <button 
                  onClick={() => playAudio(c.value, i)}
                  className={cn("p-1.5 rounded bg-background border border-border text-text-muted transition-all", isSpeaking === i ? "text-accent border-accent animate-pulse" : "opacity-0 group-hover:opacity-100 hover:text-primary hover:border-primary")}
                 >
                    <Play className="w-3 h-3 fill-current" />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="pb-8 grid grid-cols-2 gap-3">
        <Button onClick={onStartQuiz} variant="primary" className="py-3.5 shadow-lg shadow-primary/10">Latihan</Button>
        <Button variant="ghost" className="py-3.5 bg-white border border-border">Simpan Rumus</Button>
      </div>
    </motion.div>
  );
}

function QuizView({ verb, questions, onComplete }: { verb: Verb, questions: { q: string, options: string[], correct: string }[], onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = async (opt: string) => {
    setSelectedAnswer(opt);
    let newScore = score;
    if (opt === questions[step].correct) {
      newScore = score + 1;
      setScore(newScore);
    }
    
    setTimeout(async () => {
      if (step < questions.length - 1) {
        setStep(s => s + 1);
        setSelectedAnswer(null);
      } else {
        // Save Progress
        if (verb.id) {
          const actualScore = Math.round((newScore / questions.length) * 100);
          await db.progress.add({
            verbId: verb.id,
            score: actualScore,
            attempts: 1,
            lastPracticed: Date.now()
          });
        }
        setShowResult(true);
      }
    }, 800);
  };

  if (!questions.length) return <div className="p-8 text-center text-text-muted">Menyiapkan Latihan...</div>;

  if (showResult) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 pt-10">
        <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center mx-auto text-3xl font-bold border-8 border-primary-light">
          {Math.round((score / questions.length) * 100)}%
        </div>
        <div>
          <h2 className="text-xl font-bold">Latihan Selesai!</h2>
          <p className="text-sm text-text-muted mt-2">Anda berhasil menjawab {score} dari {questions.length} pertanyaan.</p>
        </div>
        <Button onClick={onComplete} variant="primary" className="w-full py-4">Kembali ke Engine</Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-muted">
         <span>Langkah {step + 1} dari {questions.length}</span>
      </div>
      <Card className="p-8 border-border shadow-md bg-white">
        <h3 className="text-lg font-bold text-left leading-relaxed text-text-dark border-l-4 border-accent pl-4">{questions[step].q}</h3>
      </Card>
      <div className="grid grid-cols-1 gap-3">
        {questions[step].options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            disabled={selectedAnswer !== null}
            className={cn(
              "p-4 rounded-xl border border-border text-right font-bold transition-all flex items-center justify-between gap-4",
              selectedAnswer === opt ? (opt === questions[step].correct ? "bg-primary text-white border-primary" : "bg-red-50 text-red-700 border-red-200") : "bg-white hover:border-primary",
              selectedAnswer !== null && opt === questions[step].correct ? "bg-primary text-white border-primary" : ""
            )}
            dir="rtl"
          >
            <span className="arabic-serif text-xl">{opt}</span>
            <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center shrink-0", selectedAnswer === opt ? "bg-white text-primary" : "border-stone-200")}>
               {selectedAnswer === opt && (opt === questions[step].correct ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3 text-red-500" />)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AIView() {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);

  const handleAnalyse = async () => {
    if (!input) return;
    setIsAnalysing(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the verb: ${input}`,
        config: {
            systemInstruction: "Anda adalah pakar tata bahasa Arab. Analisis kata kerja yang diberikan dalam bahasa Arab. Sediakan akar (root), wazan, tipe (Shahih/Mithal/dll), dan arti dalam bahasa Indonesia. Kembalikan dalam format JSON.",
            responseMimeType: "application/json"
        }
      });
      setAnalysis(response.text ?? null);
    } catch (error) {
      console.error(error);
      setAnalysis(JSON.stringify({ error: "Could not connect to AI. Please check your API key." }));
    } finally {
      setIsAnalysing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="bg-white border border-border rounded-xl p-6 text-center shadow-sm">
        <div className="w-16 h-16 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold">Mesin Kecerdasan Tata Bahasa</h2>
        <p className="text-xs text-text-muted mt-1 uppercase tracking-wider font-bold">Modul NLP Enterprise v2.4</p>
      </div>

      <Card className="p-6 border-border shadow-md">
        <div className="text-[11px] font-bold text-text-muted uppercase mb-3 tracking-widest text-left pl-1">Input Pertanyaan</div>
        <textarea
          placeholder="Masukkan huruf akar atau frase kata kerja lengkap..."
          className="w-full h-32 p-4 bg-background border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary resize-none transition-all text-left"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button 
          variant="primary" 
          className="w-full mt-4 py-3.5" 
          onClick={handleAnalyse}
          disabled={isAnalysing}
        >
          {isAnalysing ? "Memproses Leksikon..." : "Kirim Pertanyaan ke Mesin"}
        </Button>
      </Card>

      {analysis && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-1 border-primary/20 bg-primary-light">
             <div className="bg-white p-4 rounded-lg flex items-start gap-3 border border-border">
               <div className="mt-1"><CheckCircle2 className="w-4 h-4 text-primary" /></div>
               <div className="text-sm font-medium text-text-dark leading-relaxed">
                  <pre className="whitespace-pre-wrap font-sans text-xs text-text-muted">{analysis}</pre>
               </div>
             </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

function GuideView({ onBack }: { onBack: () => void }) {
  // ... (existing terms)
  const terms = [
    { title: 'Shahih', desc: 'Kata kerja yang semua huruf akarnya adalah huruf asli dan bukan huruf penyakit (Alif, Waw, Ya).' },
    { title: 'Mithal', desc: 'Kata kerja yang huruf pertama akarnya adalah huruf penyakit (biasanya Waw).' },
    { title: 'Ajwaf', desc: 'Kata kerja yang huruf tengah akarnya adalah huruf penyakit.' },
    { title: 'Naqis', desc: 'Kata kerja yang huruf terakhir akarnya adalah huruf penyakit.' },
    { title: 'Wazan', desc: 'Pola atau rumus timbangan kata dalam bahasa Arab.' },
    { title: 'Tasrif', desc: 'Perubahan kata dari satu bentuk ke bentuk lain sesuai waktu dan subjek.' },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Pusat Panduan & Istilah</h2>
        <Button onClick={onBack} variant="ghost" className="p-2"><ChevronRight /></Button>
      </div>
      <div className="grid grid-cols-1 gap-3 pb-20">
        {terms.map((t, i) => (
          <Card key={i} className="p-4 bg-white">
            <h4 className="font-bold text-primary mb-1">{t.title}</h4>
            <p className="text-xs text-text-muted leading-relaxed">{t.desc}</p>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

function SettingsView({ onBack }: { onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Registri & Profil</h2>
        <Button onClick={onBack} variant="ghost" className="p-2"><ChevronRight /></Button>
      </header>

      <section className="bg-white p-6 rounded-3xl border border-border shadow-sm text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-inner">
          <User className="w-10 h-10 text-stone-400" />
        </div>
        <h3 className="font-bold text-lg">Hafizh Arab</h3>
        <p className="text-xs text-text-muted">ID: 884-291-NLP</p>
        <div className="flex justify-center gap-4 mt-4">
          <div className="text-center">
             <div className="text-lg font-bold text-primary">42</div>
             <div className="text-[10px] uppercase font-bold text-text-muted">Mastered</div>
          </div>
          <div className="w-[1px] bg-border h-8 self-center"></div>
          <div className="text-center">
             <div className="text-lg font-bold text-accent">128</div>
             <div className="text-[10px] uppercase font-bold text-text-muted">Learning</div>
          </div>
        </div>
      </section>

      <div className="space-y-3">
        <h4 className="text-[10px] font-bold uppercase text-text-muted tracking-widest px-2">Preferensi Belajar</h4>
        <Card className="divide-y divide-border">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Bicara Otomatis</span>
            </div>
            <div className="w-10 h-5 bg-primary rounded-full relative">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Mode Tantangan</span>
            </div>
            <div className="w-10 h-5 bg-stone-200 rounded-full relative">
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
}

function AccessView({ onSelectVerb, onBack }: { onSelectVerb: (v: Verb) => void, onBack: () => void }) {
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
           <Layers className="w-5 h-5 text-primary" />
           <h2 className="text-xl font-bold">Portal Akses Cepat</h2>
        </div>
        <Button onClick={onBack} variant="ghost" className="p-2"><ChevronRight /></Button>
      </header>

      <section className="grid grid-cols-2 gap-3">
         <button className="p-4 bg-white border border-border rounded-2xl text-left hover:border-primary transition-all">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
               <History className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">Terakhir</div>
            <div className="text-sm font-bold">Kilas Balik Sesi</div>
         </button>
         <button className="p-4 bg-white border border-border rounded-2xl text-left hover:border-accent transition-all">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center mb-3">
               <Star className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">Unggulan</div>
            <div className="text-sm font-bold">Koleksi Bintang</div>
         </button>
      </section>

      <div>
        <h4 className="text-[10px] font-bold uppercase text-text-muted tracking-widest mb-3 px-1">Markah Kata Terpilih</h4>
        {loading ? (
          <div className="p-10 text-center text-xs text-text-muted">Sinkronisasi Metadata...</div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {favorites.map(v => (
               <Card key={v.id} className="hover:border-primary transition-all cursor-pointer">
                  <div className="p-3 flex items-center justify-between" onClick={() => onSelectVerb(v)}>
                    <div className="flex items-center gap-4 text-left w-full">
                       <div className="w-9 h-9 bg-primary-light rounded-lg flex items-center justify-center text-md font-bold arabic-serif text-primary">
                          {v.past[0]}
                       </div>
                       <div className="flex-1">
                          <h3 className="text-sm font-bold text-text-dark text-right arabic-serif" dir="rtl">{v.past}</h3>
                          <p className="text-[10px] text-text-muted mt-0.5">{v.translationId}</p>
                       </div>
                    </div>
                  </div>
               </Card>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-border">
             <Star className="w-8 h-8 text-stone-200 mx-auto mb-3" />
             <p className="text-xs text-text-muted leading-relaxed">Belum ada kata kerja yang ditandai. Berikan bintang pada kata kerja untuk akses instan di sini.</p>
          </div>
        )}
      </div>

      <section className="bg-stone-900 rounded-2xl p-6 text-white">
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
}
