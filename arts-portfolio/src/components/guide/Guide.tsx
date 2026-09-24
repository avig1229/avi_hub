'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { SITE_GUIDE_DEFAULTS, type SiteGuideLines } from './defaults';

// The site guide: the third-eye mascot, docked bottom-right like a game NPC.
// Pages drop <GuideSpot> markers; the first time a visitor reaches one, he
// says its line in a typewriter dialogue box. Each line plays once per
// browser (editing the line in Sanity makes it play again). Tapping his head
// replays the last line. A spot marked `revealsGuide` keeps him off screen
// while the page is scrolled above it (the home page does this while the
// hero has the stage).

const SEEN_KEY = 'shrma-guide-seen';
const CHARS_PER_SECOND = 45;

// `group`: a newer line in the same group replaces an open or queued one (e.g. project tabs).
type Message = { key: string; pages: string[]; group?: string };

type GuideContextValue = {
    say: (id: string, text: string, opts?: { group?: string }) => void;
    // Hold the dock off screen while `on` for this id.
    hold: (id: string, on: boolean) => void;
    site: SiteGuideLines;
};

const GuideContext = createContext<GuideContextValue | null>(null);

const toPages = (text: string) =>
    text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);

// Small stable hash, so an edited line counts as unseen.
function hash(text: string) {
    let h = 0;
    for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
}

function readSeen(): Set<string> {
    try {
        return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]'));
    } catch {
        return new Set();
    }
}

function writeSeen(seen: Set<string>) {
    try {
        localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
    } catch {}
}

export function GuideProvider({
    site: fromSanity,
    children,
}: {
    site?: Partial<SiteGuideLines> | null;
    children: React.ReactNode;
}) {
    const site = { ...SITE_GUIDE_DEFAULTS };
    for (const [k, v] of Object.entries(fromSanity ?? {})) {
        if (typeof v === 'string' && v.trim()) site[k as keyof SiteGuideLines] = v;
    }

    const [current, setCurrent] = useState<Message | null>(null);
    const [page, setPage] = useState(0);
    const [holds, setHolds] = useState<ReadonlySet<string>>(new Set());

    const hold = useCallback((id: string, on: boolean) => {
        setHolds((prev) => {
            if (prev.has(id) === on) return prev;
            const next = new Set(prev);
            if (on) next.add(id);
            else next.delete(id);
            return next;
        });
    }, []);
    const queue = useRef<Message[]>([]);
    const last = useRef<Message | null>(null);
    const open = useRef<Message | null>(null);

    const show = useCallback((msg: Message) => {
        last.current = msg;
        open.current = msg;
        setPage(0);
        setCurrent(msg);
    }, []);

    const say = useCallback(
        (id: string, text: string, opts?: { group?: string }) => {
            const pages = toPages(text);
            if (!pages.length) return;
            const msg: Message = { key: `${id}:${hash(text)}`, pages, group: opts?.group };
            const seen = readSeen();
            if (seen.has(msg.key)) {
                last.current = msg; // heard before: tapping the head replays it
                return;
            }
            seen.add(msg.key);
            writeSeen(seen);
            if (msg.group) {
                // Moving on within a group (say, to another tab): drop what's
                // pending for the old spot, and cut in if that's what is showing.
                queue.current = queue.current.filter((m) => m.group !== msg.group);
                if (open.current?.group === msg.group) return show(msg);
            }
            // One box at a time: later lines wait their turn.
            if (open.current) queue.current = [...queue.current.filter((m) => m.key !== msg.key), msg];
            else show(msg);
        },
        [show],
    );

    const close = useCallback(() => {
        open.current = null;
        setCurrent(null);
        const next = queue.current.shift();
        if (next) setTimeout(() => show(next), 500);
    }, [show]);

    const replay = () => show(last.current ?? { key: 'idle', pages: toPages(site.idle) });

    return (
        <GuideContext.Provider value={{ say, hold, site }}>
            {children}
            <GuideDock
                hidden={holds.size > 0}
                name={site.name}
                message={current}
                page={page}
                onAdvance={() => (current && page < current.pages.length - 1 ? setPage(page + 1) : close())}
                onClose={close}
                onHead={() => (current ? close() : replay())}
            />
        </GuideContext.Provider>
    );
}

export function useGuide() {
    const ctx = useContext(GuideContext);
    if (!ctx) throw new Error('useGuide must be used inside <GuideProvider>');
    return ctx;
}

// Invisible marker: once it is in the top 70% of the screen (so markers near
// the top of a page fire on load), the guide says `text`, or the site-wide
// line named by `siteKey`.
export function GuideSpot({
    id,
    text,
    siteKey,
    revealsGuide = false,
    group,
    className = '',
}: {
    id: string;
    text?: string | null;
    group?: string;
    siteKey?: Exclude<keyof SiteGuideLines, 'name'>;
    revealsGuide?: boolean;
    className?: string;
}) {
    const { say, hold, site } = useGuide();
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '0px 0px -30% 0px' });
    const line = text?.trim() || (siteKey ? site[siteKey] : '');

    useEffect(() => {
        if (inView && line) say(id, line, { group });
    }, [inView, line, id, say, group]);

    // Keep the dock hidden while this spot is still below the reveal line, so
    // scrolling back up above it tucks him away again. Released on leaving the page.
    useEffect(() => {
        if (!revealsGuide) return;
        const update = () => {
            const el = ref.current;
            if (el) hold(id, el.getBoundingClientRect().top > window.innerHeight * 0.7);
        };
        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
            hold(id, false);
        };
    }, [revealsGuide, id, hold]);

    return <div ref={ref} aria-hidden className={`h-px w-full pointer-events-none ${className}`} />;
}

