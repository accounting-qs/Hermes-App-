"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-ssr/client';

import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '@/types';


interface AuthContextType {
    session: Session | null;
    user: User | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a single supabase instance for the client
const supabaseClient = createClient();

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { login, logout } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        console.log('AuthContext: Initializing...');

        // Safety timeout to prevent infinite loading state
        const timeoutId = setTimeout(() => {
            if (isLoading) {
                console.warn('AuthContext: Global loading timeout reached (25s), forcing isLoading to false');
                setIsLoading(false);
            }
        }, 25000); // 25 seconds timeout

        // Get initial session
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            console.log('AuthContext: Initial session fetch complete', { hasSession: !!session });
            setSession(session);
            if (session?.user) {
                checkWhitelist(session.user);
            } else {
                console.log('AuthContext: No initial session, setting isLoading false');
                setUser(null);
                setIsLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
            console.log('AuthContext: onAuthStateChange triggered', { event, userId: session?.user?.id });
            setSession(session);

            if (session?.user) {
                await checkWhitelist(session.user);
            } else {
                console.log('AuthContext: No user in onAuthStateChange, logging out and setting isLoading false');
                logout();
                setUser(null);
                setIsLoading(false);
            }
        });

        return () => {
            console.log('AuthContext: Cleaning up subscription');
            clearTimeout(timeoutId);
            subscription.unsubscribe();
        };
    }, []);

    const checkWhitelist = async (supabaseUser: SupabaseUser, retryCount = 0) => {
        const isInitialLoad = isLoading && !user;
        console.log(`AuthContext: Starting whitelist check for ${supabaseUser.email} (Attempt ${retryCount + 1}) [isInitialLoad: ${isInitialLoad}]`);

        // Only block UI if this is the initial load or we don't have a user yet
        if (isInitialLoad) {
            setIsLoading(true);
        }

        try {
            // Optimistic check: if we already have a user and IDs match, don't query DB unless forced
            if (user?.id === supabaseUser.id && !isInitialLoad) {
                console.log('AuthContext: Skipping DB check - User already loaded and requires no update.');
                return;
            }

            console.time(`WhitelistQuery-${supabaseUser.id}`);
            // ... (rest of the query logic remains the same)

            const { data, error } = await supabaseClient
                .from('allowed_users')
                .select('role, full_name, brand_id')
                .eq('email', supabaseUser.email)
                .single();

            console.timeEnd(`WhitelistQuery-${supabaseUser.id}`);

            if (error || !data) {
                // ... (error handling)
                if (retryCount < 1 && (!error || (error.code !== 'PGRST116' && error.code !== '42501'))) {
                    console.log('AuthContext: Retrying whitelist check due to potential transient failure...');
                    return checkWhitelist(supabaseUser, retryCount + 1);
                }

                console.warn('AuthContext: Unauthorized - User not whitelisted', error);

                if (error?.code === 'PGRST116' || !data) {
                    await supabaseClient.auth.signOut();
                    logout();
                    router.push('/unauthorized');
                    return;
                }
                throw error || new Error('Whitelisting check failed');
            }

            console.log('AuthContext: Whitelist check passed', { role: data.role, brand: data.brand_id });

            const hermesUser: User = {
                id: supabaseUser.id,
                email: supabaseUser.email!,
                name: data.full_name || supabaseUser.user_metadata.full_name || supabaseUser.email!.split('@')[0],
                avatar: supabaseUser.user_metadata.avatar_url,
                role: (data.role as UserRole) || 'client_executive',
                brandId: data.brand_id,
                status: 'active',
                createdAt: supabaseUser.created_at,
                updatedAt: new Date().toISOString(),
            };

            // Only update state if data actually changed to avoid re-renders
            if (JSON.stringify(hermesUser) !== JSON.stringify(user)) {
                login(hermesUser);
                setUser(hermesUser);

                if (hermesUser.brandId && hermesUser.role.startsWith('client_')) {
                    console.log('AuthContext: Automatically selecting brand:', hermesUser.brandId);
                    const { selectBrand } = (await import('@/store/useBrandStore')).useBrandStore.getState();
                    selectBrand(hermesUser.brandId);
                }
            }

        } catch (err) {
            console.error('AuthContext: Whitelist check failure', err);
            // Only stop loading if we were loading
            if (isInitialLoad) setIsLoading(false);
        } finally {
            if (isInitialLoad) {
                console.log('AuthContext: Initial whitelist check finished, releasing loader');
                setIsLoading(false);
            }
        }
    };


    const signOut = async () => {
        console.log('AuthContext: Signing out...');
        await supabaseClient.auth.signOut();
        logout();
        router.push('/login');
    };


    return (
        <AuthContext.Provider value={{ session, user, isLoading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
