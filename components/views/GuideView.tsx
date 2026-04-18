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
    { category: 'DASAR', items: [
      { title: 'Shahih', desc: 'Kata kerja yang semua huruf akarnya adalah huruf asli dan bukan huruf penyakit (Alif, Waw, Ya).' },
      { title: 'Wazan', desc: 'Pola atau rumus timbangan kata dalam bahasa Arab.' },
      { title: 'Tasrif', desc: 'Perubahan kata dari satu bentuk ke bentuk lain sesuai waktu dan subjek.' },
    ]},
    { category: 'MATERI KULIAH (LANJUTAN)', items: [
      { title: 'Mithāl Wāwī', desc: 'Fi\'il yang diawali huruf Waw. Kaidah penting: Huruf Waw sering dihapus pada bentuk Mudhari\' (contoh: Wa’ada jadi Ya’idu).' },
      { title: 'Isnad Ajwaf', desc: 'Penyandaran Fi\'il Ajwaf ke 14 Dhomir. Memerlukan ketelitian saat bertemu dhomir yang menyebabkan sukun pada huruf terakhir.' },
      { title: 'Kaidah Majzum (Jusif)', desc: 'Penghapusan huruf illat (Alif/Waw/Ya) saat fi\'il dalam kondisi Majzum untuk menghindari bertemunya dua sukun.' },
      { title: 'I’rab Ajwaf', desc: 'Perubahan harakat akhir atau penghapusan huruf illat sebagai tanda status gramatikal (Rafa\', Nashab, Jazm).' },
      { title: 'Verba Khusus Ajwaf', desc: 'Kelompok verba seperti Nāma (Tidur), Khāfa (Takut), dan Shā’a (Berkehendak) yang memiliki pola I’lal unik.' },
      { title: 'Fi’il Naqis (Akhiran Lemah)', desc: 'Fi’il yang huruf terakhirnya adalah huruf illat (Waw/Ya). Kaidah penting: Huruf illat tidak berharakat (Marfu’), berfathah (Mansub), dan DIHAPUS TOTAL saat kondisi Majzum (contoh: Yad’u jadi Lam Yad’u).' },
    ]}
  ];

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold dark:text-dark-text">Pusat Panduan & Istilah</h2>
        <Button onClick={onBack} variant="ghost" className="p-2"><ChevronRight className="dark:text-dark-text" /></Button>
      </div>
      <div className="grid grid-cols-1 gap-6 pb-20">
        {terms.map((cat, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-[10px] font-bold text-text-muted dark:text-slate-500 uppercase tracking-widest px-1">{cat.category}</h3>
            <div className="grid grid-cols-1 gap-3">
              {cat.items.map((t, i) => (
                <Card key={i} className="p-4 bg-white dark:bg-dark-card border-border dark:border-dark-border">
                  <div dir="ltr">
                    <h4 className="font-bold text-primary dark:text-emerald-400 mb-1 text-left">{t.title}</h4>
                    <p className="text-xs text-text-muted dark:text-slate-400 leading-relaxed text-left">{t.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
