"use server";

import { createClient } from "@/lib/supabase-ssr/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdf from "pdf-parse";
import mammoth from "mammoth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

const CHUNK_SIZE = 1000; // Estimated tokens
const CHUNK_OVERLAP = 200; // 20%
const CHARS_PER_TOKEN = 4; // Rough heuristic

export async function processResource(resourceId: string) {
    const supabase = await createClient();

    try {
        // 1. Fetch Resource record
        const { data: resource, error: fetchError } = await supabase
            .from('brand_resources')
            .select('*')
            .eq('id', resourceId)
            .single();

        if (fetchError || !resource) throw new Error("Resource not found");

        // 2. Mark as Indexing
        await supabase
            .from('brand_resources')
            .update({
                metadata: { ...resource.metadata, status: 'indexing' }
            })
            .eq('id', resourceId);

        let text = "";

        if (resource.type === 'file') {
            // 3. Download from Storage
            const { data: fileData, error: downloadError } = await supabase.storage
                .from('brand-resources')
                .download(resource.file_url);

            if (downloadError) throw downloadError;

            const buffer = Buffer.from(await fileData.arrayBuffer());

            // 4. Extract Text
            if (resource.metadata.mime_type === 'application/pdf') {
                const pdfData = await pdf(buffer);
                text = pdfData.text;
            } else if (resource.metadata.mime_type?.includes('officedocument.wordprocessingml.document')) {
                const result = await mammoth.extractRawText({ buffer });
                text = result.value;
            } else {
                text = buffer.toString('utf-8');
            }
        } else if (resource.type === 'link') {
            // Placeholder for Link Crawling logic
            // In real app, we fetch content here
            text = resource.content_text || "";
        }

        if (!text || text.trim().length === 0) {
            throw new Error("No text extracted from resource");
        }

        // 5. Chunking Logic (Simplified Semantic)
        const chunks = createChunks(text, CHUNK_SIZE * CHARS_PER_TOKEN, CHUNK_OVERLAP * CHARS_PER_TOKEN);

        // 6. Generate Embeddings & Store
        for (const chunk of chunks) {
            if (chunk.trim().length < 10) continue;

            const result = await embeddingModel.embedContent(chunk);
            const embedding = result.embedding.values;

            await supabase
                .from('resource_embeddings')
                .insert({
                    resource_id: resource.id,
                    brand_id: resource.brand_id,
                    content: chunk,
                    embedding: embedding,
                    metadata: {
                        source: resource.title,
                        type: resource.type
                    }
                });
        }

        // 7. Update Resource status
        const totalTokens = Math.ceil(text.length / CHARS_PER_TOKEN); // Very rough estimation
        await supabase
            .from('brand_resources')
            .update({
                content_text: text, // Store full text for backup?
                metadata: {
                    ...resource.metadata,
                    status: 'ready',
                    token_count: totalTokens
                }
            })
            .eq('id', resourceId);

        return { success: true, chunks: chunks.length };

    } catch (err: any) {
        console.error("Resource processing failed:", err);
        await supabase
            .from('brand_resources')
            .update({
                metadata: { status: 'error' }
            })
            .eq('id', resourceId);
        return { success: false, error: err.message };
    }
}

function createChunks(text: string, size: number, overlap: number): string[] {
    const chunks: string[] = [];
    let start = 0;

    // Basic cleaning
    const cleanText = text.replace(/\s+/g, ' ').trim();

    while (start < cleanText.length) {
        const end = Math.min(start + size, cleanText.length);
        let chunk = cleanText.substring(start, end);

        // Try to find a better end point (last period or newline) if not at the very end
        if (end < cleanText.length) {
            const lastPeriod = chunk.lastIndexOf('.');
            if (lastPeriod > size * 0.8) {
                chunk = chunk.substring(0, lastPeriod + 1);
            }
        }

        chunks.push(chunk.trim());
        start += chunk.length - overlap;

        // Safety to avoid infinite loops
        if (chunk.length <= overlap) {
            start += size;
        }
    }
    return chunks;
}
