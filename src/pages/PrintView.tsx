import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MemberService } from '../services/memberService';
import { Member } from '../types';
import { Printer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrintView() {
  const [members, setMembers] = useState<Member[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const data = await MemberService.getAllMembers();
      setMembers(data);
    };
    fetch();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Controls - Hidden in print */}
      <div className="print:hidden p-8 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white z-50">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-red transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>
        <div className="flex items-center gap-4">
          <p className="text-sm text-slate-500 italic">Optimized for A4 Printing (10 per page)</p>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-brand-red text-white py-2 px-6 rounded-lg shadow-lg hover:bg-brand-red/90 transition-all font-bold uppercase text-xs"
          >
            <Printer className="w-4 h-4" /> Print Now
          </button>
        </div>
      </div>

      <div className="max-w-[210mm] mx-auto p-4 print:p-0">
        <div className="grid grid-cols-2 gap-x-12 gap-y-16">
          {members.map(m => (
            <div key={m.id} className="relative border-[3px] border-brand-gold/30 p-8 flex flex-col items-center justify-center text-center break-inside-avoid shadow-sm overflow-hidden bg-brand-cream/10">
               {/* Decorative corner */}
               <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-red/20 m-2" />
               <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-red/20 m-2" />

               <div className="mb-6 p-2 bg-white border border-slate-100 shadow-inner rounded-sm">
                  <QRCodeSVG 
                    value={`${window.location.origin}/verify/${m.slug}`} 
                    size={160}
                    level="H"
                  />
               </div>
               
               <header className="mb-4">
                 <p className="text-[9px] font-black text-brand-red uppercase tracking-[0.4em] mb-1">Official Member</p>
                 <p className="font-serif text-2xl font-black text-brand-ink leading-tight italic">{m.name}</p>
                 <p className="font-sans text-[10px] text-brand-gold font-black uppercase tracking-[0.2em] mt-1">{m.memberId}</p>
               </header>

               <div className="w-24 h-px bg-brand-gold mb-4" />
               
               <footer className="w-full flex justify-between items-center px-4">
                  <p className="text-[7px] text-slate-400 uppercase tracking-widest font-bold">Inti Elite Network</p>
                  <p className="text-[7px] text-slate-400 uppercase tracking-widest font-bold">Layer-V Secured</p>
               </footer>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          @page { margin: 15mm; size: A4; }
          .print-hidden { display: none !important; }
        }
      `}} />
    </div>
  );
}
