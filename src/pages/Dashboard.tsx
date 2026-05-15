import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Users, 
  UserPlus, 
  Plus, 
  LogOut, 
  Trash2,
  QrCode, 
  Shield, 
  ShieldCheck,
  ShieldAlert,
  Settings, 
  Download, 
  Check, 
  X,
  CreditCard,
  Key,
  Camera,
  Upload,
  Edit,
  User as UserIcon
} from 'lucide-react';
import { auth, signOut } from '../lib/firebase';
import { MemberService } from '../services/memberService';
import { Member, MembershipStatus, UserRole } from '../types';
import { formatDate, cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  user: any;
  role: UserRole | null;
  member: Member | null;
}


export default function Dashboard({ user, role, member }: DashboardProps) {
  const navigate = useNavigate();
  const isAdmin = role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const [activeTab, setActiveTab] = useState<'admin' | 'member'>('admin');

  return (
    <div className="min-h-screen bg-brand-cream font-sans relative overflow-hidden">
      {/* Background Ornament */}
      <div className="fixed inset-0 pointer-events-none border-[12px] border-double border-brand-gold/10 m-2 z-0" />

      <nav className="glass-panel border-b border-brand-gold/10 px-8 py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-red rounded-xl flex items-center justify-center shadow-xl rotate-3">
             <Shield className="text-white w-7 h-7" />
          </div>
          <div>
            <span className="text-[9px] tracking-[0.3em] font-black text-brand-red uppercase block">Institutional Network</span>
            <span className="font-serif text-2xl font-black text-brand-ink leading-none">Inti Elite</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {isAdmin && (
            <div className="flex bg-brand-cream px-2 py-1 rounded-xl border border-brand-gold/20 mr-4">
              <button 
                onClick={() => setActiveTab('admin')}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === 'admin' ? "bg-brand-red text-white shadow-lg" : "text-slate-400 hover:text-brand-gold"
                )}
              >
                {role === UserRole.SUPER_ADMIN ? 'Registry Command' : 'Management'}
              </button>
              <button 
                onClick={() => setActiveTab('member')}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === 'member' ? "bg-brand-red text-white shadow-lg" : "text-slate-400 hover:text-brand-gold"
                )}
              >
                My Card
              </button>
            </div>
          )}
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] mb-1">{role?.replace('_', ' ')}</p>
            <p className="text-sm font-bold text-slate-800">{user.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-brand-cream border border-brand-gold/20 text-slate-400 hover:text-brand-red hover:border-brand-red/30 transition-all shadow-sm"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1400px] mx-auto px-8 py-10">
        {isAdmin && activeTab === 'admin' ? (
          <AdminView userRole={role} />
        ) : (
          <MemberView member={member} email={user.email} />
        )}
      </main>

      <footer className="relative z-10 max-w-[1400px] mx-auto px-8 py-8 flex justify-between items-center border-t border-brand-gold/10 mt-12 opacity-50">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 INTI PRIVACY NETWORK</p>
        <div className="flex gap-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nodes: Active</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AES-256 Enabled</span>
        </div>
      </footer>
    </div>
  );
}

import { IdentityCertificate } from '../components/IdentityCertificate';

