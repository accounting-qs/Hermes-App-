export type ResearchPhase = 'market' | 'avatar' | 'pains';
export type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

export interface ValidationResult {
    isValid: boolean;
    feedback?: string;
    score?: number;
}

// --- Section 4: Case Study Blocks ---
export interface CaseStudy {
    id: string;
    clientDescriptor: string; // "e.g., E-commerce SaaS founder"
    startingSituation: string;
    constraints: string;
    intervention: string;
    timeline: string;
    measuredResults: string;
    timeToValue: string;
    roi: string;
    clientQuote: string;
    permissionStatus: 'granted' | 'requested' | 'strictly_anonymous';
    artifacts?: string[]; // URLs
}

// --- Phase 1: Market Research (Refactored) ---
export interface MarketResearchData {
    // Section 1: Company Details
    companyDetails: {
        promotionalName: string;
        productName?: string;
        primaryCTA: string;
        yearsInBusiness: string;
        clientsServed: string;
        websites: string[]; // List of URLs
        mission: string;
        vision?: string;
        uniqueValueProposition: string;
    };

    // Section 2: Target Audience & Apollo Filters
    targetAudience: {
        description: string;
        geography: string;
        jobTitles: string[];
        companyHeadcount: string[]; // ["1-10", "11-50", ...]
        industryNames: string[];
        companyKeywords: string[];
        audienceQualifiers: string;
        icpTiersExclusions: string;
        seniorityLevels: string[];
        revenueBrackets: string[];
    };

    // Section 3: Unified Offer & Business Overview
    unifiedOffer: {
        // A) Snapshot & Positioning
        snapshot: {
            elevatorPitch: string;
            productType: string; // Single select
            coreFeatures: string;
        };
        // B) Problem & Alternatives
        problem: {
            topPains: string;
            urgencyStakes: string;
            alternatives: string;
        };
        // C) Solution Mapping & Delivery
        solution: {
            mapping: string; // Solution per pain point
            implementationPlan: string;
            corePromise: string;
            uspClaims: string;
        };
        // D) Benefits & Outcomes
        outcomes: {
            tangible: string;
            intangible: string;
            top3Outcomes: string;
        };
        // E) Offer Mechanics & Commercials
        mechanics: {
            priceStructure: string;
            incentives: string;
            riskReversal: string;
            scarcityUrgency: string;
        };
        // F) Credibility & Proof
        credibility: {
            awards: string;
            media: string;
        };
    };

    // Section 4: Case Study & Proof Builder
    caseStudies: CaseStudy[];
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
        hopesAndDreams: string;
        dailyRoutine: string;
        victoriesAndFailures: string;
        coreBeliefs: string;
        secretFears: string;
    };
    marketExperience: {
        currentSolutions: string;
        likesAndDislikes: string;
        horrorStories: string;
    };
    curiosityAndCorruption: {
        uniqueMechanisms: string;
        corruptionEvents: string;
    };
}

// --- Phase 3: Pains & Desires ---
export interface PainsResearchData {
    painPoints: {
        foundational: string;
        breakingPoint: string;
        emotional: string;
    };
    impactAnalysis: {
        health: string;
        relationships: string;
        finances: string;
        career: string;
    };
    avoidanceAndTriggers: {
        tolerations: string;
        triggers: string;
        relief: string;
    };
    desiredFuture: {
        idealOutcome: string;
        dayToDay: string;
        motivation: string;
        legacy: string;
    };
    solutionPreferences: {
        convenience: string;
        delivery: string;
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
