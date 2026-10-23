'use client';

import { motion } from 'framer-motion';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/sanity/lib/image';
import FullBleed from '@/components/FullBleed';

interface CoreCollectionSectionProps {
    index: number;
    title: string;
    description?: any;
    gallery: any[];
}

export default function CoreCollectionSection({ index, title, description, gallery }: CoreCollectionSectionProps) {
    return (
        <section className="py-24 md:py-32">
            <FullBleed className="px-6 md:px-12 mb-16">
                <div className="max-w-[1920px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.7 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 dark:border-gray-800 pb-8"
                    >
                        <div>
                            <span className="block text-sm font-mono text-gray-400 mb-2">
                                {String(index).padStart(2, '0')} — Collection
                            </span>
                            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase">
                                {title}
                            </h2>
                        </div>
                        {description && (
                            <div className="max-w-md prose dark:prose-invert text-base md:text-lg leading-relaxed">
                                <PortableText value={description} />
                            </div>
                        )}
                    </motion.div>
                </div>
            </FullBleed>

            {gallery && gallery.length > 0 && (
                <FullBleed>
                    <div className="space-y-24 px-6 md:px-12">
                        {gallery.map((item: any, i: number) => {
                            const isVideo = item._type === 'file';
                            const isFull = i % 3 === 0;
                            const isRight = i % 3 === 1;

                            let containerClass = 'w-full';
                            if (!isVideo) {
                                if (isRight) containerClass = 'w-[80%] md:w-[65%] ml-auto';
                                else if (!isFull) containerClass = 'w-[80%] md:w-[65%] mr-auto';
                            }

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-100px' }}
                                    transition={{ duration: 0.7 }}
                                    className={containerClass}
                                >
                                    {isVideo ? (
                                        <video
                                            src={item.url}
                                            controls
                                            className="w-auto max-w-full max-h-[85vh] h-auto rounded-sm shadow-sm mx-auto"
                                        />
                                    ) : item.url ? (
                                        <img
                                            src={urlFor(item).width(1800).url()}
                                            alt={item.caption || `${title} ${i + 1}`}
                                            className="w-full h-auto rounded-sm shadow-sm"
                                        />
                                    ) : null}
                                    {item.caption && (
                                        <p className="mt-3 text-sm font-mono text-gray-500 dark:text-gray-400 text-center">
                                            {item.caption}
                                        </p>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </FullBleed>
            )}
        </section>
    );
}
