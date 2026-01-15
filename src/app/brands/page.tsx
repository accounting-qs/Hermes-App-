"use client";

import React, { useState } from "react";
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    Grid,
    List as ListIcon,
    ArrowUpRight,
    ChevronRight,
    ExternalLink,
    Edit2,
    Trash2
} from "lucide-react";
import { useBrandStore } from "@/store/useBrandStore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { NewBrandModal } from "@/components/modals/NewBrandModal";
import { createClient } from "@/lib/supabase-ssr/client";
import { Brand } from "@/types";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/Skeleton";
import { EditBrandModal } from "@/components/modals/EditBrandModal";
import { DeleteBrandDialog } from "@/components/modals/DeleteBrandDialog";

// Define FilterState type
type FilterState = {
    status: 'all' | 'active' | 'onboarding' | 'scaling';
    industry: 'all' | string;
    sortBy: 'name' | 'created_at';
};

export default function BrandsPage() {
    const { selectBrand } = useBrandStore();
    const { user } = useAuthStore();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [isNewBrandModalOpen, setIsNewBrandModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'onboarding' | 'scaling'>('all');
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);

    const supabase = createClient();
    const router = useRouter();

    const fetchBrands = async () => {
        setIsLoading(true);
        console.log("BrandsPage: Fetching brands...");
        try {
            // Optimize: Select only needed fields
            let query = supabase
                .from('brands')
                .select('id, name, industry, status, website, logo_url, phase, created_at, updated_at');

            // RBAC: Client users only see their brand
            if (user?.role !== 'qs_team' && user?.brandId) {
                query = query.eq('id', user.brandId);
            }

            const response = await query.order('name', { ascending: true });
            const { data, error, status, statusText } = response;

            console.log("BrandsPage: Full Supabase Response:", {
                data,
                error,
                status,
                statusText,
                userRoleId: user?.role,
                userBrandId: user?.brandId
            });

            if (error) {
                console.error("BrandsPage: Supabase error fetching brands:", error);
                throw error;
            }

            if (data) {
                console.log("BrandsPage: Successfully fetched brands count:", data.length);
                const mappedBrands: Brand[] = data.map((b: any) => ({
                    id: b.id,
                    name: b.name,
                    industry: b.industry,
                    status: b.status,
                    phase: b.phase,
                    createdAt: b.created_at,
                    updatedAt: b.updated_at,
                    progress: { overall: 0 }, // Default progress as it is not in the DB yet
                    // detailed progress, website, logoUrl etc are partials or not in Brand interface yet?
                    // The Brand interface in types/index.ts only has the above fields.
                }));
                setBrands(mappedBrands);
            }
        } catch (err) {
            console.error("BrandsPage: Technical failure in fetchBrands:", err);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchBrands();
    }, []);

    const filteredBrands = brands.filter(brand => {
        const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            brand.industry.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'all' || brand.status === activeTab;
        return matchesSearch && matchesTab;
    });


    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold outfit-font">Brands</h1>
                    <p className="text-muted-foreground mt-1">Manage and monitor all client brands in one place.</p>
                </div>
                {user?.role === 'qs_team' && (
                    <button
                        onClick={() => setIsNewBrandModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 premium-gradient text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        <span>New Brand</span>
                    </button>
                )}

            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between">
                <div className="flex items-center gap-2 p-1 bg-secondary/50 border border-border/50 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={cn("px-4 py-1.5 text-xs font-bold rounded-lg transition-all", activeTab === 'all' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                    >
                        All Brands
                    </button>
                    <button
                        onClick={() => setActiveTab('active')}
                        className={cn("px-4 py-1.5 text-xs font-bold rounded-lg transition-all", activeTab === 'active' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setActiveTab('onboarding')}
                        className={cn("px-4 py-1.5 text-xs font-bold rounded-lg transition-all", activeTab === 'onboarding' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                    >
                        Onboarding
                    </button>
                    <button
                        onClick={() => setActiveTab('scaling')}
                        className={cn("px-4 py-1.5 text-xs font-bold rounded-lg transition-all", activeTab === 'scaling' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                    >
                        Scaling
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name or industry..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-secondary/50 border border-border/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    <div className="flex items-center gap-1 p-1 bg-secondary/50 border border-border/50 rounded-xl">
                        <button
                            onClick={() => setView('grid')}
                            className={cn("p-1.5 rounded-lg transition-all", view === 'grid' ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={cn("p-1.5 rounded-lg transition-all", view === 'list' ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}
                        >
                            <ListIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="glass-card p-6 border-primary/20 h-[280px] flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <Skeleton className="w-12 h-12 rounded-xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                                <Skeleton className="w-8 h-8 rounded-lg" />
                            </div>
                            <div className="mt-4 space-y-3">
                                <Skeleton className="h-2 w-full" />
                                <Skeleton className="h-2 w-2/3" />
                            </div>
                            <div className="mt-auto pt-4 flex justify-between items-center">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-8 w-24 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {view === 'grid' ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filteredBrands.map((brand, idx) => (
                                <motion.div
                                    key={brand.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="glass-card group hover:border-primary/50 transition-all flex flex-col"
                                >
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-14 h-14 rounded-2xl premium-gradient flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/20">
                                                {brand.name[0]}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setEditingBrand(brand)}
                                                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingBrand(brand)}
                                                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{brand.name}</h3>
                                            <p className="text-sm text-muted-foreground">{brand.industry}</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 mb-6">
                                            <div className="p-3 bg-secondary/30 rounded-xl border border-border/30">
                                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Current Status</div>
                                                <div className="text-sm font-bold capitalize flex items-center gap-2">
                                                    <div className={cn(
                                                        "w-2 h-2 rounded-full",
                                                        brand.status === 'active' ? "bg-green-500" :
                                                            brand.status === 'scaling' ? "bg-blue-500" : "bg-amber-500"
                                                    )} />
                                                    {brand.status}
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                    <div className="p-4 bg-secondary/20 border-t border-border/50 flex items-center gap-2">
                                        <Link
                                            href={`/brands/${brand.id}`}
                                            onClick={() => selectBrand(brand.id)}
                                            className="flex-1 text-center py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all"
                                        >
                                            View Modules
                                        </Link>
                                        <button className="p-2 bg-secondary/50 text-muted-foreground hover:text-foreground rounded-lg transition-all">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="glass-card overflow-hidden border-border/50"
                        >
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-secondary/30 border-b border-border/50">
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Brand</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Industry</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                                        <th className="px-6 py-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredBrands.map((brand) => (
                                        <tr key={brand.id} className="hover:bg-secondary/10 transition-all cursor-pointer group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg premium-gradient flex items-center justify-center font-bold">{brand.name[0]}</div>
                                                    <div className="font-bold group-hover:text-primary transition-colors">{brand.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground font-medium">{brand.industry}</td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                                    brand.status === 'active' ? "bg-green-500/10 text-green-500" :
                                                        brand.status === 'scaling' ? "bg-blue-500/10 text-blue-500" : "bg-amber-500/10 text-amber-500"
                                                )}>
                                                    {brand.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/brands/${brand.id}`}
                                                    onClick={() => selectBrand(brand.id)}
                                                    className="p-2 text-muted-foreground hover:text-primary transition-all inline-block"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            <NewBrandModal
                isOpen={isNewBrandModalOpen}
                onClose={() => setIsNewBrandModalOpen(false)}
                onSuccess={fetchBrands}
            />

            <EditBrandModal
                brand={editingBrand}
                isOpen={!!editingBrand}
                onClose={() => setEditingBrand(null)}
                onSuccess={fetchBrands}
            />

            <DeleteBrandDialog
                brand={deletingBrand}
                isOpen={!!deletingBrand}
                onClose={() => setDeletingBrand(null)}
                onSuccess={fetchBrands}
            />
        </div>
    );
}
