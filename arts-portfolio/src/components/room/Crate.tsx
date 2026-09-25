'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { arcade } from '../arcade';
import { useMusicRec } from '../music/MusicRec';

// The record crate in the room's vinyl corner: flip through the weekly rec and
// the crate, read why each one's there, and put one on the turntable.

const cover = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

export default function Crate({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { records, current, playing, choose, toggle } = useMusicRec();
    const reduce = useReducedMotion();
    const [at, setAt] = useState(current);
    const [dir, setDir] = useState(1);
    const closeRef = useRef<HTMLButtonElement>(null);

    // Open on whatever's playing.
    const [wasOpen, setWasOpen] = useState(open);
    if (open !== wasOpen) {
        setWasOpen(open);
        if (open) setAt(current);
    }

    const flip = (by: number) => {
        if (!records.length) return;
        setDir(by);
        setAt((i) => (i + by + records.length) % records.length);
    };

    useEffect(() => {
        if (!open) return;
        closeRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') flip(1);
            if (e.key === 'ArrowLeft') flip(-1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // flip only depends on records.length, which doesn't change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, onClose]);

    const rec = records[at];
    const isOn = at === current;

    return (
        <AnimatePresence>
            {open && rec && (
                <motion.div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/60 backdrop-blur-[2px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    data-guide-hide="phone"
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Record crate"
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-[min(94vw,760px)] rounded-2xl border-2 border-[#f2dcc0]/30 bg-[#141312] text-[#e6e1d6] shadow-[0_30px_80px_-10px_rgba(0,0,0,0.8)] p-4 md:p-6"
                        initial={{ y: 24, scale: 0.97 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 24, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`${arcade.className} text-[11px] md:text-sm uppercase tracking-[0.2em] text-[#F2C14E]`}>
                                The crate
                            </h2>
                            <span className="font-mono text-[10px] tracking-[0.25em] text-[#e6e1d6]/50 mr-10">
                                {String(at + 1).padStart(2, '0')} / {String(records.length).padStart(2, '0')}
                            </span>
                            <button
                                ref={closeRef}
                                type="button"
                                onClick={onClose}
                                aria-label="Close the crate"
                                className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-[#e6e1d6]/60 hover:text-[#e6e1d6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F2C14E]"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-5 sm:gap-14 items-center">
                            {/* The sleeve, with its vinyl sliding out */}
                            <div className="relative aspect-square w-[min(100%,300px)] mx-auto sm:mx-0">
                                <AnimatePresence initial={false} custom={dir} mode="popLayout">
                                    <motion.div
                                        key={rec.videoId}
                                        custom={dir}
                                        className="absolute inset-0"
                                        initial={reduce ? { opacity: 0 } : { x: `${dir * 40}%`, rotate: dir * 6, opacity: 0 }}
                                        animate={{ x: 0, rotate: 0, opacity: 1 }}
                                        exit={reduce ? { opacity: 0 } : { x: `${dir * -40}%`, rotate: dir * -6, opacity: 0 }}
                                        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                                    >
                                        <div
                                            aria-hidden
                                            className={`absolute top-[6%] bottom-[6%] right-[-4%] aspect-square rounded-full bg-[#0c0c0c] transition-transform duration-500 ${
                                                isOn ? 'translate-x-[22%]' : 'translate-x-[8%]'
                                            }`}
                                            style={{
                                                backgroundImage:
                                                    'repeating-radial-gradient(circle at center, #0c0c0c 0px, #0c0c0c 2px, #1b1b1b 3px, #0c0c0c 4px)',
                                            }}
                                        >
                                            <span className="absolute inset-[34%] rounded-full bg-[#2B3A8C]" />
                                        </div>
                                        <div className="relative w-full h-full overflow-hidden rounded-sm ring-1 ring-white/10 shadow-[8px_8px_0_rgba(0,0,0,0.5)] bg-black">
                                            {/* YouTube's 4:3 cover letterboxes 16:9 videos; zoom past the bars. */}
                                            <img src={cover(rec.videoId)} alt="" className="w-full h-full object-cover scale-[1.34]" />
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            <div className="relative z-10 min-w-0" aria-live="polite">
                                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#e6e1d6]/50">
                                    {rec.weekly ? 'Weekly rec' : 'From the crate'}
                                    {isOn && playing && <span className="text-[#F2C14E]"> · ● Now spinning</span>}
                                </p>
                                <h3 className="mt-2 font-display text-3xl md:text-4xl leading-tight">{rec.song}</h3>
                                <p className="text-sm text-[#e6e1d6]/70">{rec.artist}</p>
                                {rec.note && <p className="mt-4 text-sm md:text-base italic leading-relaxed">“{rec.note}”</p>}

                                <div className="mt-6 flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => (isOn ? toggle() : choose(at))}
                                        className={`${arcade.className} text-[10px] md:text-xs uppercase px-4 py-3 bg-[#F2C14E] text-black hover:bg-[#ffd76a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C14E]`}
                                    >
                                        {isOn && playing ? '❚❚ Lift the needle' : '▶ Put it on'}
                                    </button>
                                    <a
                                        href={rec.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-mono text-[10px] tracking-widest uppercase text-[#e6e1d6]/60 underline underline-offset-4 hover:text-[#e6e1d6] px-2"
                                    >
                                        YouTube ↗
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Spines: jump to any record */}
                        <div className="mt-6 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => flip(-1)}
                                aria-label="Previous record"
                                className={`${arcade.className} shrink-0 w-9 h-9 text-xs border border-[#e6e1d6]/20 hover:border-[#F2C14E] hover:text-[#F2C14E]`}
                            >
                                ◀
                            </button>
                            <div className="flex-1 flex gap-1.5 overflow-x-auto py-1 [scrollbar-width:none]">
                                {records.map((r, i) => (
                                    <button
                                        key={r.videoId}
                                        type="button"
                                        onClick={() => {
                                            setDir(i > at ? 1 : -1);
                                            setAt(i);
                                        }}
                                        aria-label={`${r.song} by ${r.artist}`}
                                        aria-current={i === at || undefined}
                                        className={`relative shrink-0 w-11 h-11 md:w-12 md:h-12 overflow-hidden ring-offset-2 ring-offset-[#141312] ${
                                            i === at ? 'ring-2 ring-[#F2C14E]' : 'opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={cover(r.videoId)} alt="" className="w-full h-full object-cover scale-[1.34]" />
                                        {i === current && playing && (
                                            <span className="absolute bottom-0 inset-x-0 text-[8px] leading-3 bg-black/70 text-[#F2C14E] text-center">●</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => flip(1)}
                                aria-label="Next record"
                                className={`${arcade.className} shrink-0 w-9 h-9 text-xs border border-[#e6e1d6]/20 hover:border-[#F2C14E] hover:text-[#F2C14E]`}
                            >
                                ▶
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
