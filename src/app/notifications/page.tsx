"use client";

import React, { useState } from "react";
import {
    Bell,
    CheckCheck,
    Settings,
    Trash2,
    Search,
    AlertCircle,
    Zap,
    Info,
    Clock,
    MoreVertical,
    ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const initialNotifications = [
    { id: '1', title: 'Brand Milestone Reached', message: 'Quantum Scale has completed the Research Phase with 98% AI confidence score.', type: 'success', time: '5m ago', read: false },
    { id: '2', title: 'Urgent Action Required', message: 'Nexus Tech Facebook Ads account has been paused due to billing issues.', type: 'urgent', time: '1h ago', read: false },
    { id: '3', title: 'New Sales Call Booked', message: 'A new high-ticket call has been scheduled for Growth Labs (Chris Miller).', type: 'info', time: '3h ago', read: true },
    { id: '4', title: 'Script Enhancement Ready', message: 'Quantum Copilot has generated a new variation for the Webinar Script Module.', type: 'ai', time: 'Yesterday', read: true },
    { id: '5', title: 'System Update', message: 'HERMES AI engine v2.4.0 successfully deployed to all production instances.', type: 'info', time: 'Yesterday', read: true },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

    const filtered = notifications.filter(n => {
        if (filter === 'unread') return !n.read;
        if (filter === 'urgent') return n.type === 'urgent';
        return true;
    });

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Bell className="w-5 h-5 text-primary" />
                        <h1 className="text-3xl font-bold outfit-font">Notifications</h1>
                    </div>
                    <p className="text-muted-foreground">Stay updated on brand progress, system alerts, and AI insights.</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={markAllRead}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-secondary/50 rounded-xl text-xs font-bold text-muted-foreground transition-all"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Mark all as read
                    </button>
                    <button className="p-2 hover:bg-secondary/50 rounded-xl text-muted-foreground transition-all">
                        <Settings className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-secondary/20 p-2 rounded-2xl border border-border/50">
                <div className="flex p-1 bg-background/50 rounded-xl border border-border/50 w-full sm:w-auto">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'unread', label: 'Unread' },
                        { id: 'urgent', label: 'Urgent' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id as any)}
                            className={cn(
                                "flex-1 sm:px-6 py-2 text-xs font-bold rounded-lg transition-all",
                                filter === tab.id ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab.label}
                            {tab.id === 'unread' && notifications.filter(n => !n.read).length > 0 && (
                                <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-[8px] rounded-full">
                                    {notifications.filter(n => !n.read).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="relative mt-2 sm:mt-0 w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        className="w-full sm:min-w-[250px] bg-background/50 border border-border/50 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {filtered.map((n) => (
                        <motion.div
                            key={n.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className={cn(
                                "glass-card group p-5 flex gap-5 hover:border-primary/30 transition-all cursor-pointer",
                                !n.read && "border-l-4 border-l-primary"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                                n.type === 'urgent' ? "bg-red-500/10 text-red-500 shadow-red-500/10" :
                                    n.type === 'ai' ? "bg-primary/10 text-primary shadow-primary/10" :
                                        n.type === 'success' ? "bg-green-500/10 text-green-500 shadow-green-500/10" :
                                            "bg-secondary text-muted-foreground"
                            )}>
                                {n.type === 'urgent' ? <AlertCircle className="w-6 h-6" /> :
                                    n.type === 'ai' ? <Zap className="w-6 h-6" /> :
                                        n.type === 'success' ? <CheckCheck className="w-6 h-6" /> :
                                            <Info className="w-6 h-6" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={cn("font-bold truncate", !n.read && "text-foreground")}>
                                        {n.title}
                                    </h3>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {n.time}
                                        </span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                                            className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button className="p-1 text-muted-foreground hover:text-foreground">
                                            <MoreVertical className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                    {n.message}
                                </p>
                                <div className="mt-3 flex items-center gap-4">
                                    <button className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1 group/btn">
                                        Take Action
                                        <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                    {!n.read && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-6 border border-border/50">
                            <Bell className="w-10 h-10 text-muted-foreground/30" />
                        </div>
                        <h3 className="font-bold text-lg text-muted-foreground">All caught up!</h3>
                        <p className="text-sm text-muted-foreground/60 max-w-xs">
                            No new notifications found in this category. You're doing great.
                        </p>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="p-6 bg-secondary/10 rounded-2xl border border-dashed border-border/50 text-center">
                <p className="text-xs text-muted-foreground">
                    Notifications older than 30 days are automatically archived to the <b>History Log</b>.
                </p>
            </div>
        </div>
    );
}
