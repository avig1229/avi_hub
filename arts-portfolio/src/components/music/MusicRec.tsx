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
};

type YTPlayer = { playVideo(): void; pauseVideo(): void; getPlayerState(): number; destroy(): void };
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
    rec: MusicRecData;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicRecProvider({ rec, children }: { rec: MusicRecData; children: React.ReactNode }) {
    const [playing, setPlaying] = useState(false);
    const [host, setHost] = useState<HTMLElement | null>(null);
    const player = useRef<YTPlayer | null>(null);
    const ready = useRef(false);
    const pendingPlay = useRef(false);

    useEffect(() => {
        if (!host) return;
        let cancelled = false;
        loadYouTubeAPI().then((YT) => {
            if (cancelled) return;
            player.current = new YT.Player(host, {
                host: 'https://www.youtube-nocookie.com',
                videoId: rec.videoId,
                width: '100%',
                height: '100%',
                playerVars: { rel: 0, playsinline: 1, loop: 1, playlist: rec.videoId },
                events: {
                    onReady: () => {
                        ready.current = true;
                        if (pendingPlay.current) player.current?.playVideo();
                    },
                    onStateChange: (e) => setPlaying(e.data === PLAYING),
                },
            });
        });
        return () => {
            cancelled = true;
            ready.current = false;
            player.current?.destroy();
            player.current = null;
        };
    }, [host, rec.videoId]);

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
        <MusicContext.Provider value={{ playing, toggle, register: setHost, rec }}>{children}</MusicContext.Provider>
    );
}

// Safe outside the provider (nothing plays).
export function useMusicRec() {
    return useContext(MusicContext) ?? { playing: false, toggle: () => {}, register: () => {}, rec: null };
}

function formatWeek(date?: string) {
    if (!date) return null;
    const d = new Date(`${date}T00:00:00`);
    return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// The record's sleeve: YouTube's player (kept visible, as YouTube requires)
// plus the credit. The hero slides it out from behind the record.
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
    const { rec, playing } = ctx;
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
                    <span>Weekly rec{week ? ` · Week of ${week}` : ''}</span>
                    <span className={playing ? 'text-[#f2c14e]' : ''}>{playing ? '● Now spinning' : 'Side A'}</span>
                </div>
                <h2 id="weekly-rec" className="mt-2 text-2xl md:text-3xl leading-tight truncate">
                    {rec.song}
                </h2>
                <p className="text-sm text-[#e6e1d6]/70">{rec.artist}</p>
                {rec.note && <p className="hidden md:block mt-3 text-sm italic leading-relaxed line-clamp-2">“{rec.note}”</p>}
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
            </div>
        </section>
    );
}
