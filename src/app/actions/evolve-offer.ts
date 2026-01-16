"use server";

import { createClient } from "@/lib/supabase-ssr/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BrandOffer } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function evolveOffer(offer: BrandOffer, refinementPrompt: string, history: any[]) {
    const supabase = await createClient();

    try {
        const historyText = history.map(h => `PROMPT: ${h.refinement_prompt}\nSNAPSHOT: ${JSON.stringify(h.content_snapshot)}`).join("\n\n---\n\n");

        const prompt = `
            You are the "Quantum Strategist." You are refining a high-ticket offer.
            You must "evolve" the offer based on the user's latest feedback and the previous iteration history.

            ITERATION HISTORY:
            ${historyText}

            CURRENT OFFER STATE:
            ${JSON.stringify(offer.content_full)}

            USER FEEDBACK:
            "${refinementPrompt}"

            INSTRUCTIONS:
            1. Adjust the Promise, Mechanism, Bonus Stack, or Guarantee based on the feedback.
            2. Recalculate the Value Equation score if any factors have changed significantly.
            3. Return the NEW FULL OFFER structure in JSON.

            JSON STRUCTURE:
            {
                "full_offer": {
                    "promise": "string",
                    "mechanism": "string",
                    "bonus_stack": [{ "title": "string", "value": "string" }],
                    "guarantee": "string",
                    "value_equation_math": {
                        "score": number,
                        "factors": { "outcome": number, "likelihood": number, "delay": number, "effort": number }
                    }
                }
            }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(responseText);

        return { success: true, evolvedOffer: data.full_offer };

    } catch (err: any) {
        console.error("Offer Evolution Error:", err);
        return { success: false, error: err.message };
    }
}
