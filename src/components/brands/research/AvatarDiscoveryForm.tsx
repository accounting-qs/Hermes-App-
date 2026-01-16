"use client";

import React from 'react';
import { useResearchStore } from '@/store/useResearchStore';
import { QuantumInput } from './QuantumInput';
import { User, Heart, Skull } from 'lucide-react';
import { AvatarResearchData } from '@/types/research';

export const AvatarDiscoveryForm = () => {
    const { currentSession, updateFormData } = useResearchStore();

    // Casting for strict typing on the deeply nested JSONB structure
    const avatarData = (currentSession?.data?.avatar || {}) as any;
    const demographics = avatarData.demographics || {};
    const narrative = avatarData.innerNarrative || {};
    const marketXP = avatarData.marketExperience || {};
    const curiosity = avatarData.curiosityAndCorruption || {};

    const handleChange = (section: string, field: string, value: any) => {
        updateFormData('avatar', `${section}.${field}`, value);
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 pb-8 border-b border-slate-200 dark:border-zinc-800">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <User className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black outfit-font text-slate-900 dark:text-white">Avatar Discovery</h2>
                    <p className="text-sm text-slate-500">Mapping the psychological profile of your ideal client.</p>
                </div>
            </div>

            {/* Section 1: Demographics */}
            <section className="space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-3">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 bg-blue-500/5 px-3 py-1.5 w-fit rounded-lg">1. Demographic Insights</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Age Range</label>
                        <input
                            className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg"
                            placeholder="e.g. 35-45"
                            value={demographics.ageRange || ''}
                            onChange={(e) => handleChange('demographics', 'ageRange', e.target.value)}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Gender Split</label>
                        <input
                            className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg"
                            placeholder="e.g. 60% Male / 40% Female"
                            value={demographics.genderSplit || ''}
                            onChange={(e) => handleChange('demographics', 'genderSplit', e.target.value)}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Occupation / Role</label>
                        <input
                            className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg"
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
            <section className="space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-3">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-rose-500 bg-rose-500/5 px-3 py-1.5 w-fit rounded-lg">2. Inner Narrative & Beliefs</h3>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <QuantumInput
                        label="Hopes & Dreams"
                        fieldId="avatar.innerNarrative.hopesAndDreams"
                        placeholder="What is their ultimate desired future? Be specific."
                        value={narrative.hopesAndDreams || ''}
                        onChange={(e) => handleChange('innerNarrative', 'hopesAndDreams', e.target.value)}
                        helperText="Avoid 'Financial Freedom'. Use 'Ability to buy a lake house'."
                    />
                    <QuantumInput
                        label="Secret Fears"
                        fieldId="avatar.innerNarrative.secretFears"
                        placeholder="What keeps them up at 3 AM?"
                        value={narrative.secretFears || ''}
                        onChange={(e) => handleChange('innerNarrative', 'secretFears', e.target.value)}
                    />
                    <QuantumInput
                        label="Victories & Failures"
                        fieldId="avatar.innerNarrative.victoriesAndFailures"
                        placeholder="List their top 3 biggest wins and 3 most painful failures."
                        value={narrative.victoriesAndFailures || ''}
                        onChange={(e) => handleChange('innerNarrative', 'victoriesAndFailures', e.target.value)}
                    />
                </div>
            </section>

            {/* Section 3: Market Experience */}
            <section className="space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-3">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 bg-orange-500/5 px-3 py-1.5 w-fit rounded-lg">3. Market Experience (The Corruption)</h3>
                </div>

                <div className="space-y-8">
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
