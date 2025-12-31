"use client";

import React, { useState } from "react";
import {
    Settings2,
    ArrowRight,
    CheckCircle2,
    Circle,
    AlertCircle,
    Dna,
    Globe,
    Mail,
    Zap,
    ShieldCheck,
    ExternalLink,
    Plus,
    BarChart2,
    Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function TechSetupPage() {
    const { id } = useParams();

    const stages = [
        {
            id: 'foundation',
            title: 'Stage 1: Foundational Infrastructure',
            progress: 67,
            tasks: [
                { name: 'Apollo Account Configuration', status: 'completed', type: 'Guided' },
                { name: 'Domain Acquisition & DNS Setup', status: 'completed', type: 'Partial' },
                { name: 'Google Workspace Hardening', status: 'in_progress', type: 'Guided' },
            ]
        },
        {
            id: 'webinar',
            title: 'Stage 2: Webinar Platform Config',
            progress: 100,
            tasks: [
                { name: 'WebinarGeek Account Sync', status: 'completed', type: 'Full' },
                { name: 'Event Template Deployment', status: 'completed', type: 'Full' },
                { name: 'Email Sequence Integration', status: 'completed', type: 'Full' },
            ]
        },
        {
            id: 'crm',
            title: 'Stage 3: CRM & Booking Automation',
            progress: 0,
            tasks: [
                { name: 'GHL Sub-Account Provisioning', status: 'pending', type: 'Full' },
                { name: 'Booking Calendar Sync', status: 'pending', type: 'Full' },
                { name: 'Follow-Up Workflow Activation', status: 'pending', type: 'Full' },
            ]
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Settings2 className="w-5 h-5 text-primary" />
                        <h1 className="text-3xl font-bold outfit-font">Tech Setup</h1>
                    </div>
                    <p className="text-muted-foreground">Automating foundational infrastructure and campaign technical assets.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href={`/brands/${id}/tech-setup/vault`}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-xl text-sm font-bold transition-all"
                    >
                        <Lock className="w-4 h-4" />
                        Credentials Vault
                    </Link>
                    <button className="flex items-center gap-2 px-6 py-2 premium-gradient text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                        <Zap className="w-4 h-4" />
                        Run Automation Suite
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Automation Workflow */}
                <div className="lg:col-span-8 space-y-6">
                    {stages.map((stage, idx) => (
                        <div key={stage.id} className="glass-card overflow-hidden">
                            <div className="p-6 bg-secondary/30 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
                                        stage.progress === 100 ? "bg-green-500/10 text-green-500" :
                                            stage.progress > 0 ? "bg-primary/10 text-primary" : "bg-card text-muted-foreground"
                                    )}>
                                        {stage.progress === 100 ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg">{stage.title}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-32 h-1 bg-secondary rounded-full overflow-hidden">
                                                <div className="h-full premium-gradient" style={{ width: `${stage.progress}%` }} />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stage.progress}% Done</span>
                                        </div>
                                    </div>
                                </div>
                                {stage.progress < 100 && (
                                    <button className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-2">
                                        Start Stage <ArrowRight className="w-3 h-3" />
                                    </button>
                                )}
                            </div>

                            <div className="divide-y divide-border/20">
                                {stage.tasks.map((task, i) => (
                                    <div key={i} className="p-6 flex items-center justify-between hover:bg-secondary/10 transition-all">
                                        <div className="flex items-center gap-4">
                                            {task.status === 'completed' ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            ) : task.status === 'in_progress' ? (
                                                <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-muted-foreground" />
                                            )}
                                            <div>
                                                <div className="text-sm font-bold">{task.name}</div>
                                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">Type: {task.type}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {task.status === 'completed' && <div className="text-[10px] font-bold text-green-500 px-2 py-0.5 bg-green-500/10 rounded uppercase">Ready</div>}
                                            <button className="p-2 text-muted-foreground hover:text-foreground">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Real-time Automation Logs Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-6 border-amber-500/20 bg-amber-500/5">
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart2 className="w-5 h-5 text-amber-500" />
                            <h2 className="text-sm font-bold uppercase tracking-widest">Automation Logs</h2>
                        </div>

                        <div className="space-y-4">
                            {[
                                { time: '10:45 AM', action: 'Google Workspace API Key generated', status: 'success' },
                                { time: '10:42 AM', action: 'DNS Propagation Check: Pending', status: 'warning' },
                                { time: '10:38 AM', action: '3 Active Domains verified via GoDaddy', status: 'success' },
                                { time: '10:30 AM', action: 'WebinarGeek API Handshake', status: 'success' },
                            ].map((log, i) => (
                                <div key={i} className="flex gap-3 text-[11px] leading-relaxed">
                                    <span className="text-muted-foreground font-mono shrink-0">{log.time}</span>
                                    <span className={cn(
                                        "font-medium",
                                        log.status === 'success' ? "text-green-500/90" : "text-amber-500/90"
                                    )}>{log.action}</span>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-6 py-2 bg-secondary/50 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-secondary transition-all">
                            View Full Log
                        </button>
                    </div>

                    <div className="glass-card p-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Infrastructure Health</h2>
                        <div className="space-y-4">
                            {[
                                { icon: Globe, label: 'DNS Propagation', status: 'Healthy' },
                                { icon: Mail, label: 'Email Deliverability', status: 'Warning' },
                                { icon: ShieldCheck, label: 'SSL Certificates', status: 'Healthy' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl border border-border/50">
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-4 h-4 text-primary" />
                                        <span className="text-xs font-semibold">{item.label}</span>
                                    </div>
                                    <span className={cn(
                                        "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase",
                                        item.status === 'Healthy' ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                                    )}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
