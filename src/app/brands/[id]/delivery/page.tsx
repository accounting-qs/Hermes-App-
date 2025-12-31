"use client";

import React, { useState } from "react";
import {
    Truck,
    Calendar,
    CheckSquare,
    LogOut,
    Video,
    PhoneCall,
    Plus,
    Clock,
    ChevronRight,
    MoreVertical,
    User as UserIcon,
    Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

export default function DeliveryPage() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<'calls' | 'tasks' | 'offboarding'>('calls');

    const tabs = [
        { id: 'calls', title: 'Calls', icon: Video },
        { id: 'tasks', title: 'Homework', icon: CheckSquare },
        { id: 'offboarding', title: 'Offboarding', icon: LogOut },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Truck className="w-5 h-5 text-primary" />
                        <h1 className="text-3xl font-bold outfit-font">Delivery Hub</h1>
                    </div>
                    <p className="text-muted-foreground">Managing client milestones, scheduled calls, and action items.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-2 premium-gradient text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                        <Calendar className="w-4 h-4" />
                        Schedule Call
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
                                    "flex items-center gap-3 px-6 py-2.5 rounded-xl text-xs font-bold transition-all",
                                    activeTab === tab.id ? "bg-card text-primary shadow-lg" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.title}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'calls' && (
                            <motion.div
                                key="calls"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                <div className="glass-card overflow-hidden border-border/50">
                                    <div className="p-4 bg-secondary/30 border-b border-border/50 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                        <span>Upcoming Calls</span>
                                        <span className="text-primary">Next: Dec 31, 10:00 AM</span>
                                    </div>
                                    <div className="divide-y divide-border/20">
                                        {[
                                            { title: "Strategy Session #1", date: "Dec 31, 2025", time: "10:00 AM", type: "Strategy", status: "Upcoming" },
                                            { title: "Offer Review Call", date: "Jan 04, 2026", time: "02:00 PM", type: "Review", status: "Scheduled" },
                                            { title: "Script Walkthrough", date: "Jan 07, 2026", time: "09:30 AM", type: "Coaching", status: "Scheduled" },
                                        ].map((call, i) => (
                                            <div key={i} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/10 transition-all group">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-secondary rounded-2xl border border-border/50">
                                                        <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">{call.date.split(',')[0].split(' ')[0]}</span>
                                                        <span className="text-xl font-bold">{call.date.split(',')[0].split(' ')[1]}</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-lg group-hover:text-primary transition-colors">{call.title}</div>
                                                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {call.time}</span>
                                                            <span className="flex items-center gap-1 uppercase tracking-widest font-bold text-[10px]"><PhoneCall className="w-3 h-3" /> {call.type}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button className="px-6 py-2 bg-secondary/50 group-hover:bg-primary group-hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                                                        Join Call
                                                    </button>
                                                    <button className="p-2 text-muted-foreground hover:text-foreground">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="glass-card overflow-hidden border-border/50 opacity-60">
                                    <div className="p-4 bg-secondary/30 border-b border-border/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Past Call Recordings</div>
                                    <div className="divide-y divide-border/20">
                                        {[
                                            { title: "Onboarding Call (Recording)", date: "Dec 20, 2025", duration: "45:12" },
                                        ].map((rec, i) => (
                                            <div key={i} className="p-4 flex items-center justify-between hover:bg-secondary/10 cursor-pointer transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary">
                                                        <Play className="w-4 h-4" fill="currentColor" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold">{rec.title}</div>
                                                        <div className="text-[10px] text-muted-foreground">{rec.date} • {rec.duration}</div>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'tasks' && (
                            <motion.div
                                key="tasks"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { task: "Complete Research Questionnaire", owner: "Executive", due: "Today", priority: "High", status: "Done" },
                                        { task: "Upload Brand Logos (Primary & White)", owner: "Assistant", due: "Tomorrow", priority: "Med", status: "Pending" },
                                        { task: "Set up LinkedIn Outreach Link", owner: "Assistant", due: "Jan 03", priority: "Low", status: "Pending" },
                                        { task: "Review & Approve Offer Architecture", owner: "Executive", due: "Jan 05", priority: "High", status: "Pending" },
                                    ].map((item, i) => (
                                        <div key={i} className="glass-card p-5 group hover:border-primary/50 transition-all border-border/50">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={cn(
                                                    "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border",
                                                    item.priority === 'High' ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                                )}>
                                                    {item.priority} Priority
                                                </div>
                                                <button className={cn(
                                                    "w-5 h-5 rounded border-2 transition-all flex items-center justify-center",
                                                    item.status === 'Done' ? "bg-primary border-primary text-white" : "border-border hover:border-primary/50"
                                                )}>
                                                    {item.status === 'Done' && <CheckSquare className="w-3 h-3" />}
                                                </button>
                                            </div>
                                            <div className="mb-4">
                                                <h3 className={cn("text-sm font-bold mb-1", item.status === 'Done' && "line-through text-muted-foreground")}>{item.task}</h3>
                                                <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                                                    <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" /> {item.owner}</span>
                                                    <span>Due: {item.due}</span>
                                                </div>
                                            </div>
                                            <button className="w-full py-2 bg-secondary/50 group-hover:bg-secondary rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">
                                                Manage Task
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-4 border-2 border-dashed border-border/50 rounded-2xl flex items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all group">
                                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold text-sm uppercase tracking-widest">Add Assignment</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Timeline Info Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-8 border-primary/20 bg-primary/5">
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-8">Timeline Health</h2>
                        <div className="relative">
                            <div className="absolute left-4 top-0 h-full w-0.5 bg-border/50 z-0" />
                            <div className="space-y-8">
                                {[
                                    { phase: "Onboarding", date: "Dec 15 - Dec 20", status: "Done" },
                                    { phase: "Messaging", date: "Dec 21 - Dec 30", status: "Current" },
                                    { phase: "Launch Prep", date: "Jan 01 - Jan 10", status: "Pending" },
                                ].map((p, i) => (
                                    <div key={i} className="relative z-10 flex gap-6">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                                            p.status === 'Done' ? "bg-green-500 border-green-500 text-white" :
                                                p.status === 'Current' ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/30" :
                                                    "bg-card border-border text-muted-foreground"
                                        )}>
                                            {p.status === 'Done' ? <CheckSquare className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                        </div>
                                        <div className="space-y-1">
                                            <div className={cn("text-xs font-bold uppercase tracking-widest", p.status === 'Current' ? "text-primary" : "text-foreground")}>{p.phase}</div>
                                            <div className="text-[10px] text-muted-foreground font-medium italic">{p.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="w-full mt-10 py-3 bg-card border border-border/50 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-secondary transition-all">
                            View Full Timeline
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
