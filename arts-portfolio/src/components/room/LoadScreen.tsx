'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { arcade } from '../arcade';
import Kid from './Kid';

// The room's loading screen, between the hero and the room: all dark,
// "Welcome to the crib...", and Third Eye runs across from left to right,
// out of the screen and into the room.

export const RUN_MS = 1500;

export default function LoadScreen() {
    const reduce = useReducedMotion();
    // Legs pump fast while he runs.
    const [step, setStep] = useState(0);
    useEffect(() => {
        if (reduce) return;
        const id = window.setInterval(() => setStep((s) => s + 1), 90);
        return () => window.clearInterval(id);
    }, [reduce]);

    return (
        <motion.div
            role="status"
            aria-label="Welcome to the crib"
            className="fixed inset-0 z-[46] overflow-hidden bg-black text-[#E6E1D6]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
        >
            <p className={`${arcade.className} absolute inset-x-0 top-[36%] px-4 text-center text-base md:text-2xl uppercase leading-relaxed`}>
                Welcome to the crib
                <motion.span
                    aria-hidden
                    className="inline-block w-[3ch] text-left text-[#F2C14E]"
                    animate={reduce ? undefined : { opacity: [1, 0.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                >
                    ...
                </motion.span>
            </p>

            {/* Third Eye, sprinting left to right, then out of frame */}
            <motion.div
                aria-hidden
                className="absolute bottom-[16%] h-[30vh] max-h-60 aspect-[21/34]"
                initial={{ left: '-20%' }}
                animate={{ left: '112%' }}
                transition={{ duration: reduce ? 0 : RUN_MS / 1000, ease: [0.3, 0, 0.7, 1] }}
            >
                {/* Dust kicked up behind him */}
                {!reduce &&
                    [0, 1, 2].map((i) => (
                        <motion.span
                            key={i}
                            className="absolute bottom-0 w-3 h-3 bg-[#E6E1D6]/70"
                            style={{ left: `${-10 - i * 14}%` }}
                            animate={{ opacity: [0.8, 0], y: [0, -10], scale: [1, 0.4] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                        />
                    ))}
                <Kid dir="E" step={step} walking />
            </motion.div>
        </motion.div>
    );
}
