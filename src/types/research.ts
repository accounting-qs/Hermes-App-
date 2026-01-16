export type ResearchPhase = 'market' | 'avatar' | 'pains';

export interface ValidationResult {
    isValid: boolean;
    feedback: string;
    score?: number;
}

export interface MarketResearchData {
    companyDetails: {
        promotionalName?: string;
        website?: string;
        mission: string;
        vision?: string;
        uniqueValueProposition: string;
    };
    targetAudience: {
        description?: string;
        industries: string[];
        companySize: string[];
        roles: string[];
        revenueRange: string;
        geography: string;
    };
    unifiedOffer: {
        corePromise: string;
        pricingModel?: string;
        deliverables: string;
    };
    competitors: {
        direct: string[];
        indirect: string[];
    };
}

export interface AvatarResearchData {
    demographics: {
        ageRange?: string;
        genderSplit?: string;
        occupation?: string;
        attitudes?: {
            social?: string;
        };
    };
    innerNarrative: {
        hopesAndDreams?: string;
        secretFears?: string;
        victoriesAndFailures?: string;
    };
    marketExperience: {
        currentSolutions?: string;
        horrorStories?: string;
    };
    curiosityAndCorruption: {
        corruptionEvents?: string;
    };
}

export interface PainsResearchData {
    painPoints: {
        foundational?: string;
        breakingPoint?: string;
        emotional?: string;
    };
    impactAnalysis: {
        health?: string;
        relationships?: string;
        finances?: string;
        career?: string;
    };
    avoidanceAndTriggers: {
        tolerations?: string;
        triggers?: string;
    };
    desiredFuture: {
        idealOutcome?: string;
        dayToDay?: string;
        motivation?: string;
        legacy?: string;
    };
    solutionPreferences?: any;
}

export interface ResearchSession {
    id: string;
    brandId: string;
    data: {
        market?: MarketResearchData;
        avatar?: AvatarResearchData;
        pains?: PainsResearchData;
    };
    report?: string;
    status: 'draft' | 'completed';
    current_phase?: ResearchPhase;
    progress?: number;
}
