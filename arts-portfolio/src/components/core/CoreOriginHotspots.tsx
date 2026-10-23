'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { urlFor } from '@/sanity/lib/image';

interface Hotspot {
    id: string;
    label: string;
    // Position as a percentage of the diagram's width/height.
    // Calibrated against the actual bare-bone illustration: eye-with-heart at
    // the top, a small vertebra above it, then a chain of vertebrae (each
    // with a small nail/screw mark) running down the rest of the frame.
    x: number;
    y: number;
    title: string;
    body: string;
}

const HOTSPOTS: Hotspot[] = [
    {
        id: 'eye',
        label: 'The Eye',
        x: 50,
        y: 20,
        title: 'The Eye',
        body: "At the center, an eye — carrying both the religious value from my Nepali side and a personal fascination with eyes as a window into a person's soul.",
    },
    {
        id: 'nails',
        label: 'The Nails',
        x: 59,
        y: 47,
        title: 'The Nails',
        body: 'Twelve center sections, held together by nails — the surgical hardware now built into my own spine. Having gone through a major spine surgery, this collection is a newfound respect for the pieces that quietly hold our characteristics together.',
    },
    {
        id: 'spine',
        label: 'The Spine',
        x: 50,
        y: 75,
        title: 'The Spine',
        body: "The spine is the core of life — the command center and the frame to a person's appearance, and more importantly, their liveliness. It's a lot like our eyes: we use it constantly, yet rarely notice it until something goes wrong.",
    },
];

interface CoreOriginHotspotsProps {
    image: any;
}

export default function CoreOriginHotspots({ image }: CoreOriginHotspotsProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const active = HOTSPOTS.find((h) => h.id === activeId) ?? null;

    if (!image) return null;

    return (
        <div className="relative w-full max-w-[700px] mx-auto aspect-[2/3]">
            <Image
                src={urlFor(image).width(1600).url()}
                alt="Bare-bone spine diagram"
                fill
                className="object-contain select-none pointer-events-none"
                priority
            />

            {HOTSPOTS.map((h) => (
                <button
                    key={h.id}
                    onClick={() => setActiveId(activeId === h.id ? null : h.id)}
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                    aria-label={h.label}
                >
                    <span
                        className={`block w-4 h-4 rounded-full border-2 transition-colors ${
                            activeId === h.id
                                ? 'bg-black dark:bg-white border-black dark:border-white'
                                : 'bg-transparent border-black/60 dark:border-white/60 group-hover:border-black dark:group-hover:border-white'
                        }`}
                    />
                    <span
                        className={`absolute inline-block w-4 h-4 rounded-full -inset-0 border-2 border-black/40 dark:border-white/40 ${
                            activeId === h.id ? 'animate-ping' : ''
                        }`}
                    />
                </button>
            ))}

            <AnimatePresence mode="wait">
                {active && (
                    <motion.div
                        key={active.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-0 right-0 -bottom-4 translate-y-full mt-4 bg-[var(--background)] border border-gray-200 dark:border-gray-800 p-6 rounded-sm shadow-sm"
                    >
                        <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                            {active.label}
                        </span>
                        <p className="text-lg leading-relaxed">{active.body}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
