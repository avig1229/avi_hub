'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { arcade, arcadeTitleStyle } from './arcade';

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

    const cols = Math.min(items.length + 1, 7); // roster columns on wide screens

    return (
        // A full-screen select screen: the shown project fills the background
        // like a hero, the roster sits in the middle, its details below.
        <section
            id="work"
            onKeyDown={onSectionKey}
            aria-label="Selected work"
            className="relative -mt-24 -mx-6 md:-mx-12 min-h-svh overflow-hidden bg-black text-[#E6E1D6] flex flex-col"
        >
            {/* Backdrop: the shown project, full bleed */}
            <div aria-hidden className="absolute inset-0">
                {items.map((it, i) =>
                    it.screen ? (
                        <img
                            key={it.slug}
                            src={it.screen}
                            alt=""
                            className={`absolute inset-0 w-full h-full object-cover motion-reduce:transition-none ${
                                i === shown ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.05]'
                            } ${rolling !== null ? 'transition-none' : 'transition-[opacity,transform] duration-700 ease-out'}`}
                        />
                    ) : null,
                )}
                {/* A soft flash when the screen settles on a new project (not on every roulette flicker). */}
                <motion.div
                    key={rolling !== null ? 'rolling' : shown}
                    initial={{ opacity: reduceMotion || rolling !== null ? 0 : 0.15 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="absolute inset-0 bg-white"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-black/90" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.65)_100%)]" />
                <div
                    className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
                    style={{ backgroundImage: 'repeating-linear-gradient(0deg, #000 0 1px, transparent 1px 3px)' }}
                />
            </div>

            <div className="relative flex-1 flex flex-col items-center justify-between gap-8 pt-24 pb-10 px-4 md:px-12">
                {/* Title */}
                <header className="w-full text-center">
                    <Link
                        href="/#room-view"
                        className="block w-fit mb-6 md:mb-2 font-mono text-xs uppercase tracking-widest text-[#E6E1D6]/60 hover:text-[#E6E1D6] transition-colors"
                    >
                        ← Back to the room
                    </Link>
                    <h2
                        className={`${arcade.className} inline-block uppercase leading-[1.15] text-[clamp(1.35rem,5.2vw,3.75rem)]`}
                        style={arcadeTitleStyle}
                    >
                        Selected Work
                    </h2>
                    <motion.p
                        aria-hidden
                        animate={reduceMotion ? undefined : { opacity: [1, 1, 0, 0] }}
                        transition={{ duration: 1.1, times: [0, 0.55, 0.56, 1], repeat: Infinity }}
                        className={`${arcade.className} mt-4 text-[10px] md:text-xs uppercase tracking-[0.2em]`}
                    >
                        Choose your project
                    </motion.p>
                </header>

                {/* The selection box */}
                <div className="w-full flex flex-col items-center">
                    <div className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest">
                        <span className={`${arcade.className} text-[#D7263D] text-xs`}>1P</span>
                        <span aria-hidden className={rolling !== null ? 'animate-pulse' : ''}>▶</span>
                        <span>{status}</span>
                        <span className="text-[#F2C14E]">{codeFor(shown)}</span>
                    </div>
                    <div
                        ref={rosterRef}
                        role="group"
                        aria-label="Projects"
                        onKeyDown={onRosterKey}
                        onMouseLeave={() => setPreview(null)}
                        style={{ ['--cols' as string]: cols }}
                        className="grid grid-cols-4 md:grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-2 md:gap-3 p-2 md:p-3 w-[min(100%,26rem)] md:w-[min(100%,calc(var(--cols)*7.5rem))] border-2 border-[#F2C14E]/60 bg-black/45 backdrop-blur-sm shadow-[0_0_0_4px_rgba(0,0,0,0.35)]"
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
                                    className={`group relative aspect-square overflow-hidden bg-[#1b1a19] outline-none focus-visible:ring-2 focus-visible:ring-[#E6E1D6] ${
                                        isSelected ? 'ring-2 ring-[#F2C14E]' : ''
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
                                            isLit ? 'bg-[#F2C14E] text-black' : 'bg-black/70 text-[#E6E1D6]'
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
                            className={`relative aspect-square flex items-center justify-center border border-dashed border-[#E6E1D6]/40 hover:bg-[#E6E1D6] hover:text-black transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#E6E1D6] ${
                                rolling !== null ? 'bg-[#E6E1D6] text-black' : ''
                            }`}
                        >
                            <span aria-hidden className={`${arcade.className} text-2xl md:text-3xl leading-none ${rolling !== null ? 'animate-pulse' : ''}`}>
                                ?
                            </span>
                            <span className="absolute bottom-1 inset-x-0 text-center font-mono text-[9px] uppercase tracking-widest opacity-70">
                                Random
                            </span>
                        </button>
                    </div>
                    <p className="mt-3 font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-[#E6E1D6]/55 text-center">
                        Or let the <span aria-hidden>?</span>
                        <span className="sr-only">random</span> box decide
                        <span className="hidden lg:inline"> · type a code like A2 · R for random</span>
                    </p>
                </div>

                {/* The shown project */}
                <div className="w-full max-w-2xl text-center" aria-live="polite">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-[#E6E1D6]/70">
                        {[item.category, item.date].filter(Boolean).join(' · ')}
                    </p>
                    <h3 className="mt-2 font-display text-4xl md:text-6xl leading-none">{item.title}</h3>
                    {item.summary && (
                        <p className="hidden md:block mt-3 text-sm leading-relaxed text-[#E6E1D6]/80 line-clamp-2">{item.summary}</p>
                    )}
                    <Link
                        href={`/work/${item.slug}`}
                        tabIndex={rolling !== null ? -1 : 0}
                        className={`${arcade.className} inline-block mt-5 text-[10px] md:text-xs uppercase px-5 py-3 bg-[#F2C14E] text-black hover:bg-[#ffd76a] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C14E]`}
                    >
                        Open project →
                    </Link>
                </div>
            </div>
        </section>
    );
}
