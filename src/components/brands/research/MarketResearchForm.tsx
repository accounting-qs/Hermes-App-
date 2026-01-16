"use client";

import React from 'react';
import { useResearchStore } from '@/store/useResearchStore';
import { QuantumInput } from './QuantumInput';
import { Building2, Users, Target, CheckCircle } from 'lucide-react';

import { MarketResearchData } from '@/types/research';

export const MarketResearchForm = () => {
    const { currentSession, updateFormData } = useResearchStore();

    // Safe access helpers (since data is Partial in store)
    const marketData = (currentSession?.data?.market || {}) as Partial<MarketResearchData>;
    const company = marketData.companyDetails || {};
    const audience = marketData.targetAudience || {};
    const offer = marketData.unifiedOffer || {};

    const handleChange = (section: string, field: string, value: any) => {
        // Construct the full path key for store updates if needed, 
        // OR just pass the nested object. 
        // The store `updateFormData` implementation I wrote earlier handles 2 levels: phase + section.
        // So `updateFormData('market', 'companyDetails', { ...old, [field]: value })`

        // This is slightly complex with the store logic.
        // Let's assume store `updateFormData('market', 'companyDetails.mission', val)` works
        // or we manually spread.

        // For efficiency, I'll invoke store update directly:
        // Note: The store implementation uses `path.split('.')`.
        // So passing 'companyDetails.mission' works.
        updateFormData('market', `${section}.${field}`, value);
    };

    return (
        <div className="space-y-12">

            {/* Section 1: Company Details */}
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Company Fundamentals</h2>
                        <p className="text-xs text-muted-foreground">The foundational data points for the AI context.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <QuantumInput
                        label="Mission Statement"
                        fieldId="market.companyDetails.mission"
                        placeholder="What is the core purpose of the company?"
                        value={company.mission || ''}
                        onChange={(e) => handleChange('companyDetails', 'mission', e.target.value)}
                        className="md:col-span-2"
                    />
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Promotional Name</label>
                        <input
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="e.g. Acme Corp"
                            value={company.promotionalName || ''} // Need to add to type if not exists, implied loose schema
                            onChange={(e) => handleChange('companyDetails', 'promotionalName', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Website URL</label>
                        <input
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="https://"
                            value={company.website || ''}
                            onChange={(e) => handleChange('companyDetails', 'website', e.target.value)}
                        />
                    </div>
                    <QuantumInput
                        label="Unique Value Proposition"
                        fieldId="market.companyDetails.uniqueValueProposition"
                        placeholder="What makes you strictly better than the competition?"
                        value={company.uniqueValueProposition || ''}
                        onChange={(e) => handleChange('companyDetails', 'uniqueValueProposition', e.target.value)}
                        className="md:col-span-2"
                    />
                </div>
            </section>

            {/* Section 2: Target Audience (Apollo Style) */}
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-foreground">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Target Audience (ICP)</h2>
                        <p className="text-xs text-muted-foreground">Define who we are hunting. Be specific for Apollo.io filters.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <QuantumInput
                        label="Ideal Customer Profile (Rich Description)"
                        fieldId="market.targetAudience.description"
                        placeholder="Describe the perfect client in detail..."
                        value={audience.description || ''} // Add to type if needed
                        onChange={(e) => handleChange('targetAudience', 'description', e.target.value)}
                        className="md:col-span-2"
                        helperText="Mention headers, decision makers, and specific business pains."
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-bold">Revenue Range (Filter)</label>
                        <select
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            value={audience.revenueRange || ''}
                            onChange={(e) => handleChange('targetAudience', 'revenueRange', e.target.value)}
                        >
                            <option value="">Select Range</option>
                            <option value="0-1M">$0 - $1M</option>
                            <option value="1M-10M">$1M - $10M</option>
                            <option value="10M-50M">$10M - $50M</option>
                            <option value="50M+">$50M+</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold">Company Headcount</label>
                        <select
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            value={audience.companySize?.[0] || ''}
                            onChange={(e) => handleChange('targetAudience', 'companySize', [e.target.value])}
                        >
                            <option value="">Select Size</option>
                            <option value="1-10">1-10 Employees</option>
                            <option value="11-50">11-50 Employees</option>
                            <option value="51-200">51-200 Employees</option>
                            <option value="201-500">201-500 Employees</option>
                            <option value="500+">500+ Employees</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Section 3: Unified Offer */}
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Target className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Unified Offer</h2>
                        <p className="text-xs text-muted-foreground">The mechanism of delivery.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <QuantumInput
                        label="Core Promise (Elevator Pitch)"
                        fieldId="market.unifiedOffer.corePromise"
                        placeholder="We help X achieve Y without Z by doing W..."
                        value={offer.corePromise || ''}
                        onChange={(e) => handleChange('unifiedOffer', 'corePromise', e.target.value)}
                        className="md:col-span-2"
                    />
                    <QuantumInput
                        label="Deliverables"
                        fieldId="market.unifiedOffer.deliverables"
                        placeholder="What do they actually get? (e.g., 6-week course, 1on1 consulting)"
                        value={offer.deliverables || ''}
                        onChange={(e) => handleChange('unifiedOffer', 'deliverables', e.target.value)}
                        className="md:col-span-2"
                    />
                </div>
            </section>
        </div>
    );
};
