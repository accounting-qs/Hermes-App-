"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useBrandStore } from "@/store/useBrandStore";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase-ssr/client";
import { StrategicRoadmap } from "@/components/brands/overview/StrategicRoadmap";
import { ModuleStatusGrid, ModuleStatus } from "@/components/brands/overview/ModuleStatusGrid";
import { ActivityFeed } from "@/components/brands/overview/ActivityFeed";
import { QuantumPulse, AIFlashSummary } from "@/components/brands/overview/IntelligenceComponents";
import { BookOpen, Search, Target, Video, Truck, Library } from "lucide-react"; // Import necessary icons

// Define Activity Interface manually to match component expectation
interface ActivityItem {
    id: string;
    action_type: string;
    category: string;
    description: string;
    created_at: string;
}

export default function BrandOverviewPage() {
    const { id } = useParams();
    const { brands } = useBrandStore();
    const { user } = useAuthStore(); // Check for role later if needed
    const supabase = createClient();

    // Convert 'id' to string safely
    const brandId = (Array.isArray(id) ? id[0] : id) || '';
    const brand = brands.find(b => b.id === brandId);

    // Local State for New Data
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [pulseScore, setPulseScore] = useState(0);
    const [flashSummary, setFlashSummary] = useState("");
    const [loading, setLoading] = useState(true);

    // Initial Data Fetch
    useEffect(() => {
        if (!brandId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Activity Log
                const { data: logs } = await supabase
                    .from('brand_activity_log')
                    .select('*')
                    .eq('brand_id', brandId)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (logs) setActivities(logs as ActivityItem[]);

                // Fetch Summary & Pulse
                const { data: summary } = await supabase
                    .from('brand_summaries')
                    .select('*')
                    .eq('brand_id', brandId)
                    .single();

                if (summary) {
                    setPulseScore(summary.pulse_score || 0);
                    setFlashSummary(summary.flash_summary || "");
                }

                // Note: Milestones fetching could go here to calculate module progress accurately
                // For now, falling back to brand.progress or 0

            } catch (error) {
                console.error("Error fetching overview data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Real-time Subscription for Activity Log
        const channel = supabase
            .channel(`overview-${brandId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'brand_activity_log', filter: `brand_id=eq.${brandId}` },
                (payload) => {
                    const newLog = payload.new as ActivityItem;
                    setActivities(prev => [newLog, ...prev].slice(0, 5));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [brandId, supabase]);

    if (!brand) return <div className="p-8 text-center">Brand not found</div>;

    // Hardcode generic progress for now while backend populates
    // In real scenario, this comes from 'brand_milestones' or aggregated table
    // Research is manually segmented for demo: Market (33%), Avatar (33%), Pains (33%) 
    // If brand.progress.research is e.g. 50, we split it.
    const researchProg = brand.progress?.research || 0;

    const modules: ModuleStatus[] = [
        { id: 'resources', title: "Resources", icon: Library, progress: 100, status: 'Complete' },
        {
            id: 'research',
            title: "Research",
            icon: Search,
            progress: researchProg,
            status: researchProg === 100 ? 'Complete' : 'In Progress',
            subProgress: [Math.min(researchProg, 33) * 3, Math.max(0, Math.min(researchProg - 33, 33)) * 3, Math.max(0, researchProg - 66) * 3]
        },
        { id: 'offers', title: "Offers", icon: Target, progress: brand.progress?.offers || 0, status: (brand.progress?.offers || 0) > 0 ? 'In Progress' : 'Not Started' },
        { id: 'webinar', title: "Webinar", icon: Video, progress: brand.progress?.webinar || 0, status: 'Not Started' },
        { id: 'workbook', title: "Workbook", icon: BookOpen, progress: 0, status: 'Not Started' },
        { id: 'delivery', title: "Delivery", icon: Truck, progress: brand.progress?.delivery || 0, status: 'Not Started' },
    ];

    const currentPhase = brand.phase || 'foundation';

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl premium-gradient flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-primary/30">
                        {brand.name[0]}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold outfit-font">{brand.name}</h1>
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
                                {brand.status}
                            </span>
                        </div>
                        <p className="text-muted-foreground mt-1">{brand.companyName || 'Company'} • {brand.industry || 'Industry'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-xl text-sm font-bold transition-all">
                        Edit Brand
                    </button>
                    <button className="px-6 py-2 premium-gradient text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                        Manage Brand
                    </button>
                </div>
            </div>

            {/* Strategic Roadmap */}
            <div className="glass-card p-8">
                <h2 className="text-lg font-bold mb-6">Strategic Roadmap</h2>
                <StrategicRoadmap currentPhase={currentPhase} />
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column: Modules (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-card p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-bold">Quantum Modules</h2>
                        </div>
                        <ModuleStatusGrid brandId={brandId} modules={modules} />
                    </div>
                </div>

                {/* Right Column: Intelligence & Activity (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Intelligence Card */}
                    <div className="glass-card p-6 text-center">
                        <QuantumPulse score={pulseScore} />
                        <div className="mt-6">
                            <AIFlashSummary summary={flashSummary} />
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="glass-card p-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Live Activity Log</h2>
                        {loading ? (
                            <div className="text-center text-xs text-muted-foreground">Loading feed...</div>
                        ) : (
                            <ActivityFeed activities={activities} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
