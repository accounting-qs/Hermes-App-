import { create } from 'zustand';
import { ResearchSession, ResearchPhase, ValidationResult, CaseStudy } from '@/types/research';

interface ResearchState {
    currentSession: ResearchSession | null;
    isLoading: boolean;
    activeStep: number;

    // Actions
    setSession: (session: ResearchSession) => void;
    updateFormData: (phase: ResearchPhase, path: string, value: any) => void;
    setValidationResult: (path: string, result: ValidationResult) => void;
    setLoading: (loading: boolean) => void;

    // Array Helpers (Specific for repeatable blocks)
    addCaseStudy: () => void;
    removeCaseStudy: (index: number) => void;
    updateCaseStudy: (index: number, field: keyof CaseStudy, value: any) => void;

    // Computed/Helper
    getPhaseProgress: (phase: ResearchPhase) => number;
    isPhaseLocked: (phase: ResearchPhase) => boolean;
}

export const useResearchStore = create<ResearchState>((set, get) => ({
    currentSession: null,
    isLoading: false,
    activeStep: 0,

    setSession: (session) => set({ currentSession: session }),
    setLoading: (loading) => set({ isLoading: loading }),

    updateFormData: (phase, path, value) => {
        set((state) => {
            if (!state.currentSession) return state;

            const newData = { ...state.currentSession.data };
            if (!newData[phase]) (newData as any)[phase] = {};

            const keys = path.split('.');
            let current: any = newData[phase];

            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (!current[key]) current[key] = {};
                current[key] = { ...current[key] }; // Shallow copy for immutability
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

    addCaseStudy: () => {
        set((state) => {
            if (!state.currentSession) return state;
            const market = state.currentSession.data.market || {};
            const caseStudies = [...(market.caseStudies || [])];

            const newCase: CaseStudy = {
                id: Math.random().toString(36).substring(7),
                clientDescriptor: '',
                startingSituation: '',
                constraints: '',
                intervention: '',
                timeline: '',
                measuredResults: '',
                timeToValue: '',
                roi: '',
                clientQuote: '',
                permissionStatus: 'requested'
            };

            return {
                currentSession: {
                    ...state.currentSession,
                    data: {
                        ...state.currentSession.data,
                        market: {
                            ...market,
                            caseStudies: [...caseStudies, newCase]
                        }
                    }
                }
            };
        });
    },

    removeCaseStudy: (index) => {
        set((state) => {
            if (!state.currentSession) return state;
            const market = state.currentSession.data.market || {};
            const caseStudies = (market.caseStudies || []).filter((_, i) => i !== index);

            return {
                currentSession: {
                    ...state.currentSession,
                    data: {
                        ...state.currentSession.data,
                        market: {
                            ...market,
                            caseStudies
                        }
                    }
                }
            };
        });
    },

    updateCaseStudy: (index, field, value) => {
        set((state) => {
            if (!state.currentSession) return state;
            const market = state.currentSession.data.market || {};
            const caseStudies = [...(market.caseStudies || [])];

            if (caseStudies[index]) {
                caseStudies[index] = { ...caseStudies[index], [field]: value };
            }

            return {
                currentSession: {
                    ...state.currentSession,
                    data: {
                        ...state.currentSession.data,
                        market: {
                            ...market,
                            caseStudies
                        }
                    }
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

        if (phase === 'market') return false;
        if (phase === 'avatar') return (session.progress.market || 0) < 100;
        if (phase === 'pains') return (session.progress.avatar || 0) < 100;

        return true;
    }
}));
