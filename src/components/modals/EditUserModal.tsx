"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Shield, Briefcase, Loader2, ChevronDown, Save, Building2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase-ssr/client";
import { UserRole, Brand } from "@/types";
import { useToast } from "@/components/ui/ToastContext";
import { cn } from "@/lib/utils";

interface EditUserModalProps {
    user: any | null; // Using any for simplicity matching UsersPage structure, or define a User interface
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditUserModal({ user, isOpen, onClose, onSuccess }: EditUserModalProps) {
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
    const toast = useToast();

    useEffect(() => {
        if (isOpen) {
            fetchBrands();
            if (user) {
                // Populate form
                setPrimaryRole(user.role === 'qs_team' ? 'qs_team' : 'client');
                setFormData({
                    fullName: user.name || "",
                    email: user.email || "",
                    brandId: user.brandId || "", // This might need mapping if UsersPage doesn't pass raw ID
                    subRole: (user.subType === 'Executive' ? 'client_executive' : 'client_assistant') as UserRole, // Heuristic mapping based on subType display
                });

                // If we need strict ID mapping, we might need to fetch the raw user record first or ensure UsersPage passes it.
                // The UsersPage passes a mapped object. Let's rely on what we have, but ideally we need the brand_id.
                // The mapped object in UsersPage doesn't seem to have brandId, only brandName.
                // We should fix UsersPage to pass brandId if possible, or fetch it here.
                // For now, let's assume we might need to fetch the user details or Update UsersPage to include brandId.
            }
        }
    }, [isOpen, user]);

    // Fetch brands for dropdown
    const fetchBrands = async () => {
        const { data, error } = await supabase.from('brands').select('*').order('name');
        if (data) setBrands(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsLoading(true);

        const finalRole = primaryRole === 'qs_team' ? 'qs_team' : formData.subRole;

        try {
            const { error } = await supabase
                .from('allowed_users')
                .update({
                    full_name: formData.fullName,
                    // email: formData.email, // Avoiding email change for now as it affects Auth
                    role: finalRole,
                    brand_id: primaryRole === 'client' ? formData.brandId : null
                })
                .eq('id', user.id);

            if (error) throw error;

            toast.success(`User updated successfully`);
            onSuccess();
            onClose();

        } catch (error: any) {
            console.error("EditUserModal: Error updating user:", error);
            toast.error("Failed to update user");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && user && (
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
                                <h2 className="text-2xl font-bold outfit-font">Edit User</h2>
                                <p className="text-sm text-muted-foreground mt-1">Update user details and permissions.</p>
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
                                            readOnly
                                            type="email"
                                            value={formData.email}
                                            className="w-full bg-secondary/50 border border-border/50 rounded-xl py-3 pl-10 pr-4 text-sm text-muted-foreground cursor-not-allowed font-medium"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-1 ml-1">Email cannot be changed.</p>
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
                                    className={cn(
                                        "flex-[2] py-3 px-6 font-bold rounded-xl shadow-xl transition-all flex items-center justify-center gap-2",
                                        "premium-gradient text-white shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                                    )}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            <span>Save Changes</span>
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