const noop = () => () => {};

function GuideDock({
    hidden,
    name,
    message,
    page,
    onAdvance,
    onClose,
    onHead,
}: {
    hidden: boolean;
    name: string;
    message: Message | null;
    page: number;
    onAdvance: () => void;
    onClose: () => void;
    onHead: () => void;
}) {
    const reduce = useReducedMotion();
    const pathname = usePathname();
    const text = message?.pages[page] ?? '';
    // Typewriter progress, tagged with the page it belongs to, so a new page
    // starts from zero without resetting state in an effect.
    const [progress, setProgress] = useState({ text: '', n: 0 });
    const typed = reduce ? text.length : progress.text === text ? progress.n : 0;
    const done = typed >= text.length;
    const isLast = !!message && page === message.pages.length - 1;

    useEffect(() => {
        if (!text || reduce) return;
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const n = Math.min(text.length, Math.floor(((now - start) / 1000) * CHARS_PER_SECOND));
            setProgress((p) => (p.text === text && p.n >= n ? p : { text, n }));
            if (n < text.length) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [text, reduce]);

    // Not shown until after hydration, so a page that holds him back never
    // flashes him on load.
    const mounted = useSyncExternalStore(noop, () => true, () => false);

    if (pathname?.startsWith('/studio')) return null;
    const away = hidden || !mounted;

    const talking = !!message && !done;
    const advance = () => (done ? onAdvance() : setProgress({ text, n: text.length }));

    return (
        <motion.div
            className="guide-dock fixed right-3 bottom-3 md:right-6 md:bottom-6 z-[45] flex flex-col items-end gap-3 pointer-events-none"
            initial={false}
            animate={away ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            // Only set while held: an inline value would override the overlay rule in globals.css.
            style={away ? { visibility: 'hidden' } : undefined}
            aria-hidden={away || undefined}
        >
            <AnimatePresence>
                {message && (
                    <motion.div
                        key={message.key}
                        role="dialog"
                        aria-label={`${name} says`}
                        className="pointer-events-auto relative w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl border-2 border-[#f2dcc0]/30 bg-[#141312]/95 backdrop-blur-md text-[#e6e1d6] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] ring-1 ring-black/60 ring-offset-0"
                        initial={{ opacity: 0, y: 16, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                        style={{ transformOrigin: 'bottom right' }}
                    >
                        <span className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-[#f2c14e] text-black font-mono text-[10px] tracking-[0.2em] uppercase">
                            {name}
                        </span>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-[#e6e1d6]/60 hover:text-[#e6e1d6]"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <button
                            type="button"
                            onClick={advance}
                            className="block w-full text-left px-5 pt-6 pb-5 pr-10 cursor-pointer"
                            aria-label={done ? (isLast ? 'Close' : 'Next') : 'Show all'}
                        >
                            {/* Screen readers get the whole page at once, not letter by letter. */}
                            <span className="sr-only" aria-live="polite">
                                {text}
                            </span>
                            <span aria-hidden className="block min-h-[3.5rem] text-[15px] leading-relaxed whitespace-pre-line">
                                {text.slice(0, typed)}
                                <span className="invisible">{text.slice(typed)}</span>
                            </span>
                            <span aria-hidden className="mt-2 flex items-center justify-end gap-2 h-4 font-mono text-[10px] tracking-[0.2em] text-[#e6e1d6]/50">
                                {message.pages.length > 1 && (
                                    <span>
                                        {page + 1}/{message.pages.length}
                                    </span>
                                )}
                                {done && (
                                    <motion.span
                                        className="text-[#f2c14e]"
                                        animate={reduce ? undefined : { y: [0, 3, 0] }}
                                        transition={{ duration: 0.8, repeat: Infinity }}
                                    >
                                        {isLast ? '✕' : '▼'}
                                    </motion.span>
                                )}
                            </span>
                        </button>

                        {/* Tail toward the head */}
                        <span
                            aria-hidden
                            className="absolute -bottom-[7px] right-7 md:right-9 w-3 h-3 rotate-45 bg-[#141312] border-r-2 border-b-2 border-[#f2dcc0]/30"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                type="button"
                onClick={onHead}
                aria-label={message ? `Close ${name}` : `Talk to ${name}`}
                className="pointer-events-auto relative w-16 h-[3.55rem] md:w-[5.5rem] md:h-[4.87rem] drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]"
                animate={reduce ? undefined : { y: talking ? [0, -5, 0] : [0, -3, 0] }}
                transition={{ duration: talking ? 0.5 : 3, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
            >
                <Image src="/guide/head.png" alt="" fill sizes="88px" className="object-contain" priority />
                {/* Third-eye glow: pulses while he talks, flickers now and then at rest. */}
                <motion.span
                    aria-hidden
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                        left: '50%',
                        top: '21.3%',
                        width: '30%',
                        aspectRatio: '1',
                        background: 'radial-gradient(circle, rgba(255,214,90,0.95) 0%, rgba(255,214,90,0) 65%)',
                        mixBlendMode: 'screen',
                    }}
                    animate={
                        reduce
                            ? { opacity: talking ? 0.8 : 0 }
                            : talking
                              ? { opacity: [0.4, 1, 0.4] }
                              : { opacity: [0, 0, 0.85, 0, 0] }
                    }
                    transition={
                        talking
                            ? { duration: 0.6, repeat: Infinity }
                            : { duration: 7, repeat: Infinity, times: [0, 0.8, 0.85, 0.9, 1] }
                    }
                />
            </motion.button>
        </motion.div>
    );
}
