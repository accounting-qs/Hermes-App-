"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useResearchStore } from '@/store/useResearchStore';
import { ResearchPhase } from '@/types/research';
import { ResearchStepper } from '@/components/brands/research/ResearchStepper';
import { MarketResearchForm } from '@/components/brands/research/MarketResearchForm';
import { AvatarDiscoveryForm } from '@/components/brands/research/AvatarDiscoveryForm';
import { PainsResearchForm } from '@/components/brands/research/PainsResearchForm';
import { useResearchSync } from '@/hooks/useResearchSync';
import { ResearchLayout } from '@/components/brands/research/ResearchLayout';
import { generateResearchReport } from '@/app/actions/generate-report';
import { ReportViewer } from '@/components/brands/research/ReportViewer';
import { Loader2, Search, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase-ssr/client';

export default function ResearchPage() {
    const { id } = useParams();
    const brandId = (Array.isArray(id) ? id[0] : id) as string;

    // Auto-Save Sync
    useResearchSync(brandId); // This will listen to store changes

    // Store
    const {
        currentSession,
        setSession,
        setLoading,
        isLoading,
        getPhaseProgress,
        isPhaseLocked
    } = useResearchStore();

    // Local state for active phase in UI (synced with store but capable of navigation)
    const [activePhase, setActivePhase] = useState<ResearchPhase>('market');
    const [section, setSection] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportContent, setReportContent] = useState<string | null>(null);

    // Fetch existing session or create specific logic would go here
    useEffect(() => {
        if (!brandId) return;

        const initSession = async () => {
            setLoading(true);
            const supabase = createClient();

            // Try fetch active session
            const { data, error } = await supabase
                .from('research_sessions')
                .select('*')
                .eq('brand_id', brandId)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (data) {
                setSession(data as any);
            }
            setLoading(false);
        };

        initSession();
    }, [brandId, setSession, setLoading]);

    // Fetch existing report if session is completed
    useEffect(() => {
        if (!currentSession?.id) return;
        if (currentSession.status === 'completed' && !reportContent) {
            const fetchReport = async () => {
                const supabase = createClient();
                const { data } = await supabase
                    .from('research_reports')
                    .select('content')
                    .eq('session_id', currentSession.id)
                    .single();
                if (data) setReportContent(data.content);
            };
            fetchReport();
        }
    }, [currentSession, reportContent]);

    const phaseConfig: Record<ResearchPhase, { title: string; subtitle: string; totalSections: number }> = {
        market: {
            title: "Market Research",
            subtitle: "Strategic deep-dive into your market position.",
            totalSections: 4
        },
        avatar: {
            title: "Avatar Discovery",
            subtitle: "Mapping the psychological profile of your ideal client.",
            totalSections: 1
        },
        pains: {
            title: "Pains & Desires",
            subtitle: "Analyzing the emotional triggers of your market.",
            totalSections: 1
        }
    };

    const currentConfig = phaseConfig[activePhase];

    const sectionTitles: Record<string, string[]> = {
        market: [
            "Company Fundamentals",
            "Target Audience & Apollo.io Filters",
            "Unified Offer & Business Overview",
            "Case Study & Proof Builder"
        ],
        avatar: ["Ideal Customer Profile"],
        pains: ["Pain Points & Desires"]
    };

    const sectionSubtitles: Record<string, string[]> = {
        market: [
            "The foundational data points for your brand context.",
            "Map out the exact hunters we are targeting.",
            "The strategic engineering of your conversion mechanism.",
            "Document individual wins to build undeniable credibility."
        ],
        avatar: ["Psychographic mapping of your best customers."],
        pains: ["Emotional triggers and stakes analysis."]
    };

    const handleNext = () => {
        if (section < currentConfig.totalSections) {
            setSection(section + 1);
        } else {
            // Next Phase logic
            if (activePhase === 'market') { setActivePhase('avatar'); setSection(1); }
            else if (activePhase === 'avatar') { setActivePhase('pains'); setSection(1); }
        }
    };

    const handleBack = () => {
        if (section > 1) {
            setSection(section - 1);
        } else {
            // Previous Phase
            if (activePhase === 'avatar') { setActivePhase('market'); setSection(phaseConfig.market.totalSections); }
            else if (activePhase === 'pains') { setActivePhase('avatar'); setSection(phaseConfig.avatar.totalSections); }
        }
    };

    if (isLoading || isGenerating) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6">
                <Loader2 className="w-16 h-16 animate-spin text-primary" />
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold outfit-font animate-pulse">
                        {isGenerating ? 'Synthesizing Market Intelligence...' : 'Accessing Brand Session...'}
                    </h2>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Quantum AI Powered</p>
                </div>
            </div>
        );
    }

    if (reportContent) {
        return <ReportViewer initialContent={reportContent} />;
    }

    return (
        <ResearchLayout
            currentSection={section}
            totalSections={currentConfig.totalSections}
            title={sectionTitles[activePhase][section - 1]}
            subtitle={sectionSubtitles[activePhase][section - 1]}
            activePhase={activePhase}
            onPhaseChange={(phase) => { setActivePhase(phase); setSection(1); }}
            onNext={handleNext}
            onBack={handleBack}
            canBack={activePhase !== 'market' || section > 1}
            canNext={true}
            onSave={() => { }} // Hooked into auto-save via useResearchSync
        >
            {activePhase === 'market' && <MarketResearchForm section={section} />}
            {activePhase === 'avatar' && <AvatarDiscoveryForm />}
            {activePhase === 'pains' && <div className="p-12 text-center text-muted-foreground">Pains Discovery Coming Soon</div>}
        </ResearchLayout>
    );
}
