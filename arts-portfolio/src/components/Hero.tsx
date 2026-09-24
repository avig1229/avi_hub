'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Logo from './Logo';
import {
    AnimatePresence,
    motion,
    useAnimationFrame,
    useMotionValue,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useTransform,
} from 'framer-motion';
import { useAudio, useSoundtrack } from './audio/AudioProvider';

// Centre of the circle inside the "R", as a fraction of the logo's width/height (measured from /logo.svg).
const R_CIRCLE = { x: 0.499, y: 0.3025 };
// Where the mascot settles, as a fraction of the viewport height.
const MASCOT_REST_Y = 0.44;
// The home page's music. PLACEHOLDER loop until the real (licensed) track lands.
const HOME_TRACK = '/audio/placeholder-loop.m4a';
// Mascot scale once he has become the record's centre label.
const LABEL_SCALE = 0.52;
// Spin speeds in degrees per second: idle, and playing (33⅓ rpm).
const SPIN_IDLE = 40;
const SPIN_PLAYING = 200;

export default function Hero() {
    const reduce = useReducedMotion();
    useSoundtrack(HOME_TRACK);
    const { enabled: playing, toggle } = useAudio();
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
    const emerge = useTransform(p, [0.05, 0.45], [0, 1], { clamp: true });
    const mascotX = useTransform(() => startX.get() * (1 - emerge.get()));
    const mascotY = useTransform(() => startY.get() * (1 - emerge.get()));

    // 2. He becomes a record: a grooved disc grows behind him while he shrinks
    //    onto its centre label. Once formed, the record (label and all) spins.
    const vinyl = useTransform(p, [0.5, 0.7], [0, 1], { clamp: true });
    const mascotScale = useTransform(() => emerge.get() * (1 - (1 - LABEL_SCALE) * vinyl.get()));
    const discScale = useTransform(vinyl, [0, 1], [0.35, 1]);
    const discOpacity = useTransform(vinyl, [0, 0.4], [0, 1]);

    const [formed, setFormed] = useState(false);
    useMotionValueEvent(vinyl, 'change', (v) => setFormed(v > 0.97));

    // Spin accrues while formed (faster while the music plays); un-formed, it
    // eases back upright so he turns back into the mascot the right way up.
    const spin = useMotionValue(0);
    useAnimationFrame((_, delta) => {
        const s = spin.get();
        if (formed && !reduce) spin.set(s + ((playing ? SPIN_PLAYING : SPIN_IDLE) * delta) / 1000);
        else if (s !== 0) {
            const upright = Math.round(s / 360) * 360;
            spin.set(Math.abs(upright - s) < 0.5 ? 0 : s + (upright - s) * 0.12);
        }
    });
    const wobble = useTransform(p, [0.05, 0.45], [-20, 0]); // wobble out of the R
    const mascotRotate = useTransform(() => wobble.get() + spin.get());

    // The wordmark steps back so the mascot has the stage.
    const logoOpacity = useTransform(p, [0.2, 0.55], [1, 0.1]);
    const logoScale = useTransform(p, [0, 0.55], [1, 0.92]);

    // 3. The tagline arrives once the record has formed.
    const taglineOpacity = useTransform(p, [0.72, 0.85], [0, 1]);
    const taglineY = useTransform(p, [0.72, 0.85], [24, 0]);
    const hintOpacity = useTransform(p, [0, 0.08], [1, 0]);

    return (
        <section ref={sectionRef} className="relative h-[340vh] -mt-24 mb-24">
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
                    {/* The record: grooves spin; the light's reflection on them stays put. */}
                    <motion.div
                        aria-hidden
                        className="absolute inset-0 rounded-full shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
                        style={{ scale: discScale, opacity: discOpacity }}
                    >
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{
                                rotate: spin,
                                background:
                                    'repeating-radial-gradient(circle at center, #0c0c0c 0px, #0c0c0c 2px, #1b1b1b 3px, #0c0c0c 4px)',
                            }}
                        />
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background:
                                    'conic-gradient(from 20deg, transparent 0 8%, rgba(255,255,255,0.10) 13%, transparent 19% 55%, rgba(255,255,255,0.07) 62%, transparent 68%)',
                            }}
                        />
                        {/* Centre label, in the sashiko indigo; his head is the label art. */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[42%] aspect-square rounded-full bg-[#2b3a8c] ring-4 ring-black/40" />
                    </motion.div>

                    <motion.img
                        src="/shRma_Sashiko.png"
                        alt="shRma Sashiko mascot"
                        style={{ x: mascotX, y: mascotY, scale: mascotScale, rotate: mascotRotate }}
                        className="relative w-full h-full object-contain drop-shadow-2xl"
                    />

                    {/* Tonearm: rests off the record, swings on while playing. */}
                    <motion.svg
                        aria-hidden
                        viewBox="0 0 100 100"
                        className="absolute -right-[6%] -top-[4%] w-[46%] h-[46%] overflow-visible"
                        style={{ opacity: discOpacity, originX: '82%', originY: '14%' }}
                        animate={{ rotate: playing ? 24 : 0 }}
                        transition={{ type: 'spring', stiffness: 90, damping: 14 }}
                    >
                        <circle cx="82" cy="14" r="9" className="fill-gray-300 dark:fill-gray-600" />
                        <circle cx="82" cy="14" r="3.5" className="fill-gray-500 dark:fill-gray-400" />
                        <path d="M82 14 L70 70 L50 92" className="stroke-gray-300 dark:stroke-gray-500" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                        <rect x="42" y="88" width="14" height="8" rx="2" transform="rotate(-40 49 92)" className="fill-gray-200 dark:fill-gray-400" />
                    </motion.svg>

                    {/* The record is the play button once it has formed. */}
                    <button
                        type="button"
                        onClick={toggle}
                        disabled={!formed}
                        aria-label={playing ? 'Lift the needle: pause the music' : 'Drop the needle: play the music'}
                        aria-pressed={playing}
                        className={`absolute inset-[6%] rounded-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${
                            formed ? 'pointer-events-auto' : 'pointer-events-none'
                        }`}
                    />
                    <AnimatePresence>
                        {formed && (
                            <motion.span
                                aria-hidden
                                className="absolute left-1/2 -bottom-2 -translate-x-1/2 translate-y-full whitespace-nowrap px-3 py-1.5 rounded-full border border-current/20 bg-white/70 dark:bg-black/60 backdrop-blur-sm font-mono text-[10px] md:text-xs tracking-[0.25em] text-gray-700 dark:text-gray-300"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                            >
                                {playing ? '❚❚ LIFT THE NEEDLE' : '▶ DROP THE NEEDLE'}
                            </motion.span>
                        )}
                    </AnimatePresence>
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
