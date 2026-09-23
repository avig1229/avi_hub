'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import {
    AnimatePresence,
    motion,
    useMotionTemplate,
    useReducedMotion,
    useScroll,
    useTransform,
    type MotionValue,
} from 'framer-motion';
import { useSoundtrack } from '@/components/audio/AudioProvider';
import {
    ANATOMY,
    EYE,
    NAILS,
    SERIES,
    SOUNDTRACK,
    SPINE,
    VERTEBRAE,
    pct,
    type AnatomyPart,
    type SeriesId,
} from './content';

export type Piece = { url: string; caption?: string; width: number; height: number };

// Let Sanity's CDN resize instead of the Next optimizer, which times out
// pulling some of the heavier original PNGs.
const sanityLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) =>
    `${src}?w=${width}&q=${quality ?? 80}&auto=format`;

export type SeriesData = { id: SeriesId; pieces: Piece[] };

export default function CoreExperience({
    year,
    story,
    series,
}: {
    year?: string;
    story: string[];
    series: SeriesData[];
}) {
    useSoundtrack(SOUNDTRACK);

    return (
        // Full-bleed black canvas, escaping the layout's padded <main>.
        <div
            data-dark-canvas
            className="relative left-1/2 w-screen -translate-x-1/2 -mt-24 bg-black text-[#e6e1d6]"
        >
            <Origin year={year} story={story} />
            <Anatomy />
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

function Origin({ year, story }: { year?: string; story: string[] }) {
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
            <section className="max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-24 grid md:grid-cols-2 gap-12 items-center">
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
                                index={i}
                                total={story.length}
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
    index,
    total,
    children,
}: {
    p: MotionValue<number>;
    from: number;
    to: number;
    last: boolean;
    index: number;
    total: number;
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
            <span className="font-mono text-xs tracking-[0.3em] text-[#e6e1d6]/40 mb-4">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
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

function Anatomy() {
    const [active, setActive] = useState<AnatomyPart['id'] | null>(null);
    const current = ANATOMY.find((a) => a.id === active);

    return (
        <section className="min-h-screen max-w-[1400px] mx-auto px-6 md:px-12 py-24 grid lg:grid-cols-[auto_1fr] gap-12 lg:gap-20 items-center">
            <div className="relative w-[min(100%,48.65vh)] lg:w-[59.77vh] aspect-[139/200] mx-auto">
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
                        onClick={() => setActive(active === a.id ? null : a.id)}
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

            <div className="max-w-xl">
                <span className="font-mono text-xs tracking-[0.3em] text-[#e6e1d6]/50">ANATOMY</span>
                <h2 className="mt-4 text-4xl md:text-6xl font-bold tracking-tighter leading-none">
                    One frame.
                    <br />
                    Every personality.
                </h2>
                <p className="mt-6 text-[#e6e1d6]/60">
                    Every piece in the collection shares this bare spine. Tap a part to see what it carries.
                </p>

                <div className="mt-10 flex flex-wrap gap-2">
                    {ANATOMY.map((a) => (
                        <button
                            key={a.id}
                            onClick={() => setActive(active === a.id ? null : a.id)}
                            aria-pressed={active === a.id}
                            className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                                active === a.id
                                    ? 'bg-[#f2dcc0] text-black border-[#f2dcc0]'
                                    : 'border-[#e6e1d6]/30 hover:border-[#e6e1d6]'
                            }`}
                        >
                            {a.label}
                        </button>
                    ))}
                </div>

                <div className="mt-8 min-h-[12rem]">
                    <AnimatePresence mode="wait">
                        {current && (
                            <motion.div
                                key={current.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                            >
                                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">{current.title}</h3>
                                <p className="mt-4 text-lg leading-relaxed text-[#e6e1d6]/80">{current.body}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------ Collection -- */
// Interim: a plain grid per series. Replaced by the pinned-spine layered
// sections once the layered exports exist.

function Collection({ series }: { series: SeriesData[] }) {
    return (
        <div className="pb-24">
            {SERIES.map((meta) => {
                const pieces = series.find((s) => s.id === meta.id)?.pieces ?? [];
                if (!pieces.length) return null;
                return (
                    <section key={meta.id} id={meta.id} className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
                        <div className="flex items-baseline gap-4 border-t border-[#e6e1d6]/15 pt-6 mb-12">
                            <span className="font-mono text-xs tracking-[0.3em]" style={{ color: meta.accent }}>
                                {meta.kicker.toUpperCase()}
                            </span>
                            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter">{meta.title}</h2>
                            <span className="hidden md:block ml-auto text-[#e6e1d6]/50">{meta.blurb}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                            {pieces.map((piece, i) => (
                                <motion.figure
                                    key={piece.url}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-10%' }}
                                    transition={{ duration: 0.6, delay: i * 0.08 }}
                                >
                                    <Image
                                        loader={piece.url.startsWith('https://cdn.sanity.io/') ? sanityLoader : undefined}
                                        src={piece.url}
                                        alt={piece.caption || `${meta.title} piece ${i + 1}`}
                                        width={piece.width}
                                        height={piece.height}
                                        sizes="(min-width: 768px) 30vw, 50vw"
                                        className="w-full h-auto"
                                    />
                                    {piece.caption && (
                                        <figcaption className="mt-3 text-sm text-[#e6e1d6]/60">{piece.caption}</figcaption>
                                    )}
                                </motion.figure>
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
