'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { arcade, arcadeTitleStyle } from '../arcade';

// The arcade's attract screen: "Selected work / Choose your project". Sized in
// container units, so the same screen reads on the cabinet in the room and
// full screen once the camera has dived in.
export default function AttractScreen({ className = '' }: { className?: string }) {
    const reduce = useReducedMotion();
    return (
        <div
            className={`${arcade.className} [container-type:size] relative overflow-hidden flex flex-col items-center justify-center text-center ${className}`}
            style={{ background: 'radial-gradient(ellipse at 50% 45%, #22358a 0%, #121d4e 55%, #070b1f 100%)' }}
        >
            <span
                className="uppercase leading-[1.2] text-[min(7.5cqw,15cqh)]"
                style={{ ...arcadeTitleStyle, WebkitTextStroke: '0.06em #5C1409', filter: 'drop-shadow(0.08em 0.08em 0 #5C1409)' }}
            >
                Selected
                <br />
                Work
            </span>
            <motion.span
                className="mt-[5cqh] uppercase tracking-[0.15em] text-[min(3cqw,6cqh)] text-[#E6E1D6]"
                animate={reduce ? undefined : { opacity: [1, 1, 0, 0] }}
                transition={{ duration: 1.1, times: [0, 0.55, 0.56, 1], repeat: Infinity }}
            >
                Choose your project
            </motion.span>
            {/* CRT scanlines */}
            <span
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0 1px, transparent 1px 3px)' }}
            />
        </div>
    );
}
