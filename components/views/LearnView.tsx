import React, { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { cn } from '@/lib/utils';
import { db, type Verb } from '@/lib/db';
import { conjugate, type Tense, getIshtilahy } from '@/lib/conjugator';
import { GoogleGenAI } from "@google/genai";
import { IshtilahySummary } from '../IshtilahySummary';
import { TextLTR, TextRTL } from '../ui/Typography';

interface LearnViewProps {
  verb: Verb;
  onBack: () => void;
  onStartQuiz: () => void;
}

export const LearnView = ({ verb, onBack, onStartQuiz }: LearnViewProps) => {
  const [activeTense, setActiveTense] = useState<Tense>('past');
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  
  const conjugations = activeTense !== 'ishtilahy' ? conjugate(verb.past, verb.present, activeTense) : [];

  const tenses: { id: Tense, label: string }[] = [
    { id: 'past', label: 'Madhi' },
    { id: 'present', label: 'Mudhari' },
    { id: 'ishtilahy', label: 'Ringkasan' },
    { id: 'imperative', label: 'Amr' },
  ];

  const playAudio = async (text: string, index: number) => {
    setIsSpeaking(index);
    try {
      const client = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      const response = await client.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ role: 'user', parts: [{ text: `Katakan dengan jelas dalam bahasa Arab: ${text}` }] }],
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
      <section className="bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-xl p-5 flex justify-between items-center shadow-sm transition-colors duration-300">
        <div className="verb-info overflow-hidden">
          <TextRTL as="h1" className="text-3xl font-bold text-primary dark:text-emerald-400 leading-none mb-2">
            {verb.past} – {verb.present}
          </TextRTL>
          <TextLTR className="flex flex-wrap gap-2">
             <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-bold uppercase">{verb.type}</span>
             <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold uppercase">Pattern {verb.wazan}</span>
             <span className="text-[11px] text-text-muted dark:text-slate-400 truncate">{verb.translationId}</span>
          </TextLTR>
        </div>
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-background dark:bg-slate-800 border border-border dark:border-slate-700 flex items-center justify-center text-text-muted dark:text-slate-400 hover:bg-stone-50 dark:hover:bg-slate-700 shrink-0">
           <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      <div className="flex gap-1 p-1 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-xl overflow-x-auto no-scrollbar transition-colors duration-300">
        {tenses.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTense(t.id)}
            className={cn("flex-1 whitespace-nowrap px-3 py-2 rounded-lg text-[11px] font-bold uppercase transition-all tracking-wider", activeTense === t.id ? "bg-primary text-white shadow-sm" : "text-text-muted dark:text-slate-400 hover:bg-stone-50 dark:hover:bg-slate-800")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTense === 'ishtilahy' ? (
        <IshtilahySummary verb={verb} />
      ) : (
        <div className="table-container bg-white dark:bg-dark-card rounded-xl border border-border dark:border-dark-border overflow-hidden shadow-sm transition-colors duration-300">
          <div className="grid grid-cols-12 bg-background dark:bg-slate-800 border-b border-border dark:border-dark-border py-2 text-[10px] font-bold uppercase text-text-muted dark:text-slate-400 tracking-widest px-4">
            <TextLTR className="col-span-4 border-r border-border dark:border-dark-border pr-2">Subjek</TextLTR>
            <TextRTL className="col-span-8 pl-4">Konjugasi Arab</TextRTL>
          </div>
          <div className="divide-y divide-border dark:divide-dark-border h-[300px] overflow-y-auto">
            {conjugations.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-12 items-center hover:bg-primary-light dark:hover:bg-emerald-950/20 transition-colors group"
              >
                <TextLTR className="col-span-4 bg-stone-50/50 dark:bg-slate-800/50 py-2.5 px-4 text-[12px] text-text-muted dark:text-slate-400 border-r border-border dark:border-dark-border h-full flex flex-col justify-center">
                  <span className="font-bold text-primary dark:text-emerald-400">{c.dhamir}</span>
                  <span className="text-[10px] opacity-70">{c.pronoun}</span>
                </TextLTR>
                <div className="col-span-8 flex justify-end items-center px-4 py-2.5 gap-4">
                   <TextRTL className="text-xl font-bold text-primary dark:text-emerald-400">
                      {c.parts.map((p, pIdx) => (
                        <span key={pIdx} className={cn(
                          p.type === 'prefix' ? "text-accent dark:text-orange-400" : 
                          p.type === 'suffix' ? "text-accent dark:text-orange-400" : 
                          "text-primary dark:text-emerald-400"
                        )}>
                          {p.text}
                        </span>
                      ))}
                   </TextRTL>
                   <button 
                    onClick={() => playAudio(c.value, i)}
                    className={cn("p-1.5 rounded bg-background dark:bg-slate-800 border border-border dark:border-slate-700 text-text-muted dark:text-slate-400 transition-all", isSpeaking === i ? "text-accent border-accent animate-pulse" : "opacity-0 group-hover:opacity-100 hover:text-primary dark:hover:text-emerald-400 hover:border-primary dark:hover:border-emerald-400")}
                   >
                      <Play className="w-3 h-3 fill-current" />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {verb.examples && verb.examples.length > 0 && (
        <section className="space-y-2">
          <h4 className="text-[10px] font-bold uppercase text-text-muted dark:text-slate-400 tracking-widest px-1">Contoh Penggunaan</h4>
          <div className="space-y-2">
            {verb.examples.map((ex, idx) => (
              <Card key={idx} className="p-4 bg-white dark:bg-dark-card border-border dark:border-dark-border">
                <p className="text-right text-lg font-bold arabic-serif text-text-dark dark:text-dark-text" dir="rtl">{ex.ar}</p>
                <p className="text-left text-[11px] text-text-muted dark:text-slate-400 mt-2 font-medium italic">&quot;{ex.id}&quot;</p>
              </Card>
            ))}
          </div>
        </section>
      )}
      
      <div className="pb-8 grid grid-cols-2 gap-3">
        <Button onClick={onStartQuiz} variant="primary" className="py-3.5 shadow-lg shadow-primary/10">Latihan</Button>
        <Button 
          onClick={async () => {
            if (verb.id) {
              const newFav = !verb.isFavorite;
              await db.verbs.update(verb.id, { isFavorite: newFav });
              
              // Push to Cloud
              const { pushFavoriteToCloud } = await import('@/lib/sync');
              await pushFavoriteToCloud(verb.id, newFav);

              toast.success(newFav ? "Disimpan ke Koleksi" : "Dihapus dari Koleksi");
              setTimeout(() => window.location.reload(), 1000);
            }
          }}
          variant="ghost" 
          className={cn("py-3.5 bg-white dark:bg-dark-card border border-border dark:border-dark-border", verb.isFavorite && "text-accent border-accent")}
        >
          {verb.isFavorite ? "Hapus Rumus" : "Simpan Rumus"}
        </Button>
      </div>
    </motion.div>
  );
};
