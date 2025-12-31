import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Brand } from '@/types';

interface BrandState {
    brands: Brand[];
    selectedBrandId: string | null;
    addBrand: (brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>) => void;
    selectBrand: (id: string | null) => void;
    updateBrand: (id: string, updates: Partial<Brand>) => void;
}

const mockBrands: Brand[] = [
    {
        id: 'brand-1',
        name: 'Quantum Scale',
        companyName: 'Quantum Scale Agency',
        website: 'https://quantumscale.ai',
        industry: 'Marketing Automation',
        status: 'active',
        phase: 'launch',
        progress: {
            overall: 75,
            research: 100,
            offers: 90,
            webinar: 80,
            delivery: 40,
        },
        team: {
            coaches: ['1'],
            executive: 'exec-1',
            assistant: 'asst-1',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: '1',
    },
    {
        id: 'brand-2',
        name: 'Nexus Tech',
        companyName: 'Nexus Global Systems',
        website: 'https://nexustech.io',
        industry: 'SaaS',
        status: 'onboarding',
        phase: 'foundation',
        progress: {
            overall: 20,
            research: 50,
            offers: 0,
            webinar: 0,
            delivery: 0,
        },
        team: {
            coaches: ['1'],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: '1',
    }
];

export const useBrandStore = create<BrandState>()(
    persist(
        (set) => ({
            brands: mockBrands,
            selectedBrandId: null,
            addBrand: (brand) => {
                const newBrand: Brand = {
                    ...brand,
                    id: `brand-${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                set((state) => ({ brands: [...state.brands, newBrand] }));
            },
            selectBrand: (id) => set({ selectedBrandId: id }),
            updateBrand: (id, updates) => {
                set((state) => ({
                    brands: state.brands.map((b) =>
                        b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
                    ),
                }));
            },
        }),
        {
            name: 'hermes-brand-storage',
        }
    )
);
