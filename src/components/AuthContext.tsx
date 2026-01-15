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
        console.log(`AuthContext: Starting whitelist check for ${supabaseUser.email} (Attempt ${retryCount + 1})`);

        // Ensure we are in a loading state while checking
        setIsLoading(true);

        try {
            console.time(`WhitelistQuery-${supabaseUser.id}`);
            console.log(`AuthContext: Querying allowed_users for email: [${supabaseUser.email}]`);

            const { data, error } = await supabaseClient
                .from('allowed_users')
                .select('role, full_name, brand_id')
                .eq('email', supabaseUser.email)
                .single();

            console.timeEnd(`WhitelistQuery-${supabaseUser.id}`);

            if (error || !data) {
                console.error('AuthContext: Whitelist query failed or returned no data', {
                    error,
                    errorCode: error?.code,
                    email: supabaseUser.email
                });

                // If it's a transient failure and we have retries left, try again
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
            // Sync with Zustand store
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

            login(hermesUser);
            setUser(hermesUser);

            // Automatically select the user's brand if they are a client
            if (hermesUser.brandId && hermesUser.role.startsWith('client_')) {
                console.log('AuthContext: Automatically selecting brand:', hermesUser.brandId);
                const { selectBrand } = (await import('@/store/useBrandStore')).useBrandStore.getState();
                selectBrand(hermesUser.brandId);
            }


        } catch (err) {
            console.error('AuthContext: Whitelist check failure', err);
            // If it's a timeout or technical failure, we don't necessarily want to 
            // lock the user out of the login page, but we must stop loading.
            setIsLoading(false);

            // Optionally redirect to error or login
            // router.push('/login?error=technical');
        } finally {
            console.log('AuthContext: Whitelist check process finished, setting isLoading false');
            setIsLoading(false);
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
