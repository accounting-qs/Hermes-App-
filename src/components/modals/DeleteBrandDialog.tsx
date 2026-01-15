"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase-ssr/client";
import { useToast } from "@/components/ui/ToastContext";
import { Brand } from "@/types";
import { cn } from "@/lib/utils";

interface DeleteBrandDialogProps {
    brand: Brand | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function DeleteBrandDialog({ brand, isOpen, onClose, onSuccess }: DeleteBrandDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [associatedUsersCount, setAssociatedUsersCount] = useState<number | null>(null);
    const supabase = createClient();
    const toast = useToast();

    useEffect(() => {
        if (isOpen && brand) {
            checkAssociatedUsers();
        } else {
            setAssociatedUsersCount(null);
        }
    }, [isOpen, brand]);

    const checkAssociatedUsers = async () => {
        if (!brand) return;
        setIsChecking(true);
        try {
            const { count, error } = await supabase
                .from('allowed_users')
                .select('*', { count: 'exact', head: true })
                .eq('brand_id', brand.id);

            if (error) throw error;
            setAssociatedUsersCount(count);
        } catch (error) {
            console.error("DeleteBrandDialog: Error checking users:", error);
            toast.error("Failed to verify brand usage.");
        } finally {
            setIsChecking(false);
        }
    };

    const handleDelete = async () => {
        if (!brand) return;
        setIsLoading(true);

        try {
            const { error } = await supabase
                .from('brands')
                .delete()
                .eq('id', brand.id);

            if (error) throw error;

            toast.success(`Brand "${brand.name}" deleted successfully`);
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("DeleteBrandDialog: Error deleting brand:", error);
            toast.error(error.message || "Failed to delete brand");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && brand && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-md glass-card p-6 shadow-2xl border-destructive/20"
                    >
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                                <AlertTriangle className="w-6 h-6" />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold outfit-font">Delete Brand?</h2>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Are you sure you want to delete <span className="font-bold text-foreground">{brand.name}</span>?
                                    This action cannot be undone.
                                </p>
                            </div>

                            {isChecking ? (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Checking integrity...
                                </div>
                            ) : associatedUsersCount !== null && associatedUsersCount > 0 ? (
                                <div className="w-full bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center">
                                    <p className="text-sm text-destructive font-bold mb-1">Cannot Delete Role</p>
                                    <p className="text-xs text-destructive/80">
                                        There are {associatedUsersCount} users associated with this brand.
                                        Please reassign or remove them before deleting.
                                    </p>
                                </div>
                            ) : null}

                            <div className="flex gap-3 w-full mt-2">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 px-4 bg-secondary/50 hover:bg-secondary text-foreground font-bold rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isLoading || isChecking || (associatedUsersCount !== null && associatedUsersCount > 0)}
                                    className={cn(
                                        "flex-1 py-3 px-4 font-bold rounded-xl shadow-xl transition-all flex items-center justify-center gap-2",
                                        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                                        "disabled:opacity-50 disabled:cursor-not-allowed"
                                    )}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
