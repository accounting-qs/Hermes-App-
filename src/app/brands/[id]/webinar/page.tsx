"use client";

import React, { useState } from "react";
import {
    Video,
    Lightbulb,
    FileText,
    Layout,
    Palette,
    ExternalLink,
    Plus,
    Play,
    Clock,
    ArrowRight,
    Sparkles,
    ChevronRight,
    Monitor
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

export default function WebinarPage() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<'ideas' | 'script' | 'slides' | 'promotion'>('ideas');

    const tabs = [
        { id: 'ideas', title: 'Concepts', icon: Lightbulb },
        { id: 'script', title: 'Script', icon: FileText },
        { id: 'slides', title: 'Slides', icon: Layout },
        { id: 'promotion', title: 'Banners', icon: Palette },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Video className="w-5 h-5 text-primary" />
                        <h1 className="text-3xl font-bold outfit-font">Webinar Studio</h1>
                    </div>
                    <p className="text-muted-foreground">Craft your high-converting webinar from concept to conversion.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-xl text-sm font-bold transition-all">
                        <Monitor className="w-4 h-4" />
                        Preview Studio
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 premium-gradient text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" />
                        New Webinar
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-3 space-y-3">
                    <div className="flex flex-col gap-1 p-2 bg-secondary/30 border border-border/50 rounded-2xl">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                    activeTab === tab.id
                                        ? "bg-card text-primary shadow-lg"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 font-medium"
                                )}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.title}
                                {activeTab === tab.id && <motion.div layoutId="activeTabDot" className="w-1.5 h-1.5 rounded-full bg-primary ml-auto" />}
                            </button>
                        ))}
                    </div>

                    <div className="glass-card p-6 space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Webinar Settings</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">Estimated Length</span>
                                <span className="text-xs font-bold">45-60 min</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">Target Audience</span>
                                <span className="text-xs font-bold truncate max-w-[100px]">Agency Owners</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">Tone of Voice</span>
                                <span className="text-xs font-bold">Educational</span>
                            </div>
                        </div>
                        <button className="w-full py-2 bg-secondary/50 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-secondary transition-all">
                            Edit Foundation
                        </button>
                    </div>
                </div>

                {/* Studio Content Area */}
                <div className="lg:col-span-9">
                    <AnimatePresence mode="wait">
                        {activeTab === 'ideas' && (
                            <motion.div
                                key="ideas"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold">Webinar Concepts</h2>
                                    <button className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all">
                                        <Sparkles className="w-4 h-4" />
                                        Regenerate Ideas
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { title: "The $1M Agency Ecosystem", hook: "Why 99% of agency growth strategies fail and how to fix it.", angle: "Results-Driven", status: 'Active' },
                                        { title: "The Automated Outreach Engine", hook: "How to book 30+ high-ticket calls monthly on autopilot.", angle: "Tactical", status: 'Draft' },
                                        { title: "Quantum Scaling Workshop", hook: "The 3-step framework for scaling from $20k to $100k/mo.", angle: "Strategy", status: 'Draft' },
                                    ].map((idea, i) => (
                                        <div key={i} className={cn(
                                            "glass-card p-6 border-border/50 group hover:border-primary/50 transition-all",
                                            idea.status === 'Active' && "ring-2 ring-primary/20 bg-primary/5"
                                        )}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                    <Lightbulb className="w-5 h-5" />
                                                </div>
                                                <div className={cn(
                                                    "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border",
                                                    idea.status === 'Active' ? "bg-primary text-white border-primary" : "bg-secondary text-muted-foreground border-border"
                                                )}>
                                                    {idea.status}
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-all">{idea.title}</h3>
                                            <p className="text-sm text-muted-foreground mb-6 line-clamp-2 italic">"{idea.hook}"</p>

                                            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{idea.angle}</div>
                                                <button className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                                                    Select Concept <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'script' && (
                            <motion.div
                                key="script"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card p-8 border-border/50"
                            >
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">Script Editor</h2>
                                            <p className="text-xs text-muted-foreground">Webinar: The $1M Agency Ecosystem</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 hover:bg-secondary rounded-lg transition-all text-muted-foreground hover:text-foreground">
                                            <Play className="w-4 h-4" />
                                        </button>
                                        <button className="px-6 py-2 premium-gradient text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
                                            Export PDF
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {[
                                        { section: "Opening / Hook", duration: "5 min", content: "Welcome everyone! Today we are diving into the core architecture of 7-figure agency growth. If you feel like you're on a growth plateau, this is for you..." },
                                        { section: "The Problem", duration: "8 min", content: "Most agencies rely on what I call 'Hope Marketing'. Hoping for referrals, hoping for that one viral post. But hope is not a strategy. The real bottleneck is..." },
                                        { section: "The Paradox of Choice", duration: "10 min", content: "In this phase, we look at why more options lead to less action. Your clients need a singular, automated path to success. That's where the Quantum System comes in..." },
                                    ].map((part, i) => (
                                        <div key={i} className="group space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-primary px-1.5 bg-primary/10 rounded uppercase tracking-tighter">Part {i + 1}</span>
                                                    <h3 className="font-bold text-sm uppercase tracking-widest">{part.section}</h3>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                                    <Clock className="w-3 h-3" />
                                                    {part.duration}
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <textarea
                                                    className="w-full bg-secondary/20 border border-border/30 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-[100px] resize-none leading-relaxed transition-all group-hover:border-border"
                                                    defaultValue={part.content}
                                                />
                                                <button className="absolute bottom-3 right-3 p-1.5 bg-card border border-border rounded-lg text-primary hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                                    <Sparkles className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Other tabs follow similarly */}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
