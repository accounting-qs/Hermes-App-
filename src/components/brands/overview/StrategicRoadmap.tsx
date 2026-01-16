import React from 'react';
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface StrategicRoadmapProps {
    currentPhase: string;
}

const PHASES = [
    { id: 'onboarding', label: 'Onboarding' },
    { id: 'research', label: 'Research' },
    { id: 'messaging', label: 'Messaging' },
    { id: 'webinar', label: 'Webinar' },
    { id: 'launch', label: 'Launch' }
];

export const StrategicRoadmap: React.FC<StrategicRoadmapProps> = ({ currentPhase }) => {
    // Normalize phase for comparison (assuming backend might store snake_case)
    const normalizedPhase = currentPhase?.toLowerCase() || 'onboarding';

    const currentIndex = PHASES.findIndex(p => p.id === normalizedPhase);
    // If not found (e.g. 'scaling'), default to last or first? Let's assume last if it's past launch
    const effectiveIndex = currentIndex === -1 ? 0 : currentIndex;

    return (
        <div className="relative mb-12 w-full">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -translate-y-1/2 z-0 rounded-full" />

            {/* Progress Line */}
            <div
                className="absolute top-1/2 left-0 h-1 premium-gradient -translate-y-1/2 z-0 transition-all duration-1000 rounded-full"
                style={{ width: `${(effectiveIndex / (PHASES.length - 1)) * 100}%` }}
            />

            {/* Nodes */}
            <div className="relative z-10 flex justify-between w-full">
                {PHASES.map((phase, idx) => {
                    const isCompleted = idx < effectiveIndex;
                    const isCurrent = idx === effectiveIndex;
                    const isActive = idx <= effectiveIndex;

                    return (
                        <div key={phase.id} className="flex flex-col items-center gap-3">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ring-offset-2 ring-offset-background",
                                isActive ? "premium-gradient text-white shadow-lg shadow-primary/30" : "bg-card border-2 border-border text-muted-foreground",
                                isCurrent && "ring-2 ring-primary scale-110",
                            )}>
                                {isActive ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                                )}
                            </div>
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-widest transition-colors duration-300",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}>
                                {phase.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
