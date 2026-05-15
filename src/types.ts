export enum MembershipStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MEMBER = 'member'
}

export interface Member {
  id: string; // Firestore ID
  memberId: string; // INTI-2026-0001
  name: string;
  email: string;
  password?: string;
  phone?: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  status: MembershipStatus;
  role: UserRole;
  verified: boolean;
  profilePhotoURL: string;
  joinDate: string;
  slug: string;
  userId: string;
}

export interface AdminRecord {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AppState {
  user: any | null;
  role: UserRole | null;
  memberData: Member | null;
  loading: boolean;
}
