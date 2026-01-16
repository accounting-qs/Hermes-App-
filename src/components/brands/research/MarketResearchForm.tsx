"use client";

import React, { useState } from 'react';
import { useResearchStore } from '@/store/useResearchStore';
import { QuantumInput } from '@/components/brands/research/QuantumInput';
import { ResearchLayout } from '@/components/brands/research/ResearchLayout';
import {
    Building2,
    Users,
    Target,
    Briefcase,
    Plus,
    Trash2,
    CheckCircle2,
    Globe,
    ExternalLink,
    Search,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { ResearchPhase } from '@/types/research';

interface MarketResearchFormProps {
    section: number;
}

export const MarketResearchForm: React.FC<MarketResearchFormProps> = ({
    section
}) => {
    const { currentSession, updateFormData, addCaseStudy, removeCaseStudy, updateCaseStudy } = useResearchStore();

    if (!currentSession) return null;

    const data = currentSession.data.market || {};

    const handleUpdate = (path: string, value: any) => {
        updateFormData('market', path, value);
    };

    return (
        <div className="w-full">
            {/* Section 1: Company Details */}
            {section === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-4 pb-6 border-b border-border/50">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold outfit-font text-slate-900 dark:text-white">Section 1: Company DNA</h2>
                            <p className="text-sm text-slate-500">Identity and foundational metrics.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <QuantumInput
                            label="Promotional Name"
                            placeholder="e.g., Quantum Scale"
                            value={data.companyDetails?.promotionalName || ''}
                            onChange={(e) => handleUpdate('companyDetails.promotionalName', e.target.value)}
                            fieldId="market.companyDetails.promotionalName"
                        />
                        <QuantumInput
                            label="Core Product Title"
                            placeholder="e.g., The Hermes AI System"
                            value={data.companyDetails?.productName || ''}
                            onChange={(e) => handleUpdate('companyDetails.productName', e.target.value)}
                            fieldId="market.companyDetails.productName"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-600">Years in Business</label>
                            <input
                                type="text"
                                className="w-full bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl px-5 py-4 focus:ring-primary transition-all text-lg"
                                value={data.companyDetails?.yearsInBusiness || ''}
                                onChange={(e) => handleUpdate('companyDetails.yearsInBusiness', e.target.value)}
                                placeholder="e.g., 5 Years"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-600">Total Clients Helped</label>
                            <input
                                type="text"
                                className="w-full bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl px-5 py-4 focus:ring-primary transition-all text-lg"
                                value={data.companyDetails?.clientsServed || ''}
                                onChange={(e) => handleUpdate('companyDetails.clientsServed', e.target.value)}
                                placeholder="e.g., 120+"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-600">Primary URLs & Landing Pages</label>
                        <div className="space-y-3">
                            {(data.companyDetails?.websites || ['']).map((url, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <div className="relative flex-1">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            className="w-full bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl px-12 py-4 focus:ring-primary transition-all text-sm"
                                            value={url}
                                            onChange={(e) => {
                                                const newUrls = [...(data.companyDetails?.websites || [])];
                                                newUrls[idx] = e.target.value;
                                                handleUpdate('companyDetails.websites', newUrls);
                                            }}
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                    {idx > 0 && (
                                        <button
                                            onClick={() => {
                                                const newUrls = (data.companyDetails?.websites || []).filter((_, i) => i !== idx);
                                                handleUpdate('companyDetails.websites', newUrls);
                                            }}
                                            className="p-4 text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newUrls = [...(data.companyDetails?.websites || []), ''];
                                    handleUpdate('companyDetails.websites', newUrls);
                                }}
                                className="flex items-center gap-2 text-xs font-bold text-primary hover:opacity-70 transition-all ml-2"
                            >
                                <Plus className="w-4 h-4" /> Add Another URL
                            </button>
                        </div>
                    </div>

                    <QuantumInput
                        label="Elevator Pitch / Mission Statement"
                        placeholder="We help marketing agencies automate their lead generation with proprietary AI workflows..."
                        value={data.companyDetails?.mission || ''}
                        onChange={(e) => handleUpdate('companyDetails.mission', e.target.value)}
                        fieldId="market.companyDetails.mission"
                        rows={3}
                    />
                </div>
            )}

            {/* Section 2: Target Audience & Apollo Filters */}
            {section === 2 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-4 pb-6 border-b border-border/50">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold outfit-font text-slate-900 dark:text-white">Section 2: Ideal Customer Profile</h2>
                            <p className="text-sm text-slate-500">Deep targeting parameters & Apollo.io signals.</p>
                        </div>
                    </div>

                    <QuantumInput
                        label="Audience Description"
                        placeholder="e.g., Series A Funded SaaS Companies in the Fintech space looking for..."
                        value={data.targetAudience?.description || ''}
                        onChange={(e) => handleUpdate('targetAudience.description', e.target.value)}
                        fieldId="market.targetAudience.description"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-600">Job Titles (Apollo Compatible)</label>
                            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 min-h-[120px] content-start">
                                {(data.targetAudience?.jobTitles || []).map((title, idx) => (
                                    <div key={idx} className="bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 flex items-center gap-2 text-xs font-bold">
                                        {title}
                                        <button onClick={() => {
                                            const newTitles = (data.targetAudience?.jobTitles || []).filter((_, i) => i !== idx);
                                            handleUpdate('targetAudience.jobTitles', newTitles);
                                        }}><Trash2 className="w-3 h-3 text-slate-400 hover:text-destructive" /></button>
                                    </div>
                                ))}
                                <input
                                    className="bg-transparent border-none focus:ring-0 text-xs font-bold p-1 placeholder:text-slate-400"
                                    placeholder="Add title..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const val = e.currentTarget.value.trim();
                                            if (val) {
                                                handleUpdate('targetAudience.jobTitles', [...(data.targetAudience?.jobTitles || []), val]);
                                                e.currentTarget.value = '';
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-600">Industry Keywords</label>
                            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 min-h-[120px] content-start">
                                {(data.targetAudience?.industryNames || []).map((ind, idx) => (
                                    <div key={idx} className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg border border-primary/10 flex items-center gap-2 text-xs font-bold">
                                        {ind}
                                        <button onClick={() => {
                                            const newInds = (data.targetAudience?.industryNames || []).filter((_, i) => i !== idx);
                                            handleUpdate('targetAudience.industryNames', newInds);
                                        }}><Trash2 className="w-3 h-3 opacity-50 hover:opacity-100" /></button>
                                    </div>
                                ))}
                                <input
                                    className="bg-transparent border-none focus:ring-0 text-xs font-bold p-1"
                                    placeholder="Add keyword..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const val = e.currentTarget.value.trim();
                                            if (val) {
                                                handleUpdate('targetAudience.industryNames', [...(data.targetAudience?.industryNames || []), val]);
                                                e.currentTarget.value = '';
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-600">Company Headcount (Multi-Select)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {["1-10", "11-20", "21-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10k+", "Self-Employed"].map(tier => (
                                <button
                                    key={tier}
                                    onClick={() => {
                                        const current = data.targetAudience?.companyHeadcount || [];
                                        const next = current.includes(tier) ? current.filter(t => t !== tier) : [...current, tier];
                                        handleUpdate('targetAudience.companyHeadcount', next);
                                    }}
                                    className={cn(
                                        "px-4 py-8 rounded-2xl border-2 text-[10px] font-black uppercase tracking-tighter transition-all flex flex-col items-center justify-center gap-2",
                                        data.targetAudience?.companyHeadcount?.includes(tier)
                                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                                            : "bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 text-slate-400 hover:border-primary/30"
                                    )}
                                >
                                    <span className="text-xl leading-none">{tier}</span>
                                    <span>Employees</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Section 3: Unified Offer Subsections A-F */}
            {section === 3 && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-4 pb-6 border-b border-border/50">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold outfit-font text-slate-900 dark:text-white">Section 3: Strategic Unified Offer</h2>
                            <p className="text-sm text-slate-500">The engineering of your conversion mechanism.</p>
                        </div>
                    </div>

                    {/* A & B */}
                    <div className="grid grid-cols-1 gap-12">
                        <section className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-3 py-1.5 w-fit rounded-lg">A) Snapshot & Positioning</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <QuantumInput
                                    label="Snapshot (Elevator Pitch)"
                                    value={data.unifiedOffer?.snapshot?.elevatorPitch || ''}
                                    onChange={(e) => handleUpdate('unifiedOffer.snapshot.elevatorPitch', e.target.value)}
                                    fieldId="market.unifiedOffer.snapshot.elevatorPitch"
                                />
                                <QuantumInput
                                    label="Core Features (Comma Separated)"
                                    value={data.unifiedOffer?.snapshot?.coreFeatures || ''}
                                    onChange={(e) => handleUpdate('unifiedOffer.snapshot.coreFeatures', e.target.value)}
                                    fieldId="market.unifiedOffer.snapshot.coreFeatures"
                                />
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 bg-orange-500/5 px-3 py-1.5 w-fit rounded-lg">B) Problem & Alternatives</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <QuantumInput
                                    label="Top 3 Pains Addressed"
                                    value={data.unifiedOffer?.problem?.topPains || ''}
                                    onChange={(e) => handleUpdate('unifiedOffer.problem.topPains', e.target.value)}
                                    fieldId="market.unifiedOffer.problem.topPains"
                                />
                                <QuantumInput
                                    label="Competitive Alternatives"
                                    value={data.unifiedOffer?.problem?.alternatives || ''}
                                    onChange={(e) => handleUpdate('unifiedOffer.problem.alternatives', e.target.value)}
                                    fieldId="market.unifiedOffer.problem.alternatives"
                                />
                            </div>
                        </section>

                        {/* C, D, E, F ... similar pattern */}
                        <section className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 bg-blue-500/5 px-3 py-1.5 w-fit rounded-lg">C) Solution Mapping</h3>
                            <QuantumInput
                                label="How your solution maps to their specific pains"
                                value={data.unifiedOffer?.solution?.mapping || ''}
                                onChange={(e) => handleUpdate('unifiedOffer.solution.mapping', e.target.value)}
                                fieldId="market.unifiedOffer.solution.mapping"
                            />
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <section className="space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 bg-indigo-500/5 px-3 py-1.5 w-fit rounded-lg">D) Benefits & Outcomes</h3>
                                <QuantumInput
                                    label="Tangible ROI / Results"
                                    value={data.unifiedOffer?.outcomes?.tangible || ''}
                                    onChange={(e) => handleUpdate('unifiedOffer.outcomes.tangible', e.target.value)}
                                    fieldId="market.unifiedOffer.outcomes.tangible"
                                />
                            </section>
                            <section className="space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-rose-500 bg-rose-500/5 px-3 py-1.5 w-fit rounded-lg">E) Mechanics & Commercials</h3>
                                <QuantumInput
                                    label="Price Structure & Risk Reversal"
                                    value={data.unifiedOffer?.mechanics?.priceStructure || ''}
                                    onChange={(e) => handleUpdate('unifiedOffer.mechanics.priceStructure', e.target.value)}
                                    fieldId="market.unifiedOffer.mechanics.priceStructure"
                                />
                            </section>
                        </div>
                    </div>
                </div>
            )}

            {/* Section 4: Case Study Builder */}
            {section === 4 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between pb-6 border-b border-border/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-inner">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold outfit-font text-slate-900 dark:text-white">Section 4: Case Study & Proof Builder</h2>
                                <p className="text-sm text-slate-500">Individual wins that build undeniable credibility.</p>
                            </div>
                        </div>
                        <button
                            onClick={addCaseStudy}
                            className="px-6 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                        >
                            <Plus className="w-4 h-4" /> Add Case Study
                        </button>
                    </div>

                    <div className="space-y-12">
                        {(data.caseStudies || []).map((cs, idx) => (
                            <div key={cs.id} className="relative p-8 bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-sm group">
                                <button
                                    onClick={() => removeCaseStudy(idx)}
                                    className="absolute -top-3 -right-3 w-10 h-10 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-full flex items-center justify-center text-destructive opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive hover:text-white shadow-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                    <div className="md:col-span-1 space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Client Descriptor</label>
                                            <input
                                                type="text"
                                                className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm font-bold"
                                                value={cs.clientDescriptor}
                                                onChange={(e) => updateCaseStudy(idx, 'clientDescriptor', e.target.value)}
                                                placeholder="e.g., SMB Agency Owner"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Measured Results</label>
                                            <textarea
                                                className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm min-h-[100px] resize-none"
                                                value={cs.measuredResults}
                                                onChange={(e) => updateCaseStudy(idx, 'measuredResults', e.target.value)}
                                                placeholder="e.g., $1.2M in Pipeline, 40+ Appointments..."
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-6">
                                        <QuantumInput
                                            label="Starting Situation (The Gap)"
                                            value={cs.startingSituation}
                                            onChange={(e) => updateCaseStudy(idx, 'startingSituation', e.target.value)}
                                            fieldId={`market.caseStudies.${idx}.startingSituation`}
                                            rows={2}
                                        />
                                        <div className="grid grid-cols-2 gap-6">
                                            <QuantumInput
                                                label="ROI / Outcome"
                                                value={cs.roi}
                                                onChange={(e) => updateCaseStudy(idx, 'roi', e.target.value)}
                                                fieldId={`market.caseStudies.${idx}.roi`}
                                                rows={1}
                                            />
                                            <QuantumInput
                                                label="Timeline"
                                                value={cs.timeline}
                                                onChange={(e) => updateCaseStudy(idx, 'timeline', e.target.value)}
                                                fieldId={`market.caseStudies.${idx}.timeline`}
                                                rows={1}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {(data.caseStudies || []).length === 0 && (
                            <div className="text-center py-20 bg-slate-50 dark:bg-zinc-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-zinc-800">
                                <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
                                    <Briefcase className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-300 mb-2">No case studies added yet</h3>
                                <p className="text-sm text-slate-500 max-w-xs mx-auto mb-8">Add your first client success story to begin building Undeniable Proof.</p>
                                <button
                                    onClick={addCaseStudy}
                                    className="px-8 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
                                >
                                    + Add Case Study Block
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
