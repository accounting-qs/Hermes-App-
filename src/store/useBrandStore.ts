import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Brand } from '@/types';

interface BrandState {
    brands: Brand[];
    selectedBrandId: string | null;
    setBrands: (brands: Brand[]) => void;
    selectBrand: (id: string | null) => void;
}

export const useBrandStore = create<BrandState>()(
    persist(
        (set) => ({
            brands: [],
            selectedBrandId: null,
            setBrands: (brands) => set({ brands }),
            selectBrand: (id) => set({ selectedBrandId: id }),
        }),
        {
            name: 'hermes-brand-storage',
            partialize: (state) => ({ selectedBrandId: state.selectedBrandId, brands: state.brands }),
        }
    )
);
