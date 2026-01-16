import React from 'react';
import { Sparkles, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Quantum Pulse Component ---
interface QuantumPulseProps {
    score: number;
}

export const QuantumPulse: React.FC<QuantumPulseProps> = ({ score }) => {
    return (
        <div className="relative flex items-center justify-center w-32 h-32 mx-auto">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />

            {/* SVG Gauge */}
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-secondary"
                />
                <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={351.86}
                    strokeDashoffset={351.86 - (score / 100) * 351.86}
                    className="text-primary transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                />
            </svg>

            {/* Center Text */}
            <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold outfit-font">{score}</span>
                <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">Pulse</span>
            </div>
        </div>
    );
};

// --- AI Flash Summary Component ---
interface AIFlashSummaryProps {
    summary: string;
}

export const AIFlashSummary: React.FC<AIFlashSummaryProps> = ({ summary }) => {
    return (
        <div className="glass-card p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
            <div className="flex items-center gap-2 mb-4">
                <BrainCircuit className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Quantum Flash Summary</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground italic">
                "{summary || "No sufficient data to generate summary yet. Complete the Research phase to activate Quantum Intelligence."}"
            </p>
        </div>
    );
};
