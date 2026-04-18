import React, { useState } from 'react';
import { toast } from 'sonner';
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
  const [bulkInput, setBulkInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [verbsList, setVerbsList] = useState<any[]>([]);

  // Fetch Verbs for List
  const fetchVerbs = async () => {
    const { data } = await supabase.from('verbs').select('*').order('created_at', { ascending: false });
    if (data) setVerbsList(data);
  };

  React.useEffect(() => {
    fetchVerbs();
  }, []);

  const handleAddVerb = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Explicit data object
    const payload = {
      root: root.trim(),
      past: past.trim(),
      present: present.trim(),
      wazan: wazan,
      translation: translation.trim(),
      type: 'shahih',
      is_favorite: false,
      created_at: new Date().toISOString()
    };

    console.log("Mengirim data ke Supabase:", payload);

    try {
      // 1. Save to Supabase
      const { data, error } = await supabase
        .from('verbs')
        .insert([payload])
        .select();

      if (error) {
        console.error("Supabase Error Detail:", error);
        throw error;
      }

      // 2. Sync to Local Dexie
      await db.verbs.add({
        ...payload,
        translationId: translation,
        createdAt: Date.now(),
        isFavorite: false,
        type: 'shahih' as any
      });

      toast.success('Leksikon baru berhasil dipublikasikan!');
      setRoot(''); setPast(''); setPresent(''); setTranslation('');
      fetchVerbs(); // Refresh list
    } catch (error: any) {
      console.error("Catch Error:", error);
      toast.error(error.message || "Terjadi kesalahan saat menyimpan");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAdd = async () => {
    if (!bulkInput) return;
    setLoading(true);
    try {
      const dataArray = JSON.parse(bulkInput);
      if (!Array.isArray(dataArray)) throw new Error("Format harus berupa Array JSON");

      const formattedData = dataArray.map(item => ({
        root: item.root,
        past: item.past,
        present: item.present,
        wazan: item.wazan || 'Fa\'ala - Yaf\'ulu',
        translationId: item.meaning || item.translationId,
        type: item.type || 'shahih',
        forms: item.forms || null,
        examples: item.examples || null,
        isFavorite: false,
        createdAt: Date.now()
      }));

      // 1. Save to Supabase
      const { error } = await supabase.from('verbs').insert(
        formattedData.map(d => ({ 
          root: d.root,
          past: d.past,
          present: d.present,
          wazan: d.wazan,
          translation: d.translationId,
          type: d.type,
          forms: d.forms,
          examples: d.examples,
          is_favorite: d.isFavorite,
          created_at: new Date().toISOString()
        }))
      );
      if (error) {
        console.error("Bulk Error:", error);
        throw error;
      }

      // 2. Sync to Local Dexie
      for (const item of formattedData) {
        await db.verbs.add(item);
      }

      toast.success(`${formattedData.length} leksikon berhasil diimpor!`);
      setBulkInput('');
      fetchVerbs(); // Refresh list
    } catch (error: any) {
      toast.error("Gagal impor: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVerb = async (id: number) => {
    if (!confirm('Hapus leksikon ini?')) return;
    
    // Optimistic Update: Langsung hapus dari tampilan
    setVerbsList(prev => prev.filter(v => v.id !== id));

    try {
      const { error } = await supabase.from('verbs').delete().eq('id', id);
      if (error) throw error;
      await db.verbs.delete(id);
      toast.success('Leksikon dihapus');
    } catch (error: any) {
      toast.error(error.message);
      fetchVerbs(); // Ambil ulang jika gagal
    }
  };

  const handleClearAll = async () => {
    if (!confirm('PERINGATAN: Hapus SELURUH database cloud dan lokal? Tindakan ini tidak bisa dibatalkan.')) return;
    
    // Optimistic Update: Langsung kosongkan tampilan
    setVerbsList([]);
    setLoading(true);

    try {
      const { error } = await supabase.from('verbs').delete().neq('id', 0);
      if (error) throw error;
      await db.verbs.clear();
      toast.success('Database berhasil dikosongkan!');
    } catch (error: any) {
      toast.error(error.message);
      fetchVerbs(); // Ambil ulang jika gagal
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <TextLTR as="h2" className="text-xl font-bold dark:text-dark-text">Pusat Kendali CMS</TextLTR>
        <div className="flex gap-2">
          <Button onClick={handleClearAll} variant="ghost" className="text-[10px] text-red-500 font-bold border border-red-100 dark:border-red-900/30">RESET DB</Button>
          <Badge variant="primary" size="sm">Admin Active</Badge>
        </div>
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

      <Card className="p-6 border-border dark:border-dark-border bg-white dark:bg-dark-card shadow-xl">
        <TextLTR className="flex items-center gap-2 mb-4">
           <Sparkles className="w-5 h-5 text-accent" />
           <h3 className="font-bold text-sm uppercase tracking-tight dark:text-dark-text">Bulk Leksikon Import</h3>
        </TextLTR>
        
        <div className="space-y-4">
          <div className="bg-stone-50 dark:bg-slate-900 p-3 rounded-xl border border-dashed border-border dark:border-slate-800">
            <p className="text-[9px] font-bold text-text-muted uppercase mb-2">Format JSON (Array of Objects):</p>
            <pre className="text-[8px] text-primary dark:text-emerald-400 overflow-x-auto">
              {`[
  { 
    "root": "k-t-b", "past": "كتب", "present": "يكتب", "meaning": "Menulis",
    "forms": [ { "dhamir": "هُوَ", "past": "كتب", "present": "يكتب", ... } ],
    "examples": [ { "ar": "...", "id": "..." } ]
  }
]`}
            </pre>
          </div>
          
          <textarea 
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder="Paste JSON array di sini..."
            className="w-full h-32 p-4 bg-stone-50 dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl text-xs font-mono focus:ring-2 focus:ring-accent/20 outline-none transition-all dark:text-dark-text resize-none"
          />
          
          <Button 
            onClick={handleBulkAdd}
            disabled={loading || !bulkInput}
            variant="secondary" 
            className="w-full py-3 rounded-xl border border-accent/20 text-accent font-bold"
          >
            {loading ? "Mengimpor..." : "IMPOR DATA MASAL"}
          </Button>
        </div>
      </Card>

      <div className="space-y-3">
        <TextLTR as="h4" className="text-[10px] font-bold uppercase text-text-muted tracking-widest px-1">Daftar Leksikon Aktif ({verbsList.length})</TextLTR>
        <div className="space-y-2">
          {verbsList.map((v) => (
            <Card key={v.id} className="p-4 bg-white dark:bg-dark-card border-border dark:border-dark-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-stone-50 dark:bg-slate-900 rounded-lg flex items-center justify-center text-primary font-bold">{v.root[0]}</div>
                <div>
                  <TextRTL className="text-sm font-bold dark:text-dark-text">{v.past} - {v.present}</TextRTL>
                  <TextLTR className="text-[10px] text-text-muted">{v.translation}</TextLTR>
                </div>
              </div>
              <button 
                onClick={() => handleDeleteVerb(v.id)}
                className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))}
          {verbsList.length === 0 && (
            <div className="text-center py-10 opacity-50 text-[10px] font-bold uppercase tracking-widest">Belum ada data di cloud</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
