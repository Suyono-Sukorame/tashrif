import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface GuideViewProps {
  onBack: () => void;
}

export const GuideView = ({ onBack }: GuideViewProps) => {
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
};
