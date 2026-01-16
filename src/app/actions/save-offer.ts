"use server";

import { createClient } from "@/lib/supabase-ssr/server";
import { BrandOffer, OfferType } from "@/types";

interface SaveOfferParams {
    brandId: string;
    offerId?: string; // If provided, we are iterating
    title: string;
    offerType: OfferType;
    pricingData: any;
    contentFull: any;
    aiRationale: string;
    refinementPrompt?: string; // Required if iterate
}

export async function saveOffer({
    brandId,
    offerId,
    title,
    offerType,
    pricingData,
    contentFull,
    aiRationale,
    refinementPrompt
}: SaveOfferParams) {
    const supabase = await createClient();

    try {
        if (offerId) {
            // 1. Update existing offer
            const { data: updatedOffer, error: updateError } = await supabase
                .from('brand_offers')
                .update({
                    title,
                    pricing_data: pricingData,
                    content_full: contentFull,
                    ai_rationale: aiRationale
                })
                .eq('id', offerId)
                .select()
                .single();

            if (updateError) throw updateError;

            // 2. Log iteration
            await supabase
                .from('offer_iterations')
                .insert({
                    offer_id: offerId,
                    content_snapshot: contentFull,
                    refinement_prompt: refinementPrompt || "Initial deep dive expansion"
                });

            return { success: true, offer: updatedOffer };
        } else {
            // 1. Create new offer
            const { data: newOffer, error: insertError } = await supabase
                .from('brand_offers')
                .insert({
                    brand_id: brandId,
                    title,
                    offer_type: offerType,
                    status: 'draft',
                    pricing_data: pricingData,
                    content_full: contentFull,
                    ai_rationale: aiRationale
                })
                .select()
                .single();

            if (insertError) throw insertError;

            // 2. Log first iteration
            await supabase
                .from('offer_iterations')
                .insert({
                    offer_id: newOffer.id,
                    content_snapshot: contentFull,
                    refinement_prompt: "Initial generation"
                });

            return { success: true, offer: newOffer };
        }
    } catch (err: any) {
        console.error("Save Offer Error:", err);
        return { success: false, error: err.message };
    }
}
