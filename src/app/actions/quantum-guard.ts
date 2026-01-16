"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface QuantumGuardResult {
    isValid: boolean;
    feedback?: string;
}

export async function validateInputWithAI(field: string, input: string): Promise<QuantumGuardResult> {
    // Fail safe if key missing or input empty
    if (!input || input.length < 5) return { isValid: false, feedback: "Input is too short." };
    if (!process.env.GEMINI_API_KEY) {
        // Mock fallback if env not set
        return input.split(' ').length > 3
            ? { isValid: true }
            : { isValid: false, feedback: "Simulated Guard: Input too short (Env Key Missing)." };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `
            You are "Quantum Guard", a strict data validator for a high-end marketing strategy app.
            Analyze the following user input for the field "${field}".
            
            Input: "${input}"

            Rules:
            1. The input must be specific, actionable, and suitable for building a marketing strategy.
            2. Vague answers like "everyone", "all businesses", "increase sales" are INVALID.
            3. Answers shorter than 10 words for descriptions are likely INVALID unless vary precise.
            4. FOR NARRATIVE/EMOTIONAL FIELDS (Hopes, Dreams, Fears):
               - Generic clichés like "financial freedom", "more time", "be happy" are INVALID.
               - Require specific context (e.g., "financial freedom *to travel Europe*", "time *with kids*").
            
            Output strictly JSON:
            {
                "isValid": boolean,
                "feedback": "Concise, constructive critique if invalid. Max 1 sentence. Direct tone."
            }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean markdown code blocks if present
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonStr) as QuantumGuardResult;

    } catch (error) {
        console.error("Quantum Guard Error:", error);
        // Fail open to not block user on API error, but warn
        return { isValid: true, feedback: "AI Validation unavailable, proceeding with caution." };
    }
}
export async function generateResearchContent(field: string, context: any): Promise<string> {
    if (!process.env.GEMINI_API_KEY) return "AI Generation requires API Key.";

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const prompt = `
            You are "Hermes AI", a master marketing strategist.
            Generate a high-quality, professional, and specific response for the research field: "${field}".
            
            Context about the business: ${JSON.stringify(context)}
            
            Rules:
            1. Be extremely specific.
            2. Use industry-standard terminology.
            3. Make it punchy and high-end.
            4. Output ONLY the response text, no meta-talk.
        `;

        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        console.error("Generation Error:", error);
        return "Failed to generate content.";
    }
}
