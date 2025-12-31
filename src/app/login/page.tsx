"use client";

import React, { useState } from "react";
import {
    Mail,
    Lock,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Zap,
    CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthStore();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            login({
                id: 'user_1',
                email: 'coach@quantumscale.ai',
                name: 'Chris Welker',
                role: 'qs_team',
                subType: 'Lead Coach',
                brandIds: ['brand-1', 'brand-2'],
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            router.push('/dashboard');
        }, 1500);
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
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold outfit-font">Welcome Back</h2>
                        <p className="text-muted-foreground text-sm font-medium">Please enter your details to access your portal.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="email"
                                        placeholder="coach@quantumscale.ai"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-secondary/30 border border-border/50 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                                    <button type="button" className="text-[10px] font-bold text-primary hover:underline">Forgot Password?</button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-secondary/30 border border-border/50 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 premium-gradient text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                            ) : (
                                <>
                                    Connect to Portal
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center space-y-4">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
                            <span className="relative px-4 text-[10px] font-bold text-muted-foreground bg-card uppercase tracking-[0.2em]">Restricted Access</span>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                            This system is for authorized Quantum Scale team members and invited clients only.
                            Secure encryption enabled.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-8 left-0 w-full text-center">
                    <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Powered by Hermes AI Engine v2.0</span>
                </div>
            </div>
        </div>
    );
}
