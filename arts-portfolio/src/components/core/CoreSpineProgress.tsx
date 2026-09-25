'use client';

import { RefObject } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface CoreSpineProgressProps {
    targetRef: RefObject<HTMLElement | null>;
}

// A thin vertical line that fills top-to-bottom as the visitor scrolls
// through the page — a literal throughline, echoing the spine concept.
export default function CoreSpineProgress({ targetRef }: CoreSpineProgressProps) {
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start start', 'end end'],
    });

    const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <div className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 z-40 h-[40vh] w-px">
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800" />
            <motion.div
                style={{ scaleY }}
                className="absolute inset-0 bg-black dark:bg-white origin-top"
            />
        </div>
    );
}
