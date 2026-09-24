'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
    AnimatePresence,
    motion,
    useMotionTemplate,
    useInView,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from 'framer-motion';
import type { SeriesMeta } from './content';
import { enableTilt, tiltX, tiltY, useDeviceTilt } from './useDeviceTilt';
import { GuideSpot } from '@/components/guide/Guide';

export type Piece = { url: string; caption?: string; story?: string; width: number; height: number };
export type SeriesData = SeriesMeta & { guide?: string; pieces: Piece[] };

type Selection = { series: number; piece: number };

// Let Sanity's CDN resize instead of the Next optimizer, which times out
// pulling some of the heavier original PNGs.
const sanityLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) =>
    `${src}?w=${width}&q=${quality ?? 80}&auto=format`;
const loaderFor = (url: string) => (url.startsWith('https://cdn.sanity.io/') ? sanityLoader : undefined);

// "031 - FLOrigin" -> { number: "031", title: "FLOrigin" }
function parseCaption(caption?: string) {
    const c = caption?.trim() ?? '';
    const m = c.match(/^(\d+)\s*[-–—.:]\s*(.+)$/);
    return m ? { number: m[1], title: m[2].trim() } : { number: undefined, title: c || undefined };
}

const pieceAlt = (piece: Piece, series: SeriesMeta, i: number) =>
    piece.caption?.trim() || `${series.title} piece ${i + 1}`;

// Collage placement, cycled per piece: grid span/start (6 columns on phones,
// 12 from md), a stagger offset, a resting tilt, and a scroll-drift factor.
// Class strings are literal so Tailwind can see them.
const LAYOUT = [
    { cls: 'col-span-5 col-start-1 md:col-span-4 md:col-start-1', rot: -3, drift: 0.5 },
    { cls: 'col-span-5 col-start-2 md:col-span-3 md:col-start-6 md:mt-32', rot: 4, drift: 1.2 },
    { cls: 'col-span-4 col-start-3 md:col-span-3 md:col-start-10 md:mt-8', rot: -2, drift: 0.8 },
    { cls: 'col-span-5 col-start-1 md:col-span-3 md:col-start-2 md:mt-12', rot: 3, drift: 1.1 },
    { cls: 'col-span-5 col-start-2 md:col-span-4 md:col-start-5 md:mt-40', rot: -4, drift: 0.6 },
    { cls: 'col-span-4 col-start-3 md:col-span-3 md:col-start-10 md:mt-16', rot: 2, drift: 1 },
];

const noop = () => () => {};

