'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

// Site-wide soundtrack. Sound is off until the visitor opts in; pages register
// their track with useSoundtrack(), and the <audio> element lives here in the
// root layout so playback survives client-side navigation.

const TARGET_VOLUME = 0.6;
const FADE_MS = 800;

interface AudioContextValue {
    track: string | null;
    enabled: boolean;
    toggle: () => void;
    setTrack: (src: string | null) => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fadeRef = useRef<number | null>(null);
    const [track, setTrack] = useState<string | null>(null);
    const [enabled, setEnabled] = useState(false);

    const fadeTo = useCallback((target: number, onDone?: () => void) => {
        const audio = audioRef.current;
        if (!audio) return;
        if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
        const from = audio.volume;
        const start = performance.now();
        const step = (now: number) => {
            const t = Math.min(1, (now - start) / FADE_MS);
            audio.volume = from + (target - from) * t;
            if (t < 1) fadeRef.current = requestAnimationFrame(step);
            else onDone?.();
        };
        fadeRef.current = requestAnimationFrame(step);
    }, []);

    // Swap or stop the source whenever the page's track changes.
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.loop = true;
            audioRef.current.volume = 0;
        }
        const audio = audioRef.current;
        if (!track) {
            fadeTo(0, () => audio.pause());
            return;
        }
        if (audio.src.endsWith(track)) return;
        fadeTo(0, () => {
            audio.src = track;
            if (enabled) {
                audio.play().then(() => fadeTo(TARGET_VOLUME)).catch(() => setEnabled(false));
            }
        });
        // `enabled` is handled by its own effect below.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [track, fadeTo]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !track) return;
        if (enabled) {
            audio.play().then(() => fadeTo(TARGET_VOLUME)).catch(() => setEnabled(false));
        } else {
            fadeTo(0, () => audio.pause());
        }
    }, [enabled, track, fadeTo]);

    const toggle = useCallback(() => setEnabled((on) => !on), []);

    return (
        <AudioCtx.Provider value={{ track, enabled, toggle, setTrack }}>
            {children}
        </AudioCtx.Provider>
    );
}

export function useAudio() {
    const ctx = useContext(AudioCtx);
    if (!ctx) throw new Error('useAudio must be used inside <AudioProvider>');
    return ctx;
}

// Register a soundtrack for the lifetime of the calling component.
export function useSoundtrack(src: string | null | undefined) {
    const { setTrack } = useAudio();
    useEffect(() => {
        if (!src) return;
        setTrack(src);
        return () => setTrack(null);
    }, [src, setTrack]);
}
