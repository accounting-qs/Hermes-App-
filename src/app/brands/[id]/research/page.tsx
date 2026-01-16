import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useResearchStore } from '@/store/useResearchStore';
import { ResearchPhase } from '@/types/research';
import { ResearchStepper } from '@/components/brands/research/ResearchStepper';
import { MarketResearchForm } from '@/components/brands/research/MarketResearchForm';
import { AvatarDiscoveryForm } from '@/components/brands/research/AvatarDiscoveryForm';
import { PainsResearchForm } from '@/components/brands/research/PainsResearchForm';
import { useResearchSync } from '@/hooks/useResearchSync';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase-ssr/client';
import { generateResearchReport } from '@/app/actions/generate-report';
import { ReportViewer } from '@/components/brands/research/ReportViewer';

export default function ResearchPage() {
    const { id } = useParams();
    const brandId = Array.isArray(id) ? id[0] : id;

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
    const [activePhase, setActivePhase] = React.useState<ResearchPhase>('market');
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
                // .eq('status', 'draft') // In strict mode we might filter drafts
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setSession(data as any);
                // Auto-navigate to latest incomplete phase? Logic for later.
            } else {
                // Create new placeholder in store (not DB yet until first save?)
                // Or fetch empty state
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

    const handleGenerateReport = async () => {
        if (!currentSession) return;
        setIsGenerating(true);
        try {
            const result = await generateResearchReport(currentSession);
            if (result.success && result.report) {
                setReportContent(result.report.content);
            } else {
                alert("Failed to generate report. Please try again.");
            }
        } catch (e) {
            console.error(e);
            alert("Error generating report.");
        } finally {
            setIsGenerating(false);
        }
    };

    const phases = [
        { id: 'market' as ResearchPhase, label: 'Market Research', progress: getPhaseProgress('market'), locked: false },
        { id: 'avatar' as ResearchPhase, label: 'Avatar Discovery', progress: getPhaseProgress('avatar'), locked: isPhaseLocked('avatar') },
        { id: 'pains' as ResearchPhase, label: 'Pains & Desires', progress: getPhaseProgress('pains'), locked: isPhaseLocked('pains') },
    ];

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold outfit-font flex items-center gap-3">
                    <Search className="w-8 h-8 text-primary" />
                    Research Hub
                </h1>
                <p className="text-muted-foreground mt-1">
                    Execute the sequential deep-dive to extract the core brand DNA.
                </p>
            </div>

            {/* Stepper (Hide if report view?) */}
            {!reportContent && (
                <div className="max-w-3xl mx-auto py-6">
                    <ResearchStepper
                        currentPhase={activePhase}
                        phases={phases}
                        onPhaseChange={setActivePhase}
                    />
                </div>
            )}

            {/* Main Main Area */}
            <div className={`glass-card min-h-[400px] ${reportContent ? 'p-0 overflow-hidden' : 'p-8'} relative`}>
                {(isLoading || isGenerating) ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50 gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-bold animate-pulse">
                                {isGenerating ? 'Synthesizing Intelligence...' : 'Loading Session...'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {isGenerating ? 'Analyzing 50+ data points with Quantum AI' : 'Fetching your progress'}
                            </p>
                        </div>
                    </div>
                ) : reportContent ? (
                    <ReportViewer initialContent={reportContent} />
                ) : (
                    <div className="max-w-3xl mx-auto">
                        {activePhase === 'market' && <MarketResearchForm />}

                        {activePhase === 'avatar' && (
                            // locked check should technically happen in Stepper/Store but safeguarding here
                            // For now assuming visual lock prevents click
                            <AvatarDiscoveryForm />
                        )}
                        {activePhase === 'pains' && (
                            <div className="text-center p-12 text-muted-foreground">
                                Pains & Desires Form Coming Soon (Locked)
                            </div>
                        )}

                        {/* Navigation Actions */}
                        <div className="mt-12 flex justify-between pt-6 border-t border-border">
                            {activePhase !== 'market' ? (
                                <button
                                    onClick={() => {
                                        if (activePhase === 'avatar') setActivePhase('market');
                                        if (activePhase === 'pains') setActivePhase('avatar');
                                    }}
                                    className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Back
                                </button>
                            ) : <div />}

                            {activePhase !== 'pains' ? (
                                <button
                                    onClick={() => {
                                        if (activePhase === 'market') setActivePhase('avatar');
                                        if (activePhase === 'avatar') setActivePhase('pains');
                                    }}
                                    className="px-8 py-3 bg-secondary text-primary rounded-xl font-bold hover:bg-secondary/80 transition-all"
                                >
                                    Next Phase
                                </button>
                            ) : (
                                <button
                                    className="px-8 py-3 premium-gradient text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center gap-2"
                                    onClick={handleGenerateReport}
                                    disabled={isGenerating}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Generate Research Report
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
