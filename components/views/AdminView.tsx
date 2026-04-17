import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, Trash2, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { supabase } from '@/lib/supabase';
import { db } from '@/lib/db';

import { TextLTR, TextRTL } from '../ui/Typography';
import { InputLTR, InputRTL } from '../ui/Input';
import { Badge } from '../ui/Badge';

export const AdminView = () => {
  const [root, setRoot] = useState('');
  const [past, setPast] = useState('');
  const [present, setPresent] = useState('');
  const [wazan, setWazan] = useState('Fa\'ala - Yaf\'ulu');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddVerb = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newVerb = {
        root,
        past,
        present,
        wazan,
        translationId: translation,
        type: 'shahih' as any,
        isFavorite: false,
        createdAt: Date.now()
      };

      // 1. Save to Supabase
      const { data, error } = await supabase.from('verbs').insert([{
        ...newVerb,
        translation_id: translation // align with SQL schema
      }]).select();

      if (error) throw error;

      // 2. Sync to Local Dexie
      await db.verbs.add(newVerb);

      alert('Kata kerja berhasil ditambahkan ke Cloud!');
      setRoot(''); setPast(''); setPresent(''); setTranslation('');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <TextLTR as="h2" className="text-xl font-bold dark:text-dark-text">Pusat Kendali CMS</TextLTR>
        <Badge variant="primary" size="sm">Admin Active</Badge>
      </div>

      <Card className="p-6 border-border dark:border-dark-border bg-white dark:bg-dark-card shadow-xl">
        <TextLTR className="flex items-center gap-2 mb-6">
           <Plus className="w-5 h-5 text-primary" />
           <h3 className="font-bold text-sm uppercase tracking-tight dark:text-dark-text">Tambah Leksikon Baru</h3>
        </TextLTR>

        <form onSubmit={handleAddVerb} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <TextLTR as="label" className="text-[10px] font-bold text-text-muted uppercase px-1">Akar Kata (Root)</TextLTR>
              <InputRTL 
                value={root} onChange={(e) => setRoot(e.target.value)}
                placeholder="ف - ع - L" 
                className="text-center"
              />
            </div>
            <div className="space-y-1">
              <TextLTR as="label" className="text-[10px] font-bold text-text-muted uppercase px-1">Wazan</TextLTR>
              <select 
                value={wazan} onChange={(e) => setWazan(e.target.value)}
                className="w-full px-4 py-3.5 bg-stone-50 dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-dark-text"
              >
                <option>Fa'ala - Yaf'ulu</option>
                <option>Fa'ala - Yaf'ilu</option>
                <option>Fa'ala - Yaf'alu</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <TextLTR as="label" className="text-[10px] font-bold text-text-muted uppercase px-1">Fi'il Madhi</TextLTR>
              <InputRTL 
                value={past} onChange={(e) => setPast(e.target.value)}
                placeholder="كتب"
              />
            </div>
            <div className="space-y-1">
              <TextLTR as="label" className="text-[10px] font-bold text-text-muted uppercase px-1">Fi'il Mudhari</TextLTR>
              <InputRTL 
                value={present} onChange={(e) => setPresent(e.target.value)}
                placeholder="يكتب"
              />
            </div>
          </div>

          <div className="space-y-1">
            <TextLTR as="label" className="text-[10px] font-bold text-text-muted uppercase px-1">Arti (Bahasa Indonesia)</TextLTR>
            <InputLTR 
              value={translation} onChange={(e) => setTranslation(e.target.value)}
              placeholder="Contoh: Menulis"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={loading} variant="primary" className="w-full py-4 rounded-xl flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {loading ? "Menyimpan..." : "PUBLIKASIKAN KE CLOUD"}
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 gap-3">
         <TextLTR as="h4" className="text-[10px] font-bold uppercase text-text-muted tracking-widest px-1">Statistik Konten</TextLTR>
         <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 bg-white dark:bg-dark-card border border-border dark:border-dark-border text-center">
               <div className="text-xl font-bold text-primary">124</div>
               <Badge variant="secondary">Total Verbs</Badge>
            </Card>
            <Card className="p-4 bg-white dark:bg-dark-card border border-border dark:border-dark-border text-center">
               <div className="text-xl font-bold text-accent">18</div>
               <Badge variant="warning">Pending AI</Badge>
            </Card>
            <Card className="p-4 bg-white dark:bg-dark-card border border-border dark:border-dark-border text-center">
               <div className="text-xl font-bold text-emerald-500">540</div>
               <Badge variant="success">Syncs Today</Badge>
            </Card>
         </div>
      </div>
    </motion.div>
  );
};
