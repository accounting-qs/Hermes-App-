import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: {
                id: '1',
                email: 'coach@quantumscale.ai',
                name: 'Chris Welker',
                role: 'qs_team',
                subType: 'Lead Coach',
                brandIds: ['brand-1', 'brand-2'],
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            isAuthenticated: true, // Default to true for prototype
            login: (userData) => {
                set({
                    user: userData,
                    isAuthenticated: true,
                });
            },
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'hermes-auth-storage',
        }
    )
);
