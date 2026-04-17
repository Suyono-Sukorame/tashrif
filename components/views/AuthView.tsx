import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Github } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { TextLTR, TextRTL } from '../ui/Typography';

import { InputLTR } from '../ui/Input';

export const AuthView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      if (error) throw error;
      alert('Tautan ajaib telah dikirim ke email Anda!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Cek email Anda untuk konfirmasi pendaftaran!');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F3F4F6] dark:bg-dark-bg transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center font-bold text-3xl mx-auto mb-4 shadow-xl shadow-primary/20">ت</div>
          <h1 className="text-2xl font-bold dark:text-dark-text tracking-tight">Tashrif<span className="text-primary dark:text-emerald-400">Master</span></h1>
          <TextLTR className="text-xs text-text-muted dark:text-slate-400 mt-2 font-medium">Leksikon Arab dalam Genggaman Anda</TextLTR>
        </div>

        <Card className="p-8 border-border dark:border-dark-border bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl shadow-2xl">
          <div className="flex gap-4 mb-8 p-1 bg-stone-100 dark:bg-slate-800 rounded-xl">
            <button 
              onClick={() => { setIsLogin(true); setUseMagicLink(false); }}
              className={cn("flex-1 py-2 text-xs font-bold rounded-lg transition-all", isLogin ? "bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-emerald-400" : "text-text-muted")}
            >
              MASUK
            </button>
            <button 
              onClick={() => { setIsLogin(false); setUseMagicLink(false); }}
              className={cn("flex-1 py-2 text-xs font-bold rounded-lg transition-all", !isLogin ? "bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-emerald-400" : "text-text-muted")}
            >
              DAFTAR
            </button>
          </div>

          <form onSubmit={useMagicLink ? handleMagicLink : handleAuth} className="space-y-4">
            <div className="space-y-1">
              <TextLTR as="label" className="text-[10px] font-bold text-text-muted dark:text-slate-500 uppercase px-1">Email</TextLTR>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted z-10" />
                <InputLTR 
                  type="email" 
                  required
                  placeholder="nama@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {!useMagicLink && (
              <div className="space-y-1">
                <TextLTR as="label" className="text-[10px] font-bold text-text-muted dark:text-slate-500 uppercase px-1">Password</TextLTR>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted z-10" />
                  <InputLTR 
                    type="password" 
                    required={!useMagicLink}
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              variant="primary" 
              className="w-full py-4 rounded-xl shadow-lg shadow-primary/20 mt-2 font-bold tracking-wide"
            >
              {loading ? "Memproses..." : (useMagicLink ? "KIRIM MAGIC LINK" : (isLogin ? "MASUK SEKARANG" : "BUAT AKUN"))}
            </Button>

            {isLogin && (
              <button 
                type="button"
                onClick={() => setUseMagicLink(!useMagicLink)}
                className="w-full text-[10px] font-bold text-primary dark:text-emerald-400 uppercase tracking-widest hover:underline"
              >
                {useMagicLink ? "Gunakan Password" : "Masuk Tanpa Password?"}
              </button>
            )}
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border dark:border-slate-800"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-white dark:bg-dark-card px-2 text-text-muted">Atau</span></div>
          </div>

          <Button 
            onClick={handleGoogleLogin}
            variant="ghost" 
            className="w-full border border-border dark:border-slate-800 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Lanjutkan dengan Google
          </Button>
        </Card>

        <p className="text-center text-[10px] text-text-muted dark:text-slate-500 mt-8 leading-relaxed">
          Dengan melanjutkan, Anda menyetujui <span className="underline">Ketentuan Layanan</span> dan <span className="underline">Kebijakan Privasi</span> Tashrif Master.
        </p>
      </motion.div>
    </div>
  );
};
