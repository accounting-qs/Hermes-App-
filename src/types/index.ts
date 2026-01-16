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

export interface BrandProgress {
  overall: number;
  research?: number;
  offers?: number;
  webinar?: number;
  delivery?: number;
}

export interface Brand {
  id: string;
  name: string;
  industry: string;
  status: BrandStatus;
  phase: string;
  progress: BrandProgress;
  companyName?: string;
  website?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type ResourceType = 'file' | 'link' | 'asset' | 'note';
export type ResourceStatus = 'indexing' | 'ready' | 'error';

export type OfferType = 'core' | 'lead_magnet' | 'downsell';
export type OfferStatus = 'draft' | 'active' | 'archived';

export interface BrandOffer {
  id: string;
  brand_id: string;
  title: string;
  offer_type: OfferType;
  status: OfferStatus;
  pricing_data: {
    price: number;
    currency: string;
    payment_model: string;
  };
  content_full: {
    promise: string;
    mechanism: string;
    bonus_stack: Array<{ title: string; value: string }>;
    guarantee: string;
    value_equation_math: {
      score: number;
      factors: {
        outcome: number;
        likelihood: number;
        delay: number;
        effort: number;
      }
    }
  };
  ai_rationale: string;
  created_at: string;
}

export interface OfferIteration {
  id: string;
  offer_id: string;
  content_snapshot: any;
  refinement_prompt: string;
  created_at: string;
}

export interface BrandResource {
  id: string;
  brand_id: string;
  type: ResourceType;
  category: string;
  title: string;
  content_text?: string;
  file_url?: string;
  metadata: {
    size?: number;
    token_count?: number;
    status: ResourceStatus;
    mime_type?: string;
  };
  created_at: string;
}


export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  variant?: 'default' | 'ghost';
}
