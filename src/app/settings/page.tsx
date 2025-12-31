"use client";

import React, { useState } from "react";
import {
    Settings as SettingsIcon,
    User,
    Shield,
    Zap,
    Bell,
    Globe,
    Database,
    Lock,
    ChevronRight,
    Moon,
    Cloud,
    Mail,
    Smartphone,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'account' | 'workspace' | 'ai' | 'security'>('account');

    const tabs = [
        { id: 'account', label: 'My Account', icon: User },
        { id: 'workspace', label: 'Workspace', icon: Globe },
        { id: 'ai', label: 'AI Configuration', icon: Zap },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <SettingsIcon className="w-5 h-5 text-primary" />
                        <h1 className="text-3xl font-bold outfit-font">Settings</h1>
                    </div>
                    <p className="text-muted-foreground">Manage your personal preferences, workspace configuration, and AI engine settings.</p>
                </div>

                <button className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                                activeTab === tab.id
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                        </button>
                    ))}

                    <div className="pt-8 px-4">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Support</div>
                        <button className="w-full flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground py-2 transition-colors">
                            <Cloud className="w-4 h-4" />
                            Documentation
                        </button>
                        <button className="w-full flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground py-2 transition-colors">
                            <Database className="w-4 h-4" />
                            API Health
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="glass-card p-8 space-y-8"
                        >
                            {activeTab === 'account' && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold mb-6">Profile Information</h3>
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="relative group">
                                                <div className="w-24 h-24 rounded-3xl bg-secondary border border-border flex items-center justify-center overflow-hidden">
                                                    <User className="w-12 h-12 text-muted-foreground" />
                                                </div>
                                                <button className="absolute inset-0 bg-black/60 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center uppercase">
                                                    Change
                                                </button>
                                            </div>
                                            <div>
                                                <div className="font-bold text-lg">Chris Welker</div>
                                                <div className="text-sm text-muted-foreground">Lead Coach @ QS Team</div>
                                                <div className="mt-2 flex gap-2">
                                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">Admin</span>
                                                    <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded uppercase">Active</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
                                                <input type="email" defaultValue="chris@quantumscale.ai" className="w-full bg-secondary/30 border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase">Full Name</label>
                                                <input type="text" defaultValue="Chris Welker" className="w-full bg-secondary/30 border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-border/50">
                                        <h3 className="text-xl font-bold mb-6">Preferences</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-secondary rounded-lg"><Moon className="w-4 h-4" /></div>
                                                    <div>
                                                        <div className="text-sm font-bold">Dark Mode</div>
                                                        <div className="text-xs text-muted-foreground">Use the high-contrast dark theme.</div>
                                                    </div>
                                                </div>
                                                <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                                                    <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'ai' && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">AI Engine Configuration</h3>
                                        <p className="text-sm text-muted-foreground mb-8">Fine-tune how Quantum Copilot generates insights and optimizes brand offers.</p>

                                        <div className="space-y-6">
                                            <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl">
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="flex items-center gap-2 font-bold">
                                                        <Zap className="w-5 h-5 text-primary" />
                                                        Active Model: Gemini 2.0 Flash
                                                    </div>
                                                    <button className="text-xs text-primary font-bold hover:underline">Switch Model</button>
                                                </div>
                                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                    <div className="h-full w-[85%] bg-primary" />
                                                </div>
                                                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-bold font-mono">
                                                    <span>TOKEN USAGE: 852.4K / 1M</span>
                                                    <span>RESET IN 4 DAYS</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="p-6 border border-border bg-secondary/10 rounded-2xl hover:border-primary/50 transition-all group">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="p-2 bg-secondary group-hover:bg-primary/20 rounded-lg group-hover:text-primary transition-colors">
                                                            <Cloud className="w-5 h-5" />
                                                        </div>
                                                        <div className="font-bold">Cloud Sync</div>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mb-4">Automatically sync brand research to central knowledge base for AI retraining.</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-10 h-5 bg-primary rounded-full relative p-0.5">
                                                            <div className="w-4 h-4 bg-white rounded-full absolute right-0.5" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-primary">Enabled</span>
                                                    </div>
                                                </div>

                                                <div className="p-6 border border-border bg-secondary/10 rounded-2xl hover:border-primary/50 transition-all group">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="p-2 bg-secondary group-hover:bg-primary/20 rounded-lg group-hover:text-primary transition-colors">
                                                            <Database className="w-5 h-5" />
                                                        </div>
                                                        <div className="font-bold">Custom Context</div>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mb-4">Allow AI to access internal proprietary frameworks during offer generation.</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-10 h-5 bg-secondary rounded-full relative p-0.5">
                                                            <div className="w-4 h-4 bg-muted-foreground rounded-full absolute left-0.5" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-muted-foreground">Disabled</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between p-6 bg-green-500/5 border border-green-500/20 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-green-500/20 rounded-2xl text-green-500">
                                                <Shield className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-green-500">Account Security is High</h4>
                                                <p className="text-sm text-green-500/70">Multi-factor authentication and device tracking enabled.</p>
                                            </div>
                                        </div>
                                        <CheckCircle2 className="w-8 h-8 text-green-500 opacity-50" />
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between py-4 border-b border-border/50">
                                            <div className="flex items-center gap-4">
                                                <Lock className="w-5 h-5 text-muted-foreground" />
                                                <div>
                                                    <div className="font-bold">Password</div>
                                                    <div className="text-xs text-muted-foreground">Last changed 4 months ago.</div>
                                                </div>
                                            </div>
                                            <button className="px-4 py-1.5 border border-border rounded-lg text-xs font-bold hover:bg-secondary transition-all">Update</button>
                                        </div>

                                        <div className="flex items-center justify-between py-4 border-b border-border/50">
                                            <div className="flex items-center gap-4">
                                                <Smartphone className="w-5 h-5 text-muted-foreground" />
                                                <div>
                                                    <div className="font-bold">Two-Factor Authentication</div>
                                                    <div className="text-xs text-muted-foreground">Active for all members with "Admin" role.</div>
                                                </div>
                                            </div>
                                            <div className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded uppercase">Required</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
