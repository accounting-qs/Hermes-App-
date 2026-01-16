"use server";

import { createClient } from "@/lib/supabase-ssr/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BrandOffer } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function expandOffer(variation: any, brandId: string, researchReportId: string) {
    const supabase = await createClient();

    try {
        // Fetch context again for the deep dive
        const { data: report } = await supabase.from('research_reports').select('content').eq('id', researchReportId).single();

        const prompt = `
            You are the "Quantum Architect." You have been given a winning offer concept.
            Your task is to expand this into a full Offer Architecture.

            OFFER CONCEPT:
            ${JSON.stringify(variation)}

            RESEARCH DNA:
            ${report?.content}

            INSTRUCTIONS:
            1. Build a detailed "Unique Mechanism" that solves the audience's primary pain point using the Brand's methodology.
            2. Build a "Bonus Stack" (at least 3 items) that increases perceived value and handles objections.
            3. Create a powerful "Risk Reversal" (Guarantee) tailored to high-ticket clients.
            4. Format as JSON.

            JSON STRUCTURE:
            {
                "full_offer": {
                    "promise": "Refined power statement",
                    "mechanism": "2-3 paragraphs describing the unique way this works",
                    "bonus_stack": [
                        { "title": "Bonus Name", "value": "A description of how it helps" }
                    ],
                    "guarantee": "The specific promise of risk reversal",
                    "value_equation_math": ${JSON.stringify(variation.value_equation)}
                }
            }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(responseText);

        return { success: true, fullOffer: data.full_offer };

    } catch (err: any) {
        console.error("Offer Expansion Error:", err);
        return { success: false, error: err.message };
    }
}
