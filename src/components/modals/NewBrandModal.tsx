"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Building2, Globe, Tag, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase-ssr/client";
import { useToast } from "@/components/ui/ToastContext";
import { BrandStatus } from "@/types";

interface NewBrandModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function NewBrandModal({ isOpen, onClose, onSuccess }: NewBrandModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        industry: "",
        website: "", // Added website
        logoUrl: "", // Added logoUrl
    });
    const [selectedStatus, setSelectedStatus] = useState<BrandStatus>('onboarding'); // Manage status separately

    const supabase = createClient();
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data, error } = await Promise.race([
                supabase
                    .from('brands')
                    .insert([{
                        name: formData.name,
                        industry: formData.industry,
                        website: formData.website,
                        logo_url: formData.logoUrl, // Note: Make sure database uses 'logo_url' snake_case if that's the column name
                        status: 'onboarding',
                        phase: 'foundation'
                    }])
                    .select()
                    .single(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
            ]) as any; // Cast to avoid complex Promise race types

            if (error) throw error;

            toast.success(`Brand "${formData.name}" created successfully`);

            // Clear form
            setFormData({
                name: "",
                industry: "",
                website: "",
                logoUrl: ""
            });

            // Trigger refresh
            onSuccess();

            // Close immediately
            onClose();

        } catch (error: any) {
            console.error("NewBrandModal: Error creating brand:", error);

            let message = "Failed to create brand";
            if (error.message === 'Timeout') {
                message = "Request timed out. The brand might have been created - please refresh checking.";
            } else if (error.code === '42501') {
                message = "Permission denied. You must be a QS Team member to create brands.";
            } else {
                message = `Error: ${error.message || "Failed to create brand."}`;
            }

            toast.error(message);
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
                        className="relative w-full max-w-lg glass-card p-8 shadow-2xl border-primary/20"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold outfit-font">Launch New Brand</h2>
                                <p className="text-sm text-muted-foreground mt-1">Configure a new client entity in the ecosystem.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                                        Brand Identity
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="Brand Name (e.g. Nexus Tech)"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-secondary/50 border border-border/50 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                                        Vertical / Industry
                                    </label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="SaaS, E-commerce, Marketing..."
                                            value={formData.industry}
                                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                            className="w-full bg-secondary/50 border border-border/50 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                                        Ecosystem Status
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(['onboarding', 'active', 'scaling'] as BrandStatus[]).map((status) => (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => setSelectedStatus(status)}
                                                className={cn(
                                                    "py-2 px-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                                                    selectedStatus === status
                                                        ? "bg-primary/10 border-primary text-primary shadow-sm shadow-primary/20"
                                                        : "bg-secondary/50 border-border/50 text-muted-foreground hover:border-muted-foreground/50"
                                                )}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

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
                                            <span>Initializing Brand...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5" />
                                            <span>Create Brand</span>
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

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
