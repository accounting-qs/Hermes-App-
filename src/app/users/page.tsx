"use client";

import React, { useState, useEffect } from "react";
import {
    Users as UsersIcon,
    Plus,
    Search,
    Filter,
    MoreVertical,
    ShieldCheck,
    Mail,
    Clock,
    Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { InviteUserModal } from "@/components/modals/InviteUserModal";
import { createClient } from "@/lib/supabase-ssr/client";

export default function UsersPage() {
    const [activeTab, setActiveTab] = useState<'all' | 'qs_team' | 'clients'>('all');
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const supabase = createClient();

    const fetchUsers = async () => {
        setIsLoading(true);
        console.log("UsersPage: Fetching users from allowed_users...");
        try {
            const { data, error } = await supabase
                .from('allowed_users')
                .select(`
                    *,
                    brand:brands(name)
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("UsersPage: Supabase error fetching users:", error);
                throw error;
            }

            if (data) {
                console.log("UsersPage: Succesfully fetched users count:", data.length);
                setUsers(data.map(u => ({
                    id: u.id,
                    name: u.full_name || 'Pending Invite',
                    email: u.email,
                    role: u.role === 'qs_team' ? 'qs_team' : 'client',
                    subType: u.role === 'qs_team' ? 'Expert' : (u.role === 'client_executive' ? 'Executive' : 'Assistant'),
                    status: u.full_name ? 'active' : 'pending',
                    brandName: u.brand?.name || 'Global Access',
                    lastActive: 'Never'
                })));
            }
        } catch (err) {
            console.error("UsersPage: Technical failure in fetchUsers:", err);
            // Optionally set error state here if UI should show a "Try Again" button
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

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

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 premium-gradient text-white rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                    <Plus className="w-5 h-5" />
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
                {isLoading ? (
                    <div className="col-span-full text-center py-20">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="inline-block"
                        >
                            <UsersIcon className="w-8 h-8 text-primary shadow-primary/20" />
                        </motion.div>
                        <p className="text-muted-foreground mt-4 font-bold uppercase tracking-widest text-[10px]">Loading Ecosystem Personnel...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="col-span-full glass-card p-12 text-center">
                        <p className="text-muted-foreground">No users found matching your criteria.</p>
                    </div>
                ) : (
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
                                            <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Access Scope</div>
                                            <div className="font-bold text-xs truncate">{user.brandName}</div>
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
                )}
            </div>

            <InviteUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchUsers}
            />

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
