'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

// The home page's weekly music rec. The song plays through YouTube's own
// embedded player, shown (as YouTube requires) in the record's sleeve, which
// also credits the source. The hero's record drives the same player through
// this context, and follows it when visitors use the player directly.

export type MusicRecData = {
    videoId: string;
    url: string;
    song: string;
    artist: string;
    channel?: string;
    channelUrl?: string;
    note?: string;
    weekOf?: string;
    // The weekly rec, as opposed to a record from the crate.
    weekly?: boolean;
};

type YTPlayer = {
    playVideo(): void;
    pauseVideo(): void;
    loadVideoById(id: string): void;
    getPlayerState(): number;
    destroy(): void;
};
type YTNamespace = {
    Player: new (
        el: HTMLElement,
        opts: {
            host?: string;
            videoId: string;
            width?: string;
            height?: string;
            playerVars?: Record<string, string | number>;
            events?: { onReady?: () => void; onStateChange?: (e: { data: number }) => void };
        },
    ) => YTPlayer;
};
declare global {
    interface Window {
        YT?: YTNamespace;
        onYouTubeIframeAPIReady?: () => void;
    }
}

const PLAYING = 1;
const ENDED = 0;
let apiPromise: Promise<YTNamespace> | null = null;

function loadYouTubeAPI(): Promise<YTNamespace> {
    if (window.YT?.Player) return Promise.resolve(window.YT);
    apiPromise ??= new Promise((resolve) => {
        const previous = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            previous?.();
            resolve(window.YT!);
        };
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.head.appendChild(script);
    });
    return apiPromise;
}

