"use client";

import React, { useState } from "react";
import {
    Users as UsersIcon,
    UserPlus,
    Search,
    Filter,
    MoreVertical,
    ShieldCheck,
    Mail,
    Clock,
    CheckCircle2,
    XCircle,
    Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function UsersPage() {
    const [activeTab, setActiveTab] = useState<'all' | 'qs_team' | 'clients'>('all');
    const [searchQuery, setSearchQuery] = useState("");

    const users = [
        { id: '1', name: 'Chris Welker', email: 'chris@quantumscale.ai', role: 'qs_team', subType: 'Lead Coach', status: 'active', brandCount: 12, lastActive: '2 mins ago' },
        { id: '2', name: 'Angela Smith', email: 'angela@quantumscale.ai', role: 'qs_team', subType: 'Operations', status: 'active', brandCount: 8, lastActive: '1 hour ago' },
        { id: '3', name: 'David Miller', email: 'david@nexus.tech', role: 'client', subType: 'Executive', status: 'active', brandCount: 1, lastActive: 'Yesterday' },
        { id: '4', name: 'Sarah Jones', email: 'sarah@growth.io', role: 'client', subType: 'Assistant', status: 'pending', brandCount: 1, lastActive: 'Never' },
        { id: '5', name: 'Michael Chen', email: 'm.chen@quantumscale.ai', role: 'qs_team', subType: 'Expert', status: 'active', brandCount: 15, lastActive: 'Now' },
    ];

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' ||
            (activeTab === 'qs_team' && user.role === 'qs_team') ||
            (activeTab === 'clients' && user.role === 'client');
        return matchesSearch && matchesTab;
    });

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <UsersIcon className="w-5 h-5 text-primary" />
                        <h1 className="text-3xl font-bold outfit-font">Team & Clients</h1>
                    </div>
                    <p className="text-muted-foreground">Manage user permissions, roles, and brand access across the ecosystem.</p>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 premium-gradient text-white rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                    <UserPlus className="w-5 h-5" />
                    Invite User
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-secondary/20 p-4 rounded-2xl border border-border/50">
                <div className="flex items-center gap-2 p-1 bg-background/50 rounded-xl border border-border/50">
                    {[
                        { id: 'all', label: 'All Users' },
                        { id: 'qs_team', label: 'QS Team' },
                        { id: 'clients', label: 'Clients' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                                activeTab === tab.id ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-background/50 border border-border/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <button className="p-2.5 bg-background/50 border border-border/50 rounded-xl text-muted-foreground hover:text-foreground">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredUsers.map((user, idx) => (
                        <motion.div
                            key={user.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, delay: idx * 0.05 }}
                            className="glass-card group hover:border-primary/50 transition-all"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center border border-border/50 overflow-hidden">
                                                <UsersIcon className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <div className={cn(
                                                "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card",
                                                user.status === 'active' ? "bg-green-500" : "bg-amber-500"
                                            )} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-primary transition-all">{user.name}</h3>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Mail className="w-3 h-3" />
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="p-2 text-muted-foreground hover:text-foreground">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="p-3 bg-secondary/30 rounded-xl border border-border/30">
                                        <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Role</div>
                                        <div className="flex items-center gap-1.5 font-bold text-xs truncate">
                                            {user.role === 'qs_team' ? <ShieldCheck className="w-3.5 h-3.5 text-primary" /> : <Briefcase className="w-3.5 h-3.5 text-amber-500" />}
                                            {user.subType}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-secondary/30 rounded-xl border border-border/30">
                                        <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Brands</div>
                                        <div className="font-bold text-xs">{user.brandCount} Assigned</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-border/20">
                                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                                        <Clock className="w-3 h-3" />
                                        Last Active: {user.lastActive}
                                    </div>
                                    <button className="text-xs font-bold text-primary hover:underline">
                                        Manage Permissions
                                    </button>
                                </div>
                            </div>

                            {/* Quick Actions Footer */}
                            <div className="p-4 bg-secondary/20 border-t border-border/50 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="flex-1 py-1.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-primary hover:text-white transition-all">
                                    Edit User
                                </button>
                                <button className="flex-1 py-1.5 bg-secondary/50 text-muted-foreground text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all">
                                    Suspend
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Permission Summary Card */}
            <div className="glass-card p-8 border-primary/20 bg-primary/5">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center text-primary shadow-2xl shadow-primary/20">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold outfit-font mb-1">QS Team Collaboration</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            All QS Team members have access to internal brand research and automation suites. Clients only see their own brand modules. Only Lead Coaches can finalize Master Offers.
                        </p>
                    </div>
                    <button className="px-6 py-3 bg-card border border-border hover:bg-secondary rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                        View Permissions Matrix
                    </button>
                </div>
            </div>
        </div>
    );
}
