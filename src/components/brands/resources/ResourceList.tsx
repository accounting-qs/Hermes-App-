"use client";

import React from 'react';
import { FileText, Link as LinkIcon, Image as ImageIcon, File, Trash2, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import { ResourceStatus, BrandResource } from '@/types';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase-ssr/client';
import { useParams } from 'next/navigation';

interface ResourceListProps {
    resources: BrandResource[];
    onDelete?: () => void;
}

const getIcon = (type: string) => {
    switch (type) {
        case 'link': return LinkIcon;
        case 'asset': return ImageIcon;
        case 'note': return FileText;
        default: return File;
    }
};

const StatusBadge = ({ status }: { status: ResourceStatus }) => {
    if (status === 'indexing') {
        return (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-bold uppercase tracking-wider">
                <Loader2 className="w-3 h-3 animate-spin" />
                Indexing
            </div>
        );
    }
    if (status === 'ready') {
        return (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3" />
                Ready
            </div>
        );
    }
    return (
        <div className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-bold uppercase tracking-wider">
            Error
        </div>
    );
};

export const ResourceList: React.FC<ResourceListProps> = ({ resources, onDelete }) => {
    const supabase = createClient();
    const { id } = useParams();
    const brandId = Array.isArray(id) ? id[0] : id;

    const handleDelete = async (resourceId: string, filePath?: string) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;

        // 1. Delete from Storage if it's a file
        if (filePath) {
            await supabase.storage.from('brand-resources').remove([filePath]);
        }

        // 2. Delete from DB
        await supabase.from('brand_resources').delete().eq('id', resourceId);

        if (onDelete) onDelete();
    };

    const handleResync = async (resourceId: string) => {
        try {
            const { processResource } = await import('@/app/actions/process-resource');
            await processResource(resourceId);
            if (onDelete) onDelete(); // Re-fetch
        } catch (err) {
            console.error(err);
        }
    };

    if (resources.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground text-sm">No resources found in this category.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3">
            {resources.map((res) => {
                const Icon = getIcon(res.type);
                const isIndexing = res.metadata?.status === 'indexing';

                return (
                    <div key={res.id} className={cn(
                        "group flex items-center justify-between p-4 bg-card/50 border border-border/50 rounded-xl hover:border-primary/30 hover:bg-secondary/40 transition-all",
                        isIndexing && "border-amber-500/30 bg-amber-500/5 animate-pulse-slow"
                    )}>
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors",
                                isIndexing && "text-amber-500"
                            )}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer truncate max-w-[200px] md:max-w-[400px]">
                                    {res.title}
                                </h4>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                        {new Date(res.created_at).toLocaleDateString()}
                                    </span>
                                    {res.metadata?.size && (
                                        <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 rounded">
                                            {(res.metadata.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    )}
                                    {res.metadata?.token_count && (
                                        <span className="text-[10px] text-primary/70 font-mono">
                                            {res.metadata.token_count.toLocaleString()} tokens
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <StatusBadge status={res.metadata?.status || 'indexing'} />

                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                <button
                                    onClick={() => handleResync(res.id)}
                                    disabled={isIndexing}
                                    title="Re-sync AI Knowledge"
                                    className="p-2 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Loader2 className={cn("w-4 h-4", isIndexing && "animate-spin")} />
                                </button>
                                {res.file_url && (
                                    <a
                                        href={`https://hsunqllhnoeoiyzbjgxv.supabase.co/storage/v1/object/public/brand-resources/${res.file_url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                                <button
                                    onClick={() => handleDelete(res.id, res.file_url)}
                                    className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
