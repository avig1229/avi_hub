'use client';

import { useEffect, useState } from 'react';
import { PortableText } from '@portabletext/react';
import GalleryGrid from './GalleryGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { useGuide } from './guide/Guide';

// Portable Text Components (copied from page.tsx for consistency)
const ptComponents = {
    types: {
        videoEmbed: ({ value }: any) => {
            if (!value.url) return null;
            const isYoutube = value.url.includes('youtube.com') || value.url.includes('youtu.be');
            let embedUrl = value.url;
            if (isYoutube) {
                const videoId = value.url.split('v=')[1]?.split('&')[0] || value.url.split('/').pop();
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }

            return (
                <div className="my-8 aspect-video w-full">
                    <iframe
                        src={embedUrl}
                        className="w-full h-full rounded-sm"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                </div>
            );
        }
    }
}

interface UserProjectTabsProps {
    mainContent: any;
    mainGallery: any[];
    subsections?: any[];
    slug: string;
    // Third Eye's line for each subsection, in the same order.
    sectionGuides?: (string | undefined)[];
}

export default function ProjectTabs({ mainContent, mainGallery, subsections = [], slug, sectionGuides = [] }: UserProjectTabsProps) {
    const [activeTab, setActiveTab] = useState(0);

    // Combine main content and subsections into a unified structure for easier rendering
    const tabs = [
        {
            title: 'Overview',
            content: mainContent,
            gallery: mainGallery,
            guide: undefined as string | undefined,
        },
        ...(subsections || []).map((section, i) => ({
            title: section.title,
            content: section.description,
            gallery: section.gallery,
            guide: sectionGuides[i],
        }))
    ];

    // Third Eye pipes up the first time each tab is opened, straight away rather
    // than on scroll, since on phones the tab's content can start below the fold.
    const { say } = useGuide();
    const { title: activeTitle, guide: activeGuide } = tabs[activeTab];
    useEffect(() => {
        if (activeGuide) say(`project:${slug}:${activeTitle}`, activeGuide, { group: `project:${slug}` });
    }, [activeGuide, activeTitle, slug, say]);

    return (
        <div className="space-y-8">
            {/* Tab Navigation */}
            {tabs.length > 1 && (
                <div className="flex flex-wrap gap-4 border-b border-gray-200 dark:border-gray-800 pb-2">
                    {tabs.map((tab, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveTab(idx)}
                            className={`pb-2 px-1 text-sm uppercase tracking-widest font-mono transition-colors relative
                                ${activeTab === idx
                                    ? 'text-black dark:text-white font-bold'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                }`
                            }
                        >
                            {tab.title}
                            {activeTab === idx && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-12"
                >
                    {tabs[activeTab].content && (
                        <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">
                            <PortableText value={tabs[activeTab].content} components={ptComponents} />
                        </div>
                    )}

                    {tabs[activeTab].gallery && (
                        <GalleryGrid items={tabs[activeTab].gallery} />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
