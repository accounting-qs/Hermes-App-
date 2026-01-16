import React from 'react';
import { cn } from "@/lib/utils";
import { CheckCircle2, Lock } from "lucide-react";
import { ResearchPhase } from '@/types/research';

interface ResearchStepperProps {
    currentPhase: ResearchPhase;
    phases: { id: ResearchPhase; label: string; progress: number; locked: boolean }[];
    onPhaseChange: (phase: ResearchPhase) => void;
}

export const ResearchStepper: React.FC<ResearchStepperProps> = ({ currentPhase, phases, onPhaseChange }) => {
    return (
        <div className="w-full relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 w-full h-1 bg-secondary -z-0 rounded-full" />

            <div className="flex justify-between relative z-10 w-full px-4">
                {phases.map((phase, idx) => {
                    const isActive = phase.id === currentPhase;
                    const isCompleted = phase.progress === 100;

                    return (
                        <button
                            key={phase.id}
                            disabled={phase.locked}
                            onClick={() => onPhaseChange(phase.id)}
                            className={cn(
                                "flex flex-col items-center gap-3 transition-all outline-none",
                                phase.locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-80"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ring-offset-2 ring-offset-background",
                                isActive
                                    ? "premium-gradient text-white shadow-lg shadow-primary/30 scale-110"
                                    : isCompleted
                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/50"
                                        : "bg-card border-2 border-border text-muted-foreground",
                                !isActive && !isCompleted && !phase.locked && "hover:border-primary/50"
                            )}>
                                {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : phase.locked ? (
                                    <Lock className="w-4 h-4" />
                                ) : (
                                    <span className="font-bold text-sm">{idx + 1}</span>
                                )}
                            </div>

                            <div className="text-center">
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest block",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}>
                                    {phase.label}
                                </span>
                                {phase.progress > 0 && phase.progress < 100 && (
                                    <span className="text-[9px] text-muted-foreground font-mono">
                                        {phase.progress}%
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
