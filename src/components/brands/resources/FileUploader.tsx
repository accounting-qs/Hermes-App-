"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-ssr/client';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';

interface FileUploaderProps {
    onUploadComplete: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onUploadComplete }) => {
    const { id } = useParams();
    const brandId = Array.isArray(id) ? id[0] : id;
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (!brandId) return;
        setUploading(true);
        setError(null);
        setUploadProgress(0);

        const supabase = createClient();
        let successCount = 0;

        try {
            for (const file of acceptedFiles) {
                // 1. Upload to Storage
                const filePath = `${brandId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
                const { error: storageError } = await supabase.storage
                    .from('brand-resources')
                    .upload(filePath, file);

                if (storageError) throw storageError;

                const { data: newDoc, error: dbError } = await supabase.from('brand_resources').insert({
                    brand_id: brandId,
                    type: 'file',
                    title: file.name,
                    category: 'general', // Default, logic can be improved later to detect type
                    file_url: filePath,
                    metadata: {
                        size: file.size,
                        mime_type: file.type,
                        status: 'indexing' // Trigger for future vectorization
                    }
                }).select('id').single();

                if (dbError) throw dbError;

                // 3. Trigger AI Processing (Vectorization)
                const { processResource } = await import('@/app/actions/process-resource');
                // We fire and forget or wait? For now let's fire and reload UI.
                if (newDoc) processResource(newDoc.id);

                successCount++;
                setUploadProgress((successCount / acceptedFiles.length) * 100);
            }

            onUploadComplete();
        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.message || "Failed to upload file");
        } finally {
            setUploading(false);
        }
    }, [brandId, onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt'],
            'application/vnd.ms-powerpoint': ['.ppt', '.pptx']
        },
        disabled: uploading
    });

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-xl p-8 transition-all duration-300 text-center cursor-pointer relative overflow-hidden group",
                    isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/30",
                    uploading && "pointer-events-none opacity-80"
                )}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center gap-4 relative z-10">
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                        isDragActive ? "bg-primary text-white" : "bg-primary/10 text-primary group-hover:scale-110"
                    )}>
                        <Upload className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-sm font-bold">
                            {isDragActive ? "Drop files here" : "Upload Knowledge Base"}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Drag & drop PDF, DOCX, or TXT files here, or click to browse.
                        </p>
                    </div>
                </div>

                {/* Progress Overlay */}
                {uploading && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
                        <div className="w-1/2 space-y-2 text-center">
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full premium-gradient transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-xs font-bold text-primary animate-pulse">Uploading to Neural Core...</p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500 text-xs font-bold">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}
        </div>
    );
};
