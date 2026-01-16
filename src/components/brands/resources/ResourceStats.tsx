import React, { useMemo } from 'react';
import { Database, Link as LinkIcon, FileText, BrainCircuit } from 'lucide-react';
import { BrandResource } from '@/types';

interface ResourceStatsProps {
    resources: BrandResource[];
}

export const ResourceStats: React.FC<ResourceStatsProps> = ({ resources }) => {
    const stats = useMemo(() => {
        const hasFiles = resources.some(r => r.type === 'file');
        const hasLinks = resources.some(r => r.type === 'link');
        const hasNotes = resources.some(r => r.type === 'note');

        let diversityBonus = 0;
        if (hasFiles) diversityBonus += 30;
        if (hasLinks) diversityBonus += 30;
        if (hasNotes) diversityBonus += 30;

        const coverageScore = Math.min(100, (resources.length * 5) + diversityBonus);

        return {
            totalFiles: resources.filter(r => r.type === 'file').length,
            totalLinks: resources.filter(r => r.type === 'link').length,
            totalTokens: resources.reduce((acc, curr) => acc + (curr.metadata?.token_count || 0), 0),
            knowledgeScore: coverageScore
        };
    }, [resources]);

    return (
        <div className="space-y-6">
            {/* Knowledge Score */}
            <div className="glass-card p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BrainCircuit className="w-24 h-24 text-primary" />
                </div>

                <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Knowledge Coverage</h3>
                <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-bold text-primary">{stats.knowledgeScore}%</span>
                    <span className="text-xs font-medium text-muted-foreground pb-1.5">Context Depth</span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full premium-gradient transition-all duration-1000"
                        style={{ width: `${stats.knowledgeScore}%` }}
                    />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary/20 rounded-xl border border-border/50">
                    <FileText className="w-5 h-5 text-primary mb-2" />
                    <div className="text-2xl font-bold">{stats.totalFiles}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Documents</div>
                </div>
                <div className="p-4 bg-secondary/20 rounded-xl border border-border/50">
                    <LinkIcon className="w-5 h-5 text-primary mb-2" />
                    <div className="text-2xl font-bold">{stats.totalLinks}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">External Links</div>
                </div>
            </div>

            {/* Token Count */}
            <div className="glass-card p-6 flex items-center justify-between">
                <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Total Tokens Indexed</div>
                    <div className="text-xl font-bold font-mono">{stats.totalTokens.toLocaleString()}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Database className="w-5 h-5" />
                </div>
            </div>

            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl text-xs text-blue-400 leading-relaxed">
                <strong>Tip:</strong> Uploading more Case Studies (PDF) significantly improves the AI's ability to mimic your brand voice.
            </div>
        </div>
    );
};
