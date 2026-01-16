"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase-ssr/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Sparkles, Sidebar as SidebarIcon, LayoutGrid, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OfferType, BrandOffer } from '@/types';

// Components (We will build these next)
import { ContextSidebar } from '@/components/brands/offers/ContextSidebar';
import { OfferCanvas } from '@/components/brands/offers/OfferCanvas';
import { OfferArchitect } from '@/components/brands/offers/OfferArchitect';

export default function OffersPage() {
    const { id } = useParams();
    const brandId = Array.isArray(id) ? id[0] : id;
    const supabase = createClient();

    // State
    const [activeTab, setActiveTab] = useState<'generator' | 'architect'>('generator');
    const [selectedOffer, setSelectedOffer] = useState<BrandOffer | null>(null);
    const [variations, setVariations] = useState<any[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Context State
    const [selectedReportId, setSelectedReportId] = useState<string>('');
    const [offerType, setOfferType] = useState<OfferType>('core');
    const [tone, setTone] = useState<'premium' | 'aggressive' | 'results-driven'>('premium');

    return (
        <div className="flex h-[calc(100vh-100px)] overflow-hidden">
            {/* 1. Context Sidebar */}
            <ContextSidebar
                brandId={brandId}
                selectedReportId={selectedReportId}
                setSelectedReportId={setSelectedReportId}
                offerType={offerType}
                setOfferType={setOfferType}
                tone={tone}
                setTone={setTone}
                onGenerate={async () => {
                    setIsGenerating(true);
                    const { synthesizeOffer } = await import('@/app/actions/synthesize-offer');
                    const res = await synthesizeOffer({
                        brandId,
                        researchReportId: selectedReportId,
                        offerType,
                        tone
                    });
                    if (res.success) setVariations(res.variations || []);
                    setIsGenerating(false);
                }}
                isGenerating={isGenerating}
            />

            {/* 2. Main Canvas */}
            <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-6xl mx-auto h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                                <Sparkles className="w-8 h-8 text-primary" />
                                The Strategist
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Synthesize your brand DNA into high-ticket offers using RAG Intelligence.
                            </p>
                        </div>

                        <div className="flex bg-secondary/30 p-1 rounded-xl border border-border/50">
                            <button
                                onClick={() => setActiveTab('generator')}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                                    activeTab === 'generator' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                Idea Generator
                            </button>
                            <button
                                onClick={() => selectedOffer && setActiveTab('architect')}
                                disabled={!selectedOffer}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                                    activeTab === 'architect' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground",
                                    !selectedOffer && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                <BrainCircuit className="w-4 h-4" />
                                Offer Architect
                            </button>
                        </div>
                    </div>

                    {activeTab === 'generator' ? (
                        <OfferCanvas
                            variations={variations}
                            isGenerating={isGenerating}
                            brandId={brandId}
                            reportId={selectedReportId}
                            onSelect={(offer) => {
                                setSelectedOffer(offer);
                                setActiveTab('architect');
                            }}
                        />
                    ) : (
                        <OfferArchitect
                            brandId={brandId}
                            offer={selectedOffer!}
                            onUpdate={(updated) => setSelectedOffer(updated)}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}
