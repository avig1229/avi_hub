'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import Model3D from './Model3D';
import { serif } from './fonts';
import { arcade } from '@/components/arcade';
import Kid from '@/components/room/Kid';
import { ERAS, LEVELS, sees, type Detail, type Img, type Intro, type Level, type Piece, type Season } from './content';

// The shRma page, as a lookbook: a cover, a foreword, "how geeky are you with
// design?", a table of contents, then the seasons as chapters (Chapter I:
// Meraki; Chapter II: shRma). The road is a metaphor here, in the words;
// the visitor's level decides how much process each chapter shows.

const LEVEL_KEY = 'shrma-geek-level';
const LEVEL_TEXT: Record<Level, { name: string; tag: string; kid: string }> = {
    low: { name: 'Low', tag: 'Just the vibes: the pieces and the pictures.', kid: 'Chill. Scenic route it is.' },
    mid: { name: 'Mid', tag: 'Show me how: the stories, moodboards and sketches.', kid: "Nice. You'll see how it's made." },
    high: { name: 'High AF', tag: 'Give me everything: every iteration, doc and spec.', kid: "Oh, you're one of us. Buckle up." },
};

// The book's paper, ink and craft accents.
const PAPER = '#F1EBE0';
const INK = '#1C1A17';
const RED = '#A8221B';

const smallCaps = 'font-sans text-[11px] uppercase tracking-[0.22em]';
const src = (img: Img, w: number) => (img.src.includes('cdn.sanity.io') ? `${img.src}?w=${w}&auto=format&q=80` : img.src);
const pad = (n: number) => String(n).padStart(2, '0');

// Where pictures will go once they're exported: a quiet frame, not a gap.
function ToCome({ ink, label = 'Photographs to come', className = '' }: { ink: string; label?: string; className?: string }) {
    return (
        <div className={`flex items-center justify-center border ${className}`} style={{ borderColor: `${ink}33`, background: `${ink}08` }}>
            <span className={`${smallCaps} opacity-50`}>{label}</span>
        </div>
    );
}

