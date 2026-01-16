import { create } from 'zustand';
import { ResearchSession, ResearchPhase, ValidationStatus, ValidationResult } from '@/types/research';

interface ResearchState {
    currentSession: ResearchSession | null;
    isLoading: boolean;
    activeStep: number; // 0, 1, 2 derived from phase? Or explicit step index for UI

    // Actions
    setSession: (session: ResearchSession) => void;
    updateFormData: (phase: ResearchPhase, path: string, value: any) => void;
    setValidationResult: (path: string, result: ValidationResult) => void;
    setLoading: (loading: boolean) => void;

    // Computed/Helper
    getPhaseProgress: (phase: ResearchPhase) => number;
    isPhaseLocked: (phase: ResearchPhase) => boolean;
}

const INITIAL_SESSION: ResearchSession = {
    id: '',
    brand_id: '',
    current_phase: 'market',
    progress: { market: 0, avatar: 0, pains: 0 },
    data: { market: {}, avatar: {}, pains: {} },
    validation: {},
    status: 'draft',
    created_at: '',
    updated_at: ''
};

export const useResearchStore = create<ResearchState>((set, get) => ({
    currentSession: null,
    isLoading: false,
    activeStep: 0,

    setSession: (session) => set({ currentSession: session }),

    setLoading: (loading) => set({ isLoading: loading }),

    updateFormData: (phase, path, value) => {
        set((state) => {
            if (!state.currentSession) return state;

            // Deep merge logic simplified for this example
            // In reality, we might use Immer or a careful spread
            // path could be "companyDetails.mission"

            const newData = { ...state.currentSession.data };
            // @ts-ignore - dynamic key access for simplicity in prototype
            if (!newData[phase]) newData[phase] = {};

            // Very simple 1-level nested update support for demo (e.g., 'companyDetails')
            // Real implementation would parse path "companyDetails.mission"
            const keys = path.split('.');
            if (keys.length === 1) {
                // @ts-ignore
                newData[phase][keys[0]] = value;
            } else if (keys.length === 2) {
                // @ts-ignore
                newData[phase][keys[0]] = { ...newData[phase][keys[0]], [keys[1]]: value };
            }

            return {
                currentSession: {
                    ...state.currentSession,
                    data: newData
                }
            };
        });
    },

    setValidationResult: (path, result) => {
        set((state) => {
            if (!state.currentSession) return state;
            return {
                currentSession: {
                    ...state.currentSession,
                    validation: {
                        ...state.currentSession.validation,
                        [path]: result
                    }
                }
            };
        });
    },

    getPhaseProgress: (phase) => {
        const session = get().currentSession;
        if (!session) return 0;
        return session.progress[phase] || 0;
    },

    isPhaseLocked: (phase) => {
        const session = get().currentSession;
        if (!session) return true;

        if (phase === 'market') return false; // Always open
        if (phase === 'avatar') return session.progress.market < 100;
        if (phase === 'pains') return session.progress.avatar < 100;

        return true;
    }
}));
