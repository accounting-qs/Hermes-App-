import { useEffect, useRef } from 'react';
import { useResearchStore } from '@/store/useResearchStore';
import { createClient } from '@/lib/supabase-ssr/client';
// Note: Auto-save debounce is handled via useEffect timeout to avoid external dependencies.
// I'll stick to a useEffect based debounce without lodash for safety.

export const useResearchSync = (brandId: string) => {
    const { currentSession } = useResearchStore();
    const supabase = createClient();
    const lastSavedData = useRef<string>('');

    useEffect(() => {
        if (!currentSession || !brandId) return;

        const dataStr = JSON.stringify(currentSession.data);
        if (dataStr === lastSavedData.current) return;

        const saveData = async () => {
            try {
                // If session exists update, else insert.
                // Assuming session has ID if it was loaded or created.
                // If it's a fresh session that hasn't been saved to DB yet:

                const sessionPayload = {
                    brand_id: brandId,
                    current_phase: currentSession.current_phase,
                    progress: currentSession.progress,
                    data: currentSession.data, // JSONB
                    status: currentSession.status,
                    updated_at: new Date().toISOString()
                };

                let error;
                if (currentSession.id) {
                    const { error: updateError } = await supabase
                        .from('research_sessions')
                        .update(sessionPayload)
                        .eq('id', currentSession.id);
                    error = updateError;
                } else {
                    // Create new
                    const { data: newSession, error: insertError } = await supabase
                        .from('research_sessions')
                        .insert(sessionPayload)
                        .select('id')
                        .single();

                    if (newSession) {
                        // We need to update local store with real ID
                        // This might be tricky if store doesn't expose ID setter directly without robust action
                        // For now assuming the page logic handles initial load/create.
                        // Ideally the store `setSession` handles this.
                        useResearchStore.getState().setSession({
                            ...currentSession,
                            id: newSession.id
                        });
                    }
                    error = insertError;
                }

                if (error) throw error;
                lastSavedData.current = dataStr;
                // Optional: minimal toast or indicator "Saved"

            } catch (err) {
                console.error("Auto-save failed:", err);
            }
        };

        const timeoutId = setTimeout(saveData, 2000); // 2s debounce

        return () => clearTimeout(timeoutId);
    }, [currentSession, brandId, supabase]);
};
