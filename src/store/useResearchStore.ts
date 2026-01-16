import { create } from 'zustand';
import { ResearchSession, ResearchPhase, ValidationResult } from '@/types/research';

interface ResearchState {
    currentSession: ResearchSession | null;
    isLoading: boolean;
    setSession: (session: ResearchSession) => void;
    updateFormData: (phase: ResearchPhase, path: string, value: any) => void;
    setValidationResult: (path: string, result: ValidationResult) => void;
    setLoading: (loading: boolean) => void;
    getPhaseProgress: (phase: ResearchPhase) => number;
    isPhaseLocked: (phase: ResearchPhase) => boolean;
}

export const useResearchStore = create<ResearchState>((set, get) => ({
    currentSession: null,
    isLoading: false,

    setSession: (session) => set({ currentSession: session }),

    updateFormData: (phase, path, value) => {
        set((state) => {
            if (!state.currentSession) return state;

            const newData = { ...state.currentSession.data } as any;
            if (!newData[phase]) newData[phase] = {};

            const keys = path.split('.');
            let current = newData[phase];

            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (!current[key]) current[key] = {};
                current = current[key];
            }

            current[keys[keys.length - 1]] = value;

            return {
                currentSession: {
                    ...state.currentSession,
                    data: newData
                }
            };
        });
    },

    setValidationResult: (path, result) => {
        // Placeholder for future validation feedback
    },

    setLoading: (loading) => set({ isLoading: loading }),

    getPhaseProgress: (phase: ResearchPhase) => {
        const state = get();
        if (!state.currentSession?.data?.[phase]) return 0;

        const data = state.currentSession.data[phase] as any;
        let total = 0;
        let filled = 0;

        const countFields = (obj: any) => {
            if (!obj || typeof obj !== 'object') return;

            Object.values(obj).forEach(val => {
                if (val && typeof val === 'object' && !Array.isArray(val)) {
                    countFields(val);
                } else {
                    total++;
                    if (val && (typeof val !== 'string' || val.trim().length > 0)) {
                        filled++;
                    }
                }
            });
        };

        countFields(data);
        return total === 0 ? 0 : Math.round((filled / total) * 100);
    },

    isPhaseLocked: (phase: ResearchPhase) => {
        if (phase === 'market') return false;

        const phases: ResearchPhase[] = ['market', 'avatar', 'pains'];
        const idx = phases.indexOf(phase);
        const prevPhase = phases[idx - 1];

        // Lock if previous phase is less than 50% complete
        return get().getPhaseProgress(prevPhase) < 50;
    }
}));
