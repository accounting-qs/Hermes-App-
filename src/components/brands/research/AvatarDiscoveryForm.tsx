"use client";

import React from 'react';
import { useResearchStore } from '@/store/useResearchStore';
import { QuantumInput } from './QuantumInput';
import { User, Heart, Skull, Sparkles } from 'lucide-react';
import { AvatarResearchData } from '@/types/research';

export const AvatarDiscoveryForm = () => {
    const { currentSession, updateFormData } = useResearchStore();

    // Casting for strict typing on the deeply nested JSONB structure
    const avatarData = (currentSession?.data?.avatar || {}) as Partial<AvatarResearchData>;
    const demographics = avatarData.demographics || {};
    const narrative = avatarData.innerNarrative || {};
    const marketXP = avatarData.marketExperience || {};
    const curiosity = avatarData.curiosityAndCorruption || {};

    const handleChange = (section: string, field: string, value: any) => {
        updateFormData('avatar', `${section}.${field}`, value);
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700">

            {/* Section 1: Demographics */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Demographic Insights</h2>
                        <p className="text-xs text-muted-foreground">The statistical shell of the avatar.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Age Range</label>
                        <input
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="e.g. 35-45"
                            value={demographics.ageRange || ''}
                            onChange={(e) => handleChange('demographics', 'ageRange', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Gender Split</label>
                        <input
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="e.g. 60% Male / 40% Female"
                            value={demographics.genderSplit || ''}
                            onChange={(e) => handleChange('demographics', 'genderSplit', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Occupation / Role</label>
                        <input
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="e.g. Senior Marketing Manager"
                            value={demographics.occupation || ''}
                            onChange={(e) => handleChange('demographics', 'occupation', e.target.value)}
                        />
                    </div>
                    <QuantumInput
                        label="Worldview & Attitudes"
                        fieldId="avatar.demographics.attitudes.social"
                        placeholder="Briefly describe their political/social leanings if relevant to the offer..."
                        value={demographics.attitudes?.social || ''}
                        onChange={(e) => handleChange('demographics', 'attitudes.social', e.target.value)}
                        helperText="Does this affect their buying decision?"
                    />
                </div>
            </section>

            {/* Section 2: Inner Narrative */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                        <Heart className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Inner Narrative & Beliefs</h2>
                        <p className="text-xs text-muted-foreground">The emotional core. What do they feel but never say?</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <QuantumInput
                        label="Hopes & Dreams"
                        fieldId="avatar.innerNarrative.hopesAndDreams"
                        placeholder="What is their ultimate desired future? Be specific."
                        value={narrative.hopesAndDreams || ''}
                        onChange={(e) => handleChange('innerNarrative', 'hopesAndDreams', e.target.value)}
                        className="md:col-span-2"
                        helperText="Avoid 'Financial Freedom'. Use 'Ability to buy a lake house'."
                    />
                    <QuantumInput
                        label="Secret Fears"
                        fieldId="avatar.innerNarrative.secretFears"
                        placeholder="What keeps them up at 3 AM?"
                        value={narrative.secretFears || ''}
                        onChange={(e) => handleChange('innerNarrative', 'secretFears', e.target.value)}
                        className="md:col-span-2"
                    />
                    <QuantumInput
                        label="Victories & Failures"
                        fieldId="avatar.innerNarrative.victoriesAndFailures"
                        placeholder="List their top 3 biggest wins and 3 most painful failures."
                        value={narrative.victoriesAndFailures || ''}
                        onChange={(e) => handleChange('innerNarrative', 'victoriesAndFailures', e.target.value)}
                        className="md:col-span-2"
                    />
                </div>
            </section>

            {/* Section 3: Market Experience */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Skull className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Market Experience (The Corruption)</h2>
                        <p className="text-xs text-muted-foreground">Why do they hate your competitors?</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <QuantumInput
                        label="Current Solutions / Competitors"
                        fieldId="avatar.marketExperience.currentSolutions"
                        placeholder="What are they currently buying or doing to solve this?"
                        value={marketXP.currentSolutions || ''}
                        onChange={(e) => handleChange('marketExperience', 'currentSolutions', e.target.value)}
                    />
                    <QuantumInput
                        label="Horror Stories"
                        fieldId="avatar.marketExperience.horrorStories"
                        placeholder="Describe a specific scenario where a competitor failed them miserably."
                        value={marketXP.horrorStories || ''}
                        onChange={(e) => handleChange('marketExperience', 'horrorStories', e.target.value)}
                        helperText="Specific stories sell better than general complaints."
                    />
                    <QuantumInput
                        label="The Corruption (Outside Forces)"
                        fieldId="avatar.curiosityAndCorruption.corruptionEvents"
                        placeholder="What external force is making this problem worse RIGHT NOW?"
                        value={curiosity.corruptionEvents || ''}
                        onChange={(e) => handleChange('curiosityAndCorruption', 'corruptionEvents', e.target.value)}
                        helperText="e.g. AI taking jobs, Inflation, Algorithm changes."
                    />
                </div>
            </section>
        </div>
    );
};
