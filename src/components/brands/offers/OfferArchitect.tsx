"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    BrainCircuit,
    Send,
    History as HistoryIcon,
    CheckCircle2,
    ShieldCheck,
    Layers,
    Zap,
    TrendingUp,
    Target,
    Loader2,
    DollarSign,
    ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandOffer } from '@/types';
import { createClient } from '@/lib/supabase-ssr/client';

interface OfferArchitectProps {
    brandId: string;
    offer: BrandOffer;
    onUpdate: (offer: BrandOffer) => void;
}

export const OfferArchitect: React.FC<OfferArchitectProps> = ({ brandId, offer, onUpdate }) => {
    const supabase = createClient();
    const [prompt, setPrompt] = useState('');
    const [isRefining, setIsRefining] = useState(false);
    const [iterations, setIterations] = useState<any[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchIterations() {
            const { data } = await supabase
                .from('offer_iterations')
                .select('*')
                .eq('offer_id', offer.id)
                .order('created_at', { ascending: true });
            if (data) setIterations(data);
        }
        fetchIterations();
    }, [offer.id]);

    const handleRefine = async () => {
        if (!prompt.trim()) return;
        setIsRefining(true);

        try {
            const { evolveOffer } = await import('@/app/actions/evolve-offer');
            const { saveOffer } = await import('@/app/actions/save-offer');

            // 1. Evolve current state using history context
            const evolution = await evolveOffer(offer, prompt, iterations);

            if (evolution.success && evolution.evolvedOffer) {
                // 2. Persist the evolved state
                const res = await saveOffer({
                    brandId,
                    offerId: offer.id,
                    title: offer.title,
                    offerType: offer.offer_type,
                    pricingData: offer.pricing_data,
                    contentFull: evolution.evolvedOffer,
                    aiRationale: "Evolved via strategic refinement",
                    refinementPrompt: prompt
                });

                if (res.success && res.offer) {
                    onUpdate(res.offer as BrandOffer);
                    const { data: newHistory } = await supabase
                        .from('offer_iterations')
                        .select('*')
                        .eq('offer_id', offer.id)
                        .order('created_at', { ascending: true });
                    if (newHistory) setIterations(newHistory);
                    setPrompt('');
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsRefining(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Left: Architect View */}
            <div className="lg:col-span-2 space-y-8 pb-20">
                {/* 1. The Big Promise */}
                <div className="glass-card p-10 border-primary/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Target className="w-40 h-40 text-primary" />
                    </div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-4 block">The Dominant Promise</span>
                        <h2 className="text-4xl font-black text-foreground leading-tight">
                            {offer.content_full.promise}
                        </h2>
                    </div>
                </div>

                {/* 2. Mechanism & Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-8 bg-secondary/20 border-border/50">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                            <Zap className="w-4 h-4 text-amber-500" />
                            Unique Mechanism
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {offer.content_full.mechanism}
                        </p>
                    </Card>

                    <Card className="p-8 bg-secondary/20 border-border/50">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            Risk Reversal (Guarantee)
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {offer.content_full.guarantee}
                        </p>
                    </Card>
                </div>

                {/* 3. Bonus Stack */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Objection-Handling Bonus Stack
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {offer.content_full.bonus_stack.map((bonus, bidx) => (
                            <div key={bidx} className="p-5 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-all">
                                <div className="text-[10px] font-bold text-primary mb-2">BONUS #0{bidx + 1}</div>
                                <div className="text-sm font-black mb-1">{bonus.title}</div>
                                <div className="text-xs text-muted-foreground leading-relaxed">{bonus.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Refinement & Evolution */}
            <div className="space-y-6 flex flex-col h-full sticky top-0">
                {/* 1. Value Math Summary */}
                <div className="glass-card p-6 bg-primary/5 border-primary/20">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary">Value Equation Math</h3>
                        <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex items-end gap-2 mb-6">
                        <span className="text-5xl font-black text-primary">{offer.content_full.value_equation_math.score}</span>
                        <span className="text-[10px] text-muted-foreground uppercase pb-2 tracking-tighter">Strategic Rating</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-2 rounded-lg bg-background/50 border border-border/50">
                            <div className="text-[8px] font-bold text-muted-foreground uppercase opacity-60">Price Point</div>
                            <div className="text-sm font-black text-foreground">{offer.pricing_data.price.toLocaleString()} {offer.pricing_data.currency}</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-background/50 border border-border/50">
                            <div className="text-[8px] font-bold text-muted-foreground uppercase opacity-60">Payment</div>
                            <div className="text-sm font-black text-foreground">{offer.pricing_data.payment_model}</div>
                        </div>
                    </div>
                </div>

                {/* 2. Refinement Chat */}
                <div className="flex-1 flex flex-col glass-card overflow-hidden">
                    <div className="p-4 border-b border-border/50 bg-secondary/20 flex items-center justify-between">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <BrainCircuit className="w-3 h-3 text-primary" />
                            Refinement Chat
                        </h4>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold uppercase">v{iterations.length}</span>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {iterations.map((iter, iidx) => (
                            <div key={iter.id} className="space-y-3">
                                <div className="flex justify-end">
                                    <div className="max-w-[80%] bg-primary p-3 rounded-2xl rounded-tr-none text-white text-xs font-medium shadow-lg shadow-primary/10">
                                        {iter.refinement_prompt}
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="max-w-[80%] bg-secondary/50 p-3 rounded-2xl rounded-tl-none border border-border/50 text-xs text-muted-foreground italic">
                                        AI has evolved the promise and mechanism based on your guidance. {iidx === 0 ? "Initial Strategy expansion." : "Evolved state saved."}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-border/50 bg-background/50">
                        <div className="relative">
                            <input
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                                placeholder="E.g. 'Make it more premium and handle technical objections'..."
                                className="w-full bg-secondary p-3 pr-12 rounded-xl border border-border focus:border-primary outline-none text-xs transition-all"
                                disabled={isRefining}
                            />
                            <button
                                onClick={handleRefine}
                                disabled={isRefining || !prompt.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/80 transition-colors disabled:opacity-50"
                            >
                                {isRefining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
