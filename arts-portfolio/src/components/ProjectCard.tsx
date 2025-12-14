'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProjectCardProps {
    title: string;
    category: string;
    slug: string;
    image?: string;
    index?: number;
}

export default function ProjectCard({ title, category, slug, image, index = 0 }: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="break-inside-avoid mb-8"
        >
            <Link href={`/work/${slug}`} className="group block">
                <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-900 aspect-[4/3] mb-3">
                    {image ? (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full bg-gray-300 relative"
                        >
                            <img src={image} alt={title} className="w-full h-full object-cover" />
                        </motion.div>
                    ) : (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400"
                        >
                            <span className="text-xs uppercase tracking-widest">No Image</span>
                        </motion.div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>

                <div className="flex justify-between items-baseline border-b border-transparent group-hover:border-black dark:group-hover:border-white transition-colors pb-1">
                    <h3 className="text-lg font-bold tracking-tight">{title}</h3>
                    <span className="text-xs font-mono text-gray-500 uppercase">{category}</span>
                </div>
            </Link>
        </motion.div>
    );
}
