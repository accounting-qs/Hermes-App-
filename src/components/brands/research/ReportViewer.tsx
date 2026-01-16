"use client";

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { FileDown, Save, Sparkles } from 'lucide-react';

interface ReportViewerProps {
    initialContent: string;
    onSave?: (content: string) => void;
}

export const ReportViewer = ({ initialContent, onSave }: ReportViewerProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write something amazing...',
            }),
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none dark:prose-invert max-w-none',
            },
        },
        onUpdate: ({ editor }) => {
            // Debounce save logic could go here
            // onSave && onSave(editor.getHTML());
        }
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-700">
            {/* Toolbar */}
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                        Brand DNA Report
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        title="Download PDF (Coming Soon)"
                    >
                        <FileDown className="w-5 h-5" />
                    </button>
                    <button
                        className="p-2 hover:bg-secondary rounded-lg transition-colors text-emerald-500"
                        title="Saved"
                        onClick={() => onSave?.(editor.getHTML())}
                    >
                        <Save className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="min-h-[600px] w-full bg-background/50 rounded-xl border border-border/50 p-8 shadow-sm">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};
