"use client";

import React, { useState } from "react";
import {
    ShieldCheck,
    Key,
    Lock,
    Eye,
    EyeOff,
    Copy,
    Plus,
    Search,
    MoreVertical,
    ExternalLink,
    Smartphone,
    Globe,
    Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CredentialsVault() {
    const [showSecret, setShowSecret] = useState<string | null>(null);

    const credentials = [
        { id: '1', platform: 'GoDaddy', category: 'Domains', login: 'admin_qs', secret: '••••••••••••', lastUpdated: '2 days ago', icon: Globe },
        { id: '2', platform: 'GoHighLevel', category: 'CRM/API', login: 'apiKey_main', secret: 'ghl_live_x8823kLpQ992', lastUpdated: '1 month ago', icon: Database },
        { id: '3', platform: 'Stripe', category: 'Payments', login: 'sk_live_...', secret: '••••••••••••', lastUpdated: '15 days ago', icon: ShieldCheck },
        { id: '4', platform: 'Apollo.io', category: 'Leads', login: 'michael@qs.ai', secret: '••••••••••••', lastUpdated: 'Just now', icon: Smartphone },
    ];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Add toast notification logic here later
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Lock className="w-5 h-5 text-primary" />
                        <h1 className="text-3xl font-bold outfit-font">Credentials Vault</h1>
                    </div>
                    <p className="text-muted-foreground">Secure storage for brand assets, API keys, and platform logins.</p>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                    <Plus className="w-5 h-5" />
                    Add Credential
                </button>
            </div>

            {/* Security Banner */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-amber-500 flex items-center gap-2">
                        End-to-End Encryption Active
                    </h4>
                    <p className="text-sm text-amber-500/70">
                        Only authorized QS Team members with "Admin" status can view these secrets. All access is logged and tracked for security compliance.
                    </p>
                </div>
                <button className="px-4 py-2 border border-amber-500/50 text-amber-500 text-xs font-bold rounded-lg hover:bg-amber-500/10 transition-all">
                    Audit Logs
                </button>
            </div>

            {/* Vault Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search for platform, category or login..."
                    className="w-full bg-secondary/30 border border-border/50 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
            </div>

            {/* Credentials List */}
            <div className="grid grid-cols-1 gap-4">
                {credentials.map((cred) => (
                    <motion.div
                        key={cred.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card group hover:border-primary/30 transition-all"
                    >
                        <div className="p-5 flex items-center gap-6">
                            <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                <cred.icon className="w-6 h-6" />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold">{cred.platform}</h3>
                                    <span className="px-2 py-0.5 bg-secondary/50 rounded text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                        {cred.category}
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground font-mono">{cred.login}</div>
                            </div>

                            <div className="flex-[1.5] flex items-center gap-3">
                                <div className="flex-1 relative">
                                    <input
                                        type={showSecret === cred.id ? "text" : "password"}
                                        value={cred.secret}
                                        readOnly
                                        className="w-full bg-black/20 border border-border/30 rounded-lg py-2 px-3 text-xs font-mono text-muted-foreground focus:outline-none"
                                    />
                                    <button
                                        onClick={() => setShowSecret(showSecret === cred.id ? null : cred.id)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showSecret === cred.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(cred.secret)}
                                    className="p-2.5 bg-secondary/50 border border-border/50 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="text-right flex items-center gap-6">
                                <div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Updated</div>
                                    <div className="text-xs font-medium">{cred.lastUpdated}</div>
                                </div>
                                <button className="p-2 text-muted-foreground hover:text-foreground">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-8 glass-card border-dashed border-2 flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <Key className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="font-bold text-lg mb-2">Need to request access?</h4>
                <p className="text-sm text-muted-foreground max-w-md mb-6">
                    If you need credentials for a platform that isn't listed here, please submit an Access Request to the Systems Lead.
                </p>
                <button className="flex items-center gap-2 px-6 py-2 bg-secondary hover:bg-border rounded-xl text-xs font-bold transition-all">
                    <ExternalLink className="w-4 h-4" />
                    Submit Request
                </button>
            </div>
        </div>
    );
}
