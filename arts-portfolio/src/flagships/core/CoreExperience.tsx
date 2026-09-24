'use client';

import { useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Image from 'next/image';
import {
    AnimatePresence,
    motion,
    useInView,
    useMotionTemplate,
    useReducedMotion,
    useScroll,
    useTransform,
    type MotionValue,
} from 'framer-motion';
import { useSoundtrack } from '@/components/audio/AudioProvider';
import Collection, { type SeriesData } from './Collection';
import { GuideSpot } from '@/components/guide/Guide';
import {
    ANATOMY,
    EYE,
    NAILS,
    SOUNDTRACK,
    SPINE,
    VERTEBRAE,
    pct,
    type AnatomyPart,
} from './content';


export default function CoreExperience({
    year,
    story,
    series,
    guide,
}: {
    year?: string;
    story: string[];
    series: SeriesData[];
    guide: { origin?: string; anatomy?: string };
}) {
    useSoundtrack(SOUNDTRACK);

    return (
        // Full-bleed black canvas, escaping the layout's padded <main>.
        <div
            data-dark-canvas
            className="relative left-1/2 w-screen -translate-x-1/2 -mt-24 bg-black text-[#e6e1d6]"
        >
            <Origin year={year} story={story} guide={guide.origin} />
            <Anatomy guide={guide.anatomy} />
            <Collection series={series} />
        </div>
    );
}

/* ---------------------------------------------------------------- Origin -- */

function SpineImage({ priority }: { priority?: boolean }) {
    return (
        <Image
            src={SPINE.src}
            alt="Outline of the CORE spine: an eye resting on a column of vertebrae"
            fill
            priority={priority}
            sizes="(min-width: 768px) 40vw, 60vw"
            className="object-contain select-none"
            draggable={false}
        />
    );
}

function Origin({ year, story, guide }: { year?: string; story: string[]; guide?: string }) {
    const ref = useRef<HTMLElement>(null);
    const reduce = useReducedMotion();
    const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

    // Title card fades, then the spine is traced top to bottom like a scan.
    const titleOpacity = useTransform(p, [0, 0.08], [1, 0]);
    const titleY = useTransform(p, [0, 0.08], [0, -60]);
    const hidden = useTransform(p, [0.04, 0.55], [100, 0]);
    const clipPath = useMotionTemplate`inset(0 0 ${hidden}% 0)`;
    const scanTop = useTransform(hidden, (v) => `${100 - v}%`);
    const scanOpacity = useTransform(p, [0.04, 0.07, 0.52, 0.56], [0, 1, 1, 0]);

    // Story paragraphs take turns across the rest of the scroll.
    const start = 0.1;
    const seg = (0.96 - start) / Math.max(story.length, 1);
    const nailIndex = story.findIndex((s) => /nail/i.test(s));

    if (reduce) {
        return (
            <section className="relative max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-24 grid md:grid-cols-2 gap-12 items-center">
                {guide && <GuideSpot id="core:origin" text={guide} className="absolute top-0 left-0" />}
                <div className="space-y-6">
                    <h1 className="text-[18vw] md:text-[10vw] font-bold tracking-tighter leading-none">CORE</h1>
                    {story.map((s, i) => (
                        <p key={i} className="text-lg leading-relaxed text-[#e6e1d6]/80">{s}</p>
                    ))}
                </div>
                <div className="relative h-[80vh] aspect-[139/200] mx-auto">
                    <SpineImage priority />
                </div>
            </section>
        );
    }

    return (
        <section ref={ref} style={{ height: `${140 + story.length * 80}vh` }} className="relative">
            {/* Just after the title card fades. */}
            {guide && <GuideSpot id="core:origin" text={guide} className="absolute top-[18%] left-0" />}
            <div className="sticky top-0 h-screen overflow-hidden">
                <div className="h-full max-w-[1400px] mx-auto px-6 md:px-12 grid grid-rows-[1fr_auto] md:grid-rows-1 md:grid-cols-2 items-center gap-6 md:gap-16 pt-20 pb-8">
                    {/* Spine */}
                    <div className="relative h-full md:h-[84vh] max-h-[84vh] aspect-[139/200] mx-auto md:order-2">
                        <motion.div className="absolute inset-0" style={{ clipPath }}>
                            <SpineImage priority />
                            {nailIndex >= 0 && (
                                <NailGlow
                                    p={p}
                                    from={start + nailIndex * seg}
                                    to={start + (nailIndex + 1) * seg}
                                />
                            )}
                        </motion.div>
                        <motion.div
                            aria-hidden
                            className="absolute -inset-x-[15%] h-px bg-gradient-to-r from-transparent via-[#f2dcc0] to-transparent shadow-[0_0_24px_4px_rgba(242,220,192,0.45)]"
                            style={{ top: scanTop, opacity: scanOpacity }}
                        />
                    </div>

                    {/* Story */}
                    <div className="relative h-[34vh] md:h-[50vh] md:order-1">
                        {story.map((text, i) => (
                            <StoryLine
                                key={i}
                                p={p}
                                from={start + i * seg}
                                to={start + (i + 1) * seg}
                                last={i === story.length - 1}
                            >
                                {text}
                            </StoryLine>
                        ))}
                    </div>
                </div>

                {/* Title card */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                    style={{ opacity: titleOpacity, y: titleY }}
                >
                    <span className="font-mono text-xs tracking-[0.4em] text-[#e6e1d6]/60 mb-4">
                        SHRMA · COLLECTION{year ? ` · ${year}` : ''}
                    </span>
                    <h1 className="text-[28vw] md:text-[18vw] font-bold tracking-tighter leading-[0.8]">CORE</h1>
                    <span className="mt-10 font-mono text-[10px] tracking-[0.4em] text-[#e6e1d6]/50 animate-pulse">
                        SCROLL TO BEGIN
                    </span>
                </motion.div>
            </div>
        </section>
    );
}

function StoryLine({
    p,
    from,
    to,
    last,
    children,
}: {
    p: MotionValue<number>;
    from: number;
    to: number;
    last: boolean;
    children: React.ReactNode;
}) {
    const fade = (to - from) * 0.25;
    const opacity = useTransform(
        p,
        last ? [from, from + fade] : [from, from + fade, to - fade, to],
        last ? [0, 1] : [0, 1, 1, 0],
    );
    const y = useTransform(p, [from, from + fade], [24, 0]);

    return (
        <motion.div className="absolute inset-0 flex flex-col justify-center" style={{ opacity, y }}>
            <p className="text-xl md:text-3xl leading-snug md:leading-tight font-medium tracking-tight max-w-[32ch]">
                {children}
            </p>
        </motion.div>
    );
}

// While the story talks about the nails, the nails light up.
function NailGlow({ p, from, to }: { p: MotionValue<number>; from: number; to: number }) {
    const opacity = useTransform(p, [from, from + 0.02, to - 0.02, to], [0, 1, 1, 0]);
    return (
        <motion.div className="absolute inset-0" style={{ opacity }} aria-hidden>
            {NAILS.map((n, i) => (
                <Ring key={i} at={n} size="4.5%" color="#ff5a4e" />
            ))}
        </motion.div>
    );
}

/* --------------------------------------------------------------- Anatomy -- */

function Ring({ at, size, color, delay = 0 }: { at: typeof EYE; size: string; color: string; delay?: number }) {
    return (
        <span
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ ...pct(at), width: size, aspectRatio: '1' }}
        >
            <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: color, opacity: 0.45, animationDelay: `${delay}s`, animationDuration: '1.8s' }}
            />
            <span className="absolute inset-[20%] rounded-full" style={{ background: color, boxShadow: `0 0 16px ${color}` }} />
        </span>
    );
}

