"use client";

import React, { useState } from 'react';
import { validateInputWithAI } from '@/app/actions/quantum-guard';
import { Sparkles, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useResearchStore } from '@/store/useResearchStore';

interface QuantumInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    fieldId: string; // strict path for store, e.g., 'market.companyDetails.mission'
    placeholder?: string;
    helperText?: string;
}

export const QuantumInput: React.FC<QuantumInputProps> = ({
    label,
    fieldId,
    className,
    onBlur,
    ...props
}) => {
    const [status, setStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
    const [feedback, setFeedback] = useState<string | null>(null);
    const setValidationResult = useResearchStore((state) => state.setValidationResult);

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
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-foreground">{label}</label>
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

            <div className="relative group">
                <textarea
                    {...props}
                    onBlur={handleBlur}
                    className={cn(
                        "w-full min-h-[100px] bg-background border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 transition-all resize-y",
                        status === 'invalid'
                            ? "border-amber-500/50 focus:ring-amber-500/20"
                            : "border-border focus:ring-primary/20 focus:border-primary",
                        className
                    )}
                />

                {/* Visual Flair */}
                <Sparkles className={cn(
                    "absolute top-3 right-3 w-4 h-4 transition-colors duration-300",
                    status === 'valid' ? "text-emerald-500" : "text-muted-foreground/20"
                )} />
            </div>

            {/* Error / Feedback Message */}
            {status === 'invalid' && feedback && (
                <div className="flex gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-bold text-amber-600 mb-0.5">Quantum Guard Suggestions</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{feedback}</p>
                    </div>
                </div>
            )}

            {props.helperText && status !== 'invalid' && (
                <p className="text-[10px] text-muted-foreground">{props.helperText}</p>
            )}
        </div>
    );
};
