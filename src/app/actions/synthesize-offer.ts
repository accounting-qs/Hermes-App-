"use server";

import { createClient } from "@/lib/supabase-ssr/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { OfferType } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

interface SynthesizeOfferParams {
    brandId: string;
    researchReportId: string;
    offerType: OfferType;
    tone: 'premium' | 'aggressive' | 'results-driven';
    resourceIds?: string[]; // Optional specific resources to force-include
}

export async function synthesizeOffer({
    brandId,
    researchReportId,
    offerType,
    tone,
    resourceIds
}: SynthesizeOfferParams) {
    const supabase = await createClient();

    try {
        // 1. Fetch Research DNA
        const { data: report, error: reportError } = await supabase
            .from('research_reports')
            .select('content')
            .eq('id', researchReportId)
            .single();

        if (reportError || !report) throw new Error("Research Report not found");

        // 2. RAG Retrieval - Vector Search
        // We use the offer type and some keywords from Research to find relevant "Proof" or "Mechanism"
        let ragContext = "";

        // Generate query embedding for similarity search
        const queryText = `${offerType} high ticket offer mechanism proof case study`;
        const embedResult = await embeddingModel.embedContent(queryText);
        const queryEmbedding = embedResult.embedding.values;

        // RPC call to our match_resource_embeddings function
        const { data: matchedChunks, error: rpcError } = await supabase.rpc('match_resource_embeddings', {
            query_embedding: queryEmbedding,
            match_threshold: 0.5,
            match_count: 5,
            p_brand_id: brandId
        });

        if (!rpcError && matchedChunks) {
            ragContext = matchedChunks.map((c: any) => c.content).join("\n\n---\n\n");
        }

        // 3. Construct Prompt with Value Equation
        const prompt = `
            You are the "Quantum Strategist," a world-class high-ticket offer architect.
            Your goal is to synthesize the provided Research DNA and Brand Resources into 3 conversion-optimized offer variations.

            RESOURCES / BRAND BRAIN CONTEXT:
            ${ragContext}

            RESEARCH DNA (User Pains, Desires, Brand Voice):
            ${report.content}

            INSTRUCTIONS:
            1. Generate 3 unique variations for a "${offerType}" with a "${tone}" tone.
            2. For each variation, calculate a "Success Score" based on Alex Hormozi's Value Equation:
               Score = (Dream Outcome * Perceived Likelihood) / (Time Delay * Effort & Sacrifice)
            3. Each factor in the Equation should be scored 1-10.
            4. Provide the response strictly in JSON format.

            JSON STRUCTURE:
            {
                "variations": [
                    {
                        "title": "Short catchy title",
                        "big_promise": "The ultimate transformation statement",
                        "price_point": { "price": 5000, "currency": "USD", "payment_model": "One-time" },
                        "value_equation": {
                            "score": 85,
                            "factors": { "outcome": 9, "likelihood": 8, "delay": 3, "effort": 4 }
                        },
                        "ai_rationale": "Why this offer works based on the specific context"
                    }
                ]
            }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(responseText);

        return { success: true, variations: data.variations };

    } catch (err: any) {
        console.error("Offer Synthesis Error:", err);
        return { success: false, error: err.message };
    }
}
