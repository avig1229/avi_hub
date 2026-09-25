'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    animate,
    motion,
    useMotionValue,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useTransform,
} from 'framer-motion';
import { arcade } from '../arcade';
import { GuideSpot, useGuide } from '../guide/Guide';
import { useMusicRec } from '../music/MusicRec';
import AttractScreen from './AttractScreen';
import Kid, { KID_SIZE } from './Kid';
import RoomArt from './RoomArt';
import Logo from '../Logo';
import { ARCADE_SCREEN, FLOOR, KID_START, MARQUEE, RECORD, ROOM, SPOTS, pctX, pctY, type Point, type Spot } from './layout';

// Avi's room, the landing page's second act. It fades in right on the
// turntable's record (carrying on from the hero's record) and zooms out to
// the whole room as you scroll. Third Eye walks you to whatever you click;
// the arcade dives into its screen and opens the Selected Work select screen.

const ZOOM_START = 7; // how far in the camera starts, on the record
const WALK_SPEED = 110; // room pixels per second
const DIVE_MS = 1100;
const ATTRACT_MS = 1500; // how long the full-screen attract screen shows before /work

const recordPct = { x: (RECORD.x / ROOM.w) * 100, y: (RECORD.y / ROOM.h) * 100 };
const screenPct = {
    x: ((ARCADE_SCREEN.x + ARCADE_SCREEN.w / 2) / ROOM.w) * 100,
    y: ((ARCADE_SCREEN.y + ARCADE_SCREEN.h / 2) / ROOM.h) * 100,
};

type Phase = 'room' | 'walking' | 'dive' | 'attract';

// Keep a spot's label inside the room: flush to the spot's inner edge near the walls.
const labelAlign = (spot: Spot) => {
    const mid = spot.box.x + spot.box.w / 2;
    if (mid < ROOM.w / 3) return 'left-0';
    if (mid > (ROOM.w * 2) / 3) return 'right-0';
    return 'left-1/2 -translate-x-1/2';
};