export default function Collection({ series }: { series: SeriesData[] }) {
    const [selected, setSelected] = useState<Selection | null>(null);
    // false during SSR and hydration, true after; gates the body portal.
    const mounted = useSyncExternalStore(noop, () => true, () => false);
    const reduce = useReducedMotion();
    const tilt = useDeviceTilt(!reduce);
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { amount: 0.1 });

    return (
        <div ref={ref} className="pb-24">
            {series.map((meta, n) =>
                meta.pieces.length ? (
                    <SeriesSection
                        key={meta.id}
                        meta={meta}
                        n={n}
                        tiltActive={tilt === 'active'}
                        onOpen={(i) => setSelected({ series: n, piece: i })}
                    />
                ) : null,
            )}

            {/* Portaled to <body>: the page wrapper's transform would
                otherwise pin this "fixed" overlay to the page, not the screen. */}
            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {selected && (
                            <PieceDetail
                                series={series}
                                selected={selected}
                                onChange={setSelected}
                                onClose={() => setSelected(null)}
                            />
                        )}
                    </AnimatePresence>,
                    document.body,
                )}

            {/* iOS only allows gyroscope access after a tap. */}
            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {tilt === 'needs-permission' && inView && !selected && (
                            <motion.button
                                type="button"
                                onClick={enableTilt}
                                className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-full border border-white/15 bg-[#141312]/90 backdrop-blur-md text-[#e6e1d6] font-mono text-xs tracking-[0.2em] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.9)]"
                                initial={{ y: 80, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 80, opacity: 0 }}
                            >
                                ✦ TILT TO PLAY
                            </motion.button>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </div>
    );
}

// One series: a drifting colour field in its accent/glow sets the mood,
// fading out at the edges so consecutive series blend as you scroll.
function SeriesSection({
    meta,
    n,
    tiltActive,
    onOpen,
}: {
    meta: SeriesData;
    n: number;
    tiltActive: boolean;
    onOpen: (i: number) => void;
}) {
    const reduce = useReducedMotion();
    const drift = (dx: number, dy: number, duration: number) =>
        reduce ? {} : { animate: { x: [0, dx, 0], y: [0, dy, 0] }, transition: { duration, repeat: Infinity, ease: 'easeInOut' as const } };

    return (
        <section id={meta.id} className="relative isolate py-24 md:py-36">
            {meta.guide && <GuideSpot id={`core:series:${meta.id}`} text={meta.guide} className="absolute top-[25%] left-0" />}
            <div
                aria-hidden
                className="absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
            >
                <motion.div
                    className="absolute -left-[20%] top-[5%] w-[80vw] aspect-square rounded-full opacity-45"
                    style={{ background: `radial-gradient(circle, ${meta.accent} 0%, transparent 62%)` }}
                    {...drift(80, 50, 19)}
                />
                <motion.div
                    className="absolute -right-[25%] top-[35%] w-[85vw] aspect-square rounded-full opacity-35"
                    style={{ background: `radial-gradient(circle, ${meta.glow} 0%, transparent 62%)` }}
                    {...drift(-70, -60, 23)}
                />
                <motion.div
                    className="absolute left-[25%] bottom-[0%] w-[55vw] aspect-square rounded-full opacity-25"
                    style={{ background: `radial-gradient(circle, ${meta.accent} 0%, transparent 60%)` }}
                    {...drift(50, -40, 17)}
                />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-16 md:mb-20">
                    <span className="font-mono text-xs tracking-[0.3em]" style={{ color: meta.accent }}>
                        SERIES {String(n + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-5xl md:text-8xl font-bold tracking-tighter">{meta.title}</h2>
                    {meta.blurb && (
                        <span className="basis-full md:basis-auto md:ml-auto text-[#e6e1d6]/60 max-w-sm">{meta.blurb}</span>
                    )}
                </div>

                <div className="grid grid-cols-6 md:grid-cols-12 gap-x-4 md:gap-x-8 gap-y-14 md:gap-y-20">
                    {meta.pieces.map((piece, i) => (
                        <PieceCard
                            key={piece.url}
                            piece={piece}
                            index={i}
                            series={meta}
                            layout={LAYOUT[i % LAYOUT.length]}
                            tiltActive={tiltActive}
                            onOpen={() => onOpen(i)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

// A trading card. At rest it sits slightly askew; on mouse hover it
// straightens, lifts, and tilts in 3D toward the cursor with a holographic
// sheen and glare. On phones, tilting the device drives the same 3D tilt and
// sheen. Hover also previews the title and story; click (or tap, or Enter)
// opens the detail view.
function PieceCard({
    piece,
    index,
    series,
    layout,
    tiltActive,
    onOpen,
}: {
    piece: Piece;
    index: number;
    series: SeriesMeta;
    layout: (typeof LAYOUT)[number];
    tiltActive: boolean;
    onOpen: () => void;
}) {
    const reduce = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const [hover, setHover] = useState(false);
    const story = piece.story?.trim();
    const { number, title } = parseCaption(piece.caption);
    const alt = pieceAlt(piece, series, index);

    // Pointer position over the card, 0..1 on each axis.
    const mx = useMotionValue(0.5);
    const my = useMotionValue(0.5);
    const spring = { stiffness: 180, damping: 18, mass: 0.6 };
    const rotateX = useSpring(useTransform(my, [0, 1], [14, -14]), spring);
    const rotateY = useSpring(useTransform(mx, [0, 1], [-16, 16]), spring);
    const px = useTransform(mx, (v) => `${v * 100}%`);
    const py = useTransform(my, (v) => `${v * 100}%`);
    const glare = useMotionTemplate`radial-gradient(circle at ${px} ${py}, rgba(255,255,255,0.5), rgba(255,255,255,0) 45%)`;
    const holoPosition = useMotionTemplate`${px} ${py}`;

    // Each card drifts at its own rate while scrolling.
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], [70 * layout.drift, -70 * layout.drift]);

    // Phone tilt stands in for the cursor.
    useEffect(() => {
        if (!tiltActive || reduce) return;
        mx.set(tiltX.get());
        my.set(tiltY.get());
        const offX = tiltX.on('change', (v) => mx.set(v));
        const offY = tiltY.on('change', (v) => my.set(v));
        return () => {
            offX();
            offY();
        };
    }, [tiltActive, reduce, mx, my]);
    const sheen = hover ? 1 : tiltActive && !reduce ? 0.7 : 0;

    const onMove = (e: React.PointerEvent) => {
        if (e.pointerType !== 'mouse' || reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
    };
    const onLeave = () => {
        setHover(false);
        mx.set(0.5);
        my.set(0.5);
    };

    return (
        // Outer: scroll drift. Middle: entrance. Inner: resting tilt + lift.
        <motion.div
            ref={ref}
            className={`relative ${layout.cls} ${hover ? 'z-20' : 'z-0'}`}
            style={reduce ? undefined : { y }}
        >
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
                <motion.div
                    animate={{ rotate: reduce || hover ? 0 : layout.rot, scale: hover ? 1.06 : 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    style={{ perspective: 900 }}
                >
                    <motion.button
                        type="button"
                        onClick={onOpen}
                        onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
                        onPointerMove={onMove}
                        onPointerLeave={onLeave}
                        aria-haspopup="dialog"
                        aria-label={`Open ${alt}`}
                        className="relative block w-full rounded-2xl p-[5px] text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2dcc0]"
                        style={{
                            rotateX: reduce ? 0 : rotateX,
                            rotateY: reduce ? 0 : rotateY,
                            transformStyle: 'preserve-3d',
                            background: `linear-gradient(145deg, ${series.accent}, #151515 45%, #151515 60%, ${series.glow})`,
                            boxShadow: hover
                                ? `0 40px 80px -30px ${series.accent}aa, 0 0 0 1px ${series.accent}55`
                                : '0 20px 40px -24px rgba(0,0,0,0.9)',
                            transition: 'box-shadow 0.4s ease',
                        }}
                    >
                        <span className="relative block rounded-[12px] overflow-hidden bg-black">
                            {/* Name strip, like a card's title bar */}
                            <span className="flex items-center gap-2 px-3 py-2 font-mono text-[10px] tracking-[0.15em] text-[#e6e1d6]/80 border-b border-white/10">
                                {number && <span style={{ color: series.accent }}>{number}</span>}
                                <span className="truncate uppercase">{title || series.title}</span>
                                {story && (
                                    <span
                                        className="ml-auto shrink-0 w-1.5 h-1.5 rounded-full"
                                        style={{ background: series.accent }}
                                        title="Has a story"
                                    />
                                )}
                            </span>

                            <span className="relative block">
                                <Image
                                    loader={loaderFor(piece.url)}
                                    src={piece.url}
                                    alt={alt}
                                    width={piece.width}
                                    height={piece.height}
                                    sizes="(min-width: 768px) 32vw, 70vw"
                                    className="w-full h-auto"
                                />

                                {/* Holographic foil */}
                                <motion.span
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                                    style={{
                                        opacity: sheen * 0.5,
                                        mixBlendMode: 'color-dodge',
                                        backgroundImage:
                                            'linear-gradient(115deg, transparent 20%, rgba(255,0,170,0.55) 32%, rgba(0,230,255,0.55) 42%, rgba(255,240,0,0.5) 52%, rgba(0,255,140,0.5) 62%, transparent 75%)',
                                        backgroundSize: '260% 260%',
                                        backgroundPosition: holoPosition,
                                    }}
                                />
                                {/* Glare following the cursor */}
                                <motion.span
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                                    style={{ opacity: sheen, mixBlendMode: 'soft-light', backgroundImage: glare }}
                                />

                                <AnimatePresence>
                                    {hover && (title || story) && (
                                        <motion.span
                                            className="absolute inset-x-0 bottom-0 block p-4 md:p-5 pt-16 bg-gradient-to-t from-black via-black/85 to-transparent"
                                            initial={{ opacity: 0, y: 24 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 24 }}
                                            transition={{ duration: 0.3, ease: 'easeOut' }}
                                        >
                                            <span className="block h-px w-8 mb-3" style={{ background: series.accent }} />
                                            {title && (
                                                <span className="block text-base md:text-lg font-semibold tracking-tight">{title}</span>
                                            )}
                                            {story && (
                                                <span className="mt-1 text-sm leading-relaxed text-[#e6e1d6]/85 line-clamp-3 whitespace-pre-line">
                                                    {story}
                                                </span>
                                            )}
                                            <span
                                                className="mt-3 inline-block font-mono text-[10px] tracking-[0.2em]"
                                                style={{ color: series.accent }}
                                            >
                                                {story ? 'READ MORE →' : 'VIEW →'}
                                            </span>
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </span>
                        </span>
                    </motion.button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

// Full view of one piece: art on the left, title and full story on the right
// (stacked on phones). Arrows step through the pieces of the same series.
function PieceDetail({
    series,
    selected,
    onChange,
    onClose,
}: {
    series: SeriesData[];
    selected: Selection;
    onChange: (s: Selection) => void;
    onClose: () => void;
}) {
    const meta = series[selected.series];
    const piece = meta.pieces[selected.piece];
    const count = meta.pieces.length;
    const { number, title } = parseCaption(piece.caption);
    const story = piece.story?.trim();
    const closeRef = useRef<HTMLButtonElement>(null);

    const step = useCallback(
        (d: number) => onChange({ series: selected.series, piece: (selected.piece + d + count) % count }),
        [onChange, selected, count],
    );

    // Lock page scroll, move focus in, and restore it on close.
    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        return () => {
            document.body.style.overflow = overflow;
            previous?.focus?.();
        };
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            else if (e.key === 'ArrowRight' && count > 1) step(1);
            else if (e.key === 'ArrowLeft' && count > 1) step(-1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose, step, count]);

    return (
        <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title || pieceAlt(piece, meta, selected.piece)}
            data-guide-hide="always"
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm overflow-y-auto text-[#e6e1d6]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="fixed top-5 right-5 z-10 w-11 h-11 rounded-full border border-[#e6e1d6]/30 bg-black/60 flex items-center justify-center hover:border-[#e6e1d6] transition-colors"
            >
                <X className="w-5 h-5" />
            </button>

            <div
                className="min-h-full max-w-[1400px] mx-auto px-6 md:px-12 py-20 grid md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] gap-8 md:gap-16 items-center"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={piece.url}
                        className="relative flex justify-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Image
                            loader={loaderFor(piece.url)}
                            src={piece.url}
                            alt={pieceAlt(piece, meta, selected.piece)}
                            width={piece.width}
                            height={piece.height}
                            sizes="(min-width: 768px) 60vw, 100vw"
                            className="w-auto h-auto max-w-full max-h-[60vh] md:max-h-[84vh] object-contain"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                <div className="md:py-8">
                    <span className="font-mono text-xs tracking-[0.3em]" style={{ color: meta.accent }}>
                        {meta.title.toUpperCase()}
                        {number ? ` · ${number}` : ''}
                    </span>
                    <h3 className="mt-4 text-3xl md:text-5xl font-bold tracking-tighter leading-[0.95]">
                        {title || 'Untitled'}
                    </h3>
                    <span className="block h-px w-10 my-6" style={{ background: meta.accent }} />
                    {story ? (
                        <p className="text-base md:text-lg leading-relaxed text-[#e6e1d6]/85 whitespace-pre-line">{story}</p>
                    ) : (
                        <p className="text-[#e6e1d6]/40 italic">No story yet.</p>
                    )}

                    {count > 1 && (
                        <div className="mt-10 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => step(-1)}
                                aria-label="Previous piece"
                                className="w-11 h-11 rounded-full border border-[#e6e1d6]/30 flex items-center justify-center hover:border-[#e6e1d6] transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => step(1)}
                                aria-label="Next piece"
                                className="w-11 h-11 rounded-full border border-[#e6e1d6]/30 flex items-center justify-center hover:border-[#e6e1d6] transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                            <span className="ml-2 font-mono text-xs tracking-[0.2em] text-[#e6e1d6]/50">
                                {selected.piece + 1} / {count}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
