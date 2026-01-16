import { useEffect, useRef } from 'react';
import { useResearchStore } from '@/store/useResearchStore';
import { createClient } from '@/lib/supabase-ssr/client';

export const useResearchSync = (brandId: string) => {
    const { currentSession } = useResearchStore();
    const supabase = createClient();
    const lastSavedData = useRef<string>('');

    useEffect(() => {
        if (!currentSession || !brandId) return;

        const dataStr = JSON.stringify(currentSession.data);
        if (dataStr === lastSavedData.current) return;

        const saveData = async () => {
            const sessionPayload = {
                brand_id: brandId,
                current_phase: currentSession.current_phase,
                progress: currentSession.progress,
                data: currentSession.data,
                status: currentSession.status,
                updated_at: new Date().toISOString()
            };

            try {
                let error;
                if (currentSession.id) {
                    console.log("useResearchSync: Updating session:", currentSession.id);
                    const { error: updateError } = await supabase
                        .from('research_sessions')
                        .update(sessionPayload)
                        .eq('id', currentSession.id);

                    if (updateError) {
                        console.error("SUPABASE UPDATE ERROR (research_sessions):", {
                            message: updateError.message,
                            code: updateError.code,
                            details: updateError.details
                        });
                        error = updateError;
                    }
                } else {
                    console.log("useResearchSync: Creating new session for brand:", brandId);
                    const { data: newSession, error: insertError } = await supabase
                        .from('research_sessions')
                        .insert(sessionPayload)
                        .select('id')
                        .maybeSingle();

                    if (insertError) {
                        console.error("SUPABASE INSERT ERROR (research_sessions):", {
                            message: insertError.message,
                            code: insertError.code,
                            details: insertError.details
                        });
                        error = insertError;
                    }

                    if (newSession) {
                        console.log("useResearchSync: Session created:", newSession.id);
                        useResearchStore.getState().setSession({
                            ...currentSession,
                            id: newSession.id
                        });
                    }
                }

                if (error) throw error;
                lastSavedData.current = dataStr;

            } catch (err: any) {
                console.error("CRITICAL: Research Auto-save failed:", {
                    error: err.message || err,
                    payload: sessionPayload
                });
            }
        };

        const timeoutId = setTimeout(saveData, 2000);
        return () => clearTimeout(timeoutId);
    }, [currentSession, brandId, supabase]);
};
