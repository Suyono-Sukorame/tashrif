import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';
import { db, type Verb } from '@/lib/db';
import { type QuizQuestion } from '@/lib/types';

interface QuizViewProps {
  verb: Verb;
  questions: QuizQuestion[];
  onComplete: () => void;
}

export const QuizView = ({ verb, questions, onComplete }: QuizViewProps) => {
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
};
