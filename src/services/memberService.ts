/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Member, MembershipStatus, UserRole } from '../types';

const MEMBERS_KEY = 'elite_members_db';
const CONFIG_KEY = 'elite_config_db';

// Initial Dummy Data for the "Elite" brand feel
const INITIAL_MEMBERS: Member[] = [
  {
    id: '1',
    memberId: 'INTI-2026-0001',
    name: 'Alexander Saint-Claire',
    email: 'admin@example.com',
    password: 'admin123',
    status: MembershipStatus.ACTIVE,
    role: UserRole.SUPER_ADMIN,
    profilePhotoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    joinDate: new Date('2026-01-01').toISOString(),
    slug: 'alexander-premium-vault-882',
    userId: 'dummy-admin-123',
    verified: true
  },
  {
    id: '2',
    memberId: 'INTI-2026-0002',
    name: 'Mario Rossi',
    email: 'Mario@email.com',
    password: 'Kent123',
    phone: '+39 123 456 789',
    placeOfBirth: 'Rome, Italy',
    dateOfBirth: '1990-05-20',
    status: MembershipStatus.ACTIVE,
    role: UserRole.MEMBER,
    profilePhotoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
    joinDate: new Date('2026-02-15').toISOString(),
    slug: 'mario-kent-identity-991',
    userId: 'dummy-mario-456',
    verified: false
  }
];

const getStoredMembers = (): Member[] => {
  const stored = localStorage.getItem(MEMBERS_KEY);
  let members: Member[] = [];
  
  if (!stored) {
    members = INITIAL_MEMBERS;
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(INITIAL_MEMBERS));
  } else {
    members = JSON.parse(stored);
  }

  // Migration: Ensure every member has a slug and joined date
  let changed = false;
  const migrated = members.map(m => {
    if (!m.slug) {
      m.slug = Math.random().toString(36).substring(2, 15);
      changed = true;
    }
    if (!m.joinDate) {
      m.joinDate = new Date().toISOString();
      changed = true;
    }
    if (m.verified === undefined) {
      m.verified = false;
      changed = true;
    }
    if (!m.role) {
      if (m.userId === 'dummy-admin-123') {
        m.role = UserRole.SUPER_ADMIN;
      } else {
        m.role = UserRole.MEMBER;
      }
      changed = true;
    }
    return m;
  });

  if (changed) {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(migrated));
  }
  
  return migrated;
};

export const MemberService = {
  async getMemberBySlug(slug: string): Promise<Member | null> {
    const members = getStoredMembers();
    const target = slug.trim().toLowerCase();
    
    // Defensive check: ensure all members have slugs before searching
    return members.find(m => {
      if (!m.slug) return false;
      return m.slug.toLowerCase() === target || m.memberId?.toLowerCase() === target;
    }) || null;
  },

  async getMemberByUserId(userId: string): Promise<Member | null> {
    const members = getStoredMembers();
    return members.find(m => m.userId === userId) || null;
  },

  async getUserRole(userId: string): Promise<UserRole> {
    const members = getStoredMembers();
    const member = members.find(m => m.userId === userId);
    if (member) return member.role;

    // Fallback for special cases or if not found
    if (userId === 'dummy-admin-123') return UserRole.SUPER_ADMIN;
    return UserRole.MEMBER;
  },

  async getAllMembers(): Promise<Member[]> {
    return getStoredMembers();
  },

  async createMember(data: Partial<Member>): Promise<string> {
    const members = getStoredMembers();
    const configRaw = localStorage.getItem(CONFIG_KEY);
    const config = configRaw ? JSON.parse(configRaw) : { memberCounter: 1 };
    
    const count = config.memberCounter + 1;
    const year = new Date().getFullYear();
    const memberId = `INTI-${year}-${count.toString().padStart(4, '0')}`;
    const slug = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);

    const newMember: Member = {
      id: Math.random().toString(36).substring(7),
      memberId: data.memberId || memberId,
      name: data.name || 'Anonymous Member',
      email: data.email || '',
      password: data.password || 'inti123',
      phone: data.phone || '',
      placeOfBirth: data.placeOfBirth || '',
      dateOfBirth: data.dateOfBirth || '',
      status: data.status || MembershipStatus.ACTIVE,
      role: data.role || UserRole.MEMBER,
      verified: data.verified || false,
      profilePhotoURL: data.profilePhotoURL || '',
      joinDate: new Date().toISOString(),
      slug,
      userId: data.userId || Math.random().toString(36).substring(2, 15)
    };

    const updatedMembers = [...members, newMember];
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(updatedMembers));
    localStorage.setItem(CONFIG_KEY, JSON.stringify({ memberCounter: count }));
    
    return newMember.id;
  },

  async updateMemberStatus(id: string, status: MembershipStatus): Promise<void> {
    const members = getStoredMembers();
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index].status = status;
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
    }
  },

  async toggleVerification(id: string): Promise<void> {
    const members = getStoredMembers();
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index].verified = !members[index].verified;
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
    }
  },

  async updateMemberPassword(id: string, password: string): Promise<void> {
    const members = getStoredMembers();
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index].password = password;
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
    }
  },

  async updateMemberPhoto(id: string, photoURL: string): Promise<void> {
    const members = getStoredMembers();
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index].profilePhotoURL = photoURL;
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
    }
  },

  async updateMemberProfile(id: string, data: Partial<Member>): Promise<void> {
    const members = getStoredMembers();
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index] = { ...members[index], ...data };
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
    }
  },

  async updateMemberRole(id: string, role: UserRole): Promise<void> {
    const members = getStoredMembers();
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index].role = role;
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
    }
  },

  async deleteMember(id: string): Promise<void> {
    const members = getStoredMembers();
    const updatedMembers = members.filter(m => m.id !== id);
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(updatedMembers));
  }
};

