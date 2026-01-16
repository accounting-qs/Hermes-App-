"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Target, Zap, Waves, Sparkles, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-ssr/client';
import { cn } from '@/lib/utils';
import { OfferType } from '@/types';

interface ContextSidebarProps {
    brandId: string;
    selectedReportId: string;
    setSelectedReportId: (id: string) => void;
    offerType: OfferType;
    setOfferType: (type: OfferType) => void;
    tone: 'premium' | 'aggressive' | 'results-driven';
    setTone: (tone: any) => void;
    onGenerate: () => void;
    isGenerating: boolean;
}

export const ContextSidebar: React.FC<ContextSidebarProps> = ({
    brandId,
    selectedReportId,
    setSelectedReportId,
    offerType,
    setOfferType,
    tone,
    setTone,
    onGenerate,
    isGenerating
}) => {
    const supabase = createClient();
    const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchReports() {
            const { data } = await supabase
                .from('research_reports')
                .select('id, title, created_at')
                .eq('brand_id', brandId)
                .order('created_at', { ascending: false });

            if (data && data.length > 0) {
                setReports(data);
                if (!selectedReportId) setSelectedReportId(data[0].id);
            }
            setIsLoading(false);
        }
        fetchReports();
    }, [brandId]);

    return (
        <aside className="w-80 border-r border-border/50 bg-card/30 backdrop-blur-sm p-6 overflow-y-auto custom-scrollbar flex flex-col">
            <div className="space-y-8 flex-1">
                {/* Section 1: Research Context */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Research DNA
                    </h3>
                    <div className="space-y-2">
                        {isLoading ? (
                            <div className="animate-pulse space-y-2">
                                <div className="h-10 bg-secondary/50 rounded-lg w-full" />
                                <div className="h-10 bg-secondary/50 rounded-lg w-full" />
                            </div>
                        ) : reports.length > 0 ? (
                            reports.map(report => (
                                <button
                                    key={report.id}
                                    onClick={() => setSelectedReportId(report.id)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-xl border text-sm transition-all relative overflow-hidden group",
                                        selectedReportId === report.id
                                            ? "border-primary bg-primary/5 text-foreground font-medium"
                                            : "border-border/50 bg-secondary/20 text-muted-foreground hover:border-border hover:bg-secondary/40"
                                    )}
                                >
                                    <div className="truncate pr-4">{report.title}</div>
                                    <div className="text-[10px] opacity-60 mt-1">
                                        {new Date(report.created_at).toLocaleDateString()}
                                    </div>
                                    {selectedReportId === report.id && (
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                            <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                                        </div>
                                    )}
                                </button>
                            ))
                        ) : (
                            <p className="text-xs text-amber-500/70 bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
                                No Research DNA found. Please complete the Research module first.
                            </p>
                        )}
                    </div>
                </div>

                {/* Section 2: Offer Strategy */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Offer Type
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                        {(['core', 'lead_magnet', 'downsell'] as OfferType[]).map(type => (
                            <button
                                key={type}
                                onClick={() => setOfferType(type)}
                                className={cn(
                                    "p-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all",
                                    offerType === type
                                        ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "border-border/50 bg-secondary/20 text-muted-foreground hover:bg-secondary/40"
                                )}
                            >
                                {type.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section 3: Tone & Voice */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Strategic Tone
                    </h3>
                    <div className="space-y-2">
                        {[
                            { id: 'premium', icon: Waves, label: 'Premium' },
                            { id: 'aggressive', icon: Zap, label: 'Aggressive' },
                            { id: 'results-driven', icon: Target, label: 'Results' }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setTone(t.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-xl border text-sm transition-all",
                                    tone === t.id
                                        ? "border-primary bg-primary/5 text-foreground"
                                        : "border-border/50 bg-secondary/20 text-muted-foreground hover:bg-secondary/40"
                                )}
                            >
                                <t.icon className={cn("w-4 h-4", tone === t.id ? "text-primary" : "text-muted-foreground")} />
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <Button
                onClick={onGenerate}
                disabled={isGenerating || !selectedReportId}
                className="w-full mt-8 py-6 rounded-2xl premium-gradient text-white font-bold group overflow-hidden relative"
            >
                {isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <Sparkles className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Generate Variations
                    </>
                )}
            </Button>
        </aside>
    );
};
