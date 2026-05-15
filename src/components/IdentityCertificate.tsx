import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShieldCheck, Calendar, User as UserIcon } from 'lucide-react';
import { Member, MembershipStatus } from '../types';
import { formatDate, cn } from '../lib/utils';

interface IdentityCertificateProps {
  member: Member;
  showStatus?: boolean;
}

export function IdentityCertificate({ member, showStatus = true }: IdentityCertificateProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-panel w-full rounded-[50px] p-1 relative border-2 border-brand-gold shadow-[0_30px_100px_rgba(0,0,0,0.12)]">
        <div className="bg-white rounded-[48px] p-10 flex flex-col items-center text-center">
          
          {/* Status Seal */}
          <AnimatePresence>
            {showStatus && (
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                className="absolute -top-6 -right-6 gold-seal z-30"
              >
                <CheckCircle2 className="text-white w-10 h-10" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Profile Photo with Brushstroke */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="brushstroke-border mb-8"
          >
            <div className="brushstroke-inner w-44 h-44">
              {member.profilePhotoURL ? (
                <img src={member.profilePhotoURL} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand-cream">
                  <UserIcon className="w-20 h-20 text-brand-gold/30" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Verification Badge */}
          <AnimatePresence>
            {member.verified && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4"
              >
                <span className="px-5 py-1.5 rounded-full border border-brand-gold text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] bg-brand-gold/5">
                  Official Verified
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Member Details */}
          <h2 className="text-4xl font-bold text-brand-ink mb-1 font-serif leading-tight">
            {member.name}
          </h2>
          
          <p className="text-slate-400 text-xs font-semibold tracking-[0.2em] uppercase mb-8">
            Premium Tier Member
          </p>

          <div className="w-full h-px bg-slate-100 mb-8" />

          {/* Info Grid */}
          <div className="grid grid-cols-2 w-full gap-4 mb-4">
            <div className="bg-brand-cream/60 p-4 rounded-2xl text-left border border-brand-gold/10">
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Member ID</p>
              <p className="text-sm font-black text-brand-red font-mono">{member.memberId}</p>
            </div>
            <div className="bg-brand-cream/60 p-4 rounded-2xl text-left border border-brand-gold/10">
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Elite Status</p>
              <p className={cn(
                "text-sm font-black uppercase tracking-tight",
                member.status === MembershipStatus.ACTIVE ? "text-green-600" : "text-brand-red"
              )}>
                {member.status}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full gap-4 mb-4">
            <div className="bg-brand-cream/60 p-4 rounded-2xl text-left border border-brand-gold/10">
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Place of Birth</p>
              <p className="text-xs font-black text-slate-800">{member.placeOfBirth || 'N/A'}</p>
            </div>
            <div className="bg-brand-cream/60 p-4 rounded-2xl text-left border border-brand-gold/10">
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Date of Birth</p>
              <p className="text-xs font-black text-slate-800">{member.dateOfBirth || 'N/A'}</p>
            </div>
          </div>

          <div className="w-full bg-brand-cream/60 p-4 rounded-2xl text-center border border-brand-gold/10 mb-8">
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Official Contact</p>
            <p className="text-sm font-black text-brand-ink uppercase tracking-tighter">{member.phone || 'Not Registered'}</p>
          </div>

          <AnimatePresence>
            {showStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col items-center"
              >
                 <div className="flex items-center gap-2 text-slate-400 font-medium text-[10px] uppercase tracking-widest bg-slate-50 px-6 py-2 rounded-full mb-6">
                    <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Certified Since {formatDate(member.joinDate)}</span>
                 </div>

                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
                   Encrypted Token: {member.slug.substring(0, 12)}...
                 </p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