export default function ShrmaExperience({ intro, seasons }: { intro: Intro; seasons: Season[] }) {
    const reduce = useReducedMotion();
    const [level, setLevelState] = useState<Level | null>(null);
    const [lightbox, setLightbox] = useState<Img | null>(null);
    const contentsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const id = requestAnimationFrame(() => {
            try {
                const saved = localStorage.getItem(LEVEL_KEY) as Level | null;
                if (saved && LEVELS.includes(saved)) setLevelState(saved);
            } catch {}
        });
        return () => cancelAnimationFrame(id);
    }, []);

    const setLevel = useCallback((l: Level) => {
        setLevelState(l);
        try {
            localStorage.setItem(LEVEL_KEY, l);
        } catch {}
    }, []);

    const choose = (l: Level) => {
        const first = level === null;
        setLevel(l);
        if (first) window.setTimeout(() => contentsRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }), 350);
    };

    const view = level ?? 'low';
    const eras = (['meraki', 'shrma'] as const).filter((e) => seasons.some((s) => s.era === e));

    return (
        <div className="-mt-24 -mx-6 md:-mx-12" style={{ background: PAPER, color: INK }}>
            <Cover intro={intro} />
            <Foreword intro={intro} level={level} onOpen={setLightbox} />
            <TheQuestion level={level} onChoose={choose} />

            {level && (
                <>
                    <Contents ref={contentsRef} seasons={seasons} eras={eras} />
                    {eras.map((era) => (
                        <div key={era}>
                            <PartOpener era={era} />
                            {seasons
                                .filter((s) => s.era === era)
                                .map((s) => (
                                    <Chapter key={s.id} season={s} number={seasons.indexOf(s) + 1} level={view} onOpen={setLightbox} />
                                ))}
                        </div>
                    ))}
                    <Colophon />
                    <DepthSwitch level={view} onChange={setLevel} />
                </>
            )}

            <AnimatePresence>
                {lightbox && (
                    <motion.button
                        type="button"
                        onClick={() => setLightbox(null)}
                        aria-label="Close image"
                        className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 cursor-zoom-out"
                        style={{ background: 'rgba(20,18,16,0.94)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <img src={src(lightbox, 2000)} alt={lightbox.caption ?? ''} className="max-w-full max-h-[85svh] object-contain" />
                        {lightbox.caption && <p className={`${smallCaps} mt-4 text-white/60`}>{lightbox.caption}</p>}
                        <X className="absolute top-5 right-5 w-6 h-6 text-white/60" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Cover and foreword ──────────────────────────────────────────────────────

function Cover({ intro }: { intro: Intro }) {
    const reduce = useReducedMotion();
    const poster = intro.logo ? src(intro.logo, 2400) : undefined;

    // Play only the middle of the video: from videoStart until videoEndTrim
    // seconds before the end, then loop back (skipped for very short clips).
    const range = (v: HTMLVideoElement) => {
        const start = Math.max(0, intro.videoStart);
        const end = v.duration - Math.max(0, intro.videoEndTrim);
        return Number.isFinite(end) && end - start > 2 ? { start, end } : { start: 0, end: v.duration };
    };
    const toStart = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        e.currentTarget.currentTime = range(e.currentTarget).start;
    };
    const keepInRange = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const v = e.currentTarget;
        const { start, end } = range(v);
        if (v.currentTime >= end || v.currentTime < start - 0.5) {
            v.currentTime = start;
            v.play().catch(() => {});
        }
    };
    return (
        <section aria-label="shRma" className="relative h-svh min-h-[34rem] overflow-hidden bg-[#120E0C] text-[#F1EBE0]">
            {/* The logo process, playing quietly behind the cover (a still for reduced motion). */}
            {intro.video && !reduce ? (
                <video
                    src={intro.video}
                    poster={poster}
                    autoPlay
                    muted
                    playsInline
                    onLoadedMetadata={toStart}
                    onTimeUpdate={keepInRange}
                    onEnded={keepInRange}
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                poster && <img src={poster} alt="The shRma logo" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />
            <div className="absolute inset-x-0 bottom-0 px-6 md:px-16 pb-10 md:pb-14 flex items-end justify-between gap-6">
                <div>
                    <p className={`${smallCaps} opacity-80`}>A lookbook · 2024 —</p>
                    <h1 className={`${serif.className} mt-2 text-7xl md:text-[9rem] leading-[0.85] font-medium italic`}>{intro.headline}</h1>
                </div>
                <p className={`${smallCaps} hidden md:block opacity-70 pb-3`}>Scroll to begin</p>
            </div>
        </section>
    );
}

function Foreword({ intro, level, onOpen }: { intro: Intro; level: Level | null; onOpen: (i: Img) => void }) {
    const details = level ? intro.details.filter((d) => sees(level, d.level)) : [];
    const [first, ...rest] = intro.text;
    return (
        <section aria-label="Foreword" className="px-6 md:px-16 py-20 md:py-32">
            <div className="grid md:grid-cols-12 gap-8">
                <p className={`${smallCaps} md:col-span-3 pt-3`} style={{ color: RED }}>
                    Foreword
                </p>
                <div className={`${serif.className} md:col-span-8 space-y-6 text-2xl md:text-[2rem] leading-[1.35]`}>
                    {first && (
                        <p>
                            <span className="float-left mr-3 mt-2 text-7xl md:text-8xl leading-[0.7] italic" style={{ color: RED }}>
                                {first.charAt(0)}
                            </span>
                            {first.slice(1)}
                        </p>
                    )}
                    {rest.map((p, i) => (
                        <p key={i}>{p}</p>
                    ))}
                    <p className="italic opacity-70">— Avi</p>
                </div>
            </div>
            {details.length > 0 && (
                <div className="mt-20 md:mt-28 space-y-20">
                    {details.map((d, i) => (
                        <Note key={i} detail={d} accent={RED} onOpen={onOpen} />
                    ))}
                </div>
            )}
        </section>
    );
}

// ── "How geeky are you with design?" ────────────────────────────────────────

function TheQuestion({ level, onChoose }: { level: Level | null; onChoose: (l: Level) => void }) {
    const reduce = useReducedMotion();
    const [hover, setHover] = useState<Level | null>(null);
    const shown = hover ?? level;
    const rank = shown ? LEVELS.indexOf(shown) + 1 : 0;

    // Third Eye gets more excited the geekier you go: standing, walking in
    // place, then hopping.
    const [step, setStep] = useState(0);
    const moving = !reduce && (shown === 'mid' || shown === 'high');
    useEffect(() => {
        if (!moving) return;
        const id = window.setInterval(() => setStep((n) => n + 1), shown === 'high' ? 90 : 170);
        return () => window.clearInterval(id);
    }, [moving, shown]);

    return (
        <section aria-label="How geeky are you with design?" className="border-y px-6 md:px-16 py-20 md:py-28 text-center" style={{ borderColor: `${INK}22` }}>
            <p className={smallCaps} style={{ color: RED }}>
                Before we begin
            </p>
            <h2 className={`${serif.className} mt-5 text-4xl md:text-7xl leading-[1.05] italic font-normal`}>
                How geeky are you
                <br />
                with design?
            </h2>

            {/* Third Eye hosts the question */}
            <div className="mt-10 md:mt-12 flex flex-col items-center">
                <div className="relative max-w-[17rem] rounded-2xl border-2 bg-white/70 px-4 py-3 text-sm md:text-base leading-snug" style={{ borderColor: `${INK}22` }}>
                    <span className={`${arcade.className} absolute -top-2.5 left-4 px-2 py-0.5 rounded-full text-[8px] uppercase`} style={{ background: '#F2C14E', color: INK }}>
                        Third Eye
                    </span>
                    {shown ? LEVEL_TEXT[shown].kid : "Pick honestly. I won't judge. Much."}
                    <span
                        aria-hidden
                        className="absolute -bottom-[8px] left-1/2 w-3.5 h-3.5 -translate-x-1/2 rotate-45 border-r-2 border-b-2 bg-[#F8F5EF]"
                        style={{ borderColor: `${INK}22` }}
                    />
                </div>
                <motion.div
                    className="mt-4 w-16 md:w-20 aspect-[21/34]"
                    animate={shown === 'high' && !reduce ? { y: [0, -10, 0] } : { y: 0 }}
                    transition={shown === 'high' ? { duration: 0.45, repeat: Infinity, ease: 'easeOut' } : { duration: 0.2 }}
                >
                    <Kid dir="S" walking={moving} step={step} />
                </motion.div>
            </div>

            {/* The choices, as stamps */}
            <div role="radiogroup" aria-label="Geek level" className="mt-8 flex flex-wrap justify-center gap-3 md:gap-5">
                {LEVELS.map((l, i) => {
                    const on = level === l;
                    return (
                        <motion.button
                            key={l}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => onChoose(l)}
                            onMouseEnter={() => setHover(l)}
                            onMouseLeave={() => setHover(null)}
                            onFocus={() => setHover(l)}
                            onBlur={() => setHover(null)}
                            whileHover={reduce ? undefined : { rotate: i === 1 ? 2 : -2, scale: 1.04 }}
                            whileTap={reduce ? undefined : { scale: 0.96 }}
                            className={`${serif.className} rounded-full border-2 px-7 md:px-9 py-2.5 md:py-3 text-2xl md:text-4xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
                            style={{
                                borderColor: on ? RED : `${INK}55`,
                                background: on ? RED : 'transparent',
                                color: on ? PAPER : INK,
                            }}
                        >
                            {LEVEL_TEXT[l].name}
                        </motion.button>
                    );
                })}
            </div>
            <p className="mt-6 min-h-[1.5em] text-base md:text-lg opacity-70">{shown ? LEVEL_TEXT[shown].tag : 'You can change it anytime.'}</p>

            {/* The geek-o-meter */}
            <div className={`${arcade.className} mt-6 inline-flex items-center gap-3 text-[8px] md:text-[9px] uppercase tracking-widest opacity-70`} aria-hidden>
                Geek-o-meter
                <span className="flex gap-1">
                    {[1, 2, 3].map((n) => (
                        <span key={n} className="w-5 h-2.5 border" style={{ borderColor: INK, background: n <= rank ? RED : 'transparent' }} />
                    ))}
                </span>
            </div>
        </section>
    );
}

// ── Contents ────────────────────────────────────────────────────────────────

function Contents({ ref, seasons, eras }: { ref: React.Ref<HTMLDivElement>; seasons: Season[]; eras: ('meraki' | 'shrma')[] }) {
    return (
        <section ref={ref} aria-label="Contents" className="px-6 md:px-16 py-20 md:py-28 scroll-mt-0">
            <div className="grid md:grid-cols-12 gap-8">
                <p className={`${smallCaps} md:col-span-3 pt-2`} style={{ color: RED }}>
                    Contents
                </p>
                <div className="md:col-span-8 space-y-10">
                    {eras.map((era) => (
                        <div key={era}>
                            <p className={`${smallCaps} opacity-60`}>
                                {ERAS[era].chapter} · {ERAS[era].name}
                            </p>
                            <ol className="mt-3">
                                {seasons
                                    .filter((s) => s.era === era)
                                    .map((s) => (
                                        <li key={s.id}>
                                            <a href={`#${s.id}`} className="group flex items-baseline gap-4 py-2.5 border-b" style={{ borderColor: `${INK}1A` }}>
                                                <span className={`${serif.className} w-10 text-xl italic opacity-60`}>{pad(seasons.indexOf(s) + 1)}</span>
                                                <span className={`${serif.className} text-2xl md:text-3xl group-hover:italic`}>{s.name}</span>
                                                <span className="flex-1 border-b border-dotted translate-y-[-0.3em]" style={{ borderColor: `${INK}40` }} />
                                                <span className={`${smallCaps} opacity-60 text-right`}>{s.status === 'concept' ? 'Concept' : s.label ?? s.date}</span>
                                            </a>
                                        </li>
                                    ))}
                            </ol>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Part openers and chapters ───────────────────────────────────────────────

function PartOpener({ era }: { era: 'meraki' | 'shrma' }) {
    const e = ERAS[era];
    return (
        <section aria-label={`${e.chapter}: ${e.name}`} className="relative min-h-[80svh] flex flex-col justify-end px-6 md:px-16 py-16 md:py-24 bg-[#1C1A17] text-[#F1EBE0] overflow-hidden">
            {e.hanzi && (
                <span
                    aria-hidden
                    className="absolute right-6 md:right-16 top-12 text-5xl md:text-7xl tracking-[0.3em] opacity-25"
                    style={{ writingMode: 'vertical-rl' }}
                >
                    {e.hanzi}
                </span>
            )}
            <p className={smallCaps} style={{ color: '#C9A45C' }}>
                {e.chapter}
            </p>
            <h2 className={`${serif.className} mt-3 text-7xl md:text-[10rem] leading-[0.85] italic font-medium`}>{e.name}</h2>
            <p className="mt-6 max-w-xl text-base md:text-lg opacity-70">{e.blurb}</p>
        </section>
    );
}

function Chapter({ season, number, level, onOpen }: { season: Season; number: number; level: Level; onOpen: (i: Img) => void }) {
    const { palette: c } = season;
    const keyIndex = Math.max(0, season.pieces.findIndex((p) => p.key));
    const [active, setActive] = useState(keyIndex);
    const piece = season.pieces[active];
    const details = season.details.filter((d) => sees(level, d.level));
    const concept = season.status === 'concept';
    const hero = season.keyVisuals[0];

    return (
        <section id={season.id} aria-label={season.name} className="relative scroll-mt-16" style={{ background: c.bg, color: c.ink }}>
            {/* Chapter opener */}
            <div className="relative grid lg:grid-cols-12 gap-10 px-6 md:px-16 pt-20 md:pt-28 pb-12">
                {season.hanzi && (
                    <span
                        aria-hidden
                        className="absolute right-4 md:right-8 top-20 text-3xl md:text-5xl tracking-[0.35em]"
                        style={{ writingMode: 'vertical-rl', color: c.accent, opacity: 0.55 }}
                    >
                        {season.hanzi}
                    </span>
                )}
                <div className="lg:col-span-5 lg:pt-6">
                    <p className={`${serif.className} text-8xl md:text-[9rem] leading-none italic`} style={{ color: c.accent }}>
                        {pad(number)}
                    </p>
                    <p className={`${smallCaps} mt-6 opacity-75`}>
                        {[season.label, season.date].filter(Boolean).join('  ·  ')}
                        {concept && ' · Concept, coming soon'}
                    </p>
                    <h2 className={`${serif.className} mt-3 text-5xl md:text-7xl leading-[0.95] font-medium`}>{season.name}</h2>
                    {season.oneLiner && <p className={`${serif.className} mt-6 max-w-md text-xl md:text-2xl leading-snug italic opacity-85`}>{season.oneLiner}</p>}
                </div>
                {hero ? (
                    <button type="button" onClick={() => onOpen(hero)} className="lg:col-span-7 block cursor-zoom-in pr-6 md:pr-10">
                        <img src={src(hero, 1600)} alt={hero.caption ?? season.name} className="w-full h-auto" loading="lazy" />
                        {hero.caption && <span className={`${smallCaps} mt-3 block text-left opacity-60`}>{hero.caption}</span>}
                    </button>
                ) : (
                    <div className="lg:col-span-7 pr-6 md:pr-10">
                        <ToCome ink={c.ink} label={concept ? 'Visuals in the making' : 'Campaign photographs to come'} className="aspect-[4/5] md:aspect-[5/4]" />
                    </div>
                )}
            </div>

            {/* More key visuals, full width */}
            {season.keyVisuals.slice(1).map((img, i) => (
                <button key={i} type="button" onClick={() => onOpen(img)} className="block w-full px-6 md:px-16 py-6 cursor-zoom-in">
                    <img src={src(img, 1800)} alt={img.caption ?? ''} className="w-full max-h-[90svh] object-contain" loading="lazy" />
                    {img.caption && <span className={`${smallCaps} mt-3 block opacity-60`}>{img.caption}</span>}
                </button>
            ))}

            {/* The pieces: an index beside the piece */}
            {piece && (
                <div className="grid lg:grid-cols-12 gap-10 px-6 md:px-16 py-16 md:py-20 border-t" style={{ borderColor: `${c.ink}22` }}>
                    <div className="lg:col-span-4">
                        <p className={smallCaps} style={{ color: c.accent }}>
                            The pieces
                        </p>
                        <ol className="mt-5">
                            {season.pieces.map((p, i) => (
                                <li key={p.name}>
                                    <button
                                        type="button"
                                        onClick={() => setActive(i)}
                                        aria-pressed={i === active}
                                        className={`${serif.className} w-full flex items-baseline gap-4 py-3 border-b text-left text-2xl md:text-3xl transition-opacity ${
                                            i === active ? 'opacity-100 italic' : 'opacity-50 hover:opacity-80'
                                        }`}
                                        style={{ borderColor: `${c.ink}22` }}
                                    >
                                        <span className="text-base opacity-70 not-italic">{['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'][i] ?? i + 1}.</span>
                                        {p.name}
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div className="lg:col-span-8">
                        <PieceViewer piece={piece} level={level} accent={c.accent} ink={c.ink} onOpen={onOpen} />
                    </div>
                </div>
            )}

            {/* Worn / event photos */}
            {season.photos.length > 0 && (
                <div className="flex gap-4 overflow-x-auto px-6 md:px-16 pb-16">
                    {season.photos.map((img, i) => (
                        <button key={i} type="button" onClick={() => onOpen(img)} className="shrink-0 h-64 md:h-96 cursor-zoom-in">
                            <img src={src(img, 900)} alt={img.caption ?? ''} className="h-full w-auto" loading="lazy" />
                        </button>
                    ))}
                </div>
            )}

            {/* Notes, by level */}
            <AnimatePresence initial={false}>
                {details.length > 0 && (
                    <motion.div
                        key={level}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="px-6 md:px-16 py-16 md:py-20 space-y-20 border-t"
                        style={{ borderColor: `${c.ink}22` }}
                    >
                        {details.map((d, i) => (
                            <Note key={i} detail={d} accent={c.accent} onOpen={onOpen} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Folio */}
            <p className={`${smallCaps} text-center pb-10 opacity-50`}>
                — {pad(number)} · {season.name} —
            </p>
        </section>
    );
}

function PieceViewer({
    piece,
    level,
    accent,
    ink,
    onOpen,
}: {
    piece: Piece;
    level: Level;
    accent: string;
    ink: string;
    onOpen: (i: Img) => void;
}) {
    const [view, setView] = useState(0);
    const [prevPiece, setPrevPiece] = useState(piece);
    if (piece !== prevPiece) {
        setPrevPiece(piece);
        setView(0);
    }
    const img = piece.images[view] ?? piece.images[0];
    return (
        <div className="grid md:grid-cols-8 gap-6">
            <div className="md:col-span-5">
                <div className="relative aspect-[4/5]" style={{ background: `${ink}0D` }}>
                    {piece.model ? (
                        <Model3D src={piece.model} alt={piece.name} className="w-full h-full" />
                    ) : img ? (
                        <button type="button" onClick={() => onOpen(img)} className="w-full h-full cursor-zoom-in">
                            <img src={src(img, 1200)} alt={img.caption ?? piece.name} className="w-full h-full object-contain" />
                        </button>
                    ) : (
                        <ToCome ink={ink} className="absolute inset-0" />
                    )}
                    {piece.model && <span className={`${smallCaps} absolute left-3 top-3 opacity-70`}>3D · drag to turn</span>}
                </div>
                {!piece.model && piece.images.length > 1 && (
                    <div className="mt-3 flex gap-2">
                        {piece.images.map((im, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setView(i)}
                                aria-label={im.caption ?? `View ${i + 1}`}
                                className="w-14 h-14 overflow-hidden transition-opacity"
                                style={{ background: `${ink}0D`, opacity: i === view ? 1 : 0.5, outline: i === view ? `1px solid ${accent}` : 'none' }}
                            >
                                <img src={src(im, 200)} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="md:col-span-3 md:pt-2">
                <p className={`${serif.className} text-3xl leading-tight font-medium`}>{piece.name}</p>
                {img?.caption && !piece.model && <p className={`${smallCaps} mt-2 opacity-55`}>{img.caption}</p>}
                {piece.notes && sees(level, 'mid') && <p className="mt-5 text-base leading-relaxed opacity-85">{piece.notes}</p>}
                {piece.specs && sees(level, 'high') && (
                    <div className="mt-6 pt-4 border-t" style={{ borderColor: `${ink}22` }}>
                        <p className={smallCaps} style={{ color: accent }}>
                            § Specs
                        </p>
                        <p className="mt-2 text-sm leading-relaxed opacity-80 whitespace-pre-line">{piece.specs}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// A note in the margin style: a small level mark, a serif title, then text and images.
function Note({ detail, accent, onOpen }: { detail: Detail; accent: string; onOpen: (i: Img) => void }) {
    const paras = (detail.body ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    const mark = detail.level === 'high' ? '§ High AF' : detail.level === 'mid' ? '§ Mid' : '§';
    return (
        <div className="grid md:grid-cols-12 gap-6 md:gap-8">
            <p className={`${smallCaps} md:col-span-3 pt-2`} style={{ color: accent }}>
                {mark}
            </p>
            <div className="md:col-span-9">
                {detail.title && <h3 className={`${serif.className} text-3xl md:text-4xl font-medium`}>{detail.title}</h3>}
                {paras.length > 0 && (
                    <div className="mt-4 max-w-2xl space-y-4 text-base md:text-[17px] leading-relaxed opacity-85">
                        {paras.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>
                )}
                {detail.video && <video src={detail.video} controls playsInline className="mt-8 w-full max-w-3xl" />}
                {detail.images.length > 0 && (
                    <div className="mt-8 columns-2 md:columns-3 gap-4 [&>*]:mb-4">
                        {detail.images.map((img, i) => (
                            <button key={i} type="button" onClick={() => onOpen(img)} className="block w-full break-inside-avoid cursor-zoom-in text-left">
                                <img src={src(img, 900)} alt={img.caption ?? ''} className="w-full h-auto" loading="lazy" />
                                {img.caption && <span className={`${smallCaps} mt-2 block opacity-55`}>{img.caption}</span>}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function Colophon() {
    return (
        <section aria-label="End" className="px-6 md:px-16 py-24 md:py-32 text-center">
            <p className={smallCaps} style={{ color: RED }}>
                Fin, for now
            </p>
            <p className={`${serif.className} mt-4 text-4xl md:text-6xl italic`}>See you on the road.</p>
            <Link href="/work" className={`${smallCaps} inline-block mt-10 underline underline-offset-4 opacity-60 hover:opacity-100`}>
                ← Back to select
            </Link>
        </section>
    );
}

// ── The depth switch that stays with you ────────────────────────────────────

function DepthSwitch({ level, onChange }: { level: Level; onChange: (l: Level) => void }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="fixed left-4 bottom-4 md:left-6 md:bottom-6 z-40">
            <AnimatePresence>
                {open && (
                    <motion.div
                        role="radiogroup"
                        aria-label="Geek level"
                        className="mb-2 flex flex-col shadow-lg"
                        style={{ background: PAPER, color: INK, border: `1px solid ${INK}33` }}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                    >
                        {LEVELS.map((l) => (
                            <button
                                key={l}
                                type="button"
                                role="radio"
                                aria-checked={level === l}
                                onClick={() => {
                                    onChange(l);
                                    setOpen(false);
                                }}
                                className={`${serif.className} px-4 py-2 text-left text-xl ${level === l ? 'italic' : 'opacity-60 hover:opacity-100'}`}
                                style={level === l ? { color: RED } : undefined}
                            >
                                {LEVEL_TEXT[l].name}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className={`${smallCaps} px-4 py-2.5 shadow-md`}
                style={{ background: PAPER, color: INK, border: `1px solid ${INK}33` }}
            >
                Geek level — <span style={{ color: RED }}>{LEVEL_TEXT[level].name}</span>
            </button>
        </div>
    );
}