function Highlight({ part }: { part: AnatomyPart['id'] }) {
    if (part === 'nails') {
        return NAILS.map((n, i) => <Ring key={i} at={n} size="5%" color="#ff5a4e" delay={i * 0.12} />);
    }
    if (part === 'eye') {
        return (
            <span
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                    ...pct(EYE),
                    width: '34%',
                    aspectRatio: '1',
                    background: 'radial-gradient(circle, rgba(120,190,255,0.45) 0%, rgba(120,190,255,0) 70%)',
                }}
            />
        );
    }
    return VERTEBRAE.map((v, i) => (
        <motion.span
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[40%]"
            style={{
                ...pct(v),
                width: '34%',
                height: '9%',
                background: 'radial-gradient(ellipse, rgba(242,220,192,0.4) 0%, rgba(242,220,192,0) 70%)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
        />
    ));
}

const noop = () => () => {};

function Anatomy({ guide }: { guide?: string }) {
    const [active, setActive] = useState<AnatomyPart['id'] | null>(null);
    const current = ANATOMY.find((a) => a.id === active);
    const sectionRef = useRef<HTMLElement>(null);
    const inView = useInView(sectionRef, { amount: 0.3 });
    const mounted = useSyncExternalStore(noop, () => true, () => false);

    // Tapping the active part again clears it.
    const select = (id: AnatomyPart['id']) => setActive(active === id ? null : id);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen max-w-[1400px] mx-auto px-6 md:px-12 pt-24 pb-36 sm:py-24 grid sm:grid-cols-[auto_1fr] gap-8 sm:gap-8 md:gap-12 lg:gap-20 items-center"
        >
            {guide && <GuideSpot id="core:anatomy" text={guide} className="absolute top-[30%] left-0" />}
            <div className="relative w-[min(100%,41.7vh)] sm:w-[min(40vw,59.77vh)] aspect-[139/200] mx-auto">
                <SpineImage />
                <AnimatePresence mode="wait">
                    {active && (
                        <motion.div
                            key={active}
                            className="absolute inset-0 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Highlight part={active} />
                        </motion.div>
                    )}
                </AnimatePresence>
                {ANATOMY.map((a) => (
                    <button
                        key={a.id}
                        onClick={() => select(a.id)}
                        aria-label={a.label}
                        aria-pressed={active === a.id}
                        className="group absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center"
                        style={pct(a.hotspot)}
                    >
                        <span
                            className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-sm leading-none transition-all ${
                                active === a.id
                                    ? 'bg-[#f2dcc0] text-black border-[#f2dcc0] rotate-45'
                                    : 'bg-black/60 border-[#f2dcc0] text-[#f2dcc0] group-hover:scale-125'
                            }`}
                        >
                            +
                        </span>
                    </button>
                ))}
            </div>

            {/* Heading sits above the spine on phones, beside it from sm. */}
            <div className="max-w-xl order-first sm:order-none">
                <span className="font-mono text-xs tracking-[0.3em] text-[#e6e1d6]/50">ANATOMY</span>
                <h2 className="mt-3 sm:mt-4 text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-none">
                    One frame.
                    <br />
                    Every personality.
                </h2>
                <p className="mt-3 sm:mt-4 md:mt-6 text-sm md:text-base text-[#e6e1d6]/60">
                    Every piece in the collection shares this bare spine. Tap a part to see what it carries.
                </p>

                <div className="flex mt-5 sm:mt-6 md:mt-10 flex-wrap gap-2">
                    {ANATOMY.map((a) => (
                        <PartButton key={a.id} part={a} active={active === a.id} onClick={() => select(a.id)} />
                    ))}
                </div>

                {/* From sm up the story shows inline; phones get the pop-up. */}
                <div className="hidden sm:block mt-6 md:mt-8 min-h-[12rem]">
                    <AnimatePresence mode="wait">
                        {current && (
                            <motion.div
                                key={current.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                            >
                                <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">{current.title}</h3>
                                <p className="mt-4 text-base lg:text-lg leading-relaxed text-[#e6e1d6]/80">{current.body}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Portaled: the page wrapper's transform breaks position: fixed. */}
            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {inView && current && (
                            <AnatomySheet key={current.id} part={current} onClose={() => setActive(null)} />
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </section>
    );
}

function PartButton({
    part,
    active,
    onClick,
}: {
    part: AnatomyPart;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            aria-pressed={active}
            className={`shrink-0 rounded-full border px-3 md:px-4 py-2 text-sm transition-colors ${
                active ? 'bg-[#f2dcc0] text-black border-[#f2dcc0]' : 'border-[#e6e1d6]/30 hover:border-[#e6e1d6]'
            }`}
        >
            {part.label}
        </button>
    );
}

// Phones only: a pop-up pinned to the bottom of the screen with the selected
// part's story, so it reads alongside the spine. Closing clears the part.
function AnatomySheet({ part, onClose }: { part: AnatomyPart; onClose: () => void }) {
    return (
        <motion.div
            role="dialog"
            aria-label={part.title}
            data-guide-hide="phone"
            className="sm:hidden fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-white/10 bg-[#141312]/90 backdrop-blur-md text-[#e6e1d6] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.9)]"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        >
            <div className="flex items-start gap-3 p-4 pr-3">
                <div className="min-w-0 flex-1 max-h-[45vh] overflow-y-auto">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-[#e6e1d6]/50">
                        {part.label.toUpperCase()}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold tracking-tight">{part.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#e6e1d6]/80">{part.body}</p>
                </div>
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center border border-[#e6e1d6]/20"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}
