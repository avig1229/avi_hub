'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
import { ARCADE_SCREEN, FLOOR, KID_START, MARQUEE, POSTER_SPOT, RECORD, ROOM, SPOTS, pctX, pctY, type Point, type Spot } from './layout';

// Avi's room, the landing page's second act, full screen. It fades in right on
// the turntable's record (carrying on from the hero's record) and zooms out to
// the whole room as you scroll. The room always fills the screen's height: on
// wide screens the floor carries on past it; on narrow ones (phones) the camera
// pans, following Third Eye, and you can swipe to look around. Third Eye walks
// you to whatever you click; the arcade dives into its screen and opens the
// Selected Work select screen.

const ZOOM_START = 7; // how far in the camera starts, on the record
const WALK_SPEED = 110; // room pixels per second
const DIVE_MS = 1100;
const ATTRACT_MS = 1500; // how long the full-screen attract screen shows before /work
const DRAG_SLOP = 8; // px a touch moves before it counts as a swipe, not a tap

type Phase = 'room' | 'walking' | 'dive' | 'attract';

// Keep a spot's label inside the room: flush to the spot's inner edge near the walls.
const labelAlign = (spot: Spot) => {
    const mid = spot.box.x + spot.box.w / 2;
    if (mid < ROOM.w / 3) return 'left-0';
    if (mid > (ROOM.w * 2) / 3) return 'right-0';
    return 'left-1/2 -translate-x-1/2';
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// The art piece framed on the wall, and the project it opens.
export type RoomPoster = { title: string; slug: string; src: string };

export default function Room({ poster }: { poster?: RoomPoster | null }) {
    const router = useRouter();
    const reduce = useReducedMotion();
    const { say } = useGuide();
    const { playing, rec } = useMusicRec();
    const spots = useMemo(() => (poster ? [...SPOTS, { ...POSTER_SPOT, label: poster.title }] : SPOTS), [poster]);

    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: p } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

    // ── Screen size → room scale. One room pixel = k screen pixels, so the
    // 180-pixel-tall room exactly fills the screen's height.
    const [dims, setDims] = useState({ W: 0, H: 0 });
    const mW = useMotionValue(0);
    const mH = useMotionValue(0);
    useLayoutEffect(() => {
        const el = stageRef.current;
        if (!el) return;
        const measure = () => {
            const W = el.clientWidth;
            const H = el.clientHeight;
            mW.set(W);
            mH.set(H);
            setDims({ W, H });
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, [mW, mH]);
    const k = dims.H / ROOM.h || 1;
    const worldW = Math.max(dims.W, ROOM.w * k); // the drawn world, in screen px
    const boxLeft = (worldW - ROOM.w * k) / 2; // where the 240×180 plan sits in it
    const canPan = worldW > dims.W + 1;

    // Room pixels → world px, as motion-friendly functions of the live size.
    const toWorldX = useCallback(
        (u: number) => {
            const kk = mH.get() / ROOM.h || 1;
            const ww = Math.max(mW.get(), ROOM.w * kk);
            return (ww - ROOM.w * kk) / 2 + u * kk;
        },
        [mW, mH],
    );
    const clampFocus = useCallback(
        (x: number) => {
            const kk = mH.get() / ROOM.h || 1;
            const ww = Math.max(mW.get(), ROOM.w * kk);
            return clamp(x, mW.get() / 2, ww - mW.get() / 2);
        },
        [mW, mH],
    );

    // ── Camera. `focusX` is the world point at the middle of the screen when
    // zoomed all the way out (only moves on phones); the scroll zoom pulls the
    // focus to the record, the dive pulls it to the arcade screen.
    const focusX = useMotionValue(0);
    useEffect(() => {
        focusX.set(clampFocus(toWorldX(KID_START.x)));
    }, [dims, focusX, clampFocus, toWorldX]);

    const out = useTransform(p, [0.04, 0.55], [0, 1], { clamp: true });
    // Evenly in log space, so the zoom feels steady rather than rushing at the end.
    const zoom = useTransform(out, (t) => Math.pow(ZOOM_START, 1 - t));
    const dive = useMotionValue(0);
    const diveTarget = useRef(8);

    const camScale = useTransform(() => zoom.get() * (1 + (diveTarget.current - 1) * dive.get()));
    const camFocus = () => {
        const kk = mH.get() / ROOM.h || 1;
        const f = (zoom.get() - 1) / (ZOOM_START - 1); // 1 on the record, 0 zoomed out
        const d = dive.get();
        const rx = toWorldX(RECORD.x);
        const ry = RECORD.y * kk;
        const sx = toWorldX(ARCADE_SCREEN.x + ARCADE_SCREEN.w / 2);
        const sy = (ARCADE_SCREEN.y + ARCADE_SCREEN.h / 2) * kk;
        const x0 = focusX.get() + (rx - focusX.get()) * f;
        const y0 = mH.get() / 2 + (ry - mH.get() / 2) * f;
        return { x: x0 + (sx - x0) * d, y: y0 + (sy - y0) * d };
    };
    const camX = useTransform(() => mW.get() / 2 - camFocus().x * camScale.get());
    const camY = useTransform(() => mH.get() / 2 - camFocus().y * camScale.get());

    // On phones, which spots are off screen to each side (for the edge signs).
    const [offscreen, setOffscreen] = useState<{ left: Spot[]; right: Spot[] }>({ left: [], right: [] });
    const updateOffscreen = useCallback(() => {
        const half = mW.get() / 2;
        const fx = focusX.get();
        const left: Spot[] = [];
        const right: Spot[] = [];
        for (const spot of spots) {
            const c = toWorldX(spot.box.x + spot.box.w / 2);
            if (c < fx - half + 12) left.push(spot);
            else if (c > fx + half - 12) right.push(spot);
        }
        setOffscreen((prev) =>
            prev.left.map((s) => s.id).join() === left.map((s) => s.id).join() &&
            prev.right.map((s) => s.id).join() === right.map((s) => s.id).join()
                ? prev
                : { left, right },
        );
    }, [mW, focusX, toWorldX, spots]);
    useMotionValueEvent(focusX, 'change', updateOffscreen);
    useEffect(() => {
        const id = requestAnimationFrame(updateOffscreen);
        return () => cancelAnimationFrame(id);
    }, [dims, updateOffscreen]);
    const panTo = (spot: Spot) =>
        animate(focusX, clampFocus(toWorldX(spot.box.x + spot.box.w / 2)), reduce ? { duration: 0 } : { duration: 0.6, ease: 'easeInOut' });

    const fadeIn = useTransform(p, [0, 0.05], [0, 1]);
    // The room starts one screen early, over the hero's last frame; until it has
    // faded in it must not catch taps meant for the hero's record player.
    const stageEvents = useTransform(fadeIn, (v) => (v > 0.9 ? 'auto' : 'none'));
    const hintOpacity = useTransform(p, [0.5, 0.6], [0, 1]);
    // Clickable once the camera is (nearly) all the way out. Checked on mount
    // too: arriving via #room-view or the back button lands there with no scroll.
    const [ready, setReady] = useState(false);
    useMotionValueEvent(out, 'change', (v) => setReady(v > 0.92));
    useEffect(() => {
        const id = requestAnimationFrame(() => setReady(out.get() > 0.92));
        return () => cancelAnimationFrame(id);
    }, [out]);

    // ── Third Eye.
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
                // On phones the camera follows him.
                const camTo = clampFocus(toWorldX(to.x));
                if (reduce || dist < 1) {
                    kx.set(to.x);
                    ky.set(to.y);
                    focusX.set(camTo);
                    return resolve();
                }
                setPhase('walking');
                const duration = Math.max(0.25, dist / WALK_SPEED);
                const ax = animate(kx, to.x, { duration, ease: 'linear' });
                const ac = animate(focusX, camTo, { duration, ease: 'easeInOut' });
                const ay = animate(ky, to.y, {
                    duration,
                    ease: 'linear',
                    onComplete: () => {
                        setPhase((ph) => (ph === 'walking' ? 'room' : ph));
                        setStep(0);
                        resolve();
                    },
                });
                walkRef.current = [ax, ay, ac];
            }),
        [kx, ky, reduce, focusX, clampFocus, toWorldX],
    );

    const enterArcade = useCallback(async () => {
        await walkTo(SPOTS.find((s) => s.id === 'arcade')!.stand);
        // Scale until the screen covers the viewport.
        const kk = mH.get() / ROOM.h || 1;
        diveTarget.current = Math.max(mW.get() / (ARCADE_SCREEN.w * kk), mH.get() / (ARCADE_SCREEN.h * kk)) * 1.04;
        setPhase('dive');
        if (!reduce) await animate(dive, 1, { duration: DIVE_MS / 1000, ease: [0.55, 0, 0.8, 0.2] });
        setPhase('attract');
        window.setTimeout(() => router.push('/work'), reduce ? 400 : ATTRACT_MS);
    }, [walkTo, dive, reduce, router, mW, mH]);

    const act = useCallback(
        async (spot: Spot) => {
            if (!ready || phase === 'dive' || phase === 'attract') return;
            if (spot.id === 'arcade') return enterArcade();
            await walkTo(spot.stand);
            if (spot.id === 'poster' && poster) {
                router.push(`/work/${poster.slug}`);
                return;
            }
            // The record corner takes you back to the one record player: the
            // camera zooms into the turntable and lands on the hero's record,
            // with the weekly rec and the crate beside it.
            if (spot.id === 'records' && rec) {
                say('room:crate', `Avi's records. Every one in the crate says something about him.\n\nPick one and put it on.`, { group: 'room' });
                document.getElementById('record-player')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
                return;
            }
            if (spot.id === 'closet') {
                say('room:closet', `The closet. Avi's still tidying it.\n\nHis favourite pieces move in here soon.`, { group: 'room' });
            } else if (spot.id === 'records') {
                say('room:records', `No record on this week. Check back soon.`, { group: 'room' });
            }
        },
        [ready, phase, enterArcade, walkTo, say, rec, reduce, poster, router],
    );

    // ── Swipe to look around (phones). A drag pans the camera; a tap still
    // walks him or opens a spot. Vertical swipes keep scrolling the page.
    const drag = useRef<{ x: number; focus: number; moved: boolean } | null>(null);
    const swallowClick = useRef(false);
    const onPointerDown = (e: React.PointerEvent) => {
        if (!canPan || !ready || phase === 'dive' || phase === 'attract') return;
        drag.current = { x: e.clientX, focus: focusX.get(), moved: false };
    };
    const onPointerMove = (e: React.PointerEvent) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x;
        if (!d.moved && Math.abs(dx) < DRAG_SLOP) return;
        d.moved = true;
        focusX.set(clampFocus(d.focus - dx));
    };
    const onPointerUp = () => {
        swallowClick.current = !!drag.current?.moved;
        drag.current = null;
    };
    const onClickCapture = (e: React.MouseEvent) => {
        if (!swallowClick.current) return;
        swallowClick.current = false;
        e.stopPropagation();
        e.preventDefault();
    };

    // Click the floor and he walks there.
    const onFloor = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ready || phase === 'dive' || phase === 'attract' || !boxRef.current) return;
        const r = boxRef.current.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * ROOM.w;
        const y = ((e.clientY - r.top) / r.height) * ROOM.h;
        walkTo({
            x: clamp(x, FLOOR.x, FLOOR.x + FLOOR.w),
            y: clamp(y, FLOOR.y, FLOOR.y + FLOOR.h),
        });
    };

    return (
        <section
            id="room"
            ref={sectionRef}
            aria-label="Avi's room"
            // Starts one screen early so it fades in over the hero's last frame.
            // Taps pass through the section itself: it overlaps the hero's last frame.
            className="relative h-[260vh] -mt-[calc(100svh+6rem)] -mx-6 md:-mx-12 pointer-events-none"
        >
            {/* Anchor for "back to the room" links: the fully zoomed-out view. */}
            <div id="room-view" className="absolute left-0 top-[62%] h-px w-px" aria-hidden />
            {/* Third Eye stays tucked away through the hero and introduces himself once the room is in view. */}
            <GuideSpot id="home" siteKey="home" revealsGuide className="absolute left-0 top-[40%]" />

            <motion.div
                ref={stageRef}
                style={{ opacity: fadeIn, pointerEvents: stageEvents }}
                className="sticky top-0 h-svh overflow-hidden bg-[#E8E2D8] select-none touch-pan-y"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onClickCapture={onClickCapture}
            >
                {dims.H > 0 && (
                    <motion.div
                        className="absolute left-0 top-0"
                        style={{ width: worldW, height: dims.H, x: camX, y: camY, scale: camScale, transformOrigin: '0 0' }}
                        onClick={onFloor}
                    >
                        <RoomArt playing={playing} x0={-boxLeft / k} width={worldW / k} poster={poster?.src} />

                        {/* The 240×180 floor plan: everything clickable lives here. */}
                        <div ref={boxRef} className="absolute top-0" style={{ left: boxLeft, width: ROOM.w * k, height: dims.H }}>
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
                            {spots.map((spot) => (
                                <button
                                    key={spot.id}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        act(spot);
                                    }}
                                    disabled={!ready}
                                    aria-label={`${spot.label}: ${spot.hint}`}
                                    className="group absolute outline-none"
                                    style={{ left: pctX(spot.box.x), top: pctY(spot.box.y), width: pctX(spot.box.w), height: pctY(spot.box.h) }}
                                >
                                    <span className="absolute inset-0 border-2 border-dashed border-[#F2C14E] opacity-0 group-hover:opacity-80 group-focus-visible:opacity-100 transition-opacity" />
                                    <span
                                        className={`${arcade.className} absolute ${labelAlign(spot)} whitespace-nowrap px-1.5 py-1 text-[9px] md:text-[10px] leading-none uppercase bg-black/80 text-[#F2C14E] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity ${ready ? '' : '!opacity-0'} ${
                                            spot.box.y < 20 ? 'top-full mt-1' : '-top-1 -translate-y-full'
                                        }`}
                                    >
                                        {spot.label}
                                        <span className="hidden sm:inline text-[#E6E1D6]/70"> · {spot.hint}</span>
                                    </span>
                                </button>
                            ))}

                            {/* Third Eye, anchored at his feet */}
                            <motion.div
                                aria-hidden
                                className="absolute pointer-events-none -translate-x-1/2 -translate-y-full"
                                style={{ left: kidLeft, top: kidTop, width: pctX(KID_SIZE.w), height: pctY(KID_SIZE.h) }}
                            >
                                <span className="absolute left-[18%] right-[18%] -bottom-[3%] h-[7%] rounded-[50%] bg-black/35" />
                                <div
                                    className="relative w-full h-full"
                                    style={{
                                        transform: `scaleX(${facing}) translateY(${phase === 'walking' && step % 2 ? '-5%' : '0'})`,
                                    }}
                                >
                                    <Kid step={step} walking={phase === 'walking'} />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* How to play, over the floor */}
                <motion.div
                    style={{ opacity: hintOpacity }}
                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-5 md:bottom-7 px-3 py-2 bg-black/70 text-center whitespace-nowrap"
                >
                    <p className={`${arcade.className} text-[8px] md:text-[10px] uppercase tracking-[0.15em] text-[#F2C14E]`}>
                        {canPan ? 'Tap · swipe to explore' : 'Click anything · Third Eye walks you there'}
                    </p>
                </motion.div>

                {/* Phones: signs at the edges for what's off screen that way; tap to pan there. */}
                {canPan &&
                    (['left', 'right'] as const).map((side) =>
                        offscreen[side].length ? (
                            <motion.div
                                key={side}
                                style={{ opacity: hintOpacity }}
                                className={`absolute top-1/2 -translate-y-1/2 flex flex-col gap-1.5 ${side === 'left' ? 'left-2 items-start' : 'right-2 items-end'} ${ready ? '' : 'pointer-events-none'}`}
                            >
                                {offscreen[side].map((spot) => (
                                    <button
                                        key={spot.id}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            panTo(spot);
                                        }}
                                        aria-label={`Look at the ${spot.label.toLowerCase()}`}
                                        className={`${arcade.className} px-2 py-2 text-[9px] uppercase leading-none bg-black/75 text-[#F2C14E] border border-[#F2C14E]/50 active:bg-[#F2C14E] active:text-black`}
                                    >
                                        {side === 'left' ? `◀ ${spot.label}` : `${spot.label} ▶`}
                                    </button>
                                ))}
                            </motion.div>
                        ) : null,
                    )}
            </motion.div>

            {/* Full-screen attract screen once the camera is inside the cabinet */}
            {phase === 'attract' && (
                <motion.button
                    type="button"
                    onClick={() => router.push('/work')}
                    aria-label="Selected work: choose your project"
                    className="fixed inset-0 z-[70] cursor-pointer pointer-events-auto"
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
