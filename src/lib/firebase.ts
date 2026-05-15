/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Mocking Firebase Auth and Firestore for "Dummy Account" mode
export const auth = {
  currentUser: null as any
};

export const db = {}; // Placeholder

export const googleProvider = {};

// Mock Auth functions
export const signInWithPopup = async (_auth?: any, _provider?: any) => {
  const dummyUser = {
    uid: 'dummy-admin-123',
    email: 'admin@example.com',
    displayName: 'Elite Admin',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
  };
  auth.currentUser = dummyUser;
  localStorage.setItem('dummy_user', JSON.stringify(dummyUser));
  window.location.reload();
  return { user: dummyUser };
};

export const signInWithEmailAndPassword = async (_auth: any, email: string, pass: string) => {
  let dummyUser: any = null;
  
  if (email === 'admin@example.com' && pass === 'admin123') {
    dummyUser = {
      uid: 'dummy-admin-123',
      email: 'admin@example.com',
      displayName: 'Elite Admin',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
    };
  } else {
    // Check dynamic members list
    const stored = localStorage.getItem('elite_members_db');
    if (stored) {
      const members = JSON.parse(stored);
      const member = members.find((m: any) => m.email === email && m.password === pass);
      if (member) {
        dummyUser = {
          uid: member.userId,
          email: member.email,
          displayName: member.name,
          photoURL: member.profilePhotoURL
        };
      }
    }
  }

  if (dummyUser) {
    auth.currentUser = dummyUser;
    localStorage.setItem('dummy_user', JSON.stringify(dummyUser));
    window.location.reload();
    return { user: dummyUser };
  } else {
    throw new Error('Invalid credentials');
  }
};

export const signOut = async (_auth?: any) => {
  auth.currentUser = null;
  localStorage.removeItem('dummy_user');
  window.location.reload();
};

export const onAuthStateChanged = (_authObj: any, callback: (user: any) => void) => {
  const savedUser = localStorage.getItem('dummy_user');
  if (savedUser) {
    const user = JSON.parse(savedUser);
    auth.currentUser = user;
    callback(user);
  } else {
    callback(null);
  }
  return () => {}; // Unsubscribe mock
};

export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

