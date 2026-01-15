"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Mail, User, Shield, Briefcase, Loader2, ChevronDown, Check } from "lucide-react";
import { createClient } from "@/lib/supabase-ssr/client";
import { UserRole, Brand } from "@/types";

interface InviteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function InviteUserModal({ isOpen, onClose, onSuccess }: InviteUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [primaryRole, setPrimaryRole] = useState<'qs_team' | 'client'>('qs_team');
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        brandId: "",
        subRole: "client_executive" as UserRole,
    });

    const supabase = createClient();

    useEffect(() => {
        if (isOpen) {
            fetchBrands();
        }
    }, [isOpen]);

    const fetchBrands = async () => {
        const { data } = await supabase.from('brands').select('*').order('name');
        if (data) setBrands(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const finalRole = primaryRole === 'qs_team'
                ? 'qs_team'
                : formData.subRole;

            const { error } = await supabase
                .from('allowed_users')
                .insert([{
                    email: formData.email,
                    full_name: formData.fullName,
                    role: finalRole as string,
                    brand_id: primaryRole === 'client' ? formData.brandId : null
                }]);

            if (error) throw error;
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error inviting user:", error);
            alert("Failed to invite user. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-xl glass-card p-8 shadow-2xl border-primary/20"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold outfit-font">Invite New User</h2>
                                <p className="text-sm text-muted-foreground mt-1">Add a new member to the Quantum Scale ecosystem.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Role Selection Tabs */}
                            <div className="flex p-1 bg-secondary/50 rounded-xl border border-border/50">
                                <button
                                    type="button"
                                    onClick={() => setPrimaryRole('qs_team')}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-bold transition-all",
                                        primaryRole === 'qs_team' ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
                                    )}
                                >
                                    <Shield className="w-3.5 h-3.5" />
                                    QS Team Member
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPrimaryRole('client')}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-bold transition-all",
                                        primaryRole === 'client' ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
                                    )}
                                >
                                    <Briefcase className="w-3.5 h-3.5" />
                                    Client Access
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="John Doe"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full bg-secondary/50 border border-border/50 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            required
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-secondary/50 border border-border/50 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            {primaryRole === 'client' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
                                >
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                                            Assigned Brand
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <select
                                                required
                                                value={formData.brandId}
                                                onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                                                className="w-full bg-secondary/50 border border-border/50 rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none"
                                            >
                                                <option value="">Select Brand...</option>
                                                {brands.map(brand => (
                                                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                                            Client Role
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {([
                                                { id: 'client_executive', label: 'Executive' },
                                                { id: 'client_assistant', label: 'Assistant' }
                                            ] as const).map(role => (
                                                <button
                                                    key={role.id}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, subRole: role.id as UserRole })}
                                                    className={cn(
                                                        "py-2.5 px-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                                                        formData.subRole === role.id
                                                            ? "bg-primary/10 border-primary text-primary shadow-sm"
                                                            : "bg-secondary/50 border-border/50 text-muted-foreground hover:border-muted-foreground/50"
                                                    )}
                                                >
                                                    {role.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 px-6 bg-secondary/50 hover:bg-secondary text-foreground font-bold rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-[2] py-3 px-6 premium-gradient text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Sending Invitation...</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-5 h-5" />
                                            <span>Invite User</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function Building2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
            <path d="M10 6h4" />
            <path d="M10 10h4" />
            <path d="M10 14h4" />
            <path d="M10 18h4" />
        </svg>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
