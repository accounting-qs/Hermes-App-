"use client";

import React from "react";
import { ShieldAlert, LogOut, ArrowLeft, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function UnauthorizedPage() {
    const router = useRouter();
    const { signOut } = useAuth();

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 premium-gradient opacity-10" />
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px]"
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full bg-card border border-border/50 rounded-[2.5rem] p-12 text-center relative z-10 shadow-2xl"
            >
                {/* Icon Header */}
                <div className="flex justify-center mb-10">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/10 relative z-10">
                            <ShieldAlert className="w-12 h-12" />
                        </div>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-4 border border-emerald-500/20 rounded-[2rem] border-dashed"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <h1 className="text-4xl font-black outfit-font tracking-tight leading-none">
                        Access <span className="text-emerald-500">Restricted</span>
                    </h1>

                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                        Your account has successfully authenticated with Google, but you are not currently on the
                        <span className="text-foreground font-bold italic px-1">Hermes Whitelist</span>.
                    </p>

                    <div className="bg-secondary/30 rounded-2xl p-6 border border-border/50 text-left space-y-3">
                        <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                            <Lock className="w-4 h-4" />
                            Security Protocol
                        </div>
                        <p className="text-xs text-muted-foreground/80 leading-relaxed uppercase tracking-tighter">
                            Unauthorized entry attempt logged. Please contact your system administrator to request access to the Quantum Scale ecosystem.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            onClick={() => router.push('/login')}
                            className="flex-1 py-4 bg-secondary border border-border/50 text-foreground font-bold rounded-2xl hover:bg-secondary/80 transition-all flex items-center justify-center gap-3 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Return to Login
                        </button>

                        <button
                            onClick={() => signOut()}
                            className="flex-1 py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                        >
                            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            Sign Out Account
                        </button>
                    </div>
                </div>

                {/* Footer system details */}
                <div className="mt-12 flex items-center justify-center gap-4 opacity-30">
                    <div className="h-[1px] w-8 bg-muted-foreground" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Hermes Security Engine v3.0</span>
                    <div className="h-[1px] w-8 bg-muted-foreground" />
                </div>
            </motion.div>
        </div>
    );
}
