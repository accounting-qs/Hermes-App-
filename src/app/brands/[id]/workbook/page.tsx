"use client";

import React, { useState } from "react";
import {
    BookOpen,
    FileText,
    Copy,
    CheckSquare,
    Download,
    Plus,
    Eye,
    Share2,
    Sparkles,
    ExternalLink,
    ChevronDown,
    Info,
    Edit2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

export default function WorkbookPage() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<'executive' | 'assistant' | 'copywriting' | 'checklists'>('executive');

    const tabs = [
        { id: 'executive', title: 'Executive', icon: BookOpen },
        { id: 'assistant', title: 'Assistant', icon: FileText },
        { id: 'copywriting', title: 'Copywriting', icon: Copy },
        { id: 'checklists', title: 'Checklists', icon: CheckSquare },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <h1 className="text-3xl font-bold outfit-font">Brand Workbook</h1>
                    </div>
                    <p className="text-muted-foreground">Unified deliverables and operational assets for the program execution.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-xl text-sm font-bold transition-all">
                        <Share2 className="w-4 h-4" />
                        Share Portal
                    </button>
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-6 py-2 premium-gradient text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
                            <Download className="w-4 h-4" />
                            Export Package
                            <ChevronDown className="w-4 h-4 opacity-50" />
                        </button>
                        <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2 shadow-2xl">
                            <button className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-secondary rounded-lg">Export to PDF</button>
                            <button className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-secondary rounded-lg">Google Docs Sync</button>
                            <button className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-secondary rounded-lg">Notion Template</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-12 space-y-6">
                    <div className="flex items-center gap-2 p-1 bg-secondary/30 border border-border/50 rounded-2xl w-fit">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-3 px-8 py-3 rounded-xl text-sm font-bold transition-all",
                                    activeTab === tab.id ? "bg-card text-primary shadow-lg" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.title}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'executive' && (
                            <motion.div
                                key="executive"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                            >
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="glass-card p-10 border-border/50">
                                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                            <Sparkles className="w-6 h-6 text-primary" />
                                            Executive Overview
                                        </h2>

                                        <div className="space-y-10">
                                            <section className="space-y-4">
                                                <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Mission & North Star</h3>
                                                <div className="p-6 bg-secondary/20 rounded-2xl border border-border/50 text-lg font-medium italic leading-relaxed">
                                                    "To empower 100 service-based agency founders to break the $1M ARR ceiling by automating their high-ticket acquisition through the Quantum Scale ecosystem."
                                                </div>
                                            </section>

                                            <section className="space-y-4">
                                                <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Strategic Advantage</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {[
                                                        { title: 'Proprietary AI Stack', desc: 'Custom trained models for your specific industry niche.' },
                                                        { title: 'Velocity-as-a-Service', desc: 'Deploying in 30 days what usually takes 6 months.' },
                                                        { title: 'Zero-Risk Model', desc: 'Performance-based scaling with guaranteed call volume.' },
                                                        { title: 'Brand Equity Builder', desc: 'Positioning the founder as the global category leader.' },
                                                    ].map((item, i) => (
                                                        <div key={i} className="p-4 bg-card border border-border/50 rounded-xl hover:border-primary/50 transition-all">
                                                            <div className="font-bold text-sm mb-1">{item.title}</div>
                                                            <div className="text-xs text-muted-foreground leading-relaxed">{item.desc}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="glass-card p-6 border-primary/20 bg-primary/5">
                                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Export Settings</h2>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-card border border-border/50 rounded-xl">
                                                <span className="text-xs font-medium">Include Research</span>
                                                <div className="w-8 h-4 bg-primary rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" /></div>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-card border border-border/50 rounded-xl">
                                                <span className="text-xs font-medium">Add Brand Styling</span>
                                                <div className="w-8 h-4 bg-primary rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" /></div>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-card border border-border/50 rounded-xl">
                                                <span className="text-xs font-medium">Assistant Access</span>
                                                <div className="w-8 h-4 bg-secondary rounded-full relative"><div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full" /></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="glass-card p-6">
                                        <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Quick Actions</h2>
                                        <div className="space-y-3">
                                            <button className="w-full flex items-center justify-between p-3 bg-secondary/50 hover:bg-secondary rounded-xl transition-all">
                                                <div className="flex items-center gap-3">
                                                    <Eye className="w-4 h-4 text-primary" />
                                                    <span className="text-xs font-bold">Preview Portal</span>
                                                </div>
                                                <ChevronDown className="w-4 h-4 -rotate-90 opacity-50" />
                                            </button>
                                            <button className="w-full flex items-center justify-between p-3 bg-secondary/50 hover:bg-secondary rounded-xl transition-all">
                                                <div className="flex items-center gap-3">
                                                    <Plus className="w-4 h-4 text-primary" />
                                                    <span className="text-xs font-bold">Add New Section</span>
                                                </div>
                                                <ChevronDown className="w-4 h-4 -rotate-90 opacity-50" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'copywriting' && (
                            <motion.div
                                key="copywriting"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    <div className="lg:col-span-3 space-y-2">
                                        {['LinkedIn Ads', 'Email Sequence', 'Webinar Description', 'Social Posts', 'Landing Page'].map(cat => (
                                            <button key={cat} className="w-full p-4 bg-secondary/20 hover:bg-secondary/40 border border-border/50 rounded-2xl text-left transition-all">
                                                <span className="text-sm font-bold">{cat}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="lg:col-span-9 space-y-6">
                                        {[
                                            { title: 'The "Pivot" Pattern (Email 1)', body: "Hey {{first_name}}, most agencies are stuck in a loop. They think more cold calling is the answer. But what if the real bottleneck was your conversion mechanism?" },
                                            { title: 'The "Architecture" Hook (LinkedIn)', body: "Stop building on rented land. If you don't own your conversion path, you don't own your business. Here is how we build the Quantum Ecosystem..." },
                                        ].map((copy, i) => (
                                            <div key={i} className="glass-card p-6 border-border/50 group">
                                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/20">
                                                    <h3 className="font-bold text-lg group-hover:text-primary transition-all">{copy.title}</h3>
                                                    <div className="flex items-center gap-2">
                                                        <button className="p-2 bg-secondary/50 hover:bg-primary hover:text-white rounded-lg transition-all">
                                                            <Copy className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 bg-secondary/50 hover:bg-secondary rounded-lg transition-all">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-card rounded-xl border border-border/30 text-sm italic text-muted-foreground leading-loose">
                                                    {copy.body}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
