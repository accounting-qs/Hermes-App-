export type UserRole = 'qs_team' | 'client_executive' | 'client_assistant';
export type BrandStatus = 'onboarding' | 'active' | 'scaling';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  brandId?: string; // Nullable for QS Team, mandatory for Clients
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  industry: string;
  status: BrandStatus;
  phase: string;
  progress: {
    overall: number;
  };
  createdAt: string;
  updatedAt: string;
}


export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  variant?: 'default' | 'ghost';
}
