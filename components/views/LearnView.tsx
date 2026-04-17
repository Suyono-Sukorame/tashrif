import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';
import { type Verb } from '@/lib/db';
import { conjugate, type Tense } from '@/lib/conjugator';
import { GoogleGenAI } from "@google/genai";

interface LearnViewProps {
  verb: Verb;
  onBack: () => void;
  onStartQuiz: () => void;
}

export const LearnView = ({ verb, onBack, onStartQuiz }: LearnViewProps) => {
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
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
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
};
