'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface WorkItem {
    slug: string;
    title: string;
    category?: string;
    date?: string;
    summary?: string;
    screen?: string;
    thumb?: string;
}

// Jukebox selection codes: three strips per letter, so A1 A2 A3 B1 …
const ROW = 3;
const codeFor = (i: number) => `${String.fromCharCode(65 + Math.floor(i / ROW))}${(i % ROW) + 1}`;

// The "?" box flickers through the roster, slowing down until it lands.
const ROULETTE_STEPS = 12;
const ROULETTE_FIRST_MS = 45;
const ROULETTE_SLOWDOWN = 1.14;

export default function WorkSelect({ items }: { items: WorkItem[] }) {
    const router = useRouter();
    const reduceMotion = useReducedMotion();
    const [selected, setSelected] = useState(0);
    const [preview, setPreview] = useState<number | null>(null);
    const [rolling, setRolling] = useState<number | null>(null);
    const typed = useRef(''); // first half of a typed code, e.g. the "A" of A2
    const timers = useRef<number[]>([]);
    const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const rosterRef = useRef<HTMLDivElement>(null);

    const shown = rolling ?? preview ?? selected;
    const item = items[shown];
    const randomIndex = items.length;

    const stopRoulette = useCallback(() => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        setRolling(null);
    }, []);
    useEffect(() => stopRoulette, [stopRoulette]);

    const select = useCallback(
        (i: number) => {
            stopRoulette();
            setPreview(null);
            setSelected(i);
        },
        [stopRoulette],
    );

    const shuffle = useCallback(() => {
        if (items.length < 2) return;
        stopRoulette();
        setPreview(null);
        let target = Math.floor(Math.random() * (items.length - 1));
        if (target >= selected) target += 1; // never land on what's already playing
        if (reduceMotion) {
            setSelected(target);
            return;
        }
        let at = 0;
        let delay = ROULETTE_FIRST_MS;
        let last = selected;
        for (let step = 0; step < ROULETTE_STEPS; step++) {
            let next = Math.floor(Math.random() * (items.length - 1));
            if (next >= last) next += 1; // always move, so every step reads as a flicker
            last = next;
            at += delay;
            delay *= ROULETTE_SLOWDOWN;
            timers.current.push(window.setTimeout(() => setRolling(next), at));
        }
        timers.current.push(
            window.setTimeout(() => {
                timers.current = [];
                setRolling(null);
                setSelected(target);
            }, at + delay),
        );
    }, [items.length, selected, reduceMotion, stopRoulette]);

    const pressTile = (i: number) => {
        if (i === randomIndex) return shuffle();
        if (i === selected && rolling === null) return router.push(`/work/${items[i].slug}`);
        select(i);
    };

    // Arrow keys move the cursor across the roster, like a select screen.
    const onRosterKey = (e: React.KeyboardEvent) => {
        const current = tileRefs.current.findIndex((el) => el === document.activeElement);
        if (current < 0) return;
        const cols = rosterRef.current
            ? getComputedStyle(rosterRef.current).gridTemplateColumns.split(' ').length
            : 1;
        const move = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -cols, ArrowDown: cols }[e.key];
        if (move === undefined) return;
        e.preventDefault();
        const next = Math.min(randomIndex, Math.max(0, current + move));
        tileRefs.current[next]?.focus();
        if (next !== randomIndex) select(next);
    };

    // Type a code (A2) to pick it, or R for the random box.
    const onSectionKey = (e: React.KeyboardEvent) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const k = e.key.toUpperCase();
        if (k === 'R' || k === '?') {
            e.preventDefault();
            typed.current = '';
            return shuffle();
        }
        if (/^[A-Z]$/.test(k)) {
            typed.current = k;
            return;
        }
        if (/^[1-9]$/.test(k) && typed.current) {
            const i = items.findIndex((_, j) => codeFor(j) === typed.current + k);
            typed.current = '';
            if (i >= 0) {
                select(i);
                tileRefs.current[i]?.focus();
            }
        }
    };

    if (!items.length) {
        return (
            <section id="work" className="py-12">
                <div className="p-12 text-center border border-dashed border-gray-300 dark:border-gray-700 text-gray-400 font-mono">
                    No projects yet. Add one in the Sanity Studio.
                </div>
            </section>
        );
    }

    const status = rolling !== null ? 'Shuffling…' : preview !== null && preview !== selected ? 'Cued' : 'Now playing';

    return (
        <section id="work" className="py-12" onKeyDown={onSectionKey} aria-label="Selected work">
            <div className="flex flex-wrap justify-between items-baseline gap-x-8 gap-y-2 mb-10 border-b border-black dark:border-white pb-4">
                <h2 className="text-4xl font-bold tracking-tighter uppercase">Selected Work</h2>
                <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
                    Pick a project, or let the <span aria-hidden>?</span>
                    <span className="sr-only">random</span> box choose
                    <span className="hidden lg:inline"> · type a code like A2 · R for random</span>
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                {/* The screen: whatever is selected plays here. */}
                <div className="lg:col-span-8">
                    <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-black text-[#E6E1D6] ring-1 ring-black/10 dark:ring-white/10">
                        {items.map((it, i) =>
                            it.screen ? (
                                <img
                                    key={it.slug}
                                    src={it.screen}
                                    alt=""
                                    aria-hidden={i !== shown}
                                    className={`absolute inset-0 w-full h-full object-cover motion-reduce:transition-none ${
                                        i === shown ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.04]'
                                    } ${rolling !== null ? 'transition-none' : 'transition-[opacity,transform] duration-500 ease-out'}`}
                                />
                            ) : null,
                        )}

                        {/* A soft flash when the screen settles on a new channel (not on every roulette flicker). */}
                        <motion.div
                            key={rolling !== null ? 'rolling' : shown}
                            initial={{ opacity: reduceMotion || rolling !== null ? 0 : 0.18 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="absolute inset-0 bg-white pointer-events-none"
                        />
                        <div
                            aria-hidden
                            className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay"
                            style={{ backgroundImage: 'repeating-linear-gradient(0deg, #000 0 1px, transparent 1px 3px)' }}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

                        <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest bg-black/55 backdrop-blur-sm px-2.5 py-1">
                            <span aria-hidden className={rolling !== null ? 'animate-pulse' : ''}>▶</span>
                            <span>{status}</span>
                            <span className="opacity-60">{codeFor(shown)}</span>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4" aria-live="polite">
                            <div className="min-w-0">
                                <p className="font-mono text-[11px] uppercase tracking-widest opacity-70 mb-2">
                                    {[item.category, item.date].filter(Boolean).join(' · ')}
                                </p>
                                <h3 className="font-display text-3xl md:text-5xl leading-none">{item.title}</h3>
                                {item.summary && (
                                    <p className="hidden md:block mt-3 max-w-xl text-sm leading-relaxed opacity-80 line-clamp-2">
                                        {item.summary}
                                    </p>
                                )}
                            </div>
                            <Link
                                href={`/work/${item.slug}`}
                                tabIndex={rolling !== null ? -1 : 0}
                                className="shrink-0 self-start md:self-auto font-mono text-xs uppercase tracking-widest border border-current px-4 py-2.5 hover:bg-[#E6E1D6] hover:text-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                            >
                                Open project →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* The roster. */}
                <div
                    ref={rosterRef}
                    role="group"
                    aria-label="Projects"
                    onKeyDown={onRosterKey}
                    onMouseLeave={() => setPreview(null)}
                    className="lg:col-span-4 grid grid-cols-4 lg:grid-cols-3 gap-2 md:gap-3"
                >
                    {items.map((it, i) => {
                        const isSelected = i === selected && rolling === null;
                        const isLit = i === shown;
                        return (
                            <button
                                key={it.slug}
                                ref={(el) => {
                                    tileRefs.current[i] = el;
                                }}
                                type="button"
                                onClick={() => pressTile(i)}
                                onMouseEnter={() => rolling === null && setPreview(i)}
                                aria-pressed={isSelected}
                                aria-label={`${codeFor(i)} ${it.title}${isSelected ? ', selected. Press again to open' : ''}`}
                                className={`group relative aspect-square overflow-hidden bg-gray-200 dark:bg-gray-800 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground focus-visible:ring-offset-background ${
                                    isSelected ? 'ring-2 ring-offset-2 ring-foreground ring-offset-background' : ''
                                }`}
                            >
                                {it.thumb && (
                                    <img
                                        src={it.thumb}
                                        alt=""
                                        className={`w-full h-full object-cover transition-[filter,opacity,transform] duration-300 motion-reduce:transition-none ${
                                            isLit ? 'grayscale-0 opacity-100 scale-105' : 'grayscale opacity-55 group-hover:opacity-80'
                                        }`}
                                    />
                                )}
                                <span
                                    className={`absolute left-1 top-1 font-mono text-[10px] leading-none px-1 py-0.5 ${
                                        isLit ? 'bg-foreground text-background' : 'bg-background/80 text-foreground'
                                    }`}
                                >
                                    {codeFor(i)}
                                </span>
                            </button>
                        );
                    })}

                    <button
                        ref={(el) => {
                            tileRefs.current[randomIndex] = el;
                        }}
                        type="button"
                        onClick={shuffle}
                        aria-label="Random: let the site pick a project"
                        className={`relative aspect-square flex items-center justify-center border border-dashed border-current/40 text-foreground hover:bg-foreground hover:text-background transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground focus-visible:ring-offset-background ${
                            rolling !== null ? 'bg-foreground text-background' : ''
                        }`}
                    >
                        <span aria-hidden className={`font-display text-4xl leading-none ${rolling !== null ? 'animate-pulse' : ''}`}>
                            ?
                        </span>
                        <span className="absolute bottom-1 inset-x-0 text-center font-mono text-[9px] uppercase tracking-widest opacity-70">
                            Random
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
}