export default function Room() {
    const router = useRouter();
    const reduce = useReducedMotion();
    const { say } = useGuide();
    const { playing, toggle, rec } = useMusicRec();

    const sectionRef = useRef<HTMLElement>(null);
    const roomRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: p } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

    // Scroll camera: from the record out to the whole room, evenly in log space
    // so the zoom feels steady rather than rushing at the end.
    const out = useTransform(p, [0.04, 0.55], [0, 1], { clamp: true });
    const zoom = useTransform(out, (t) => Math.pow(ZOOM_START, 1 - t));
    // Zooming around the record keeps it still; this shifts it to the middle
    // of the screen, fading out as the camera reaches the whole room.
    const zoomX = useTransform(zoom, (s) => `${(50 - recordPct.x) * ((s - 1) / (ZOOM_START - 1))}%`);
    const zoomY = useTransform(zoom, (s) => `${(50 - recordPct.y) * ((s - 1) / (ZOOM_START - 1))}%`);
    const fadeIn = useTransform(p, [0, 0.05], [0, 1]);
    const captionOpacity = useTransform(p, [0.5, 0.6], [0, 1]);
    // Clickable once the camera is (nearly) all the way out. Checked on mount
    // too: arriving via #room-view or the back button lands there with no scroll.
    const [ready, setReady] = useState(false);
    useMotionValueEvent(out, 'change', (v) => setReady(v > 0.92));
    useEffect(() => {
        const id = requestAnimationFrame(() => setReady(out.get() > 0.92));
        return () => cancelAnimationFrame(id);
    }, [out]);

    // The dive into the arcade screen.
    const dive = useMotionValue(0);
    const diveTarget = useRef(8);
    const diveScale = useTransform(dive, (d) => 1 + (diveTarget.current - 1) * d);
    const diveX = useTransform(dive, (d) => `${(50 - screenPct.x) * d}%`);
    const diveY = useTransform(dive, (d) => `${(50 - screenPct.y) * d}%`);

    // Third Eye.
    const kx = useMotionValue(KID_START.x);
    const ky = useMotionValue(KID_START.y);
    const kidLeft = useTransform(kx, (x) => pctX(x));
    const kidTop = useTransform(ky, (y) => pctY(y));
    const [phase, setPhase] = useState<Phase>('room');
    const [facing, setFacing] = useState(1);
    const [step, setStep] = useState(0);
    const walkRef = useRef<{ stop: () => void }[]>([]);

    useEffect(() => {
        router.prefetch('/work');
    }, [router]);

    // Legs alternate while he walks.
    useEffect(() => {
        if (phase !== 'walking') return;
        const id = window.setInterval(() => setStep((s) => s + 1), 140);
        return () => window.clearInterval(id);
    }, [phase]);

    // Hold the page still while the camera dives and the attract screen shows.
    useEffect(() => {
        if (phase !== 'dive' && phase !== 'attract') return;
        const html = document.documentElement;
        const prev = html.style.overflow;
        html.style.overflow = 'hidden';
        return () => {
            html.style.overflow = prev;
        };
    }, [phase]);

    const walkTo = useCallback(
        (to: Point) =>
            new Promise<void>((resolve) => {
                walkRef.current.forEach((a) => a.stop());
                const dx = to.x - kx.get();
                const dy = to.y - ky.get();
                const dist = Math.hypot(dx, dy);
                if (Math.abs(dx) > 0.5) setFacing(dx < 0 ? -1 : 1);
                if (reduce || dist < 1) {
                    kx.set(to.x);
                    ky.set(to.y);
                    return resolve();
                }
                setPhase('walking');
                const duration = Math.max(0.25, dist / WALK_SPEED);
                const ax = animate(kx, to.x, { duration, ease: 'linear' });
                const ay = animate(ky, to.y, { duration, ease: 'linear', onComplete: () => {
                    setPhase((ph) => (ph === 'walking' ? 'room' : ph));
                    setStep(0);
                    resolve();
                } });
                walkRef.current = [ax, ay];
            }),
        [kx, ky, reduce],
    );

    const enterArcade = useCallback(async () => {
        await walkTo(SPOTS.find((s) => s.id === 'arcade')!.stand);
        const room = roomRef.current?.getBoundingClientRect();
        if (room) {
            // Scale until the screen covers the viewport.
            const sw = (ARCADE_SCREEN.w / ROOM.w) * room.width;
            const sh = (ARCADE_SCREEN.h / ROOM.h) * room.height;
            diveTarget.current = Math.max(window.innerWidth / sw, window.innerHeight / sh) * 1.04;
        }
        setPhase('dive');
        if (!reduce) await animate(dive, 1, { duration: DIVE_MS / 1000, ease: [0.55, 0, 0.8, 0.2] });
        setPhase('attract');
        window.setTimeout(() => router.push('/work'), reduce ? 400 : ATTRACT_MS);
    }, [walkTo, dive, reduce, router]);

    const act = useCallback(
        async (spot: Spot) => {
            if (!ready || phase === 'dive' || phase === 'attract') return;
            if (spot.id === 'arcade') return enterArcade();
            // Play/pause inside the click itself: browsers only let a tap start audio.
            if (spot.id === 'records' && rec) toggle();
            await walkTo(spot.stand);
            if (spot.id === 'closet') {
                say('room:closet', `The closet. Avi's still tidying it.\n\nHis favourite pieces move in here soon.`, { group: 'room' });
            } else if (spot.id === 'records' && !rec) {
                say('room:records', `No record on this week. Check back soon.`, { group: 'room' });
            }
        },
        [ready, phase, enterArcade, walkTo, say, rec, toggle],
    );

    // Click the floor and he walks there.
    const onFloor = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ready || phase === 'dive' || phase === 'attract') return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * ROOM.w;
        const y = ((e.clientY - r.top) / r.height) * ROOM.h;
        walkTo({
            x: Math.min(FLOOR.x + FLOOR.w, Math.max(FLOOR.x, x)),
            y: Math.min(FLOOR.y + FLOOR.h, Math.max(FLOOR.y, y)),
        });
    };

    return (
        <section
            id="room"
            ref={sectionRef}
            aria-label="Avi's room"
            // Starts one screen early so it fades in over the hero's last frame.
            className="relative h-[260vh] -mt-[calc(100svh+6rem)] -mx-6 md:-mx-12"
        >
            {/* Anchor for "back to the room" links: the fully zoomed-out view. */}
            <div id="room-view" className="absolute left-0 top-[62%] h-px w-px" aria-hidden />
            {/* Third Eye stays tucked away through the hero and introduces himself once the room is in view. */}
            <GuideSpot id="home" siteKey="home" revealsGuide className="absolute left-0 top-[40%]" />

            <motion.div
                style={{ opacity: fadeIn }}
                className="sticky top-0 h-svh overflow-hidden bg-background flex flex-col items-center justify-center pt-12"
            >
                <motion.div style={{ scale: zoom, x: zoomX, y: zoomY, transformOrigin: `${recordPct.x}% ${recordPct.y}%` }}>
                    <motion.div
                        style={{ scale: diveScale, x: diveX, y: diveY, transformOrigin: `${screenPct.x}% ${screenPct.y}%` }}
                    >
                        <div
                            ref={roomRef}
                            onClick={onFloor}
                            className="relative aspect-[4/3] w-[min(100vw,calc((100svh-12rem)*4/3))] sm:w-[min(94vw,calc((100svh-12rem)*4/3))] select-none"
                        >
                            <RoomArt playing={playing} />

                            {/* Marquee: the logo in arcade yellow */}
                            <div
                                aria-hidden
                                className="absolute flex items-center justify-center text-[#FFD23F]"
                                style={{ left: pctX(MARQUEE.x), top: pctY(MARQUEE.y), width: pctX(MARQUEE.w), height: pctY(MARQUEE.h) }}
                            >
                                <Logo className="w-[86%] drop-shadow-[0_1px_0_#5C1409]" />
                            </div>

                            {/* The cabinet's screen */}
                            <div
                                aria-hidden
                                className="absolute"
                                style={{
                                    left: pctX(ARCADE_SCREEN.x),
                                    top: pctY(ARCADE_SCREEN.y),
                                    width: pctX(ARCADE_SCREEN.w),
                                    height: pctY(ARCADE_SCREEN.h),
                                }}
                            >
                                <AttractScreen className="w-full h-full" />
                            </div>

                            {/* Hotspots */}
                            {SPOTS.map((spot) => (
                                <button
                                    key={spot.id}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        act(spot);
                                    }}
                                    disabled={!ready}
                                    aria-label={`${spot.label}: ${spot.id === 'records' && rec ? (playing ? 'pause the music' : 'play the music') : spot.hint}`}
                                    className="group absolute outline-none"
                                    style={{ left: pctX(spot.box.x), top: pctY(spot.box.y), width: pctX(spot.box.w), height: pctY(spot.box.h) }}
                                >
                                    <span className="absolute inset-0 border-2 border-dashed border-[#F2C14E] opacity-0 group-hover:opacity-80 group-focus-visible:opacity-100 transition-opacity" />
                                    <span
                                        className={`${arcade.className} absolute ${labelAlign(spot)} whitespace-nowrap px-1.5 py-1 text-[8px] md:text-[10px] leading-none uppercase bg-black/80 text-[#F2C14E] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity ${ready ? '' : '!opacity-0'} ${
                                            spot.box.y < 20 ? 'top-full mt-1' : '-top-1 -translate-y-full'
                                        }`}
                                    >
                                        {spot.label}
                                        <span className="hidden sm:inline text-[#E6E1D6]/70"> · {spot.id === 'records' && rec && playing ? 'Pause' : spot.hint}</span>
                                    </span>
                                </button>
                            ))}

                            {/* Third Eye, anchored at his feet */}
                            <motion.div
                                aria-hidden
                                className="absolute pointer-events-none -translate-x-1/2 -translate-y-full"
                                style={{ left: kidLeft, top: kidTop, width: pctX(KID_SIZE.w), height: pctY(KID_SIZE.h) }}
                            >
                                <div
                                    className="w-full h-full"
                                    style={{
                                        transform: `scaleX(${facing}) translateY(${phase === 'walking' && step % 2 ? '-4%' : '0'})`,
                                    }}
                                >
                                    <Kid step={phase === 'walking' ? step : 0} />
                                </div>
                                <span className="absolute left-[10%] right-[10%] -bottom-[4%] h-[8%] rounded-[50%] bg-black/30 -z-10" />
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div style={{ opacity: captionOpacity }} className="mt-5 text-center px-4">
                    <p className={`${arcade.className} text-[10px] md:text-xs uppercase tracking-[0.2em]`}>Avi&apos;s room</p>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-gray-500">
                        Click something and Third Eye will walk you over
                    </p>
                </motion.div>
            </motion.div>

            {/* Full-screen attract screen once the camera is inside the cabinet */}
            {phase === 'attract' && (
                <motion.button
                    type="button"
                    onClick={() => router.push('/work')}
                    aria-label="Selected work: choose your project"
                    className="fixed inset-0 z-[70] cursor-pointer"
                    initial={{ opacity: reduce ? 1 : 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <AttractScreen className="w-full h-full" />
                </motion.button>
            )}
        </section>
    );
}
