"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Sparkles,
    X,
    Send,
    Bot,
    User as UserIcon,
    MessageSquare,
    Zap,
    Minimize2,
    Maximize2,
    Brain
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useBrandStore } from "@/store/useBrandStore";

export function QuantumCopilot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your Quantum Copilot. I have access to your brand research and offer data. How can I help you scale today?" }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuthStore();
    const { brands, selectedBrandId } = useBrandStore();
    const selectedBrand = brands.find(b => b.id === selectedBrandId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");

        // Mock AI Response
        setTimeout(() => {
            const response = {
                role: 'assistant',
                content: `I've analyzed the ${selectedBrand ? selectedBrand.name : 'current'} context. Based on your ICP, I recommend focusing on the "Time Freedom" angle for the next email sequence. Would you like me to draft a template?`
            };
            setMessages(prev => [...prev, response]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 45 }}
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 premium-gradient rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center text-white hover:scale-110 transition-transform group"
                    >
                        <Sparkles className="w-8 h-8 group-hover:animate-pulse" />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            height: isMinimized ? '80px' : '600px',
                            width: isMinimized ? '300px' : '400px'
                        }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="glass-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border-primary/20 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 premium-gradient flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                    <Brain className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold">Quantum Copilot</div>
                                    <div className="text-[10px] opacity-80 font-medium">
                                        {selectedBrand ? `Context: ${selectedBrand.name}` : 'Global Context'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
                                >
                                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                                    {messages.map((msg, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={i}
                                            className={cn(
                                                "flex items-start gap-3",
                                                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                                msg.role === 'user' ? "bg-secondary text-muted-foreground" : "bg-primary/20 text-primary"
                                            )}>
                                                {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                            </div>
                                            <div className={cn(
                                                "p-3 rounded-2xl text-xs leading-relaxed max-w-[80%]",
                                                msg.role === 'user' ? "bg-secondary/50 rounded-tr-none" : "bg-primary/5 border border-primary/10 rounded-tl-none"
                                            )}>
                                                {msg.content}
                                            </div>
                                        </motion.div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Quick Prompts */}
                                <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
                                    {['Draft Email', 'Market Analysis', 'Webinar Hook'].map(p => (
                                        <button key={p} className="whitespace-nowrap px-3 py-1 bg-secondary/30 border border-border/50 rounded-full text-[10px] font-bold text-muted-foreground hover:border-primary/50 transition-all">
                                            {p}
                                        </button>
                                    ))}
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-border/50 bg-secondary/10">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Ask copilot anything..."
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                            className="w-full bg-card border border-border/50 rounded-xl py-3 pl-4 pr-12 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
                                        />
                                        <button
                                            onClick={handleSend}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 ml-1 text-[9px] text-muted-foreground font-medium uppercase tracking-widest">
                                        <Zap className="w-3 h-3 text-amber-500" />
                                        Powered by Quantum AI (Gemini 2.0)
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
