"use client";

import React from 'react';
import { useResearchStore } from '@/store/useResearchStore';
import { QuantumInput } from './QuantumInput';
import { Flame, Activity, ShieldBan, Sparkles } from 'lucide-react';
import { PainsResearchData } from '@/types/research';

export const PainsResearchForm = () => {
    const { currentSession, updateFormData } = useResearchStore();

    // Strict typing access
    const painsData = (currentSession?.data?.pains || {}) as Partial<PainsResearchData>;
    const painPoints = painsData.painPoints || {} as PainsResearchData['painPoints'];
    const impact = painsData.impactAnalysis || {} as PainsResearchData['impactAnalysis'];
    const avoidance = painsData.avoidanceAndTriggers || {} as PainsResearchData['avoidanceAndTriggers'];
    const future = painsData.desiredFuture || {} as PainsResearchData['desiredFuture'];
    const prefs = painsData.solutionPreferences || {} as PainsResearchData['solutionPreferences'];

    const handleChange = (section: string, field: string, value: any) => {
        updateFormData('pains', `${section}.${field}`, value);
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700">

            {/* Section 1: Pain Points & Impact */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                        <Flame className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Pain Points & Emotional Impact</h2>
                        <p className="text-xs text-muted-foreground">The raw, unfiltered struggle.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <QuantumInput
                        label="Foundational Pains & Nightmares"
                        fieldId="pains.painPoints.foundational"
                        placeholder="Describe the top 5 biggest pains and use exact quotes if possible."
                        value={painPoints.foundational || ''}
                        onChange={(e) => handleChange('painPoints', 'foundational', e.target.value)}
                        className="md:col-span-2"
                        helperText="Be descriptive. What is the nightmare scenario?"
                    />
                    <QuantumInput
                        label="The 'Breaking Point'"
                        fieldId="pains.painPoints.breakingPoint"
                        placeholder="What is the specific moment they say 'Enough is enough'?"
                        value={painPoints.breakingPoint || ''}
                        onChange={(e) => handleChange('painPoints', 'breakingPoint', e.target.value)}
                        className="md:col-span-2"
                    />
                    <QuantumInput
                        label="Emotional Internalization"
                        fieldId="pains.painPoints.emotional"
                        placeholder="How do they feel about themselves? (Guilt, Shame, inadequacy)"
                        value={painPoints.emotional || ''}
                        onChange={(e) => handleChange('painPoints', 'emotional', e.target.value)}
                        className="md:col-span-2"
                    />
                </div>

                {/* Impact Grid */}
                <div className="bg-secondary/20 p-6 rounded-xl space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Impact Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <QuantumInput
                            label="Impact on Health"
                            fieldId="pains.impactAnalysis.health"
                            placeholder="Stress, sleep, physical toll..."
                            value={impact.health || ''}
                            onChange={(e) => handleChange('impactAnalysis', 'health', e.target.value)}
                        />
                        <QuantumInput
                            label="Impact on Relationships"
                            fieldId="pains.impactAnalysis.relationships"
                            placeholder="Family tension, marriage strain..."
                            value={impact.relationships || ''}
                            onChange={(e) => handleChange('impactAnalysis', 'relationships', e.target.value)}
                        />
                        <QuantumInput
                            label="Impact on Finances"
                            fieldId="pains.impactAnalysis.finances"
                            placeholder="Lost money, debt, limitation..."
                            value={impact.finances || ''}
                            onChange={(e) => handleChange('impactAnalysis', 'finances', e.target.value)}
                        />
                        <QuantumInput
                            label="Impact on Career/Biz"
                            fieldId="pains.impactAnalysis.career"
                            placeholder="Stagnation, burnout, lost deals..."
                            value={impact.career || ''}
                            onChange={(e) => handleChange('impactAnalysis', 'career', e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Section 2: Avoidance & Triggers */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <ShieldBan className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Avoidance & Triggers</h2>
                        <p className="text-xs text-muted-foreground">What they refuse to tolerate anymore.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <QuantumInput
                        label="Non-Negotiables (Tolerations)"
                        fieldId="pains.avoidanceAndTriggers.tolerations"
                        placeholder="What will they absolutely NOT accept in a solution?"
                        value={avoidance.tolerations || ''}
                        onChange={(e) => handleChange('avoidanceAndTriggers', 'tolerations', e.target.value)}
                    />
                    <QuantumInput
                        label="Primary Triggers"
                        fieldId="pains.avoidanceAndTriggers.triggers"
                        placeholder="What specific events trigger their frustration/fear?"
                        value={avoidance.triggers || ''}
                        onChange={(e) => handleChange('avoidanceAndTriggers', 'triggers', e.target.value)}
                    />
                </div>
            </section>

            {/* Section 3: Desired Future */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Outcomes & New Reality</h2>
                        <p className="text-xs text-muted-foreground">The detailed picture of success.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <QuantumInput
                        label="The Dream Outcome (Big Win)"
                        fieldId="pains.desiredFuture.idealOutcome"
                        placeholder="If magic existed, what would the perfect result look like?"
                        value={future.idealOutcome || ''}
                        onChange={(e) => handleChange('desiredFuture', 'idealOutcome', e.target.value)}
                        className="md:col-span-2"
                    />
                    <QuantumInput
                        label="Day-to-Day Reality"
                        fieldId="pains.desiredFuture.dayToDay"
                        placeholder="Describe a Tuesday morning after the problem is solved."
                        value={future.dayToDay || ''}
                        onChange={(e) => handleChange('desiredFuture', 'dayToDay', e.target.value)}
                        className="md:col-span-2"
                    />
                    <QuantumInput
                        label="Deeper Motivation (Why now?)"
                        fieldId="pains.desiredFuture.motivation"
                        placeholder="Why is it urgent to solve this now? (12-month goals)"
                        value={future.motivation || ''}
                        onChange={(e) => handleChange('desiredFuture', 'motivation', e.target.value)}
                    />
                    <QuantumInput
                        label="Legacy & Impact"
                        fieldId="pains.desiredFuture.legacy"
                        placeholder="How does this change their life story?"
                        value={future.legacy || ''}
                        onChange={(e) => handleChange('desiredFuture', 'legacy', e.target.value)}
                    />
                </div>
            </section>
        </div>
    );
};
