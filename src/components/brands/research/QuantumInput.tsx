"use client";

import React, { useState } from 'react';
import { validateInputWithAI, generateResearchContent } from '@/app/actions/quantum-guard';
import { Sparkles, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useResearchStore } from '@/store/useResearchStore';

interface QuantumInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    fieldId: string; // strict path for store, e.g., 'market.companyDetails.mission'
    placeholder?: string;
    helperText?: string;
    rows?: number;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const QuantumInput: React.FC<QuantumInputProps> = ({
    label,
    fieldId,
    className,
    helperText,
    onBlur,
    onChange,
    rows = 4,
    ...props
}) => {
    const [status, setStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
    const [feedback, setFeedback] = useState<string | null>(null);
    const setValidationResult = useResearchStore((state) => state.setValidationResult);

    const handleGenerate = async () => {
        setStatus('validating');
        const sessionData = useResearchStore.getState().currentSession?.data || {};
        const generated = await generateResearchContent(label, sessionData);

        if (generated) {
            // Manually trigger onChange to update store
            const event = {
                target: { value: generated }
            } as React.ChangeEvent<HTMLTextAreaElement>;
            onChange(event);

            // After generation, it's usually valid
            setStatus('valid');
        } else {
            setStatus('idle');
        }
    };

    const handleBlur = async (e: React.FocusEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (!value) return;

        setStatus('validating');
        setFeedback(null);

        // Call Server Action
        const result = await validateInputWithAI(label, value);

        if (result.isValid) {
            setStatus('valid');
            setValidationResult(fieldId, { isValid: true, score: 95 });
        } else {
            setStatus('invalid');
            setFeedback(result.feedback || "Please be more specific.");
            setValidationResult(fieldId, { isValid: false, feedback: result.feedback });
        }

        if (onBlur) onBlur(e);
    };

    return (
        <div className="space-y-3 relative group">
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                    {label}
                </label>
                {status === 'validating' && (
                    <div className="flex items-center gap-1.5 text-primary text-[10px] uppercase font-bold animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Quantum Guard Checking...
                    </div>
                )}
                {status === 'valid' && (
                    <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] uppercase font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        Validated
                    </div>
                )}
            </div>

            <div className="relative">
                <textarea
                    {...props}
                    rows={rows}
                    onBlur={handleBlur}
                    onChange={onChange}
                    className={cn(
                        "w-full bg-white dark:bg-zinc-900 border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 pr-16 text-lg focus:border-primary focus:ring-primary transition-all duration-200 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none",
                        status === 'invalid' && "border-amber-500/50 focus:ring-amber-500/20",
                        className
                    )}
                />

                <button
                    onClick={handleGenerate}
                    className="absolute top-4 right-4 p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors group/btn flex items-center gap-1 z-10 disabled:opacity-50"
                    type="button"
                    title="Generate with AI"
                    disabled={status === 'validating'}
                >
                    <Sparkles className={cn(
                        "w-4 h-4 transition-all duration-300",
                        status === 'validating' ? "animate-spin" : ""
                    )} />
                    <span className="text-[10px] font-bold uppercase pr-1 hidden group-hover/btn:inline">Generate with AI</span>
                </button>
            </div>

            {/* Error / Feedback Message */}
            {status === 'invalid' && feedback && (
                <div className="flex gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-0.5">Quantum Guard Suggestions</p>
                        <p className="text-xs text-muted-foreground leading-relaxed italic">{feedback}</p>
                    </div>
                </div>
            )}

            {helperText && status !== 'invalid' && (
                <p className="text-[10px] text-muted-foreground">{helperText}</p>
            )}
        </div>
    );
};
