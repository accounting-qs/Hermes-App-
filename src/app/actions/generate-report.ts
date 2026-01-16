"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ResearchSession } from "@/types/research";
import { createClient } from "@/lib/supabase-ssr/server";
import { cookies } from "next/headers";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateResearchReport(sessionData: ResearchSession) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY not set");
    }

    const { market, avatar, pains } = sessionData.data;

    // Construct the Context Prompt
    const prompt = `
        You are the Chief Strategy Officer for a high-end consulting firm.
        Your task is to synthesize the following raw research data into a "Brand DNA Report".
        This report will be used as the foundation for all marketing, copy, and offer creation.

        Tone: Authoritative, Insightful, Strategic, Psychological.
        Format: Markdown (Headers, Bullet points, Bold text for emphasis).

        --- RAW DATA START ---
        
        PHASE 1: MARKET FUNDAMENTALS
        Company: ${market.companyDetails?.promotionalName}
        Mission: ${market.companyDetails?.mission}
        Target Audience Description: ${market.targetAudience?.description}
        Offer Core Promise: ${market.unifiedOffer?.corePromise}

        PHASE 2: AVATAR PSYCHOLOGY
        Demographics: ${avatar.demographics?.ageRange}, ${avatar.demographics?.genderSplit}, ${avatar.demographics?.occupation}
        Hopes & Dreams: ${avatar.innerNarrative?.hopesAndDreams}
        Secret Fears: ${avatar.innerNarrative?.secretFears}
        Victories/Failures: ${avatar.innerNarrative?.victoriesAndFailures}
        Market Horror Stories: ${avatar.marketExperience?.horrorStories}
        The "Corruption" (External Enemy): ${avatar.curiosityAndCorruption?.corruptionEvents}

        PHASE 3: PAINS & DESIRES
        Foundational Pains: ${pains.painPoints?.foundational}
        Breaking Point: ${pains.painPoints?.breakingPoint}
        Emotional Impact (Self-Worth): ${pains.painPoints?.emotional}
        Impact on Life (Health/Family/Money): 
        - Health: ${pains.impactAnalysis?.health}
        - Relationship: ${pains.impactAnalysis?.relationships}
        - Finance: ${pains.impactAnalysis?.finances}
        Triggers: ${pains.avoidanceAndTriggers?.triggers}
        Dream Outcome: ${pains.desiredFuture?.idealOutcome}
        Legacy: ${pains.desiredFuture?.legacy}

        --- RAW DATA END ---

        INSTRUCTIONS:
        Write a comprehensive strategic report with the following sections:
        
        # Executive Summary
        A high-level synthesis of who they are, who they help, and the core opportunity.

        # 1. The Market Opportunity
        Analyze the gap in the market based on the "Corruption" and "Horror Stories". Why is the current market failing this avatar?
        
        # 2. Avatar Profiling (The Internal Dialogue)
        Write a psychological profile. 
        - **The Surface**: Who they appear to be.
        - **The Shadow**: What they fear in the dark (use the Secret Fears & Emotional Impact).
        - **The Driver**: What they secretly crave (Legacy & Hopes).

        # 3. Pain-to-Power Map
        Connect their deepest pains to the specific aspects of the Offer.
        - "They feel [Pain X], so our [Deliverable Y] provides [Relief Z]."
        
        # 4. Strategic Angles & Hooks
        Suggest 3 Powerful Marketing Hooks based on this data. 
        - Hook 1 (Fear/Urgency): ...
        - Hook 2 (Desire/Hope): ...
        - Hook 3 (Identify/Us vs Them): ...

        Output purely the Markdown report. No preamble.
    `;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(prompt);
        const reportContent = result.response.text();

        // Save to Supabase
        const supabase = await createClient();

        // 1. Create Research Report
        // Check if report already exists for this session/brand? 
        // For now, simple insert or update logic would be best handled by checking brand_id

        // We'll insert a new row or update if we had a constraint. 
        // Let's assume one report per session for now.

        const { data: reportData, error: reportError } = await supabase
            .from('research_reports')
            .upsert({
                session_id: sessionData.id,
                brand_id: sessionData.brand_id, // Ensure this exists in Session
                title: `Brand DNA Report - ${market.companyDetails?.promotionalName || 'Draft'}`,
                content: reportContent,
                status: 'generated',
                is_current_version: true
            }, { onConflict: 'session_id' }) // Assuming unique on session_id
            .select('*')
            .single();

        if (reportError) throw new Error(`Supabase Save Error: ${reportError.message}`);

        if (reportError) throw new Error(`Supabase Save Error: ${reportError.message}`);

        // 2. Update Session as Completed
        await supabase
            .from('research_sessions')
            .update({ status: 'completed' })
            .eq('id', sessionData.id);

        // 3. Update Brand Milestones (Wrap-Up Requirement)
        // Ensure Phase 2 (Research) is marked 100% complete
        const { error: milestoneError } = await supabase
            .from('brand_milestones')
            .upsert({
                brand_id: sessionData.brand_id,
                milestone_id: 'research', // Matches module ID
                status: 'completed',
                progress: 100,
                updated_at: new Date().toISOString()
            }, { onConflict: 'brand_id, milestone_id' }); // Assuming composite key

        if (milestoneError) console.warn("Milestone Update Warning:", milestoneError);

        // 4. Log Activity
        await supabase
            .from('brand_activity_log')
            .insert({
                brand_id: sessionData.brand_id,
                action_type: 'created',
                category: 'research',
                description: `AI generated the Brand DNA Report for ${market.companyDetails?.promotionalName || 'Brand'}`,
            });

        // 5. Update Top-Level Brand Progress (for quick Dashboard UI access)
        // Fetch current first to merge
        const { data: brand } = await supabase
            .from('brands')
            .select('progress')
            .eq('id', sessionData.brand_id)
            .single();

        const currentProgress = brand?.progress || {};
        await supabase
            .from('brands')
            .update({
                progress: {
                    ...currentProgress,
                    research: 100
                }
            })
            .eq('id', sessionData.brand_id);

        return { success: true, report: reportData };

    } catch (error: any) {
        console.error("Report Generation Error:", error);
        return { success: false, error: error.message };
    }
}