function MemberView({ member, email }: { member: Member | null, email: string }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  
  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-24 h-24 rounded-[30%] bg-brand-gold/10 flex items-center justify-center mb-8 rotate-12">
          <Users className="w-12 h-12 text-brand-gold/40" />
        </div>
        <h2 className="font-serif text-3xl text-slate-800 mb-2 font-black">Registry Pending</h2>
        <p className="text-slate-500 max-w-sm mb-12 italic font-serif">Your official credentials are currently being processed by the high council.</p>
        
        {email === 'admin@example.com' && (
          <button 
            onClick={() => window.location.reload()}
            className="bg-brand-red text-white font-black py-4 px-10 rounded-2xl shadow-2xl hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest text-xs"
          >
            System Override: Refresh Identity
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      <div className="lg:col-span-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-[50px] p-1 border-2 border-brand-gold shadow-2xl overflow-hidden"
        >
          <div className="bg-white rounded-[48px] p-10 md:p-14 relative overflow-hidden">
             {/* Decorative seal bg */}
             <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/5 rounded-full -mr-32 -mt-32" />
             
             <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
                <div className="brushstroke-border shrink-0 relative group">
                  <div className="brushstroke-inner w-44 h-44">
                    {member.profilePhotoURL ? (
                      <img src={member.profilePhotoURL} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-cream">
                        <Users className="text-brand-gold/30 w-20 h-20" />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowPhotoModal(true)}
                    className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-brand-gold border-2 border-brand-gold/20 hover:bg-brand-red hover:text-white transition-all group-hover:scale-110"
                  >
                    <Camera className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="flex-1">
                   <span className="inline-block px-4 py-1.5 rounded-full border border-brand-gold text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] mb-6">
                     Official Verified Member
                   </span>
                   <h2 className="font-serif text-5xl font-black text-brand-ink mb-2">{member.name}</h2>
                   <div className="flex items-center gap-3 mb-10">
                      <p className="text-brand-red font-black text-sm tracking-[0.3em] font-mono">MEMBER ID: {member.memberId}</p>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                        member.role === UserRole.SUPER_ADMIN ? "bg-red-50 text-brand-red border-brand-red/30" : 
                        member.role === UserRole.ADMIN ? "bg-brand-cream text-brand-gold border-brand-gold/30" : 
                        "bg-brand-cream/40 text-slate-400 border-brand-gold/5"
                      )}>
                        {member.role.replace('_', ' ')}
                      </span>
                   </div>
                   
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-brand-cream/60 p-5 rounded-[20px] border border-brand-gold/10">
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Status</p>
                        <div className="flex items-center gap-2">
                           <div className={cn("w-2 h-2 rounded-full", member.status === MembershipStatus.ACTIVE ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-red-500 shadow-[0_0_8px_rgba(178,34,34,0.4)]")} />
                           <span className="font-black text-slate-800 uppercase text-sm tracking-tight">{member.status}</span>
                        </div>
                      </div>
                      <div className="bg-brand-cream/60 p-5 rounded-[20px] border border-brand-gold/10">
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Official Registry</p>
                        <p className="font-black text-slate-800 text-sm tracking-tight uppercase">{formatDate(member.joinDate)}</p>
                      </div>
                      <div className="bg-brand-cream/60 p-5 rounded-[20px] border border-brand-gold/10">
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Contact Protocol</p>
                        <p className="font-black text-slate-800 text-sm tracking-tight uppercase">{member.phone || 'N/A'}</p>
                      </div>
                      <div className="bg-brand-cream/60 p-5 rounded-[20px] border border-brand-gold/10">
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Personal Origin</p>
                        <p className="font-black text-slate-800 text-[11px] leading-tight uppercase font-serif italic">{member.placeOfBirth || member.dateOfBirth ? `${member.placeOfBirth || ''} ${member.dateOfBirth || ''}` : 'NOT FILED'}</p>
                      </div>
                    </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel rounded-[50px] p-1 border-2 border-brand-gold shadow-2xl relative"
        >
          <div className="bg-white rounded-[48px] p-10 flex flex-col items-center text-center">
             <div className="gold-seal absolute -top-8 -right-8">
                <QrCode className="text-white w-10 h-10" />
             </div>
             
             <h3 className="font-serif text-2xl font-black text-brand-ink mb-1">Digital Identity</h3>
             <p className="text-[10px] text-slate-400 mb-8 font-black uppercase tracking-[0.3em]">Official Mobile Scanner</p>
             
             <div className="bg-white p-6 rounded-[32px] shadow-inner border border-slate-100 mb-6 group transition-transform hover:scale-105">
               <QRCodeSVG 
                 value={`${window.location.origin}/verify/${member.slug}`} 
                 size={200}
                 level="H"
                 imageSettings={{
                   src: "https://raw.githubusercontent.com/lucide-react/lucide/main/icons/shield.svg",
                   x: undefined,
                   y: undefined,
                   height: 48,
                   width: 48,
                   excavate: true,
                 }}
               />
             </div>
          </div>
        </motion.div>

        <div className="glass-panel p-8 rounded-[40px] border border-brand-gold/10">
           <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-gold shadow-lg flex items-center justify-center text-white">
                 <CreditCard className="w-5 h-5" />
              </div>
              <p className="font-black text-xs uppercase tracking-widest text-slate-800">Support Terminal</p>
           </div>
           <p className="text-xs text-slate-500 font-medium leading-relaxed italic font-serif">If you require any assistance with your credentials, please visit the central registry office.</p>
        </div>

        <button 
           onClick={() => setShowPasswordModal(true)}
           className="w-full glass-panel p-6 rounded-[32px] border border-brand-gold/10 flex items-center justify-between group hover:border-brand-gold/40 transition-all text-left"
        >
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-red group-hover:text-white transition-all">
                 <Key className="w-5 h-5" />
               </div>
               <div>
                  <p className="font-black text-[10px] uppercase tracking-widest text-slate-800">Security Vault</p>
                  <p className="text-[9px] text-slate-400 font-medium tracking-tight">Rotate Identity Key</p>
               </div>
            </div>
            <Settings className="w-4 h-4 text-brand-gold/30 group-hover:rotate-90 transition-transform" />
        </button>

        {showPasswordModal && (
          <ChangePasswordModal 
            memberId={member.id} 
            onClose={() => setShowPasswordModal(false)} 
          />
        )}

        {showPhotoModal && (
          <ChangePhotoModal 
            memberId={member.id} 
            currentPhoto={member.profilePhotoURL}
            onClose={() => setShowPhotoModal(false)}
            onUpdated={() => window.location.reload()}
          />
        )}
      </div>
    </div>
  );
}

function EditMemberModal({ member, onClose, onUpdated, canChangeRole }: { member: Member, onClose: () => void, onUpdated: () => void, canChangeRole?: boolean }) {
  const [formData, setFormData] = useState({ 
    name: member.name, 
    email: member.email, 
    memberId: member.memberId,
    phone: member.phone || '',
    placeOfBirth: member.placeOfBirth || '',
    dateOfBirth: member.dateOfBirth || '',
    profilePhotoURL: member.profilePhotoURL || '',
    role: member.role
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await MemberService.updateMemberProfile(member.id, formData);
      onUpdated();
      onClose();
    } catch (error) {
      alert('Error updating member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-brand-ink/40 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[50px] w-full max-w-2xl shadow-[0_50px_100px_rgba(0,0,0,0.2)] overflow-hidden relative z-10 border-2 border-brand-gold max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-brand-gold p-10 text-white flex justify-between items-center sticky top-0 z-20">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 block mb-2">Modify Registry Entry</span>
            <h3 className="font-serif text-3xl font-black italic underline underline-offset-8 decoration-white/20">Credential Modification</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-4">Full Identity Name</label>
              <input 
                required
                className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-4 px-6 rounded-2xl transition-all font-bold text-slate-800"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-4">Authorized Email</label>
              <input 
                required
                type="email"
                className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-4 px-6 rounded-2xl transition-all font-bold text-slate-800"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-4">Phone Number</label>
              <input 
                className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-4 px-6 rounded-2xl transition-all font-bold text-slate-800"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-4">Membership Number</label>
              <input 
                className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-4 px-6 rounded-2xl transition-all font-bold text-slate-800 font-mono"
                value={formData.memberId}
                onChange={e => setFormData({ ...formData, memberId: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-4">Place of Birth</label>
              <input 
                className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-4 px-6 rounded-2xl transition-all font-bold text-slate-800"
                value={formData.placeOfBirth}
                onChange={e => setFormData({ ...formData, placeOfBirth: e.target.value })}
                placeholder="City, Country"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-4">Date of Birth</label>
              <input 
                type="date"
                className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-4 px-6 rounded-2xl transition-all font-bold text-slate-800"
                value={formData.dateOfBirth}
                onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
          </div>

          {canChangeRole && (
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-4">Security Access Level</label>
              <select 
                className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-4 px-6 rounded-2xl transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
              >
                <option value={UserRole.MEMBER}>Standard Member Access</option>
                <option value={UserRole.ADMIN}>Regional Admin Access</option>
                <option value={UserRole.SUPER_ADMIN}>Universal Super Admin Access</option>
              </select>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-4">Profile Photo URL</label>
            <input 
              className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-4 px-6 rounded-2xl transition-all font-bold text-slate-800"
              value={formData.profilePhotoURL}
              onChange={e => setFormData({ ...formData, profilePhotoURL: e.target.value })}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className="pt-8">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-ink text-white font-black py-6 rounded-3xl shadow-2xl hover:brightness-110 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 uppercase tracking-[0.3em] text-xs"
            >
              {loading ? 'Updating Protocol...' : 'Save Modifications'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function AdminView({ userRole }: { userRole: UserRole | null }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN;

  useEffect(() => {
    fetchMembers();
  }, []);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [previewCertificate, setPreviewCertificate] = useState<Member | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);

  const fetchMembers = async () => {
    try {
      const data = await MemberService.getAllMembers();
      setMembers(data);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (e: React.MouseEvent, m: Member) => {
    e.stopPropagation();
    try {
      const newStatus = m.status === MembershipStatus.ACTIVE ? MembershipStatus.INACTIVE : MembershipStatus.ACTIVE;
      await MemberService.updateMemberStatus(m.id, newStatus);
      await fetchMembers();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleToggleVerification = async (id: string) => {
    try {
      await MemberService.toggleVerification(id);
      await fetchMembers();
    } catch (error) {
      alert('Verification protocol interrupted.');
    }
  };

  const handleToggleRole = async (member: Member) => {
    if (!isSuperAdmin) return;
    
    let nextRole: UserRole = UserRole.MEMBER;
    if (member.role === UserRole.MEMBER) nextRole = UserRole.ADMIN;
    else if (member.role === UserRole.ADMIN) nextRole = UserRole.SUPER_ADMIN;
    else nextRole = UserRole.MEMBER;

    if (nextRole === UserRole.SUPER_ADMIN && !window.confirm('Are you sure you want to grant Super Admin privileges? This provides total system control.')) {
      return;
    }

    try {
      await MemberService.updateMemberRole(member.id, nextRole);
      await fetchMembers();
    } catch (error) {
      alert('Role reassignment failed.');
    }
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;
    
    try {
      console.log('Initiating purge protocol for:', memberToDelete.memberId, memberToDelete.id);
      await MemberService.deleteMember(memberToDelete.id);
      if (selectedMember?.id === memberToDelete.id) {
        setSelectedMember(null);
      }
      await fetchMembers();
      setMemberToDelete(null);
    } catch (error) {
      alert('Protocol failure: Identity could not be purged.');
    }
  };

  return (
    <div className="grid grid-cols-12 gap-8 items-start">
      {/* Sidebar Stats */}
      <div className="col-span-12 lg:col-span-3 space-y-6">
        <div className="glass-panel p-8 rounded-[40px] border border-brand-gold/20">
          <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-brand-gold mb-8">Registry Pulse</h3>
          <div className="space-y-8">
            <div className="border-l-4 border-brand-red pl-6">
               <p className="text-4xl font-serif font-black text-brand-ink">{members.length}</p>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Registry</p>
            </div>
            <div className="border-l-4 border-green-600 pl-6">
               <p className="text-4xl font-serif font-black text-brand-ink">{members.filter(m => m.status === MembershipStatus.ACTIVE).length}</p>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Credentials</p>
            </div>
            <div className="border-l-4 border-brand-gold pl-6">
               <p className="text-4xl font-serif font-black text-brand-ink">Live</p>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">System Status</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[40px] border border-brand-gold/20 bg-brand-cream/30">
          <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-brand-gold mb-6">Security Logs</h3>
          <div className="space-y-4">
             {[1,2,3].map(i => (
               <div key={i} className="flex gap-4 items-start py-2 border-b border-brand-gold/5 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                  <div>
                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">Encrypted Access</p>
                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-tight">Handled by Node-{i*382}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Main Registry Table */}
      <div className="col-span-12 lg:col-span-6 space-y-8">
         <div className="glass-panel rounded-[40px] border border-brand-gold/10 overflow-hidden shadow-2xl">
            <div className="bg-brand-red/5 px-8 py-6 flex justify-between items-center border-b border-brand-gold/10">
               <h2 className="font-serif text-2xl font-black text-brand-red">Active Registry</h2>
               <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white text-[10px] font-bold">
                 {members.length}
               </div>
            </div>
            
            <div className="overflow-x-auto min-h-[500px]">
              <table className="w-full text-left">
                <thead className="bg-brand-cream/50 border-b border-brand-gold/10">
                  <tr>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Member Identity</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold hidden md:table-cell text-center">Protocol Role</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold hidden md:table-cell">Contact Information</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold text-right">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-gold/5">
                      <AnimatePresence mode="popLayout">
                        {members.map((m, idx) => (
                          <motion.tr 
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            key={m.id} 
                            onClick={() => setSelectedMember(m)}
                            className="group hover:bg-brand-cream/30 transition-all cursor-pointer"
                          >
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="brushstroke-border scale-75 -ml-4 group-hover:scale-90 transition-transform">
                                    <div className="brushstroke-inner w-12 h-12">
                                       {m.profilePhotoURL ? <img src={m.profilePhotoURL} className="w-full h-full object-cover" /> : <UserIcon className="text-brand-gold w-6 h-6" />}
                                    </div>
                                 </div>
                                 <div>
                                    <p className="font-black text-slate-800 text-lg tracking-tighter leading-none mb-1">{m.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">{m.memberId}</p>
                                 </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 hidden md:table-cell text-center">
                              <div className="flex flex-col items-center gap-1">
                                <button
                                  disabled={!isSuperAdmin}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleRole(m);
                                  }}
                                  className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all",
                                    m.role === UserRole.SUPER_ADMIN ? "bg-red-50 text-brand-red border-brand-red/30" : 
                                    m.role === UserRole.ADMIN ? "bg-brand-cream text-brand-gold border-brand-gold/30" : 
                                    "bg-slate-50 text-slate-400 border-slate-200",
                                    isSuperAdmin && "hover:scale-105 active:scale-95"
                                  )}
                                >
                                  {m.role === UserRole.SUPER_ADMIN ? <ShieldAlert className="w-2.5 h-2.5" /> : m.role === UserRole.ADMIN ? <Shield className="w-2.5 h-2.5" /> : <UserIcon className="w-2.5 h-2.5" />}
                                  {m.role.replace('_', ' ')}
                                </button>
                                {isSuperAdmin && <span className="text-[7px] text-slate-300 font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">Click to reassign</span>}
                              </div>
                            </td>
                      <td className="px-8 py-6 hidden md:table-cell">
                        <p className="font-black text-slate-600 text-xs tracking-tighter">{m.phone || 'NO CONTACT'}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.email}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-4">
                            <span className={cn(
                              "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                              m.status === MembershipStatus.ACTIVE ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            )}>
                              {m.status}
                            </span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                 onClick={(e) => toggleStatus(e, m)}
                                 className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-brand-red transition-all"
                                 title="Revoke/Authorize"
                               >
                                 <LogOut className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleToggleVerification(m.id);
                                 }}
                                 className={cn(
                                   "p-2 rounded-lg transition-all",
                                   m.verified ? "text-green-500 hover:bg-green-50" : "text-slate-300 hover:bg-slate-100"
                                 )}
                                 title="Verification Status"
                               >
                                 <ShieldCheck className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setMemberToDelete(m);
                                 }}
                                 className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-all"
                                 title="Purge Identity"
                               >
                                 <Trash2 className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setPreviewCertificate(m);
                                 }}
                                 className="p-2 hover:bg-brand-gold/10 rounded-lg text-brand-gold transition-all"
                                 title="Inspect Certificate"
                               >
                                 <ShieldCheck className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setMemberToEdit(m);
                                 }}
                                 className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-brand-gold transition-all"
                                 title="Edit Profile"
                               >
                                 <Edit className="w-4 h-4" />
                               </button>
                            </div>
                         </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                </tbody>
              </table>
            </div>
         </div>
      </div>

      {/* Admin Toolkit */}
      <div className="col-span-12 lg:col-span-3 space-y-6">
        <div className="glass-panel p-8 rounded-[40px] border border-brand-gold/20 flex flex-col gap-4">
           <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-brand-gold mb-4">Registry Toolkit</h3>
           
           <button 
             onClick={() => setShowAddModal(true)}
             className="w-full py-5 bg-brand-red text-white rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
           >
             <Plus className="w-4 h-4" /> Authorize Member
           </button>

           <button 
             onClick={() => navigate('/print')}
             className="w-full py-5 border-2 border-brand-gold text-brand-gold rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase hover:bg-brand-gold hover:text-white active:scale-95 transition-all flex items-center justify-center gap-3 shadow-sm"
           >
             <Download className="w-4 h-4" /> Batch Export
           </button>

           <div className="mt-8 p-6 bg-brand-cream border border-brand-gold/10 rounded-3xl text-center">
              <div className="gold-seal mx-auto w-12 h-12 mb-4 -mt-10">
                 <Shield className="text-white w-6 h-6" />
              </div>
              <p className="text-[10px] font-black text-brand-red uppercase mb-2 tracking-widest">Protocol Active</p>
              <p className="text-[9px] text-slate-400 leading-relaxed italic font-serif">Secure non-sequential URL generation and AES-256 encryption are currently active across all nodes.</p>
           </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {memberToDelete && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-brand-ink/80 backdrop-blur-md"
               onClick={() => setMemberToDelete(null)}
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="relative z-10 w-full max-w-sm bg-white rounded-[40px] overflow-hidden border-2 border-brand-red shadow-2xl"
             >
                <div className="bg-brand-red p-8 text-white text-center">
                   <Trash2 className="w-12 h-12 mx-auto mb-4" />
                   <h3 className="font-serif text-2xl font-black italic">Purge Registry?</h3>
                </div>
                <div className="p-8 text-center">
                   <p className="text-slate-600 font-medium mb-8 leading-relaxed">
                     You are about to permanently erase <span className="font-black text-brand-red">{memberToDelete.name}</span> from the central registry. This protocol is irreversible.
                   </p>
                   <div className="flex flex-col gap-3">
                      <button 
                        onClick={confirmDelete}
                        className="w-full py-4 bg-brand-red text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:brightness-110 transition-all"
                      >
                        Confirm Permanent Deletion
                      </button>
                      <button 
                        onClick={() => setMemberToDelete(null)}
                        className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all"
                      >
                        Abort Protocol
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      {showAddModal && <AddMemberModal onClose={() => setShowAddModal(false)} onAdded={fetchMembers} canAssignRole={isSuperAdmin} />}

      {/* Edit Modal */}
      {memberToEdit && (
        <EditMemberModal 
          member={memberToEdit} 
          onClose={() => setMemberToEdit(null)} 
          onUpdated={fetchMembers} 
          canChangeRole={isSuperAdmin}
        />
      )}
      
      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {previewCertificate && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-brand-ink/60 backdrop-blur-xl"
               onClick={() => setPreviewCertificate(null)}
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="relative z-10 w-full max-w-lg"
             >
                <div className="absolute -top-4 -right-4 z-20">
                   <button 
                     onClick={() => setPreviewCertificate(null)}
                     className="w-12 h-12 rounded-full bg-brand-red text-white flex items-center justify-center shadow-2xl border-2 border-white hover:scale-110 transition-transform"
                   >
                     <X />
                   </button>
                </div>
                <div className="max-h-[90vh] overflow-y-auto py-10 px-4">
                  <div className="text-center mb-8">
                     <p className="text-white text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-60">Internal Registry Inspector</p>
                     <h3 className="text-white font-serif text-2xl italic font-black">Identity Certificate Preview</h3>
                  </div>
                  <IdentityCertificate member={previewCertificate} showStatus={true} />
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Identity Card Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-brand-ink/40 backdrop-blur-md"
               onClick={() => setSelectedMember(null)}
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 30 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 30 }}
               className="relative z-10 w-full max-w-xl"
             >
                <div className="absolute -top-4 -right-4 z-20">
                   <button 
                     onClick={() => setSelectedMember(null)}
                     className="w-12 h-12 rounded-full bg-brand-red text-white flex items-center justify-center shadow-2xl border-2 border-white hover:scale-110 transition-transform"
                   >
                     <X />
                   </button>
                </div>
                <div className="bg-white rounded-[50px] overflow-hidden shadow-2xl border-2 border-brand-gold">
                   <div className="p-10 flex flex-col items-center">
                      <div className="brushstroke-border mb-8">
                         <div className="brushstroke-inner w-40 h-40">
                            {selectedMember.profilePhotoURL ? <img src={selectedMember.profilePhotoURL} className="w-full h-full object-cover" /> : <UserIcon className="text-brand-gold w-16 h-16" />}
                         </div>
                      </div>
                      <h3 className="font-serif text-3xl font-black text-brand-ink mb-2">{selectedMember.name}</h3>
                      <div className="flex items-center gap-3 mb-10">
                         <p className="text-brand-gold font-black text-[10px] tracking-[0.3em] uppercase">MEMBER ID: {selectedMember.memberId}</p>
                         {selectedMember.verified && (
                           <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                              <ShieldCheck className="w-2.5 h-2.5" /> Verified
                           </span>
                         )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 w-full mb-8">
                         <div className="bg-brand-cream/40 p-4 rounded-2xl border border-brand-gold/5 text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Phone</p>
                            <p className="text-xs font-black text-slate-800">{selectedMember.phone || 'N/A'}</p>
                         </div>
                         <div className="bg-brand-cream/40 p-4 rounded-2xl border border-brand-gold/5 text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Birth</p>
                            <p className="text-[10px] font-black text-slate-800 leading-tight">
                               {selectedMember.placeOfBirth && `${selectedMember.placeOfBirth}, `}{selectedMember.dateOfBirth || 'N/A'}
                            </p>
                         </div>
                      </div>

                      <div className="bg-brand-cream/50 p-6 rounded-[32px] border border-brand-gold/10 mb-8 w-full max-w-xs flex justify-center">
                         <QRCodeSVG 
                            value={`${window.location.origin}/verify/${selectedMember.slug}`} 
                            size={180}
                            level="H"
                            imageSettings={{
                              src: "https://raw.githubusercontent.com/lucide-react/lucide/main/icons/shield.svg",
                              height: 40,
                              width: 40,
                              excavate: true,
                            }}
                         />
                      </div>
                      
                      <div className="flex flex-col gap-4 w-full mt-4">
                         <div className="flex gap-4 w-full">
                            <div className="flex-1 bg-brand-cream/40 p-4 rounded-2xl border border-brand-gold/5">
                               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Status</p>
                               <p className="font-black text-slate-800 uppercase tracking-tighter">{selectedMember.status}</p>
                            </div>
                            <div className="flex-1 bg-brand-cream/40 p-4 rounded-2xl border border-brand-gold/5">
                               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Joined</p>
                               <p className="font-black text-slate-800 uppercase tracking-tighter">{formatDate(selectedMember.joinDate)}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


function ChangePhotoModal({ memberId, currentPhoto, onClose, onUpdated }: { memberId: string, currentPhoto: string, onClose: () => void, onUpdated: () => void }) {
  const [photoURL, setPhotoURL] = useState(currentPhoto);
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      alert('Only official JPG, JPEG or PNG portraits are accepted by the registry.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Portrait file size exceeds the 2MB registry limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoURL(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await MemberService.updateMemberPhoto(memberId, photoURL);
      onUpdated();
      onClose();
    } catch (error) {
      alert('Error updating photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-brand-ink/40 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] w-full max-w-sm shadow-2xl overflow-hidden relative z-10 border-2 border-brand-gold"
      >
        <div className="bg-brand-red p-8 text-white text-center">
          <Camera className="w-10 h-10 mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-black italic">Update Portrait</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col items-center">
               <div className="w-32 h-32 rounded-2xl border-2 border-brand-gold/20 overflow-hidden mb-4 bg-brand-cream flex items-center justify-center">
                  {photoURL ? (
                    <img src={photoURL} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-12 h-12 text-brand-gold/30" />
                  )}
               </div>
               
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 onChange={handleFileChange}
                 accept=".jpg,.jpeg,.png"
                 className="hidden"
               />
               
               <button 
                 type="button"
                 onClick={() => fileInputRef.current?.click()}
                 className="w-full py-3 bg-brand-gold text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"
               >
                 <Upload className="w-4 h-4" /> Upload JPG/PNG
               </button>
            </div>

            <div className="relative">
               <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-brand-gold/10"></div>
               </div>
               <div className="relative flex justify-center text-[8px] uppercase font-black text-slate-400">
                 <span className="bg-white px-2">or specify URL</span>
               </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest font-black text-slate-400 ml-2">Direct Link</label>
              <input 
                className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-3 px-6 rounded-xl transition-all font-bold text-slate-800 text-xs"
                value={photoURL}
                onChange={e => setPhotoURL(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-red text-white font-black py-5 rounded-2xl transition-all disabled:opacity-50 uppercase tracking-widest text-[10px]"
          >
            {loading ? 'Encrypting...' : 'Update Identity'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}


function ChangePasswordModal({ memberId, onClose }: { memberId: string, onClose: () => void }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await MemberService.updateMemberPassword(memberId, password);
      alert('Identity key successfully rotated.');
      onClose();
    } catch (error) {
      alert('Protocol error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-brand-ink/40 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] w-full max-w-sm shadow-2xl overflow-hidden relative z-10 border-2 border-brand-gold"
      >
        <div className="bg-brand-gold p-8 text-white text-center">
          <Key className="w-10 h-10 mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-black italic">Rotate Key</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-4">New Access Key</label>
            <input 
              required
              type="password"
              className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-4 px-6 rounded-2xl transition-all font-bold text-slate-800"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 8 characters"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-red text-white font-black py-5 rounded-2xl transition-all disabled:opacity-50 uppercase tracking-widest text-[10px]"
          >
            {loading ? 'Rotating...' : 'Confirm Encryption'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}


function AddMemberModal({ onClose, onAdded, canAssignRole }: { onClose: () => void, onAdded: () => void, canAssignRole?: boolean }) {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    memberId: '',
    phone: '',
    placeOfBirth: '',
    dateOfBirth: '',
    profilePhotoURL: '',
    role: UserRole.MEMBER
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await MemberService.createMember(formData);
      onAdded();
      onClose();
    } catch (error) {
      alert('Error creating member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-brand-red/10 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[50px] w-full max-w-2xl shadow-[0_50px_100px_rgba(0,0,0,0.2)] overflow-hidden relative z-10 border-2 border-brand-gold max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-brand-red p-10 text-white flex justify-between items-center sticky top-0 z-20">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 block mb-2">New Registry Entry</span>
            <h3 className="font-serif text-3xl font-black italic underline underline-offset-8 decoration-brand-gold/40">Credential Authorization</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-4">Full Identity Name</label>
              <input 
                required
                className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-4 px-6 rounded-2xl transition-all font-bold text-slate-800"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-4">Authorized Email</label>
              <input 
                required
                type="email"
                className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-4 px-6 rounded-2xl transition-all font-bold text-slate-800"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-4">Phone Number</label>
              <input 
                className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-4 px-6 rounded-2xl transition-all font-bold text-slate-800"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-4">Membership Number</label>
              <input 
                className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-4 px-6 rounded-2xl transition-all font-bold text-slate-800 font-mono"
                value={formData.memberId}
                onChange={e => setFormData({ ...formData, memberId: e.target.value })}
                placeholder="Leave blank for auto-generate"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-4">Place of Birth</label>
              <input 
                className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-4 px-6 rounded-2xl transition-all font-bold text-slate-800"
                value={formData.placeOfBirth}
                onChange={e => setFormData({ ...formData, placeOfBirth: e.target.value })}
                placeholder="City, Country"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-4">Date of Birth</label>
              <input 
                type="date"
                className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-4 px-6 rounded-2xl transition-all font-bold text-slate-800"
                value={formData.dateOfBirth}
                onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-4">Registry Password</label>
            <input 
              required
              type="password"
              className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-4 px-6 rounded-2xl transition-all font-bold text-slate-800"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="Initial access key"
            />
          </div>

          {canAssignRole && (
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-4">Authorized Access Level</label>
              <select 
                className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-4 px-6 rounded-2xl transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
              >
                <option value={UserRole.MEMBER}>Standard Member Access</option>
                <option value={UserRole.ADMIN}>Regional Admin Access</option>
                <option value={UserRole.SUPER_ADMIN}>Universal Super Admin Access</option>
              </select>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-4">Profile Photo URL (Optional)</label>
            <input 
              className="w-full bg-brand-cream border-2 border-transparent focus:border-brand-gold outline-none py-4 px-6 rounded-2xl transition-all font-bold text-slate-800"
              value={formData.profilePhotoURL}
              onChange={e => setFormData({ ...formData, profilePhotoURL: e.target.value })}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className="pt-8">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-red text-white font-black py-6 rounded-3xl shadow-2xl hover:brightness-110 hover:-translate-y-1 active:translate-y-0 shadow-brand-red/20 transition-all disabled:opacity-50 uppercase tracking-[0.3em] text-xs"
            >
              {loading ? 'Processing Protocol...' : 'Authorize Identity'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
