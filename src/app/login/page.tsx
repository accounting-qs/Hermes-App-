"use client";

import React, { useState, useEffect } from "react";
import {
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Zap,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam === 'unauthorized') {
            setError("Access Restricted: Your email is not on the authorized whitelist. Please contact the administrator.");
        }
    }, [searchParams]);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
            {/* Visual Side */}
            <div className="md:flex-1 relative hidden md:block overflow-hidden">
                <div className="absolute inset-0 premium-gradient opacity-20" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-40" />

                <div className="relative h-full flex flex-col justify-center p-16 space-y-8 z-10">
                    <div className="w-16 h-16 rounded-2xl premium-gradient flex items-center justify-center shadow-2xl shadow-primary/40">
                        <span className="text-3xl font-bold text-white">H</span>
                    </div>

                    <div className="space-y-4 max-w-lg">
                        <h1 className="text-6xl font-black outfit-font leading-tight">
                            Scale to <span className="text-primary">Infinity</span> with AI.
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            The world's first AI-powered agency ecosystem for high-ticket scaling.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-12">
                        {[
                            { label: 'Automated Research', icon: Sparkles },
                            { label: 'Offer Architecture', icon: ShieldCheck },
                            { label: 'Webinar Ecosystem', icon: Zap },
                            { label: 'Growth Tracking', icon: CheckCircle2 },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                {item.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floating elements */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"
                />
            </div>

            {/* Form Side */}
            <div className="md:w-[500px] w-full bg-card border-l border-border/50 flex flex-col justify-center p-8 md:p-16 relative">
                <div className="max-w-md mx-auto w-full space-y-10">
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-3xl font-bold outfit-font">Access Portals</h2>
                        <p className="text-muted-foreground text-sm font-medium">Use your organizational account to continue.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3"
                        >
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-xs font-semibold leading-relaxed">{error}</p>
                        </motion.div>
                    )}

                    <div className="space-y-6">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full py-4 bg-secondary/50 border border-border/50 text-foreground font-bold rounded-xl shadow-sm hover:bg-secondary transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                        />
                                    </svg>
                                    Continue with Google
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform opacity-50" />
                                </>
                            )}
                        </button>

                        <div className="relative flex items-center justify-center py-2">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
                            <span className="relative px-4 text-[10px] font-bold text-muted-foreground bg-card uppercase tracking-[0.2em]">Authorized Access Only</span>
                        </div>

                        <p className="text-center text-[10px] text-muted-foreground/60 leading-relaxed max-w-[280px] mx-auto uppercase tracking-tighter">
                            By continuing, you agree to the hermes ai ecosystem security and data governance protocols.
                        </p>
                    </div>

                    <div className="text-center space-y-4">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            This system is for authorized Quantum Scale team members and invited clients only.
                            Secure encryption enabled.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-8 left-0 w-full text-center">
                    <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Powered by Hermes AI Engine v3.0</span>
                </div>
            </div>
        </div>
    );
}
