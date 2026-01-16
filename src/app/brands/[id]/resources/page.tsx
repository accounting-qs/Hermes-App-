"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase-ssr/client';
import { BrandResource, ResourceType } from '@/types';
import { FileUploader } from '@/components/brands/resources/FileUploader';
import { ResourceList } from '@/components/brands/resources/ResourceList';
import { ResourceStats } from '@/components/brands/resources/ResourceStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Assuming we have shadcn tabs or standard
import { BookOpen, Link as LinkIcon, Image as ImageIcon, FileText, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBrandStore } from '@/store/useBrandStore';

// Temporary simplistic Tabs if shadcn not installed yet, but user asked for Radix. 
// I'll implement a custom Tab wrapper to ensure it works without shadcn dependency for now, 
// using generic logic or assuming standard UI components exist.
// Since User requested Radix, I installed radix-ui/react-tabs earlier.

import * as TabsPrimitive from '@radix-ui/react-tabs';

const CustomTabs = TabsPrimitive.Root;
const CustomTabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "inline-flex h-12 items-center justify-center rounded-2xl bg-secondary/50 p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
));
CustomTabsList.displayName = TabsPrimitive.List.displayName;

const CustomTabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:font-bold",
            className
        )}
        {...props}
    />
));
CustomTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const CustomTabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
            className
        )}
        {...props}
    />
));
CustomTabsContent.displayName = TabsPrimitive.Content.displayName;

export default function ResourcesPage() {
    const { id } = useParams();
    const brandId = Array.isArray(id) ? id[0] : id;
    const [resources, setResources] = useState<BrandResource[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const { brands } = useBrandStore();
    const brand = brands.find(b => b.id === brandId);

    const fetchResources = async () => {
        if (!brandId) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('brand_resources')
            .select('*')
            .eq('brand_id', brandId)
            .order('created_at', { ascending: false });

        if (data) setResources(data as BrandResource[]);
        setLoading(false);
    };

    useEffect(() => {
        fetchResources();
    }, [brandId]);

    const [urlInput, setUrlInput] = useState("");
    const [isAddingLink, setIsAddingLink] = useState(false);

    const handleAddLink = async () => {
        if (!urlInput || !brandId) return;
        setIsAddingLink(true);
        try {
            const { crawlLink } = await import('@/app/actions/crawl-link');
            const { processResource } = await import('@/app/actions/process-resource');

            const content = await crawlLink(urlInput);

            // 1. Create Link Resource
            const { data: newLink, error: linkError } = await supabase
                .from('brand_resources')
                .insert({
                    brand_id: brandId,
                    type: 'link',
                    title: urlInput.replace(/^https?:\/\//, '').split('/')[0],
                    content_text: content,
                    metadata: { status: 'indexing' }
                })
                .select('id')
                .single();

            if (linkError) throw linkError;

            // 2. Trigger Processing
            await processResource(newLink.id);

            setUrlInput("");
            fetchResources();
        } catch (err) {
            console.error(err);
            alert("Failed to add link");
        } finally {
            setIsAddingLink(false);
        }
    };

    const filterByType = (type: ResourceType) => resources.filter(r => r.type === type);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold outfit-font flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-primary" />
                        Brand Resources
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage the knowledge base for {brand?.name || 'this brand'}. Upload documents to train the AI.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content: Tabs */}
                <div className="lg:col-span-8">
                    <CustomTabs defaultValue="files" className="w-full">
                        <CustomTabsList className="w-full justify-start overflow-x-auto">
                            <CustomTabsTrigger value="files" className="flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Documents
                            </CustomTabsTrigger>
                            <CustomTabsTrigger value="links" className="flex items-center gap-2">
                                <LinkIcon className="w-4 h-4" /> Links
                            </CustomTabsTrigger>
                            <CustomTabsTrigger value="assets" className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Brand Assets
                            </CustomTabsTrigger>
                        </CustomTabsList>

                        <CustomTabsContent value="files" className="space-y-6">
                            <FileUploader onUploadComplete={fetchResources} />
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Uploaded Documents</h3>
                                <ResourceList resources={filterByType('file')} onDelete={fetchResources} />
                            </div>
                        </CustomTabsContent>

                        <CustomTabsContent value="links" className="space-y-6">
                            <div className="glass-card p-4 flex gap-3">
                                <input
                                    type="text"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="Paste URL to index (e.g., https://example.com)..."
                                    className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                    disabled={isAddingLink}
                                />
                                <button
                                    onClick={handleAddLink}
                                    disabled={isAddingLink || !urlInput}
                                    className="px-4 py-2 premium-gradient text-white rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isAddingLink ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Link"}
                                </button>
                            </div>
                            <ResourceList resources={filterByType('link')} onDelete={fetchResources} />
                        </CustomTabsContent>

                        <CustomTabsContent value="assets" className="space-y-6">
                            <div className="p-12 border border-dashed border-border rounded-xl text-center text-muted-foreground">
                                Asset Manager Coming Soon
                            </div>
                            <ResourceList resources={filterByType('asset')} onDelete={fetchResources} />
                        </CustomTabsContent>
                    </CustomTabs>
                </div>

                {/* Sidebar: Stats */}
                <div className="lg:col-span-4">
                    <ResourceStats resources={resources} />
                </div>
            </div>
        </div>
    );
}
