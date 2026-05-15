import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from './lib/firebase';
import { MemberService } from './services/memberService';
import { UserRole, Member } from './types';

// Pages (to be created)
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Verify from './pages/Verify';
import PrintView from './pages/PrintView';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRole = await MemberService.getUserRole(currentUser.uid);
        setRole(userRole);
        
        const data = await MemberService.getMemberByUserId(currentUser.uid);
        setMember(data);
      } else {
        setRole(null);
        setMember(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} role={role} />} />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} role={role} member={member} /> : <Navigate to="/" />} 
        />
        <Route path="/verify/:slug" element={<Verify />} />
        <Route 
          path="/print" 
          element={role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN ? <PrintView /> : <Navigate to="/" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

import { auth } from './lib/firebase';
