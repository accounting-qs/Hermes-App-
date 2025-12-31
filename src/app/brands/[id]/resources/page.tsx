"use client";

import React, { useState } from "react";
import {
    File,
    Link as LinkIcon,
    Image as ImageIcon,
    StickyNote,
    Plus,
    Upload,
    Globe,
    MoreVertical,
    Download,
    Trash2,
    ExternalLink,
    Sparkles,
    Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

export default function ResourcesPage() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<'files' | 'links' | 'assets' | 'notes'>('files');

    const tabs = [
        { id: 'files', title: 'Files', icon: File },
        { id: 'links', title: 'Links', icon: LinkIcon },
        { id: 'assets', title: 'Assets', icon: ImageIcon },
        { id: 'notes', title: 'Notes', icon: StickyNote },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <LinkIcon className="w-5 h-5 text-primary" />
                        <h1 className="text-3xl font-bold outfit-font">Resources</h1>
                    </div>
                    <p className="text-muted-foreground">Central knowledge base and brand assets for AI training.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-xl text-sm font-bold transition-all">
                        <Upload className="w-4 h-4" />
                        Upload File
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 premium-gradient text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" />
                        Add Resource
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Tabs */}
                    <div className="flex items-center gap-2 p-1 bg-secondary/30 border border-border/50 rounded-2xl w-fit">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                                    activeTab === tab.id ? "bg-card text-primary shadow-lg" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.title}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'files' && (
                            <motion.div
                                key="files"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                <div className="glass-card overflow-hidden border-border/50">
                                    <table className="w-full text-left">
                                        <thead className="bg-secondary/30 border-b border-border/50">
                                            <tr>
                                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">File Name</th>
                                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Category</th>
                                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Size</th>
                                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tokens</th>
                                                <th className="px-6 py-4 text-right"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/50">
                                            {[
                                                { name: "Brand-Guidelines-2024.pdf", cat: "Branding", size: "2.5 MB", tokens: "1.2k" },
                                                { name: "Sales-Deck-Draft.pptx", cat: "Sales", size: "12.0 MB", tokens: "4.5k" },
                                                { name: "Client-Testimonials.docx", cat: "Proof", size: "850 KB", tokens: "2.1k" },
                                            ].map((file, i) => (
                                                <tr key={i} className="hover:bg-secondary/10 transition-all group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                                                                <File className="w-4 h-4" />
                                                            </div>
                                                            <span className="font-bold text-sm tracking-tight">{file.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 rounded bg-secondary text-[10px] font-bold uppercase tracking-widest border border-border/50">
                                                            {file.cat}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-muted-foreground italic">{file.size}</td>
                                                    <td className="px-6 py-4 font-mono text-[10px] text-primary font-bold">{file.tokens}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button className="p-2 text-muted-foreground hover:text-foreground">
                                                                <Download className="w-4 h-4" />
                                                            </button>
                                                            <button className="p-2 text-muted-foreground hover:text-destructive">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'links' && (
                            <motion.div
                                key="links"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                {[
                                    { label: "Company Website", url: "https://quantumscale.ai", type: "Website", status: "Scraped" },
                                    { label: "LinkedIn Company", url: "linkedin.com/company/qs", type: "Social", status: "Scraped" },
                                    { label: "Lead Magnets", url: "https://hub.qs.ai/leads", type: "App", status: "Pending" },
                                ].map((link, i) => (
                                    <div key={i} className="glass-card p-5 hover:border-primary/50 transition-all">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-secondary rounded-2xl">
                                                <Globe className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className={cn(
                                                "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                                link.status === 'Scraped' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                            )}>
                                                {link.status}
                                            </div>
                                        </div>
                                        <div className="space-y-1 mb-4">
                                            <div className="text-sm font-bold">{link.label}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                {link.url} <ExternalLink className="w-3 h-3" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="flex-1 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">
                                                Edit Link
                                            </button>
                                            <button className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all">
                                                <Sparkles className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Notes & Assets would go here similarly */}
                    </AnimatePresence>
                </div>

                {/* Knowledge Base Info Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-6 bg-primary/5 border-primary/20">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-primary text-white">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <h2 className="text-sm font-bold uppercase tracking-widest">AI Context Stats</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-card border border-border/50 rounded-2xl">
                                    <div className="text-xl font-bold">18.5k</div>
                                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Total Tokens</div>
                                </div>
                                <div className="p-4 bg-card border border-border/50 rounded-2xl">
                                    <div className="text-xl font-bold">12</div>
                                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Data Sources</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                    <span>Knowledge Coverage</span>
                                    <span className="text-primary">82%</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full premium-gradient" style={{ width: '82%' }} />
                                </div>
                            </div>

                            <div className="p-4 bg-secondary/30 rounded-2xl border border-border/50 flex gap-3 italic text-xs text-muted-foreground">
                                <Info className="w-4 h-4 shrink-0 text-primary" />
                                <span>The AI Copilot uses these resources to generate brand-aligned copy and offers.</span>
                            </div>

                            <button className="w-full py-3 premium-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                                Re-sync AI Knowledge
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Quick Add Link</h2>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="https://paste-link-here.com"
                                className="w-full bg-secondary/50 border border-border/50 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-all">
                                Crawl Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
