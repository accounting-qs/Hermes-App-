import React from 'react';
import { Clock, Target, Search, BookOpen, Video, HelpCircle } from "lucide-react";

interface ActivityItem {
    id: string;
    action_type: string; // e.g., 'created', 'updated'
    category: string; // 'research', 'offers', etc.
    description: string;
    created_at: string; // ISO string
}

interface ActivityFeedProps {
    activities: ActivityItem[];
}

const getIconForCategory = (category: string) => {
    switch (category?.toLowerCase()) {
        case 'research': return Search;
        case 'offers': return Target;
        case 'resources': return BookOpen;
        case 'webinar': return Video;
        default: return HelpCircle;
    }
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
    if (!activities || activities.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground text-xs">
                No recent activity recorded.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {activities.map((act, i) => {
                const Icon = getIconForCategory(act.category);
                const timeStr = new Date(act.created_at).toLocaleDateString() + ' ' +
                    new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                    <div key={act.id} className="flex gap-4 relative group">
                        {/* Connecting Line (except for last item) */}
                        {i !== activities.length - 1 && (
                            <div className="absolute top-8 left-4 w-px h-full bg-border group-hover:bg-primary/30 transition-colors" />
                        )}

                        {/* Icon Bubble */}
                        <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 z-10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                            <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Content */}
                        <div className="space-y-1 pb-2">
                            <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                {act.description}
                            </div>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide font-bold">
                                <Clock className="w-3 h-3" />
                                {timeStr}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
