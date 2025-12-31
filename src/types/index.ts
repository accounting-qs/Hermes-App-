export type UserRole = 'qs_team' | 'client';
export type UserSubType = 'Lead Coach' | 'coach' | 'executive' | 'assistant';
export type BrandPhase = 'foundation' | 'messaging' | 'webinar' | 'launch' | 'running' | 'scaling';
export type BrandStatus = 'active' | 'onboarding' | 'paused' | 'completed';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  subType: UserSubType;
  brandIds: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  companyName: string;
  website?: string;
  industry: string;
  description?: string;
  logo?: string;
  status: BrandStatus;
  phase: BrandPhase;
  progress: {
    overall: number;
    research: number;
    offers: number;
    webinar: number;
    delivery: number;
  };
  team: {
    coaches: string[];
    executive?: string;
    assistant?: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  variant?: 'default' | 'ghost';
}
