"use client";

import React, { useState } from "react";
import {
    Building2,
    Users2,
    Frown,
    FileSearch,
    CheckCircle2,
    Zap,
    ArrowRight,
    Sparkles,
    ChevronDown,
    Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

export default function ResearchPage() {
    const { id } = useParams();
    const [activeSection, setActiveSection] = useState<'market' | 'avatar' | 'pains'>('market');

    const sections = [
        { id: 'market', title: 'Market Research', icon: Building2, completion: 100 },
        { id: 'avatar', title: 'Avatar Discovery', icon: Users2, completion: 85 },
        { id: 'pains', title: 'Pains & Desires', icon: Frown, completion: 0 },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <FileSearch className="w-5 h-5 text-primary" />
                        <h1 className="text-3xl font-bold outfit-font">Research Hub</h1>
                    </div>
                    <p className="text-muted-foreground">Deep analysis of the business, audience, and market landscape.</p>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 premium-gradient text-white rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                    <Sparkles className="w-5 h-5" />
                    Generate AI Summary
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-3 space-y-3">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id as any)}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                                activeSection === section.id
                                    ? "bg-primary/10 border-primary/50 text-foreground shadow-lg shadow-primary/5"
                                    : "bg-secondary/20 border-border/50 text-muted-foreground hover:border-border hover:bg-secondary/30"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-2 rounded-xl transition-colors",
                                    activeSection === section.id ? "bg-primary text-white" : "bg-card text-muted-foreground"
                                )}>
                                    <section.icon className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold">{section.title}</div>
                                    <div className="text-[10px] uppercase font-bold tracking-widest opacity-70">
                                        {section.completion}% Complete
                                    </div>
                                </div>
                            </div>
                            <div className="relative w-1.5 h-1.5 rounded-full overflow-hidden bg-secondary">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary"
                                    style={{ height: `${section.completion}%` }}
                                />
                            </div>
                        </button>
                    ))}

                    <div className="p-6 glass-card bg-secondary/10 mt-8 border-dashed border-border/50 flex flex-col items-center gap-3 text-center">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                            <Plus className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Custom Research Section</div>
                    </div>
                </div>

                {/* Form Content Area */}
                <div className="lg:col-span-9">
                    <AnimatePresence mode="wait">
                        {activeSection === 'market' && (
                            <motion.div
                                key="market"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="glass-card p-8 border-border/50">
                                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                                        <div>
                                            <h2 className="text-xl font-bold">Market Analysis</h2>
                                            <p className="text-sm text-muted-foreground">Define the company's core positioning and industry context.</p>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 text-[10px] font-bold uppercase tracking-widest">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Complete
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                Company Name
                                                <Info className="w-3 h-3" />
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="Quantum Scale Agency"
                                                className="w-full bg-secondary/50 border border-border/50 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Industry</label>
                                            <input
                                                type="text"
                                                defaultValue="Marketing Automation"
                                                className="w-full bg-secondary/50 border border-border/50 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Core Transformation (Mission)</label>
                                            <textarea
                                                rows={3}
                                                defaultValue="Helping service-based agencies scale to $1M ARR via automated webinar ecosystems that consistently book high-ticket calls."
                                                className="w-full bg-secondary/50 border border-border/50 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none"
                                            />
                                            <div className="flex justify-end">
                                                <button className="flex items-center gap-1.5 text-[10px] text-primary font-bold hover:underline">
                                                    <Zap className="w-3 h-3" />
                                                    AI Enhance
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 space-y-6">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                            Ideal Customer Profile (ICP)
                                            <div className="flex-1 h-px bg-primary/20" />
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {['Agency Owners', 'Coaches', 'Course Creators', 'B2B Sales Teams'].map((profile) => (
                                                <div key={profile} className="flex items-center justify-between p-3 bg-card border border-border/50 rounded-xl group hover:border-primary/50 transition-all">
                                                    <span className="text-sm font-medium">{profile}</span>
                                                    <button className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-border/50 rounded-xl text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
                                                <Plus className="w-4 h-4" />
                                                Add ICP Group
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-12 flex justify-between pt-8 border-t border-border/50">
                                        <button className="px-6 py-3 bg-secondary/50 hover:bg-secondary rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                                            Save Draft
                                        </button>
                                        <button
                                            onClick={() => setActiveSection('avatar')}
                                            className="px-8 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2"
                                        >
                                            Next Section: Avatar
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'avatar' && (
                            <motion.div
                                key="avatar"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass-card p-12 border-border/50 flex flex-col items-center text-center space-y-6"
                            >
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    <Users2 className="w-10 h-10 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Avatar Discovery</h2>
                                    <p className="text-muted-foreground max-w-md">Let's build a deep persona profile. Who are we truly speaking to in this campaign?</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                                    <button className="p-6 bg-secondary/30 border border-border rounded-2xl flex flex-col items-center gap-4 hover:border-primary transition-all">
                                        <div className="w-12 h-12 rounded-xl premium-gradient flex items-center justify-center text-white">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <div className="text-sm font-bold">Generate from Resources</div>
                                    </button>
                                    <button className="p-6 bg-secondary/30 border border-border rounded-2xl flex flex-col items-center gap-4 hover:border-primary transition-all">
                                        <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground">
                                            <Plus className="w-6 h-6" />
                                        </div>
                                        <div className="text-sm font-bold">Build Manually</div>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
