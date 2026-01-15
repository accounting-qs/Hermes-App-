"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Building2, Globe, Tag, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase-ssr/client";
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
        status: "onboarding" as BrandStatus,
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            name: formData.name,
            industry: formData.industry,
            status: formData.status
        };

        console.log("NewBrandModal: Creating brand...", payload);

        try {
            // Race between Supabase insert and a 12-second timeout
            const insertPromise = supabase
                .from('brands')
                .insert([payload])
                .select();

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out. Please check your connection.")), 12000)
            );

            const { data, error } = await Promise.race([insertPromise, timeoutPromise]) as any;

            if (error) {
                console.error("NewBrandModal: Supabase insertion error:", error);
                throw error;
            }

            console.log("NewBrandModal: Brand created successfully!", data);

            // Show success feedback
            setShowSuccess(true);

            // Wait 2 seconds, then complete
            setTimeout(() => {
                onSuccess();
                onClose();
                setShowSuccess(false);
                // Reset form
                setFormData({
                    name: "",
                    industry: "",
                    status: "onboarding",
                });
            }, 2000);

        } catch (error: any) {
            console.error("NewBrandModal: Detailed error context:", {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });

            const errorMessage = error.code === '42501'
                ? "Permission denied. You must be a QS Team member to create brands."
                : `Error: ${error.message || "Failed to create brand."}`;

            alert(errorMessage);
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
                                                onClick={() => setFormData({ ...formData, status })}
                                                className={cn(
                                                    "py-2 px-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                                                    formData.status === status
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
                                    disabled={isLoading || showSuccess}
                                    className={cn(
                                        "flex-[2] py-3 px-6 font-bold rounded-xl shadow-xl transition-all flex items-center justify-center gap-2",
                                        showSuccess
                                            ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/50"
                                            : "premium-gradient text-white shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                                    )}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Initializing Brand...</span>
                                        </>
                                    ) : showSuccess ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            <span>Brand added correctly</span>
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
