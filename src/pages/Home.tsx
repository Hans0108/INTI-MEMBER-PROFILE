import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, User as UserIcon, Lock, Mail } from 'lucide-react';
import { auth, signInWithEmailAndPassword } from '../lib/firebase';
import { UserRole } from '../types';

interface HomeProps {
  user: any;
  role: UserRole | null;
}

export default function Home({ user, role }: HomeProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Identity mismatch. Check credentials.');
      setLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-brand-cream relative flex flex-col items-center justify-center p-8 overflow-hidden font-sans">
      {/* Background Frame Ornament */}
      <div className="absolute inset-0 pointer-events-none border-[16px] border-double border-brand-gold/15 m-4 z-0" />
      
      {/* Floating Orbs */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-brand-gold/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-[20%] right-[5%] w-96 h-96 bg-brand-red/5 rounded-full blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 max-w-lg w-full text-center flex flex-col items-center"
      >
        <header className="mb-12 text-center">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] tracking-[0.4em] font-semibold text-brand-red uppercase mb-4 block"
          >
            Official Institutional Portal
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-serif text-5xl md:text-6xl font-black italic text-brand-ink mb-2 leading-tight"
          >
            Elite Portal
          </motion.h1>
          <div className="h-px w-24 bg-brand-gold mx-auto mb-8" />
        </header>

        <div className="glass-panel p-2 rounded-[40px] border-2 border-brand-gold shadow-2xl mb-12 group transition-transform hover:scale-[1.02]">
          <div className="bg-white rounded-[38px] p-10 flex flex-col items-center">
            <div className="brushstroke-border mb-8">
              <div className="brushstroke-inner w-32 h-32 md:w-40 md:h-40">
                <ShieldCheck className="w-16 h-16 md:w-20 md:h-20 text-brand-gold" />
              </div>
            </div>

            <p className="text-slate-500 text-sm italic font-serif mb-8 max-w-[280px] leading-relaxed">
              Welcome to the exclusive registry of the INTI association. Please authenticate to access your digital identity.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative group/field">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-brand-cream rounded-xl text-brand-gold group-focus-within/field:bg-brand-gold group-focus-within/field:text-white transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="Official Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-brand-cream/50 border-2 border-transparent focus:border-brand-gold outline-none py-4 pl-16 pr-6 rounded-2xl transition-all font-bold text-slate-800 placeholder:text-slate-400 placeholder:italic"
                />
              </div>

              <div className="relative group/field">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-brand-cream rounded-xl text-brand-gold group-focus-within/field:bg-brand-gold group-focus-within/field:text-white transition-all">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="Security Key"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-brand-cream/50 border-2 border-transparent focus:border-brand-gold outline-none py-4 pl-16 pr-6 rounded-2xl transition-all font-bold text-slate-800 placeholder:text-slate-400 placeholder:italic"
                />
              </div>

              {error && (
                <p className="text-[10px] font-black text-brand-red uppercase tracking-widest">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-red text-white font-sans font-black py-5 px-8 rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Enter Sanctuary
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-brand-gold/10 w-full">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Registry Access Points</p>
               <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center bg-brand-cream/40 p-3 rounded-xl border border-brand-gold/5">
                     <span className="text-[10px] font-bold text-slate-500">Super Admin</span>
                     <span className="text-[10px] font-black text-brand-gold font-mono">admin@example.com / admin123</span>
                  </div>
                  <div className="flex justify-between items-center bg-brand-cream/40 p-3 rounded-xl border border-brand-gold/5">
                     <span className="text-[10px] font-bold text-slate-500">Elite Member</span>
                     <span className="text-[10px] font-black text-brand-gold font-mono">Mario@email.com / Kent123</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
          Secured by Deep-Red Encryption
        </p>
      </motion.div>

      <footer className="absolute bottom-10 text-[10px] text-slate-400 font-medium tracking-wider uppercase z-10 px-8 text-center sm:text-left flex flex-col sm:flex-row gap-4 sm:gap-12">
        <span>© 2026 INTI ASSOCIATION</span>
        <span className="hidden sm:inline">•</span>
        <span>Premium Certification Layer</span>
      </footer>
    </div>
  );
}
