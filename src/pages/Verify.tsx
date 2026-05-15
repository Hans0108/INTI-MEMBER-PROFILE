import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShieldCheck, Calendar, User as UserIcon } from 'lucide-react';
import { MemberService } from '../services/memberService';
import { Member, MembershipStatus } from '../types';
import { formatDate, cn } from '../lib/utils';

import { IdentityCertificate } from '../components/IdentityCertificate';

export default function Verify() {
  const { slug } = useParams<{ slug: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        if (!slug) {
          setLoading(false);
          return;
        }
        
        console.log('Verifying slug:', slug);
        const data = await MemberService.getMemberBySlug(slug);
        
        if (data) {
          console.log('Member found:', data.name);
          setMember(data);
          // Delay for dramatic reveal
          setTimeout(() => {
            setShowStatus(true);
            playSuccessSound();
          }, 800);
        } else {
          console.warn('No member found for slug:', slug);
          setError(true);
        }
      } catch (err) {
        console.error('Verification protocol error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [slug]);

  const playSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
      oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.2); // A5

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      // Audio might be blocked by browser policy
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-4">
        <motion.div
           animate={{ scale: [1, 1.1, 1] }}
           transition={{ repeat: Infinity, duration: 2 }}
           className="w-20 h-20 border-4 border-brand-gold rounded-full border-t-brand-red animate-spin mb-4"
        />
        <p className="font-serif italic text-brand-red text-xl">Verifying Credentials...</p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-4 text-center">
        <ShieldCheck className="w-16 h-16 text-slate-300 mb-4" />
        <h1 className="font-serif text-3xl text-slate-800 mb-2">Verification Failed</h1>
        <p className="text-slate-500 mb-6">This credential could not be verified by the official system.</p>
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-brand-red text-white py-3 px-8 rounded-lg shadow-lg font-sans font-bold uppercase tracking-widest text-sm"
          >
            Return Home
          </button>
          <p className="text-[10px] text-slate-300 font-mono">Token: {slug}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream relative overflow-hidden font-sans">
      {/* Background Frame Ornament */}
      <div className="fixed inset-0 pointer-events-none border-[16px] border-double border-brand-gold/15 m-4 z-50 transition-opacity duration-1000" />
      
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20 flex flex-col items-center">
        {/* Institutional Header */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <span className="text-[10px] tracking-[0.5em] font-black text-brand-red uppercase mb-4 block">Official Identity Verification</span>
          <h1 className="font-serif text-5xl md:text-6xl font-black text-brand-ink italic mb-4">Inti Association</h1>
          <div className="h-px w-32 bg-brand-gold mx-auto" />
        </motion.header>

        {/* Verification Card Panel */}
        <IdentityCertificate member={member} showStatus={showStatus} />

        {/* Footer Info */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
             <div className="h-px w-8 bg-brand-gold/30" />
             <ShieldCheck className="w-5 h-5 text-brand-gold" />
             <div className="h-px w-8 bg-brand-gold/30" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] max-w-sm leading-relaxed">
            This verification link is digitally signed and non-sequential. Any unauthorized modification of this record is strictly prohibited.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

function useParallax(speed: number = 0.5) {
  const [scroll, setScroll] = React.useState(0);
  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScroll(window.scrollY);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return scroll * speed;
}
