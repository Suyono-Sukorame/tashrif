import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { GoogleGenAI } from "@google/genai";

export const AIView = () => {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);

  const handleAnalyse = async () => {
    if (!input) return;
    setIsAnalysing(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
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
};
