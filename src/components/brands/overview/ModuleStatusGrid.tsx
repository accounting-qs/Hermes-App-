import Link from 'next/link';
import { cn } from "@/lib/utils";
import { BookOpen, Search, Target, Video, Truck, Sparkles } from "lucide-react";
import { BrandProgress } from "@/types"; // Fixed import path

export interface ModuleStatus {
    id: string;
    title: string;
    icon: any;
    status: 'Not Started' | 'In Progress' | 'Complete' | 'Locked';
    progress: number;
    subProgress?: number[]; // For Research (Market, Avatar, Pains)
}

interface ModuleStatusGridProps {
    brandId: string;
    modules: ModuleStatus[];
}

export const ModuleStatusGrid: React.FC<ModuleStatusGridProps> = ({ brandId, modules }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod) => (
                <Link
                    href={`/brands/${brandId}/${mod.id}`}
                    key={mod.id}
                    className="p-5 bg-card/40 border border-border/50 rounded-2xl hover:border-primary/50 hover:bg-secondary/40 transition-all group relative overflow-hidden"
                >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                                <mod.icon className="w-5 h-5" />
                            </div>

                            <Badge status={mod.status} />
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                            <div className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                                {mod.title}
                            </div>

                            {/* Progress Section */}
                            <div className="space-y-1.5">
                                {/* Special Segmented Bar for Research */}
                                {mod.id === 'research' && mod.subProgress ? (
                                    <div className="flex gap-1 h-1.5 w-full">
                                        {mod.subProgress.map((val, idx) => (
                                            <div key={idx} className="flex-1 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full premium-gradient transition-all duration-1000"
                                                    style={{ width: `${val}%` }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    /* Standard Bar */
                                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full premium-gradient transition-all duration-1000"
                                            style={{ width: `${mod.progress}%` }}
                                        />
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    <span>Completion</span>
                                    <span className="text-primary">{mod.progress}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

const Badge = ({ status }: { status: ModuleStatus['status'] }) => {
    const styles = {
        'Complete': "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        'In Progress': "bg-amber-500/10 text-amber-500 border-amber-500/20",
        'Not Started': "bg-slate-500/10 text-slate-400 border-slate-500/20",
        'Locked': "bg-red-500/10 text-red-500 border-red-500/20",
    };

    return (
        <div className={cn(
            "text-[9px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-md border backdrop-blur-sm",
            styles[status] || styles['Not Started']
        )}>
            {status}
        </div>
    );
};
