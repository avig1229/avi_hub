'use client';

import { useLayoutEffect, useRef } from 'react';
import Logo from './Logo';
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion';

// Centre of the circle inside the "R", as a fraction of the logo's width/height (measured from /logo.svg).
const R_CIRCLE = { x: 0.499, y: 0.3025 };
// Where the mascot settles, as a fraction of the viewport height.
const MASCOT_REST_Y = 0.44;

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress: p } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

    // Offset from the mascot's resting spot to the R's circle, re-measured on resize.
    const startX = useMotionValue(0);
    const startY = useMotionValue(0);
    useLayoutEffect(() => {
        const measure = () => {
            // offset* ignores the scroll-driven scale, so this is right whatever the scroll position.
            const stage = stageRef.current;
            const logo = logoRef.current;
            if (!stage || !logo) return;
            startX.set(logo.offsetLeft + logo.offsetWidth * R_CIRCLE.x - stage.clientWidth / 2);
            startY.set(logo.offsetTop + logo.offsetHeight * R_CIRCLE.y - stage.clientHeight * MASCOT_REST_Y);
        };
        measure();
        const ro = new ResizeObserver(measure);
        if (stageRef.current) ro.observe(stageRef.current);
        if (logoRef.current) ro.observe(logoRef.current);
        return () => ro.disconnect();
    }, [startX, startY]);

    // 1. The mascot is born in the R's circle and rises to the centre of the screen.
    const emerge = useTransform(p, [0.05, 0.55], [0, 1], { clamp: true });
    const mascotScale = useTransform(emerge, [0, 1], [0, 1]);
    const mascotX = useTransform(() => startX.get() * (1 - emerge.get()));
    const mascotY = useTransform(() => startY.get() * (1 - emerge.get()));
    const mascotRotate = useTransform(p, [0.05, 0.55, 0.75, 1], [-20, 0, 0, 12]); // wobble out, then the "head tilt"

    // 2. The wordmark steps back so the mascot has the stage.
    const logoOpacity = useTransform(p, [0.2, 0.55], [1, 0.1]);
    const logoScale = useTransform(p, [0, 0.55], [1, 0.92]);

    // 3. The tagline arrives once the mascot has settled.
    const taglineOpacity = useTransform(p, [0.55, 0.72], [0, 1]);
    const taglineY = useTransform(p, [0.55, 0.72], [24, 0]);
    const hintOpacity = useTransform(p, [0, 0.08], [1, 0]);

    return (
        <section ref={sectionRef} className="relative h-[300vh] -mt-24 mb-24">
            <div ref={stageRef} className="sticky top-0 h-svh flex items-center justify-center overflow-hidden">
                <motion.div
                    ref={logoRef}
                    style={{ opacity: logoOpacity, scale: logoScale }}
                    className="w-[86vw] max-w-[960px]"
                >
                    <h1 className="overflow-hidden">
                        <motion.span
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.8, ease: 'circOut' }}
                            className="block"
                        >
                            <Logo className="w-full" />
                        </motion.span>
                    </h1>
                </motion.div>

                <div
                    style={{ top: `${MASCOT_REST_Y * 100}%` }}
                    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(58svh,82vw)] aspect-square pointer-events-none"
                >
                    <motion.img
                        src="/shRma_Sashiko.png"
                        alt="shRma Sashiko mascot"
                        style={{ x: mascotX, y: mascotY, scale: mascotScale, rotate: mascotRotate }}
                        className="w-full h-full object-contain drop-shadow-2xl"
                    />
                </div>

                <motion.p
                    style={{ opacity: taglineOpacity, y: taglineY }}
                    className="absolute bottom-[8svh] left-6 right-6 mx-auto max-w-2xl text-center text-lg md:text-2xl font-mono text-gray-600 dark:text-gray-400 leading-tight"
                >
                    Passionate product designer bridging tech, design, and fashion to create intuitive digital experiences.
                </motion.p>

                <motion.div
                    style={{ opacity: hintOpacity }}
                    className="absolute bottom-10 text-sm font-mono uppercase tracking-widest text-gray-400"
                >
                    Scroll ↓
                </motion.div>
            </div>
        </section>
    );
}
