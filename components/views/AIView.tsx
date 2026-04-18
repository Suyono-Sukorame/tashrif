import React, { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Brain, CheckCircle2, Loader2, Send } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/lib/utils';
import { db } from '@/lib/db';

export const AIView = () => {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);

  const handleAnalyse = async () => {
    if (!input) return;
    setIsAnalysing(true);
    setAnalysis(null);
    
    try {
      const client = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      
      const prompt = `Analisis kata kerja atau akar kata Arab berikut: "${input}". 
      Sediakan informasi berikut dalam format JSON:
      {
        "root": "akar kata",
        "past": "bentuk fiil madhi (past)",
        "present": "bentuk fiil mudhari (present)",
        "wazan": "pola wazan",
        "type": "tipe kata (Shahih, Mithal, dll)",
        "meaning": "arti dalam bahasa Indonesia",
        "explanation": "penjelasan singkat tentang penggunaan atau karakteristik unik kata ini"
      }`;

      const response = await client.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setAnalysis(JSON.parse(text));
      } else {
        throw new Error("Respons kosong dari AI");
      }
    } catch (error) {
      console.error(error);
      setAnalysis({ error: "Gagal menghubungkan ke Mesin Kecerdasan. Periksa koneksi atau kunci API Anda." });
    } finally {
      setIsAnalysing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 pb-24"
    >
      <div className="bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-3xl p-8 text-center shadow-sm transition-colors duration-300">
        <div className="w-16 h-16 bg-primary-light dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100 dark:border-emerald-800/50 shadow-inner">
          <Brain className="w-8 h-8 text-primary dark:text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold dark:text-dark-text">Mesin Kecerdasan Leksikon</h2>
        <p className="text-[10px] text-text-muted dark:text-slate-500 mt-2 uppercase tracking-[0.2em] font-bold">Neural Arabic Engine v4.0</p>
      </div>

      <Card className="p-6 border-border dark:border-dark-border shadow-md bg-white dark:bg-dark-card">
        <div className="text-[10px] font-bold text-text-muted dark:text-slate-400 uppercase mb-3 tracking-widest text-left pl-1">Input Analisis</div>
        <div className="relative">
          <textarea
            placeholder="Masukkan akar kata (ex: k-t-b) atau kata kerja Arab..."
            className="w-full h-32 p-4 bg-background dark:bg-slate-800 border border-border dark:border-slate-700 rounded-2xl text-sm focus:ring-1 focus:ring-primary focus:bg-white dark:focus:bg-slate-700 transition-all text-right arabic-text dark:text-dark-text resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <Button 
          variant="primary" 
          className="w-full mt-4 py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2" 
          onClick={handleAnalyse}
          disabled={isAnalysing || !input}
        >
          {isAnalysing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sinkronisasi Data...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Analisis Leksikon</span>
            </>
          )}
        </Button>
      </Card>

      {analysis && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {analysis.error ? (
            <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-medium text-center rounded-2xl">
              {analysis.error}
            </Card>
          ) : (
            <Card className="p-1 border-primary/20 bg-primary-light dark:bg-emerald-950/20 rounded-3xl overflow-hidden">
               <div className="bg-white dark:bg-dark-card p-6 rounded-[calc(1.5rem-4px)] space-y-4 border border-border dark:border-dark-border">
                  <div className="flex justify-between items-center border-b border-border dark:border-dark-border pb-3">
                    <span className="text-[10px] font-bold text-text-muted dark:text-slate-500 uppercase tracking-wider">Hasil Ekstraksi</span>
                    <CheckCircle2 className="w-4 h-4 text-primary dark:text-emerald-400" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-text-muted dark:text-slate-500 uppercase">Akar Kata</p>
                      <p className="text-xl font-bold arabic-serif text-primary dark:text-emerald-400" dir="rtl">{analysis.root}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[9px] font-bold text-text-muted dark:text-slate-500 uppercase">Wazan</p>
                      <p className="text-md font-bold text-text-dark dark:text-dark-text">{analysis.wazan}</p>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <p className="text-[9px] font-bold text-text-muted dark:text-slate-500 uppercase">Klasifikasi</p>
                    <p className="text-xs font-semibold text-text-dark dark:text-dark-text">{analysis.type}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-text-muted dark:text-slate-500 uppercase">Arti</p>
                    <p className="text-sm font-bold text-primary dark:text-emerald-400">{analysis.meaning}</p>
                  </div>

                  <div className="p-3 bg-background dark:bg-slate-800 rounded-xl border border-border dark:border-dark-border">
                     <p className="text-[9px] font-bold text-text-muted dark:text-slate-500 uppercase mb-1">Catatan Linguistik</p>
                     <p className="text-[11px] text-text-dark dark:text-slate-300 leading-relaxed italic">&quot;{analysis.explanation}&quot;</p>
                  </div>

                  <Button 
                    onClick={async () => {
                      const parts = analysis.root.split('-');
                      const past = analysis.root.replace(/-/g, ''); // Placeholder, AI should ideally provide this
                      await db.verbs.add({
                        root: analysis.root,
                        past: analysis.past || input, // Use input as fallback if past not provided
                        present: analysis.present || "ي...", 
                        wazan: analysis.wazan,
                        type: analysis.type.toLowerCase() as any,
                        translationId: analysis.meaning,
                        isFavorite: false,
                        createdAt: Date.now()
                      });
                      toast.success("Berhasil disimpan ke Koleksi!");
                    }}
                    variant="secondary" 
                    className="w-full py-3 rounded-xl border border-primary/20"
                  >
                    Simpan ke Koleksi
                  </Button>
               </div>
            </Card>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
