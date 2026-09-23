'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollSection {
    number: string;
    title: string;
    subtitle: string;
    description: string;
    accent: string;
}

const sections: ScrollSection[] = [
    {
        number: '01',
        title: 'Design',
        subtitle: 'User Experience',
        description: 'Crafting intuitive interfaces that bridge the gap between users and technology.',
        accent: 'text-orange-500',
    },
    {
        number: '02',
        title: 'Create',
        subtitle: 'Visual Identity',
        description: 'Building cohesive brand experiences through thoughtful visual storytelling.',
        accent: 'text-blue-500',
    },
    {
        number: '03',
        title: 'Innovate',
        subtitle: 'Digital Products',
        description: 'Pushing boundaries to deliver cutting-edge solutions for modern challenges.',
        accent: 'text-purple-500',
    },
    {
        number: '04',
        title: 'Curate',
        subtitle: 'Creative Direction',
        description: 'Selecting and refining ideas into polished, impactful design systems.',
        accent: 'text-pink-500',
    },
];

export default function HorizontalScrollSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Main horizontal movement - moves the entire track
    const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

    // Parallax for background decorative elements (slower)
    const bgX = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

    // Parallax for floating elements (faster)
    const floatX = useTransform(scrollYProgress, [0, 1], ['0%', '-100%']);

    // Opacity for intro/outro
    const introOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
    const outroOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

    return (
        <section
            ref={containerRef}
            className="relative h-[400vh]" // Height determines scroll distance
        >
            {/* Sticky container that pins the viewport */}
            <div className="sticky top-0 h-screen overflow-hidden bg-gradient-to-br from-[var(--background)] via-[var(--background)] to-[var(--accent)]">

                {/* Background parallax layer - decorative numbers */}
                <motion.div
                    style={{ x: bgX }}
                    className="absolute inset-0 flex items-center pointer-events-none"
                >
                    {sections.map((section, index) => (
                        <div
                            key={section.number}
                            className="flex-shrink-0 w-screen flex items-center justify-center"
                        >
                            <span
                                className="text-[40vw] font-black opacity-[0.03] dark:opacity-[0.05] leading-none select-none"
                                style={{
                                    WebkitTextStroke: '2px currentColor',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {section.number}
                            </span>
                        </div>
                    ))}
                </motion.div>

                {/* Floating decorative circles - fastest parallax */}
                <motion.div
                    style={{ x: floatX }}
                    className="absolute inset-0 pointer-events-none"
                >
                    <div className="absolute top-[20%] left-[50vw] w-32 h-32 rounded-full border border-orange-500/20" />
                    <div className="absolute bottom-[30%] left-[120vw] w-48 h-48 rounded-full border-2 border-blue-500/10" />
                    <div className="absolute top-[60%] left-[200vw] w-24 h-24 rounded-full bg-purple-500/5" />
                    <div className="absolute top-[15%] left-[280vw] w-64 h-64 rounded-full border border-pink-500/15" />
                </motion.div>

                {/* Main content track */}
                <motion.div
                    style={{ x }}
                    className="absolute inset-0 flex items-center"
                >
                    {/* Intro panel */}
                    <div className="flex-shrink-0 w-screen h-full flex items-center justify-center px-8">
                        <motion.div
                            style={{ opacity: introOpacity }}
                            className="text-center max-w-2xl"
                        >
                            <p className="font-mono text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">
                                Scroll to Explore
                            </p>
                            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
                                My Process
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 font-mono">
                                A journey through design philosophy
                            </p>
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="mt-12 text-gray-400"
                            >
                                ↓
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Content sections */}
                    {sections.map((section, index) => (
                        <div
                            key={section.number}
                            className="flex-shrink-0 w-screen h-full flex items-center px-8 md:px-16 lg:px-24"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 w-full max-w-7xl mx-auto">
                                {/* Left: Number and title */}
                                <div className="flex flex-col justify-center">
                                    <motion.span
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8 }}
                                        viewport={{ once: true, amount: 0.5 }}
                                        className={`text-8xl md:text-9xl font-black ${section.accent} opacity-80`}
                                    >
                                        {section.number}
                                    </motion.span>
                                    <motion.h3
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                        viewport={{ once: true, amount: 0.5 }}
                                        className="text-5xl md:text-7xl font-black tracking-tighter mt-4"
                                    >
                                        {section.title}
                                    </motion.h3>
                                </div>

                                {/* Right: Content card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    className="flex flex-col justify-center"
                                >
                                    <div className="p-8 md:p-12 bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-sm">
                                        <p className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-6">
                                            {section.subtitle}
                                        </p>
                                        <p className="text-2xl md:text-3xl font-light leading-relaxed text-gray-700 dark:text-gray-300">
                                            {section.description}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    ))}

                    {/* Outro panel */}
                    <div className="flex-shrink-0 w-screen h-full flex items-center justify-center px-8">
                        <motion.div
                            style={{ opacity: outroOpacity }}
                            className="text-center max-w-2xl"
                        >
                            <p className="font-mono text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">
                                Continue Below
                            </p>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                                View My Work
                            </h2>
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="mt-8 text-gray-400 text-2xl"
                            >
                                ↓
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Fixed side indicator */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
                    {sections.map((section, index) => {
                        const start = index / sections.length;
                        const end = (index + 1) / sections.length;

                        return (
                            <SectionDot
                                key={section.number}
                                progress={scrollYProgress}
                                start={start}
                                end={end}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// Sub-component for section indicator dots
function SectionDot({
    progress,
    start,
    end,
}: {
    progress: any;
    start: number;
    end: number;
}) {
    const isActive = useTransform(progress, (p: number) =>
        p >= start && p < end ? 1 : 0.3
    );
    const scale = useTransform(progress, (p: number) =>
        p >= start && p < end ? 1.5 : 1
    );

    return (
        <motion.div
            style={{ opacity: isActive, scale }}
            className="w-2 h-2 rounded-full bg-current transition-colors"
        />
    );
}
