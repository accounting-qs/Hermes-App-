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
        industry: 'Marketing Automation',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'brand-2',
        name: 'Nexus Tech',
        industry: 'SaaS',
        status: 'onboarding',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