type MusicContextValue = {
    playing: boolean;
    toggle: () => void;
    register: (el: HTMLElement | null) => void;
    // What's on the turntable now.
    rec: MusicRecData;
    // Everything that can be put on: the weekly rec, then the crate.
    records: MusicRecData[];
    current: number;
    // Put record i on and play it.
    choose: (i: number) => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicRecProvider({
    rec: weekly,
    crate = [],
    children,
}: {
    rec: MusicRecData;
    crate?: MusicRecData[];
    children: React.ReactNode;
}) {
    const [records] = useState(() => [weekly, ...crate.filter((r) => r.videoId !== weekly.videoId)]);
    const [current, setCurrent] = useState(0);
    const currentRef = useRef(0);
    const rec = records[current];
    const [playing, setPlaying] = useState(false);
    const [host, setHost] = useState<HTMLElement | null>(null);
    const player = useRef<YTPlayer | null>(null);
    const ready = useRef(false);
    const pendingPlay = useRef(false);
    // A record chosen before the player was ready.
    const pendingVideo = useRef<string | null>(null);
    // Whether the chosen record has actually started. Swapping records can
    // report the old one as ended; only a record that played can end.
    const started = useRef(false);

    const choose = useCallback(
        (i: number) => {
            const next = records[i];
            if (!next) return;
            currentRef.current = i;
            started.current = false;
            setCurrent(i);
            const p = player.current;
            if (p && ready.current) p.loadVideoById(next.videoId);
            else {
                pendingVideo.current = next.videoId;
                pendingPlay.current = true;
            }
        },
        [records],
    );
    const chooseRef = useRef(choose);
    useEffect(() => {
        chooseRef.current = choose;
    }, [choose]);

    useEffect(() => {
        if (!host) return;
        let cancelled = false;
        loadYouTubeAPI().then((YT) => {
            if (cancelled) return;
            player.current = new YT.Player(host, {
                host: 'https://www.youtube-nocookie.com',
                videoId: records[0].videoId,
                width: '100%',
                height: '100%',
                playerVars: { rel: 0, playsinline: 1 },
                events: {
                    onReady: () => {
                        ready.current = true;
                        if (pendingVideo.current) player.current?.loadVideoById(pendingVideo.current);
                        else if (pendingPlay.current) player.current?.playVideo();
                        pendingVideo.current = null;
                    },
                    onStateChange: (e) => {
                        setPlaying(e.data === PLAYING);
                        if (e.data === PLAYING) started.current = true;
                        // When a song ends, the next record in the crate goes on.
                        if (e.data === ENDED && started.current) chooseRef.current((currentRef.current + 1) % records.length);
                    },
                },
            });
        });
        return () => {
            cancelled = true;
            ready.current = false;
            player.current?.destroy();
            player.current = null;
        };
        // The player is built once per host; `choose` swaps records on it.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [host]);

    const toggle = useCallback(() => {
        const p = player.current;
        if (!p || !ready.current) {
            pendingPlay.current = !pendingPlay.current;
            return;
        }
        if (p.getPlayerState() === PLAYING) p.pauseVideo();
        else p.playVideo();
    }, []);

    return (
        <MusicContext.Provider value={{ playing, toggle, register: setHost, rec, records, current, choose }}>{children}</MusicContext.Provider>
    );
}

// Safe outside the provider (nothing plays).
export function useMusicRec() {
    return (
        useContext(MusicContext) ?? {
            playing: false,
            toggle: () => {},
            register: () => {},
            rec: null,
            records: [] as MusicRecData[],
            current: 0,
            choose: () => {},
        }
    );
}

function formatWeek(date?: string) {
    if (!date) return null;
    const d = new Date(`${date}T00:00:00`);
    return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const cover = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

// The record player's one interface: YouTube's player (kept visible, as
// YouTube requires), the credit for what's on, and the crate to put another
// record on. The hero slides it out from behind the record; the room's
// record corner brings visitors back here.
export function RecSleeve({ interactive = true }: { interactive?: boolean }) {
    const ctx = useContext(MusicContext);
    const slot = useRef<HTMLDivElement>(null);
    const register = ctx?.register;

    // The YouTube API replaces this inner node with its iframe.
    useEffect(() => {
        if (!register || !slot.current) return;
        const inner = document.createElement('div');
        slot.current.appendChild(inner);
        register(inner);
        return () => {
            register(null);
            inner.remove();
        };
    }, [register]);

    if (!ctx) return null;
    const { rec, playing, records, current, choose } = ctx;
    const week = formatWeek(rec.weekOf);
    const link = 'underline underline-offset-4 hover:text-[#e6e1d6]';

    return (
        <section
            aria-labelledby="weekly-rec"
            className={`rounded-md overflow-hidden bg-[#141312] text-[#e6e1d6] ring-1 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] ${
                interactive ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
        >
            <div
                ref={slot}
                className="relative w-full aspect-video min-h-[200px] bg-black [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:w-full [&>iframe]:h-full"
            />
            <div className="p-4 md:p-5">
                <div className="flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.25em] uppercase text-[#e6e1d6]/50">
                    <span>{rec.weekly ? `Weekly rec${week ? ` · Week of ${week}` : ''}` : 'From the crate'}</span>
                    <span className={playing ? 'text-[#f2c14e]' : ''}>{playing ? '● Now spinning' : 'Side A'}</span>
                </div>
                <h2 id="weekly-rec" className="mt-2 text-2xl md:text-3xl leading-tight truncate">
                    {rec.song}
                </h2>
                <p className="text-sm text-[#e6e1d6]/70">{rec.artist}</p>
                {rec.note && <p className="mt-2 text-sm italic leading-relaxed line-clamp-2">“{rec.note}”</p>}
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] tracking-widest uppercase text-[#e6e1d6]/60">
                    <a href={rec.url} target="_blank" rel="noopener noreferrer" className={link}>
                        Watch on YouTube ↗
                    </a>
                    {rec.channel && rec.channelUrl && (
                        <a href={rec.channelUrl} target="_blank" rel="noopener noreferrer" className={link}>
                            {rec.channel} ↗
                        </a>
                    )}
                </p>

                {records.length > 1 && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="mb-2 font-mono text-[10px] tracking-[0.25em] uppercase text-[#e6e1d6]/50">
                            The crate · put one on
                        </p>
                        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
                            {records.map((r, i) => (
                                <button
                                    key={r.videoId}
                                    type="button"
                                    onClick={() => choose(i)}
                                    title={`${r.song} · ${r.artist}`}
                                    aria-label={`Put on ${r.song} by ${r.artist}${r.weekly ? ' (weekly rec)' : ''}`}
                                    aria-current={i === current || undefined}
                                    className={`relative shrink-0 w-10 h-10 md:w-11 md:h-11 overflow-hidden bg-black ring-offset-2 ring-offset-[#141312] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f2c14e] ${
                                        i === current ? 'ring-2 ring-[#f2c14e]' : 'opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    {/* YouTube's 4:3 cover letterboxes 16:9 videos; zoom past the bars. */}
                                    <img src={cover(r.videoId)} alt="" className="w-full h-full object-cover scale-[1.34]" />
                                    {r.weekly && (
                                        <span className="absolute top-0 left-0 px-0.5 text-[8px] leading-3 font-mono bg-[#f2c14e] text-black">W</span>
                                    )}
                                    {i === current && playing && (
                                        <span className="absolute bottom-0 inset-x-0 text-[8px] leading-3 bg-black/70 text-[#f2c14e] text-center">●</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
