"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    session: Session | null;
    user: SupabaseUser | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { login, logout } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        console.log('AuthContext: Initializing...');
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('AuthContext: Initial session fetch complete', { hasSession: !!session });
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                checkWhitelist(session.user);
            } else {
                console.log('AuthContext: No initial session, setting isLoading false');
                setIsLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('AuthContext: onAuthStateChange triggered', { event, userId: session?.user?.id });
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                await checkWhitelist(session.user);
            } else {
                console.log('AuthContext: No user in onAuthStateChange, logging out and setting isLoading false');
                logout();
                setIsLoading(false);
            }
        });

        return () => {
            console.log('AuthContext: Cleaning up subscription');
            subscription.unsubscribe();
        };
    }, []);

    const checkWhitelist = async (supabaseUser: SupabaseUser) => {
        console.log('AuthContext: Starting whitelist check for', supabaseUser.email);
        // Prevent redundant checks if we already have this user synced
        const currentUser = useAuthStore.getState().user;
        if (currentUser?.id === supabaseUser.id && !isLoading) {
            console.log('AuthContext: User already synced, skipping whitelist check');
            setIsLoading(false);
            return;
        }

        try {
            console.log('AuthContext: Querying allowed_users table...');
            const { data, error } = await supabase
                .from('allowed_users')
                .select('role')
                .eq('email', supabaseUser.email)
                .single();

            if (error || !data) {
                console.warn('AuthContext: Unauthorized - User not whitelisted', error);
                await supabase.auth.signOut();
                logout();
                router.push('/login?error=unauthorized');
                return;
            }

            console.log('AuthContext: Whitelist check passed', { role: data.role });
            // Sync with Zustand store
            login({
                id: supabaseUser.id,
                email: supabaseUser.email!,
                name: supabaseUser.user_metadata.full_name || supabaseUser.email!.split('@')[0],
                avatar: supabaseUser.user_metadata.avatar_url,
                role: 'qs_team',
                subType: data.role === 'admin' ? 'Lead Coach' : 'coach',
                brandIds: [],
                status: 'active',
                createdAt: supabaseUser.created_at,
                updatedAt: new Date().toISOString(),
            });

        } catch (err) {
            console.error('AuthContext: Whitelist check technical failure', err);
            await supabase.auth.signOut();
            logout();
        } finally {
            console.log('AuthContext: Whitelist check process finished, setting isLoading false');
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        console.log('AuthContext: Signing out...');
        await supabase.auth.signOut();
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
