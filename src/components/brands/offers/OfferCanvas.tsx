"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, BrainCircuit, TrendingUp, DollarSign, Clock, ShieldCheck, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandOffer } from '@/types';

interface OfferCanvasProps {
    variations: any[];
    isGenerating: boolean;
    brandId: string;
    reportId: string;
    onSelect: (offer: BrandOffer) => void;
}

export const OfferCanvas: React.FC<OfferCanvasProps> = ({
    variations,
    isGenerating,
    brandId,
    reportId,
    onSelect
}) => {
    const handleSelectVariation = async (v: any) => {
        const { expandOffer } = await import('@/app/actions/expand-offer');
        const { saveOffer } = await import('@/app/actions/save-offer');

        // 1. Expand Variation into full architecture
        const res = await expandOffer(v, brandId, reportId);
        if (!res.success) return;

        // 2. Save full offer to DB
        const saveRes = await saveOffer({
            brandId,
            title: v.title,
            offerType: 'core', // Should be dynamic
            pricingData: v.price_point,
            contentFull: res.fullOffer,
            aiRationale: v.ai_rationale
        });

        if (saveRes.success && saveRes.offer) {
            onSelect(saveRes.offer as BrandOffer);
        }
    };

    if (isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-20 space-y-6">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <Sparkles className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground">Synthesizing Offer Variations...</h2>
                    <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
                        Calculating the Value Equation and cross-referencing your Brand DNA with Resource assets.
                    </p>
                </div>
            </div>
        );
    }

    if (variations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-20 opacity-40">
                <BrainCircuit className="w-24 h-24 text-muted-foreground mb-6" />
                <h2 className="text-xl font-medium text-muted-foreground">No variations generated yet.</h2>
                <p className="text-sm text-muted-foreground mt-2">Select your research context and click "Generate" to start.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {variations.map((v, idx) => (
                <div
                    key={idx}
                    className="group relative flex flex-col glass-card p-8 border border-border/50 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2"
                >
                    {/* Success Score Badge */}
                    <div className="absolute top-0 right-8 -translate-y-1/2">
                        <div className="px-4 py-2 rounded-full bg-background border border-border shadow-xl flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-lg font-black font-mono text-emerald-500">
                                {v.value_equation?.score || 85}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50 tracking-tighter">Score</span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-xl font-black text-foreground mb-4 group-hover:text-primary transition-colors">
                            {v.title}
                        </h3>

                        <p className="text-sm font-medium text-muted-foreground leading-relaxed italic mb-8 border-l-4 border-primary/30 pl-4 py-1">
                            "{v.big_promise}"
                        </p>

                        {/* Value Equation Factors */}
                        <div className="space-y-4 mb-8">
                            <FactorItem
                                icon={TrendingUp}
                                label="Outcome"
                                value={v.value_equation?.factors?.outcome || 9}
                            />
                            <FactorItem
                                icon={ShieldCheck}
                                label="Likelihood"
                                value={v.value_equation?.factors?.likelihood || 8}
                            />
                            <FactorItem
                                icon={Clock}
                                label="Time Delay"
                                value={v.value_equation?.factors?.delay || 3}
                                inverse
                            />
                            <FactorItem
                                icon={BrainCircuit}
                                label="Effort"
                                value={v.value_equation?.factors?.effort || 4}
                                inverse
                            />
                        </div>
                    </div>

                    <div className="mt-auto space-y-6 pt-6 border-t border-border/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">Target Price</div>
                                <div className="text-2xl font-black text-foreground flex items-center">
                                    <DollarSign className="w-5 h-5 text-emerald-500 mr-0.5" />
                                    {v.price_point?.price?.toLocaleString()}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">Model</div>
                                <div className="text-xs font-bold text-foreground bg-secondary px-2 py-1 rounded-md">
                                    {v.price_point?.payment_model}
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={() => handleSelectVariation(v)}
                            className="w-full py-6 rounded-xl bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/20 group"
                        >
                            Select & Architect
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

const FactorItem = ({ icon: Icon, label, value, inverse = false }: any) => {
    // For delay/effort, low is good. For outcome/likelihood, high is good.
    const scoreColor = inverse
        ? (value <= 3 ? "text-emerald-500" : value <= 6 ? "text-amber-500" : "text-red-500")
        : (value >= 7 ? "text-emerald-500" : value >= 4 ? "text-amber-500" : "text-red-500");

    return (
        <div className="flex items-center justify-between group/factor">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <Icon className="w-3.5 h-3.5 opacity-40 group-hover/factor:opacity-100 transition-opacity" />
                {label}
            </div>
            <div className="flex items-center gap-1.5 flex-1 max-w-[100px] ml-4">
                <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            scoreColor.replace('text', 'bg')
                        )}
                        style={{ width: `${value * 10}%` }}
                    />
                </div>
                <span className={cn("text-[10px] font-mono font-bold w-4", scoreColor)}>{value}</span>
            </div>
        </div>
    );
};
