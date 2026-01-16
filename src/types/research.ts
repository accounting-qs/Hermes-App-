export type ResearchPhase = 'market' | 'avatar' | 'pains';
export type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

export interface ValidationResult {
    isValid: boolean;
    feedback?: string; // AI suggestions if invalid
    score?: number; // 0-100 quality score
}

// --- Phase 1: Market Research ---
export interface MarketResearchData {
    companyDetails: {
        promotionalName?: string;
        website?: string;
        mission: string;
        vision?: string;
        uniqueValueProposition: string;
    };
    targetAudience: {
        description?: string; // "ICP Description (Long text)"
        industries: string[];
        companySize: string[]; // e.g., "11-50", "51-200"
        roles: string[]; // e.g., "CEO", "CMO"
        revenueRange: string;
        geography: string;
    };
    unifiedOffer: {
        corePromise: string;
        pricingModel?: string;
        deliverables: string;
    };
    competitors: {
        direct: string[]; // List of competitor names/URLs
        indirect: string[];
    };
}

// --- Phase 2: Avatar Discovery ---
export interface AvatarResearchData {
    demographics: {
        ageRange: string;
        genderSplit: string;
        education: string;
        occupation?: string;
        attitudes?: {
            political?: string;
            social?: string;
            economic?: string;
        };
    };
    innerNarrative: {
        hopesAndDreams: string; // "Short term wins & Legacy ambitions"
        dailyRoutine: string;
        victoriesAndFailures: string; // "Top 3 wins, Top 3 failures"
        coreBeliefs: string; // "Beliefs about Life, Love, Family"
        secretFears: string;
    };
    marketExperience: {
        currentSolutions: string;
        likesAndDislikes: string;
        horrorStories: string; // "Previous bad experiences"
    };
    curiosityAndCorruption: {
        uniqueMechanisms: string; // "What have they tried?"
        corruptionEvents: string; // "Why the problem has worsened recently (Outside Forces)"
    };
}

// --- Phase 3: Pains & Desires ---
export interface PainsResearchData {
    painPoints: {
        foundational: string; // Top 5-10 biggest pains, quotes, nightmare scenarios
        breakingPoint: string; // "Straw that broke the camel's back"
        emotional: string; // How they feel about themselves, limiting beliefs
    };
    impactAnalysis: {
        health: string;
        relationships: string; // Family/Relationships
        finances: string;
        career: string; // Career/Business
    };
    avoidanceAndTriggers: {
        tolerations: string; // Things they refuse to tolerate
        triggers: string; // Primary triggers for fear/frustration
        relief: string; // What stress would vanish if solved
    };
    desiredFuture: {
        idealOutcome: string; // Dream scenarios, Big Win
        dayToDay: string; // Life without the problem
        motivation: string; // 12-month goals, deeper drivers
        legacy: string; // Impact
    };
    solutionPreferences: {
        convenience: string;
        delivery: string; // Preferred delivery method
    };
}

// --- Master Session Types ---
export interface ResearchSession {
    id: string;
    brand_id: string;
    current_phase: ResearchPhase;
    progress: {
        market: number;
        avatar: number;
        pains: number;
    };
    data: {
        market: Partial<MarketResearchData>;
        avatar: Partial<AvatarResearchData>;
        pains: Partial<PainsResearchData>;
    };
    validation: Record<string, ValidationResult>;
    status: 'draft' | 'completed';
    created_at: string;
    updated_at: string;
}
